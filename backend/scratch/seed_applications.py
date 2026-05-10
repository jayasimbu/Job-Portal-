from core.database import get_db, get_next_sequence
from datetime import datetime, timedelta
import random

def seed_applications():
    db = next(get_db())
    user_id = 1 # Assuming user ID 1 is the main tester
    
    # Clear existing applications for this user if any
    db["job_applications"].delete_many({"user_id": user_id})
    
    jobs = list(db["job_postings"].find().limit(5))
    if not jobs:
        print("No jobs found to apply to. Please seed jobs first.")
        return

    statuses = ["applied", "reviewing", "shortlisted", "rejected", "interview_scheduled"]
    
    for i, job in enumerate(jobs):
        status = statuses[i % len(statuses)]
        now = datetime.utcnow() - timedelta(days=random.randint(1, 10))
        
        app_doc = {
            "id": get_next_sequence(db, "job_applications"),
            "user_id": user_id,
            "job_id": job["id"],
            "employer_id": job.get("employer_id", 0),
            "job_title": job.get("title", "Software Engineer"),
            "company_name": job.get("company", "Tech Corp"),
            "status": status,
            "ats_score": random.randint(45, 95),
            "baseline_score": random.randint(40, 90),
            "job_match_score": random.randint(50, 95),
            "skills_match": {
                "matched_keywords": ["Python", "React", "Node.js", "MongoDB"][:random.randint(2, 4)],
            },
            "missing_keywords": ["Docker", "Kubernetes", "AWS"][:random.randint(1, 3)],
            "created_at": now,
            "updated_at": now,
        }
        
        if status == "rejected":
            app_doc["rejection_feedback"] = "While your Python skills are excellent, we require more hands-on experience with production-scale Kubernetes clusters for this specific architecture role."
            
        db["job_applications"].insert_one(app_doc)
        print(f"Seeded application for job: {app_doc['job_title']} with status: {status}")

if __name__ == "__main__":
    seed_applications()
