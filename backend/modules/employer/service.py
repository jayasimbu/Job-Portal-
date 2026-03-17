from typing import Any, Dict, List

from fastapi import Depends
from sqlalchemy.orm import Session

from core.database import get_db
from modules.employer.candidate_ranking import CandidateRankingEngine
from modules.employer.model import EmployerProfile, JobPosting
from modules.jobseeker.model import JobApplication, Resume


interview_store: Dict[int, List[Dict[str, Any]]] = {}
hiring_policy_store: Dict[int, Dict[str, Any]] = {}


class EmployerService:
    def __init__(self, db: Session):
        self.db = db
        self.ranking_engine = CandidateRankingEngine()

    def upsert_company_profile(self, user_id: int, payload: Dict[str, Any]) -> EmployerProfile:
        profile = self.db.query(EmployerProfile).filter(EmployerProfile.user_id == user_id).first()
        if not profile:
            profile = EmployerProfile(user_id=user_id, company_name=payload.get("company_name", ""))
            self.db.add(profile)

        for key, value in payload.items():
            if hasattr(profile, key):
                setattr(profile, key, value)

        self.db.commit()
        self.db.refresh(profile)
        return profile

    def create_job_posting(self, payload: Dict[str, Any]) -> JobPosting:
        posting = JobPosting(**payload)
        self.db.add(posting)
        self.db.commit()
        self.db.refresh(posting)
        return posting

    def list_job_postings(self, employer_id: int) -> List[JobPosting]:
        return self.db.query(JobPosting).filter(JobPosting.employer_id == employer_id).all()

    def rank_applicants(self, job_id: int) -> List[Dict[str, Any]]:
        job = self.db.query(JobPosting).filter(JobPosting.id == job_id).first()
        if not job:
            return []

        applications = self.db.query(JobApplication).filter(JobApplication.job_id == job_id).all()
        candidates: List[Dict[str, Any]] = []
        for app in applications:
            resume = self.db.query(Resume).filter(Resume.user_id == app.user_id).order_by(Resume.id.desc()).first()
            candidates.append(
                {
                    "application_id": app.id,
                    "user_id": app.user_id,
                    "resume_text": resume.raw_text if resume else "",
                    "parsed_resume": resume.parsed_data if resume else {},
                }
            )

        return self.ranking_engine.rank_candidates(job.description, candidates)

    def analytics_summary(self, employer_id: int) -> Dict[str, Any]:
        jobs = self.list_job_postings(employer_id)
        job_ids = [job.id for job in jobs]
        applications = self.db.query(JobApplication).filter(JobApplication.job_id.in_(job_ids)).all() if job_ids else []
        shortlisted = [app for app in applications if (app.status or "").lower() in {"shortlisted", "interview_scheduled"}]
        return {
            "active_jobs": len([job for job in jobs if job.active]),
            "total_jobs": len(jobs),
            "total_applicants": len(applications),
            "shortlisted": len(shortlisted),
            "interviews": len(interview_store.get(employer_id, [])),
        }

    def update_candidate_status(self, application_id: int, status: str) -> JobApplication:
        app = self.db.query(JobApplication).filter(JobApplication.id == application_id).first()
        if not app:
            return None
        app.status = status
        self.db.commit()
        self.db.refresh(app)
        return app

    def list_interviews(self, employer_id: int) -> List[Dict[str, Any]]:
        return interview_store.get(employer_id, [])

    def schedule_interview(self, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        job = self.db.query(JobPosting).filter(JobPosting.id == payload["job_id"]).first()
        if not job:
            return []
        employer_id = job.employer_id
        current = interview_store.get(employer_id, [])
        current = [*current, payload]
        interview_store[employer_id] = current
        return current

    def get_hiring_policy(self, employer_id: int) -> Dict[str, Any]:
        return hiring_policy_store.get(
            employer_id,
            {
                "employer_id": employer_id,
                "skill_only_evaluation": True,
                "hide_sensitive_attributes": True,
                "bias_monitoring_enabled": True,
            },
        )

    def save_hiring_policy(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        employer_id = payload["employer_id"]
        hiring_policy_store[employer_id] = payload
        return payload


def get_employer_service(db: Session = Depends(get_db)) -> EmployerService:
    return EmployerService(db)
