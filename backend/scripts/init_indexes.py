import pymongo
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="local.env")

def init_indexes():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGO_DB", "career_auto")
    
    print(f"Connecting to MongoDB at {mongo_uri}...")
    client = pymongo.MongoClient(mongo_uri)
    db = client[db_name]

    print("Creating National-Level Performance Indexes...")

    # Job Postings Indexes
    db.job_postings.create_index([("required_skills", pymongo.ASCENDING)])
    db.job_postings.create_index([("id", pymongo.ASCENDING)], unique=True)
    db.job_postings.create_index([("employer_id", pymongo.ASCENDING)])

    # External Jobs Indexes
    db.external_jobs.create_index([("requiredSkills", pymongo.ASCENDING)])
    db.external_jobs.create_index([("createdAt", pymongo.DESCENDING)])

    # User Interactions (For Feedback Learning)
    db.user_interactions.create_index([("userId", pymongo.ASCENDING), ("jobId", pymongo.ASCENDING)])
    db.user_interactions.create_index([("action", pymongo.ASCENDING)])

    # Jobseeker Profiles
    db.jobseeker_profiles.create_index([("user_id", pymongo.ASCENDING)], unique=True)
    db.jobseeker_profiles.create_index([("skills", pymongo.ASCENDING)])

    # Applications
    db.job_applications.create_index([("user_id", pymongo.ASCENDING)])
    db.job_applications.create_index([("job_id", pymongo.ASCENDING)])

    print("[SUCCESS] All National-Level indexes created successfully.")

if __name__ == "__main__":
    init_indexes()
