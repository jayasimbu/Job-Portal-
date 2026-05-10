from pymongo import MongoClient
from datetime import datetime
import uuid

def seed():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['career_auto_db']
    
    # 1. Check if Employer exists, if not create one
    employer = db.users.find_one({"role": "employer", "email": "hr@innovateai.com"})
    if not employer:
        employer_id = db.users.count_documents({}) + 1
        db.users.insert_one({
            "id": employer_id,
            "email": "hr@innovateai.com",
            "password_hash": "dummy_hash",
            "first_name": "Sarah",
            "last_name": "Connor",
            "role": "employer",
            "is_active": True,
            "created_at": datetime.utcnow()
        })
    else:
        employer_id = employer["id"]

    # 2. Check/Create Employer Profile
    profile = db.employer_profiles.find_one({"user_id": employer_id})
    if not profile:
        db.employer_profiles.insert_one({
            "id": db.employer_profiles.count_documents({}) + 1,
            "company_id": str(uuid.uuid4()),
            "user_id": employer_id,
            "company_name": "Innovate AI Solutions",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
            "website": "https://innovateai.com",
            "industry": "Technology",
            "company_size": "50-200",
            "location": "Global",
            "description": "Leading the AI revolution in autonomous career systems.",
            "founded_year": "2020",
            "email": "hr@innovateai.com",
            "phone": "+1234567890",
            "verified": True,
            "created_by": str(employer_id),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })

    # 3. Insert a proper Job Posting matching the Jobseeker's skills (AI, deep learning, es6, css3, bootstrap)
    # We will also insert one that perfectly matches, and one that partially matches.
    
    db.job_postings.delete_many({"company_name": "Innovate AI Solutions"}) # Clear old
    
    job1 = {
        "id": db.job_postings.count_documents({}) + 1,
        "job_id": str(uuid.uuid4()),
        "company_id": str(uuid.uuid4()),
        "title": "AI Full Stack Engineer",
        "company_name": "Innovate AI Solutions",
        "location": "Remote",
        "employment_type": "Full-time",
        "experience_level": "2-5 years",
        "skills_required": ["ai", "deep learning", "python", "es6", "react", "tensorflow"],
        "job_description": "We are looking for an AI Full Stack Engineer who can bridge the gap between Deep Learning models and modern web interfaces using ES6 and React.",
        "responsibilities": "Develop deep learning models and deploy them on the web.",
        "qualifications": "Experience with AI, Deep Learning, and ES6 Javascript.",
        "employer_id": employer_id,
        "posted_by": str(employer_id),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "status": "active",
        "active": True
    }
    
    job2 = {
        "id": db.job_postings.count_documents({}) + 2,
        "job_id": str(uuid.uuid4()),
        "company_id": str(uuid.uuid4()),
        "title": "Frontend UI Developer (AI Tools)",
        "company_name": "Innovate AI Solutions",
        "location": "New York, USA",
        "employment_type": "Full-time",
        "experience_level": "0-2 years",
        "skills_required": ["bootstrap", "css3", "es6", "html5", "ui/ux"],
        "job_description": "Create stunning, responsive interfaces for our next-gen AI tools. Strong Bootstrap and CSS3 skills required.",
        "responsibilities": "Build dashboards using Bootstrap and ES6.",
        "qualifications": "Strong portfolio showing CSS3 and Bootstrap mastery.",
        "employer_id": employer_id,
        "posted_by": str(employer_id),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "status": "active",
        "active": True
    }
    
    db.job_postings.insert_many([job1, job2])
    print("Seeded Employer and 2 perfect matching jobs!")

if __name__ == '__main__':
    seed()
