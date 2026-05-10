import sys
from pathlib import Path
backend_root = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_root))

from core.database import get_database
from modules.jobseeker.service import JobSeekerService
import traceback

db = get_database()
service = JobSeekerService(db)

# Use the data from the last test run
user_id = 96
job_id = 135

print(f"Simulating apply_for_job for user {user_id}, job {job_id}")
try:
    # Manual simulation of the logic inside apply_for_job
    job_doc = db["job_postings"].find_one({"id": int(job_id)})
    resume_doc = db["resumes"].find_one({"user_id": int(user_id)}, sort=[("id", -1)])
    
    print(f"Job found: {bool(job_doc)}")
    print(f"Resume found: {bool(resume_doc)}")
    
    resume_data = {
        "skills": resume_doc.get("parsed_data", {}).get("skills", []),
        "experience_years": resume_doc.get("parsed_data", {}).get("experience_years", 0),
        "parsed_text": resume_doc.get("raw_text", ""),
    }
    
    jd_data = {
        "required_skills": job_doc.get("required_skills") or job_doc.get("skills_required") or [],
        "required_experience_years": job_doc.get("min_experience", 0),
        "description": job_doc.get("description", ""),
    }
    
    print("Calling ats_scorer.score_job_description_ats...")
    result = service.ats_scorer.score_job_description_ats(resume_data, jd_data)
    print(f"Result: {result}")
    
except Exception as e:
    print(f"Error caught: {e}")
    traceback.print_exc()
