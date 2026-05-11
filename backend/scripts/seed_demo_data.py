from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from core.database import get_database, get_next_sequence, create_db_and_tables
from core.security import get_password_hash
from modules.employer.service import EmployerService
from modules.jobseeker.service import JobSeekerService


DEMO_PASSWORD = "DemoPass123!"


def _ensure_user(
    db,
    *,
    email: str,
    first_name: str,
    last_name: str,
    role: str,
    is_verified: bool = True,
) -> Dict[str, Any]:
    users = db["users"]
    existing = users.find_one({"email": email})
    now = datetime.utcnow()

    if existing:
        users.update_one(
            {"email": email},
            {
                "$set": {
                    "first_name": first_name,
                    "last_name": last_name,
                    "role": role,
                    "is_active": True,
                    "is_verified": is_verified,
                    "updated_at": now,
                }
            },
        )
        return users.find_one({"email": email})

    doc = {
        "id": get_next_sequence(db, "users"),
        "email": email,
        "username": email,
        "hashed_password": get_password_hash(DEMO_PASSWORD),
        "first_name": first_name,
        "last_name": last_name,
        "role": role,
        "auth_method": "email",
        "is_active": True,
        "is_verified": is_verified,
        "verification_token": None,
        "reset_token": None,
        "reset_token_expires": None,
        "created_at": now,
        "updated_at": now,
    }
    users.insert_one(doc)
    return users.find_one({"email": email})


def _ensure_jobseeker_profile(jobseeker_service: JobSeekerService, user_id: int) -> None:
    profile = jobseeker_service.get_profile(user_id)
    payload = {
        "headline": "Full Stack Developer",
        "skills": ["python", "fastapi", "react", "mongodb"],
        "experience_years": 3,
        "education_level": "B.Tech",
        "portfolio_url": "https://example-portfolio.dev",
        "github_url": "https://github.com/example",
    }
    if profile:
        jobseeker_service.update_profile(user_id, payload)
    else:
        jobseeker_service.update_profile(user_id, payload)


def _ensure_resume(jobseeker_service: JobSeekerService, user_id: int) -> Optional[int]:
    resumes = jobseeker_service.resumes
    existing = resumes.find_one({"user_id": int(user_id)}, sort=[("id", -1)])
    if existing:
        return int(existing["id"])

    resume = jobseeker_service.upload_resume(
        user_id=user_id,
        file_name="demo_resume.txt",
        resume_text=(
            "Python FastAPI React MongoDB developer with hands-on API design, "
            "frontend integration, CI automation, and deployment troubleshooting."
        ),
        job_description="Looking for a full stack engineer skilled in Python and React",
    )
    return int(getattr(resume, "id", 0) or 0)


def _ensure_employer_profile(employer_service: EmployerService, employer_id: int) -> None:
    employer_service.upsert_company_profile(
        employer_id,
        {
            "company_name": "LINKUP Demo Inc",
            "website": "https://demo.example.com",
            "description": "Demo employer profile for product walkthrough",
            "verified": True,
        },
    )


def _ensure_job(employer_service: EmployerService, employer_id: int) -> int:
    jobs = employer_service.list_job_postings(employer_id)
    if jobs:
        return int(jobs[0].id)

    job = employer_service.create_job_posting(
        {
            "employer_id": employer_id,
            "title": "Demo Full Stack Engineer",
            "description": "Build and maintain FastAPI + React products.",
            "required_skills": ["python", "fastapi", "react", "mongodb"],
            "min_experience": 2,
            "education_required": "B.Tech",
            "location": "Remote",
            "employment_type": "full_time",
        }
    )
    return int(job.id)


def _ensure_application(jobseeker_service: JobSeekerService, user_id: int, job_id: int) -> None:
    existing = jobseeker_service.applications.find_one({"user_id": int(user_id), "job_id": int(job_id)})
    if existing:
        return
    jobseeker_service.apply_for_job(user_id=user_id, job_id=job_id)


def seed() -> None:
    create_db_and_tables()
    db = get_database()

    jobseeker = _ensure_user(
        db,
        email="demo.jobseeker@example.com",
        first_name="Demo",
        last_name="JobSeeker",
        role="jobseeker",
    )
    employer = _ensure_user(
        db,
        email="demo.employer@example.com",
        first_name="Demo",
        last_name="Employer",
        role="employer",
    )
    _ensure_user(
        db,
        email="demo.admin@example.com",
        first_name="Demo",
        last_name="Admin",
        role="admin",
    )

    jobseeker_service = JobSeekerService(db)
    employer_service = EmployerService(db)

    jobseeker_id = int(jobseeker["id"])
    employer_id = int(employer["id"])

    _ensure_jobseeker_profile(jobseeker_service, jobseeker_id)
    _ensure_resume(jobseeker_service, jobseeker_id)
    _ensure_employer_profile(employer_service, employer_id)
    job_id = _ensure_job(employer_service, employer_id)
    _ensure_application(jobseeker_service, jobseeker_id, job_id)

    print("Demo data seeded successfully.")
    print("Credentials (all users):")
    print(f"- Password: {DEMO_PASSWORD}")
    print("- demo.jobseeker@example.com")
    print("- demo.employer@example.com")
    print("- demo.admin@example.com")
    print(f"- Demo job id: {job_id}")


if __name__ == "__main__":
    seed()
