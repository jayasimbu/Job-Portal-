import sys
import os
import asyncio
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import get_db
from modules.employer.service import EmployerService

async def run_verification():
    db = next(get_db())
    service = EmployerService(db)
    
    employer_id = 1010
    hacker_id = 9999
    job_id = 2020
    app_id = 3030
    
    # Cleanup
    db["job_postings"].delete_many({"id": job_id})
    db["job_applications"].delete_many({"id": app_id})
    
    # Setup
    db["job_postings"].insert_one({
        "id": job_id,
        "employer_id": employer_id,
        "title": "Senior Logic Engineer",
        "active": True
    })
    
    db["job_applications"].insert_one({
        "id": app_id,
        "user_id": 1234,
        "job_id": job_id,
        "status": "applied",
        "ats_score": 85
    })
    
    print("\n[Case 1] Valid Employer Status Update")
    try:
        res = service.update_candidate_status(app_id, "shortlisted", employer_id)
        print(f"-> SUCCESS: Status updated to {res.status}")
    except Exception as e:
        print(f"-> FAILED: {e}")

    print("\n[Case 2] Unauthorized Employer Status Update")
    try:
        service.update_candidate_status(app_id, "rejected", hacker_id)
        print("-> FAILED: Allowed unauthorized update!")
    except ValueError as e:
        print(f"-> SUCCESS: Caught unauthorized move: {e}")

    print("\n[Case 3] Move to Interviewing")
    try:
        res = service.update_candidate_status(app_id, "interviewing", employer_id)
        print(f"-> SUCCESS: Status updated to {res.status}")
    except Exception as e:
        print(f"-> FAILED: {e}")

    print("\n[Case 4] Database Sync Check")
    final_doc = db["job_applications"].find_one({"id": app_id})
    print(f"-> Application Status in DB: {final_doc['status']}")
    print(f"-> Updated At Present: {'updated_at' in final_doc}")

if __name__ == "__main__":
    asyncio.run(run_verification())
