import os
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime

load_dotenv("local.env")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB", "career_auto")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def seed_users():
    # Clear existing users
    db.users.delete_many({})
    
    users = [
        # Admin
        {
            "id": 1,
            "email": "admin@careerauto.com",
            "first_name": "System",
            "last_name": "Administrator",
            "role": "admin",
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        # Employers
        {
            "id": 10,
            "email": "hr@tcs.com",
            "first_name": "Arjun",
            "last_name": "Mehta",
            "role": "employer",
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": 11,
            "email": "recruiter@zoho.com",
            "first_name": "Sneha",
            "last_name": "Iyer",
            "role": "employer",
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": 12,
            "email": "hiring@infosys.com",
            "first_name": "Vikram",
            "last_name": "Singh",
            "role": "employer",
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        # Jobseekers
        {
            "id": 20,
            "email": "priya.sharma@gmail.com",
            "first_name": "Priya",
            "last_name": "Sharma",
            "role": "jobseeker",
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": 21,
            "email": "rahul.k@outlook.com",
            "first_name": "Rahul",
            "last_name": "Kumar",
            "role": "jobseeker",
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": 22,
            "email": "ananya.r@yahoo.com",
            "first_name": "Ananya",
            "last_name": "Reddy",
            "role": "jobseeker",
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": 23,
            "email": "karthik.nair@live.com",
            "first_name": "Karthik",
            "last_name": "Nair",
            "role": "jobseeker",
            "is_active": False,
            "created_at": datetime.utcnow()
        },
        {
            "id": 24,
            "email": "deepa.m@gmail.com",
            "first_name": "Deepa",
            "last_name": "Menon",
            "role": "jobseeker",
            "is_active": True,
            "created_at": datetime.utcnow()
        }
    ]
    
    db.users.insert_many(users)
    print(f"Successfully seeded {len(users)} users.")

if __name__ == "__main__":
    seed_users()
