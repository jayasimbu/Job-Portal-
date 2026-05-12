import os
import sys
import json
from datetime import datetime, timedelta

# Add parent directory to path to import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.database import get_database

def seed_demo_data():
    db = get_database()
    print("Seeding LINKUP AI Recruitment Platform Demo Data...")

    # 1. SAMPLE JOBS
    db["job_postings"].delete_many({"is_demo": True})
    
    sample_jobs = [
        {
            "id": 1001,
            "employer_id": 1,
            "title": "Senior Frontend Engineer (React/Next.js)",
            "description": "We are looking for a React expert to build our core dashboard. You should have 5+ years of experience with modern JS frameworks and a strong eye for design.",
            "required_skills": ["React", "JavaScript", "TypeScript", "Next.js", "Tailwind CSS", "Redux"],
            "experience_level": "Senior",
            "min_experience": 5,
            "salary": "$120k - $160k",
            "job_type": "Full-time",
            "location": "Remote",
            "active": True,
            "is_demo": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": 1002,
            "employer_id": 1,
            "title": "Full Stack Developer (Node/React)",
            "description": "Join our startup as an early engineer. You will work on both the React frontend and the Node.js/MongoDB backend.",
            "required_skills": ["React", "Node.js", "MongoDB", "Express", "REST API", "Docker"],
            "experience_level": "Mid-Level",
            "min_experience": 3,
            "salary": "$90k - $130k",
            "job_type": "Full-time",
            "location": "New York, NY",
            "active": True,
            "is_demo": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": 1003,
            "employer_id": 1,
            "title": "AI/ML Engineer Intern",
            "description": "Perfect role for a student or fresher interested in NLP and Generative AI. You will help build our matching engine using Python and OpenAI.",
            "required_skills": ["Python", "NLP", "Machine Learning", "Scikit-Learn", "FastAPI"],
            "experience_level": "Fresher",
            "min_experience": 0,
            "salary": "$40/hr",
            "job_type": "Internship",
            "location": "San Francisco, CA",
            "active": True,
            "is_demo": True,
            "created_at": datetime.utcnow()
        }
    ]
    
    db["job_postings"].insert_many(sample_jobs)
    print(f"Created {len(sample_jobs)} demo job postings.")

    # 2. SAMPLE CANDIDATES / APPLICATIONS
    db["job_applications"].delete_many({"is_demo": True})
    
    # We'll use id range 5000+ for demo candidates
    sample_apps = [
        {
            "id": 5001,
            "user_id": 501,
            "job_id": 1001,
            "employer_id": 1,
            "name": "Arjun Kumar",
            "role": "Frontend Specialist",
            "status": "shortlisted",
            "ats_score": 94,
            "ats_match_score": 94,
            "matched_skills": ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
            "missing_skills": ["Next.js"],
            "is_demo": True,
            "created_at": datetime.utcnow() - timedelta(days=2)
        },
        {
            "id": 5002,
            "user_id": 502,
            "job_id": 1001,
            "employer_id": 1,
            "name": "Sarah Chen",
            "role": "UI Engineer",
            "status": "applied",
            "ats_score": 82,
            "ats_match_score": 82,
            "matched_skills": ["React", "JavaScript", "Redux"],
            "missing_skills": ["TypeScript", "Tailwind CSS"],
            "is_demo": True,
            "created_at": datetime.utcnow() - timedelta(hours=5)
        },
        {
            "id": 5003,
            "user_id": 503,
            "job_id": 1002,
            "employer_id": 1,
            "name": "David Miller",
            "role": "Full Stack Dev",
            "status": "applied",
            "ats_score": 68,
            "ats_match_score": 68,
            "matched_skills": ["Node.js", "Express", "MongoDB"],
            "missing_skills": ["React", "Docker"],
            "is_demo": True,
            "created_at": datetime.utcnow() - timedelta(days=1)
        }
    ]
    
    db["job_applications"].insert_many(sample_apps)
    print(f"Created {len(sample_apps)} demo applications with AI rankings.")

    print("\nDEMO DATA READY. You can now showcase the full AI Matching flow.")

if __name__ == "__main__":
    seed_demo_data()
