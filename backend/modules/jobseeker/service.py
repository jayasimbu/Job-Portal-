from typing import Any, Dict, List, Optional
from pathlib import Path
from datetime import datetime
import json

from fastapi import Depends

# ── Centralized Services Layer ──
from services.atsService import ats_service
from services.resumeParserService import resume_parser_service
from services.recommendationService import recommendation_service

from ai_engine.verification.verifier import VerificationEngine
from core.database import doc_to_entity, docs_to_entities, get_db, get_next_sequence


class JobSeekerService:
    def __init__(self, db):
        self.db = db
        self.profiles = db["jobseeker_profiles"]
        self.resumes = db["resumes"]
        self.applications = db["job_applications"]
        self.jobs = db["job_postings"]
        self.parser = resume_parser_service
        self.ats_scorer = ats_service
        self.recommender = recommendation_service
        self.verifier = VerificationEngine()

    def get_profile(self, user_id: int):
        profile_doc = self.profiles.find_one({"user_id": int(user_id)})
        if not profile_doc: return None
        resumes = list(self.resumes.find({"user_id": int(user_id)}).sort("id", -1))
        profile_doc["uploadedResumes"] = resumes
        profile_doc["hasResume"] = len(resumes) > 0
        return doc_to_entity(profile_doc)

    async def upload_resume(self, user_id: int, file_name: str, file_bytes: bytes, user_email: str, job_description: str = ""):
        # 1. Save file (with collision avoidance)
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        safe_file_name = f"{timestamp}_{file_name}"
        db_base = Path(__file__).resolve().parents[3] / "database" / "jobseeker" / "Files" / user_email
        db_base.mkdir(parents=True, exist_ok=True)
        file_path = db_base / safe_file_name
        file_path.write_bytes(file_bytes)

        # 2. Extract text
        resume_text = self.parser.extract_text_from_bytes(file_bytes, file_name)

        # 3. AI STRUCTURAL PARSING (STRICT MODE)
        from services.llmService import llm_service
        ai_parsed = await llm_service.parse_resume_structural(resume_text)
        
        # 4. DEEP DEDUPLICATION & CLEANING
        raw_skills = ai_parsed.get("skills", [])
        
        # Normalize: Trim, Upper Case, Remove empty
        clean_skills = []
        seen = set()
        for s in raw_skills:
            norm = s.strip().upper()
            if norm and norm not in seen:
                clean_skills.append(norm)
                seen.add(norm)
        
        resume_data = {
            "skills": clean_skills,
            "experience_years": float(ai_parsed.get("experience_years") or 0),
            "parsed_text": resume_text,
            "projects": ai_parsed.get("projects") or [],
            "education": ai_parsed.get("education") or "Unknown",
        }

        # 5. ATS & GAP ANALYSIS
        if job_description.strip():
            jd_result = await llm_service.generate_deep_ats_match(resume_text, job_description)
            ats_score = jd_result.get("match_score", 0)
            missing_skills = jd_result.get("missing_skills", [])
            recommended_skills = jd_result.get("recommendations", [])
            ats_breakdown = {"semantic": ats_score, "skills": 100 if len(jd_result.get("matched_skills", [])) > 5 else 50}
        else:
            ats_result = self.ats_scorer.score_resume(resume_data)
            ats_score = ats_result.get("ats_score", 0)
            ats_breakdown = ats_result.get("breakdown", {})
            gap_analysis = await llm_service.generate_skill_gap_analysis(clean_skills)
            missing_skills = gap_analysis.get("missing_skills", [])
            recommended_skills = gap_analysis.get("recommendations", [])

        # 6. HR SUMMARY
        hr_summary = await llm_service.generate_hr_summary(resume_text, ats_score)

        now = datetime.utcnow()
        resume_doc = {
            "id": get_next_sequence(self.db, "resumes"),
            "user_id": int(user_id),
            "file_name": file_name,
            "stored_path": str(file_path),
            "parsed_data": resume_data,
            "ats_score": ats_score,
            "hr_summary": hr_summary,
            "missing_skills": missing_skills,
            "recommended_skills": recommended_skills,
            "created_at": now,
        }
        self.resumes.insert_one(resume_doc)

        # Update Profile
        self.profiles.update_one(
            {"user_id": int(user_id)},
            {
                "$set": {
                    "skills": clean_skills,
                    "experience_years": resume_data["experience_years"],
                    "ats_score": float(ats_score),
                    "ats_breakdown": ats_breakdown,
                    "hr_summary": hr_summary,
                    "missing_skills": missing_skills,
                    "recommended_skills": recommended_skills,
                    "hasResume": True,
                    "updated_at": now,
                }
            },
            upsert=True
        )

        return doc_to_entity(resume_doc)

    async def apply_for_job(self, user_id: int, job_id: int):
        existing = self.applications.find_one({"user_id": int(user_id), "job_id": int(job_id)})
        if existing: return doc_to_entity(existing)
        
        job_doc = self.jobs.find_one({"id": int(job_id)})
        if not job_doc:
            # Fallback to jobs.json if not in database
            jobs_path = Path(__file__).resolve().parents[3] / "database" / "jobs" / "jobs.json"
            if jobs_path.exists():
                with open(jobs_path, "r", encoding="utf-8") as f:
                    all_jobs = json.load(f)
                    job_doc = next((j for j in all_jobs if j.get("id") == int(job_id)), None)
                    
        if not job_doc:
            raise ValueError(f"Job {job_id} not found")
            
        resume_doc = self.resumes.find_one({"user_id": int(user_id)}, sort=[("id", -1)])
        resume_text = resume_doc.get("parsed_data", {}).get("parsed_text", "") if resume_doc else ""
        job_desc = job_doc.get("description", "")
        
        from services.llmService import llm_service
        match_result = await llm_service.generate_deep_ats_match(resume_text, job_desc)
        ats_score = match_result.get("match_score", 0)

        application_doc = {
            "id": get_next_sequence(self.db, "job_applications"),
            "user_id": int(user_id),
            "job_id": int(job_id),
            "status": "applied",
            "ats_match_score": ats_score,
            "created_at": datetime.utcnow(),
        }
        self.applications.insert_one(application_doc)
        return doc_to_entity(application_doc)

    def list_applications(self, user_id: int) -> List[Any]:
        return docs_to_entities(list(self.applications.find({"user_id": int(user_id)}).sort("id", -1)))

    def list_recommended_jobs(self, user_id: int) -> List[Dict[str, Any]]:
        profile = self.get_profile(user_id)
        if not profile:
            return []
        
        # RecommendationService expects a dict for profile
        profile_dict = vars(profile) if hasattr(profile, "__dict__") else profile
        
        # Get all jobs (limit to open ones if possible)
        all_jobs = list(self.jobs.find({"status": "open"}))
        if not all_jobs:
            all_jobs = list(self.jobs.find())
            
        jobs_objects = docs_to_entities(all_jobs)
        return self.recommender.recommend_jobs(profile_dict, jobs_objects)

    def update_profile(self, user_id: int, data: Dict[str, Any]):
        now = datetime.utcnow()
        data["updated_at"] = now
        self.profiles.update_one(
            {"user_id": int(user_id)},
            {"$set": data},
            upsert=True
        )
        return self.get_profile(user_id)

    def upsert_profile(self, user_id: int, data: Dict[str, Any]):
        return self.update_profile(user_id, data)

    def get_insights(self, user_id: int) -> List[Dict[str, Any]]:
        profile = self.get_profile(user_id)
        if not profile:
            return []
        
        return self.recommender.get_insights(
            skills=getattr(profile, "skills", []),
            ats_score=getattr(profile, "ats_score", 0.0),
            experience_years=getattr(profile, "experience_years", 0.0)
        )

    def verify_projects(self, github_url: Optional[str] = None, portfolio_url: Optional[str] = None) -> Dict[str, Any]:
        return self.verifier.verify_candidate(github_url, portfolio_url)

    def get_notifications(self, user_id: int) -> List[Dict[str, Any]]:
        # This could be pulled from a 'notifications' collection
        return [
            {
                "id": 1,
                "title": "Welcome to LinkUp",
                "message": "Complete your profile to get better job recommendations.",
                "time": "Just now",
                "type": "info"
            }
        ]

    def list_bookmarks(self, user_id: int) -> List[int]:
        bookmarks_doc = self.db["bookmarks"].find_one({"user_id": int(user_id)})
        return bookmarks_doc.get("job_ids", []) if bookmarks_doc else []

    def toggle_bookmark(self, user_id: int, job_id: int) -> List[int]:
        bookmarks_doc = self.db["bookmarks"].find_one({"user_id": int(user_id)})
        if not bookmarks_doc:
            job_ids = [int(job_id)]
            self.db["bookmarks"].insert_one({"user_id": int(user_id), "job_ids": job_ids})
        else:
            job_ids = bookmarks_doc.get("job_ids", [])
            if int(job_id) in job_ids:
                job_ids.remove(int(job_id))
            else:
                job_ids.append(int(job_id))
            self.db["bookmarks"].update_one({"user_id": int(user_id)}, {"$set": {"job_ids": job_ids}})
        return job_ids

    def list_search_history(self, user_id: int) -> List[str]:
        history_doc = self.db["search_history"].find_one({"user_id": int(user_id)})
        return history_doc.get("queries", []) if history_doc else []

    def add_search_history(self, user_id: int, query: str) -> List[str]:
        history_doc = self.db["search_history"].find_one({"user_id": int(user_id)})
        if not history_doc:
            queries = [query]
            self.db["search_history"].insert_one({"user_id": int(user_id), "queries": queries})
        else:
            queries = history_doc.get("queries", [])
            if query in queries:
                queries.remove(query)
            queries.insert(0, query)
            queries = queries[:10]
            self.db["search_history"].update_one({"user_id": int(user_id)}, {"$set": {"queries": queries}})
        return queries

    def get_learning_recommendations(self, user_id: int) -> Dict[str, Any]:
        profile = self.profiles.find_one({"user_id": int(user_id)})
        missing = profile.get("missing_skills", []) if profile else []
        recs = self.recommender.get_learning_recommendations(missing)
        return {
            "courses": [r for r in recs if r.get("type") == "Course"],
            "roadmap": [r for r in recs if r.get("type") == "Project"],
            "certifications": [r for r in recs if r.get("type") == "Certification"]
        }

    def delete_resume(self, user_id: int, resume_id: int) -> bool:
        resume = self.resumes.find_one({"id": int(resume_id), "user_id": int(user_id)})
        if not resume:
            return False
        
        # 1. Delete file if exists
        stored_path = resume.get("stored_path")
        if stored_path:
            try:
                p = Path(stored_path)
                if p.exists():
                    p.unlink()
            except Exception as e:
                log.warning(f"Failed to delete resume file: {e}")

        # 2. Delete from DB
        self.resumes.delete_one({"id": int(resume_id)})

        # 3. Update profile (clear if no resumes left)
        remaining = list(self.resumes.find({"user_id": int(user_id)}).sort("id", -1))
        if not remaining:
            self.profiles.update_one(
                {"user_id": int(user_id)},
                {"$set": {
                    "hasResume": False,
                    "ats_score": 0,
                    "skills": [],
                    "experience_years": 0,
                    "hr_summary": None,
                    "missing_skills": [],
                    "recommended_skills": []
                }}
            )
        else:
            latest = remaining[0]
            self.profiles.update_one(
                {"user_id": int(user_id)},
                {"$set": {
                    "skills": latest.get("parsed_data", {}).get("skills", []),
                    "experience_years": latest.get("parsed_data", {}).get("experience_years", 0),
                    "ats_score": latest.get("ats_score", 0),
                    "hr_summary": latest.get("hr_summary"),
                    "missing_skills": latest.get("missing_skills", []),
                    "recommended_skills": latest.get("recommended_skills", []),
                    "hasResume": True
                }}
            )
        return True

def get_jobseeker_service(db=Depends(get_db)) -> JobSeekerService:
    return JobSeekerService(db)
