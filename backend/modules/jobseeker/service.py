from typing import Any, Dict, List, Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from ai_engine.ats_scoring.scorer import ATSScorer
from ai_engine.recommendation.recommender import JobRecommender
from ai_engine.verification.verifier import VerificationEngine
from core.database import get_db
from modules.employer.model import JobPosting
from modules.jobseeker.model import JobApplication, JobSeekerProfile, Resume
from modules.jobseeker.resume_parser import ResumeParser


class JobSeekerService:
    def __init__(self, db: Session):
        self.db = db
        self.parser = ResumeParser()
        self.ats_scorer = ATSScorer()
        self.recommender = JobRecommender()
        self.verifier = VerificationEngine()

    def get_profile(self, user_id: int) -> Optional[JobSeekerProfile]:
        return self.db.query(JobSeekerProfile).filter(JobSeekerProfile.user_id == user_id).first()

    def upsert_profile(self, user_id: int, payload: Dict[str, Any]) -> JobSeekerProfile:
        profile = self.get_profile(user_id)
        if not profile:
            profile = JobSeekerProfile(user_id=user_id)
            self.db.add(profile)

        for key, value in payload.items():
            if hasattr(profile, key):
                setattr(profile, key, value)

        self.db.commit()
        self.db.refresh(profile)
        return profile

    def upload_resume(self, user_id: int, file_name: str, resume_text: str, job_description: str = "") -> Resume:
        parsed = self.parser.parse_text(resume_text)
        ats_score = self.ats_scorer.score_resume(parsed, job_description)

        resume = Resume(
            user_id=user_id,
            file_name=file_name,
            raw_text=resume_text,
            parsed_data=parsed,
            ats_score=ats_score,
            semantic_score=0,
        )
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)
        return resume

    def list_recommended_jobs(self, user_id: int) -> List[Dict[str, Any]]:
        profile = self.get_profile(user_id)
        jobs = self.db.query(JobPosting).all()
        profile_payload = {
            "skills": profile.skills if profile else [],
            "experience_years": profile.experience_years if profile else 0,
        }
        return self.recommender.recommend(profile_payload, jobs)

    def apply_for_job(self, user_id: int, job_id: int) -> JobApplication:
        application = JobApplication(user_id=user_id, job_id=job_id, status="applied", ranking_score=0)
        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)
        return application

    def list_applications(self, user_id: int) -> List[JobApplication]:
        return self.db.query(JobApplication).filter(JobApplication.user_id == user_id).all()

    def verify_projects(self, github_url: Optional[str], portfolio_url: Optional[str]) -> Dict[str, Any]:
        return self.verifier.verify_candidate(github_url=github_url, portfolio_url=portfolio_url)


def get_jobseeker_service(db: Session = Depends(get_db)) -> JobSeekerService:
    return JobSeekerService(db)
