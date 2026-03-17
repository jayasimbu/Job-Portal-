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


bookmark_store: Dict[int, List[int]] = {}
search_history_store: Dict[int, List[str]] = {}


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

    def get_insights(self, user_id: int) -> List[Dict[str, Any]]:
        profile = self.get_profile(user_id)
        skills = profile.skills if profile and profile.skills else []
        resume = self.db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.created_at.desc()).first()
        ats_score = resume.ats_score if resume else 0
        experience_years = profile.experience_years if profile else 0
        return [
            {
                "title": "ATS Readiness",
                "description": f"Current ATS score is {ats_score:.1f}. Target 85+ for premium role filters.",
            },
            {
                "title": "Skill Coverage",
                "description": f"Detected {len(skills)} mapped skills. Add project evidence for top 3 skills.",
            },
            {
                "title": "Experience Fit",
                "description": f"Profile maps to {experience_years:.1f}+ years roles based on experience markers.",
            },
        ]

    def get_learning_recommendations(self, user_id: int) -> List[Dict[str, Any]]:
        profile = self.get_profile(user_id)
        skills = set(profile.skills) if profile and profile.skills else set()
        modules: List[Dict[str, Any]] = [
            {"name": "Advanced React Architecture", "reason": "Improves frontend system design depth"},
            {"name": "System Design for Product Engineers", "reason": "Strengthens large-scale decision making"},
            {"name": "Data Structures Refresh for Interviews", "reason": "Improves interview readiness"},
        ]
        if "AWS" not in skills:
            modules.append({"name": "Cloud Fundamentals with AWS", "reason": "Adds cloud deployment competency"})
        return modules

    def get_notifications(self, user_id: int) -> List[Dict[str, Any]]:
        applications = self.list_applications(user_id)
        history = search_history_store.get(user_id, [])
        latest_query = history[-1] if history else "frontend roles"
        return [
            {
                "type": "application",
                "message": f"You have {len(applications)} tracked applications in progress.",
            },
            {
                "type": "recommendation",
                "message": f"New recommendations generated from your latest search: '{latest_query}'.",
            },
            {
                "type": "learning",
                "message": "A new skill-gap learning module is available for your profile.",
            },
        ]

    def list_bookmarks(self, user_id: int) -> List[int]:
        return bookmark_store.get(user_id, [])

    def toggle_bookmark(self, user_id: int, job_id: int) -> List[int]:
        saved = bookmark_store.get(user_id, [])
        if job_id in saved:
            saved = [item for item in saved if item != job_id]
        else:
            saved = [*saved, job_id]
        bookmark_store[user_id] = saved
        return saved

    def list_search_history(self, user_id: int) -> List[str]:
        return search_history_store.get(user_id, [])

    def add_search_history(self, user_id: int, query: str) -> List[str]:
        history = search_history_store.get(user_id, [])
        cleaned = query.strip()
        if cleaned:
            history = [*history, cleaned][-20:]
        search_history_store[user_id] = history
        return history


def get_jobseeker_service(db: Session = Depends(get_db)) -> JobSeekerService:
    return JobSeekerService(db)
