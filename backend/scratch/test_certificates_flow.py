import sys
import os
import asyncio
import io
import time
from datetime import datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import get_db
from modules.certificates.service import CertificateService
from fastapi import HTTPException
from starlette.datastructures import UploadFile

class MockFile(UploadFile):
    def __init__(self, filename, content):
        self._content = content
        super().__init__(file=io.BytesIO(content), size=len(content), filename=filename)

    async def read(self, *args, **kwargs):
        return self._content

async def run_tests():
    db = next(get_db())
    cert_service = CertificateService(db)
    
    test_user_id = 8888
    
    # Cleanup
    db["certificates"].delete_many({"user_id": test_user_id})
    db["job_applications"].delete_many({"user_id": test_user_id})
    db["job_postings"].delete_many({"title": "Test Cloud Role"})
    db["resumes"].delete_many({"user_id": test_user_id})
    
    # Seed Mock Data
    db["resumes"].insert_one({
        "id": 8888, 
        "user_id": test_user_id, 
        "file_name": "mock_resume.pdf",
        "ats_score": 75.0,
        "parsed_data": {"skills": ["Python"]},
        "created_at": datetime.now()
    })
    db["job_postings"].insert_one({"id": 8888, "employer_id": 1, "title": "Test Cloud Role", "required_skills": ["Python", "AWS", "Cloud Architecture"]})
    
    from modules.jobseeker.service import JobSeekerService
    job_service = JobSeekerService(db)
    job_service.apply_for_job(test_user_id, 8888)
    
    app_doc = db["job_applications"].find_one({"user_id": test_user_id})
    print(f"Base ATS Score without certificates: {app_doc.get('ats_score', 0)}")
    
    print("\n[Case 1] Good Certificate")
    # Generates a string triggering AWS whitelist and 70+ conf
    good_content = b"Amazon Web Services AWS Cloud Certified Architect. Excellent execution and completion."
    uploaded = await cert_service.process_and_upload(test_user_id, "John Doe", MockFile("aws_cert.pdf", good_content))
    print(f"-> Uploaded: {uploaded.certificate_name} | Issuer: {uploaded.issuer} | Conf: {uploaded.confidence_score}% | Label: {uploaded.confidence_level}")
    
    # Manually verify ATS recalculation manually triggers
    
    print("\n[Case 2] Fake / Participation")
    bad_content = b"Thank you for your participation footprint. Great attendance."
    try:
        bad_up = await cert_service.process_and_upload(test_user_id, "John Doe", MockFile("random.jpg", bad_content))
        print(f"-> Uploaded Fake: {bad_up.certificate_name} | Score: {bad_up.confidence_score} | Status: {bad_up.verification_status}")
    except Exception as e:
        print(f"-> Blocked fake successfully: {e}")
        
    print("\n[Case 3] Duplicate Certificate")
    try:
        await cert_service.process_and_upload(test_user_id, "John Doe", MockFile("aws_cert.pdf", good_content))
        print("-> FAILED: Allowed duplicate!")
    except HTTPException as e:
        print(f"-> SUCCESS: Blocked Duplicate! Error: {e.detail}")

    print("\n[Case 4] Expired Certificate")
    from datetime import date, timedelta
    old_date = (date.today() - timedelta(days=10)).isoformat()
    db["certificates"].update_one({"id": uploaded.id}, {"$set": {"expiry_date": old_date}})
    print("-> Forcing Expiry flag updated in DB.")
        
    print("\n[Case 5] Admin Verify Flow + ATS Check")
    # Manually re-triggering ATS loop simulating recruiter verify route
    app_pre = db["job_applications"].find_one({"user_id": test_user_id})
    print(f"-> App baseline score: {app_pre.get('ats_score')}")
    
    # Set to verified
    db["certificates"].update_one({"id": uploaded.id}, {"$set": {"verification_status": "verified"}})
    
    # Recalculate
    job_service.apply_for_job(test_user_id, 8888) # Re-applies to rewrite exact ATS mapping via backend service loop 
    app_post = db["job_applications"].find_one({"user_id": test_user_id})
    print(f"-> App ATS score after Verified + Expired Check: {app_post.get('ats_score')} (Should ignore expired bonus)")
    
    # Fix expiry and re-run
    db["certificates"].update_one({"id": uploaded.id}, {"$unset": {"expiry_date": ""}})
    db["job_applications"].delete_one({"user_id": test_user_id})
    job_service.apply_for_job(test_user_id, 8888) 
    app_final = db["job_applications"].find_one({"user_id": test_user_id})
    print(f"-> App ATS Profile score after Verified (Valid Expiry): {app_final.get('ats_score')}")
    
    print("\n[Case 6] Performance Check / Load Testing")
    start = time.time()
    batch = []
    for i in range(10):
        # Different hashes preventing dedupe
        f = MockFile(f"perf_{i}.pdf", f"Amazon AWS Google Certificate Architect Valid {i}".encode())
        batch.append(cert_service.process_and_upload(test_user_id, "John Doe", f))
    
    await asyncio.gather(*batch)
    end = time.time()
    print(f"-> Processed 10 rapid OCR & Validation bursts cleanly in {end-start:.3f} seconds.")

if __name__ == "__main__":
    asyncio.run(run_tests())
