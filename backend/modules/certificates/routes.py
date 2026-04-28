from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from core.database import get_db
from core.security import get_current_user_db
from modules.certificates.service import CertificateService
from modules.certificates.models import CertificateResponse

router = APIRouter()

def get_certificate_service(db = Depends(get_db)) -> CertificateService:
    return CertificateService(db)

@router.post("/upload")
async def upload_certificate(
    file: UploadFile = File(...),
    user = Depends(get_current_user_db),
    service: CertificateService = Depends(get_certificate_service)
):
    cert = await service.process_and_upload(user.id, getattr(user, "name", "Candidate"), file)
    return {"success": True, "certificate": cert.__dict__}

@router.get("/user", response_model=dict)
async def get_my_certificates(
    user = Depends(get_current_user_db),
    service: CertificateService = Depends(get_certificate_service)
):
    certs = service.get_user_certificates(user.id)
    return {"success": True, "certificates": [c.__dict__ for c in certs]}

@router.get("/user/{user_id}")
async def get_user_certificates(
    user_id: int,
    user = Depends(get_current_user_db),
    service: CertificateService = Depends(get_certificate_service)
):
    if user.id != user_id and getattr(user, 'role', '') != 'employer' and getattr(user, 'role', '') != 'admin':
        # Added safety bound handling. Employers/Admins can see if needed, else locked to candidate.
        raise HTTPException(status_code=403, detail="Not authorized to view these certificates")
        
    certs = service.get_user_certificates(user_id)
    return {"success": True, "certificates": [c.__dict__ for c in certs]}

@router.put("/verify/{cert_id}")
async def verify_certificate(
    cert_id: str,
    payload: dict,
    user = Depends(get_current_user_db),
    service: CertificateService = Depends(get_certificate_service),
    db = Depends(get_db)
):
    status = payload.get("status")
    cert = service.verify_certificate(cert_id, status, str(user.id))
    
    # Optional AST Recalculation Trigger logic for recruiter view sync automatically
    try:
        from modules.jobseeker.service import JobSeekerService
        job_service = JobSeekerService(db) 
        apps = db["job_applications"].find({"user_id": cert.user_id})
        for app in apps:
            # Reapplying the ATS flow using the current application's resume and job
            resume_doc = db["resumes"].find_one({"user_id": cert.user_id}, sort=[("id", -1)])
            job_doc = db["job_postings"].find_one({"id": app["job_id"]})
            if resume_doc and job_doc:
                from ai_engine.ats_scoring.scorer import score_job_description_ats
                resume_data = {
                    "skills": resume_doc.get("parsed_data", {}).get("skills", []),
                    "experience_years": resume_doc.get("parsed_data", {}).get("experience_years", 0),
                    "parsed_text": resume_doc.get("raw_text", ""),
                }
                jd_data = {
                    "required_skills": job_doc.get("required_skills", []),
                    "required_experience_years": job_doc.get("min_experience", 0),
                    "description": job_doc.get("description", ""),
                }
                ats_result = score_job_description_ats(resume_data, jd_data)
                base_ats = ats_result.get("ats_score", 0)
                
                # Fetch Cert Bonus again
                cert_bonus = 0
                TRUSTED_ISSUERS = ["amazon", "google", "microsoft", "coursera", "aws"]
                verified_certs = db["certificates"].find({"user_id": cert.user_id, "verification_status": {"$in": ["ai_reviewed", "verified"]}})
                for v_cert in verified_certs:
                    iss = v_cert.get("issuer", "").lower()
                    conf = v_cert.get("confidence_score", 0)
                    if any(t in iss for t in TRUSTED_ISSUERS): cert_bonus += 10
                    if conf > 70: cert_bonus += 5
                
                new_ats = min(100, base_ats + min(cert_bonus, 20))
                db["job_applications"].update_one({"id": app["id"]}, {"$set": {"ats_score": new_ats}})
    except Exception as e:
        print(f"ATS Recalculation Trigger Failed: {e}")

    return {"success": True, "certificate": cert.__dict__}
    
@router.get("/queue")
async def get_verification_queue(
    user = Depends(get_current_user_db),
    service: CertificateService = Depends(get_certificate_service)
):
    # Optional checking if user is admin could be done here
    certs = service.get_all_pending()
    return {"success": True, "queue": [c.__dict__ for c in certs]}
