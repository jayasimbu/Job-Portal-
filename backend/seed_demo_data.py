"""
seed_demo_data.py — Seed demo applications & mixed activity logs for admin panel
Run once:  python seed_demo_data.py
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv("local.env")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = os.getenv("MONGO_DB", "career_auto")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# ── 1. Seed 5 demo applications with different statuses ──────────────────────

demo_apps = [
    {
        "id": "app-demo-001",
        "user_id": 2,
        "user_name": "Priya Sharma",
        "user_email": "priya@example.com",
        "job_id": "job-001",
        "job_title": "Full Stack Developer",
        "company_name": "TCS Digital",
        "match_score": 87,
        "status": "pending",
        "applied_at": (datetime.utcnow() - timedelta(days=2)).isoformat(),
        "created_at": datetime.utcnow() - timedelta(days=2),
    },
    {
        "id": "app-demo-002",
        "user_id": 3,
        "user_name": "Rahul Kumar",
        "user_email": "rahul@example.com",
        "job_id": "job-002",
        "job_title": "Data Analyst",
        "company_name": "Infosys BPM",
        "match_score": 72,
        "status": "shortlisted",
        "applied_at": (datetime.utcnow() - timedelta(days=5)).isoformat(),
        "created_at": datetime.utcnow() - timedelta(days=5),
    },
    {
        "id": "app-demo-003",
        "user_id": 4,
        "user_name": "Ananya Reddy",
        "user_email": "ananya@example.com",
        "job_id": "job-003",
        "job_title": "Backend Engineer",
        "company_name": "Wipro Technologies",
        "match_score": 91,
        "status": "hired",
        "applied_at": (datetime.utcnow() - timedelta(days=10)).isoformat(),
        "created_at": datetime.utcnow() - timedelta(days=10),
    },
    {
        "id": "app-demo-004",
        "user_id": 5,
        "user_name": "Karthik Nair",
        "user_email": "karthik@example.com",
        "job_id": "job-004",
        "job_title": "UI/UX Designer",
        "company_name": "Zoho Corporation",
        "match_score": 54,
        "status": "rejected",
        "applied_at": (datetime.utcnow() - timedelta(days=7)).isoformat(),
        "created_at": datetime.utcnow() - timedelta(days=7),
    },
    {
        "id": "app-demo-005",
        "user_id": 6,
        "user_name": "Deepa Menon",
        "user_email": "deepa@example.com",
        "job_id": "job-005",
        "job_title": "DevOps Engineer",
        "company_name": "HCL Technologies",
        "match_score": 79,
        "status": "reviewed",
        "applied_at": (datetime.utcnow() - timedelta(days=3)).isoformat(),
        "created_at": datetime.utcnow() - timedelta(days=3),
    },
]

# Remove old demo apps first
db["job_applications"].delete_many({"id": {"$regex": "^app-demo-"}})
db["job_applications"].insert_many(demo_apps)
print(f"✅ Seeded {len(demo_apps)} demo applications")


# ── 2. Seed diverse activity logs ────────────────────────────────────────────

import uuid

demo_logs = [
    {"level": "INFO",    "category": "auth",   "message": "New user registered: priya@example.com",         "user_email": "priya@example.com"},
    {"level": "INFO",    "category": "admin",  "message": "Company 'TCS Digital' verified by admin",        "user_email": "admin@LINKUP.com"},
    {"level": "INFO",    "category": "job",    "message": "Job 'Full Stack Developer' approved",            "user_email": "admin@LINKUP.com"},
    {"level": "INFO",    "category": "resume", "message": "Resume uploaded by Rahul Kumar",                 "user_email": "rahul@example.com"},
    {"level": "INFO",    "category": "job",    "message": "Application submitted for Data Analyst",         "user_email": "rahul@example.com"},
    {"level": "WARNING", "category": "admin",  "message": "Employer 'TestCorp' suspended for policy violation", "user_email": "admin@LINKUP.com"},
    {"level": "INFO",    "category": "auth",   "message": "New user registered: karthik@example.com",      "user_email": "karthik@example.com"},
    {"level": "INFO",    "category": "admin",  "message": "Company 'Zoho Corporation' verified by admin",   "user_email": "admin@LINKUP.com"},
    {"level": "INFO",    "category": "resume", "message": "Resume uploaded by Ananya Reddy",                "user_email": "ananya@example.com"},
    {"level": "INFO",    "category": "job",    "message": "Job 'Backend Engineer' approved",                "user_email": "admin@LINKUP.com"},
    {"level": "WARNING", "category": "system", "message": "High API response time detected (>2s)",         "user_email": None},
    {"level": "INFO",    "category": "auth",   "message": "New user registered: deepa@example.com",        "user_email": "deepa@example.com"},
    {"level": "INFO",    "category": "job",    "message": "Application submitted for DevOps Engineer",     "user_email": "deepa@example.com"},
    {"level": "INFO",    "category": "admin",  "message": "User role changed: employer → admin",            "user_email": "admin@LINKUP.com"},
    {"level": "ERROR",   "category": "system", "message": "Ollama service timeout — retrying",              "user_email": None},
]

# Add timestamps spread across last 7 days
for i, entry in enumerate(demo_logs):
    entry["id"] = str(uuid.uuid4())
    entry["timestamp"] = (datetime.utcnow() - timedelta(hours=i*5)).isoformat()
    entry["user_id"] = None
    entry["ip_address"] = None
    entry["extra"] = {}

# Remove old demo logs by checking for our specific messages
db["system_logs"].delete_many({"id": {"$regex": "^[0-9a-f]{8}-"}})
db["system_logs"].insert_many(demo_logs)
print(f"✅ Seeded {len(demo_logs)} diverse activity logs")

print("\n🎯 Demo data seeded successfully!")
