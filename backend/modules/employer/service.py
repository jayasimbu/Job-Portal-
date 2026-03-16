from typing import Any, Dict, List

from fastapi import Depends
from sqlalchemy.orm import Session

from core.database import get_db
from modules.employer.candidate_ranking import CandidateRankingEngine
from modules.employer.model import EmployerProfile, JobPosting
from modules.jobseeker.model import JobApplication, Resume


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


def get_employer_service(db: Session = Depends(get_db)) -> EmployerService:
    return EmployerService(db)
