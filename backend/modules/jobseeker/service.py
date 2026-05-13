from typing import Any, Dict, List, Optional
from pathlib import Path
from datetime import datetime
import json

from fastapi import Depends

# ── Centralized Services Layer (Phase 1 refactor) ──
from services.atsService import ats_service
from services.resumeParserService import resume_parser_service
from services.recommendationService import recommendation_service

from ai_engine.verification.verifier import VerificationEngine
from core.database import doc_to_entity, docs_to_entities, get_db, get_next_sequence


bookmark_store: Dict[int, List[int]] = {}
search_history_store: Dict[int, List[str]] = {}


class JobSeekerService:
    def __init__(self, db):
        self.db = db
        self.profiles = db["jobseeker_profiles"]
        self.resumes = db["resumes"]
        self.applications = db["job_applications"]
        self.jobs = db["job_postings"]
        # Phase 1: Delegate AI concerns to centralized services
        self.parser = resume_parser_service
        self.ats_scorer = ats_service
        self.recommender = recommendation_service
        self.verifier = VerificationEngine()

    @staticmethod
    def _domain_dir() -> Path:
        folder = Path(__file__).resolve().parents[3] / "database" / "jobseeker"
        folder.mkdir(parents=True, exist_ok=True)
        return folder

    def _sync_domain_snapshot(self, user_id: int) -> None:
        profile = self.get_profile(user_id)
        resumes = docs_to_entities(self.resumes.find({"user_id": int(user_id)}).sort("id", 1))
        applications = docs_to_entities(self.applications.find({"user_id": int(user_id)}).sort("id", 1))

        snapshot = {
            "updated_at": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "profile": {
                "headline": getattr(profile, "headline", None),
                "skills": getattr(profile, "skills", []),
                "ats_score": getattr(profile, "ats_score", 0),
                "resume_data": getattr(profile, "resume_data", {}),
                "missing_skills": getattr(profile, "missing_skills", []),
                "experience_years": getattr(profile, "experience_years", 0),
                "education_level": getattr(profile, "education_level", None),
                "portfolio_url": getattr(profile, "portfolio_url", None),
                "github_url": getattr(profile, "github_url", None),
            },
            "resumes": [
                {
                    "id": getattr(r, "id", None),
                    "file_name": getattr(r, "file_name", "Unknown File"),
                    "ats_score": getattr(r, "ats_score", 0),
                    "missing_skills": getattr(r, "missing_skills", []),
                    "created_at": getattr(r, "created_at", datetime.utcnow()).isoformat() if hasattr(r, "created_at") and r.created_at else None,
                }
                for r in resumes
            ],
            "applications": [
                {
                    "id": getattr(a, "id", None),
                    "job_id": getattr(a, "job_id", None),
                    "status": getattr(a, "status", "applied"),
                    "ats_score": getattr(a, "ats_score", 0),
                    "ats_match_score": getattr(a, "ats_match_score", getattr(a, "ats_score", 0)),
                    "matched_skills": getattr(a, "matched_skills", []),
                    "missing_skills": getattr(a, "missing_skills", []),
                }
                for a in applications
            ],
        }

        file_path = self._domain_dir() / f"jobseeker_{user_id}_domain.json"
        file_path.write_text(json.dumps(snapshot, ensure_ascii=True, indent=2), encoding="utf-8")

    def get_profile(self, user_id: int):
        profile_doc = self.profiles.find_one({"user_id": int(user_id)})
        if not profile_doc:
            return None
            
        # Fetch all resumes for this user to support multiple versions in UI
        resumes = list(self.resumes.find({"user_id": int(user_id)}).sort("id", -1))
        # Ensure ObjectIds are handled (handled by doc_to_entity/serialization usually, 
        # but we mark it here for clarity)
        profile_doc["uploadedResumes"] = resumes
        profile_doc["hasResume"] = len(resumes) > 0
        
        # Add dynamic skill recommendations based on profile
        profile_doc["recommended_skills"] = self.get_skill_recommendations(user_id)
        
        return doc_to_entity(profile_doc)

    def get_skill_recommendations(self, user_id: int) -> List[str]:
        profile_doc = self.profiles.find_one({"user_id": int(user_id)})
        if not profile_doc: return ["Docker", "AWS", "TypeScript"]
        
        skills = profile_doc.get("skills", [])
        recommendations = set()
        lower_skills = [s.lower() for s in skills]
        
        mapping = {
            "java": ["Spring Boot", "Hibernate"],
            "react": ["Next.js", "Redux"],
            "python": ["Django", "FastAPI"],
            "node.js": ["Express", "MongoDB"],
            "node": ["Express", "MongoDB"],
            "javascript": ["TypeScript", "Node.js"],
            "js": ["TypeScript", "Node.js"],
            "sql": ["PostgreSQL", "Redis"],
            "html": ["React", "Tailwind CSS"],
            "css": ["React", "Tailwind CSS"],
            "cloud": ["AWS", "Azure", "Docker"],
            "frontend": ["Next.js", "Tailwind CSS"],
            "backend": ["Docker", "Redis", "Microservices"]
        }
        
        for s in lower_skills:
            for key, recs in mapping.items():
                if key in s:
                    for r in recs:
                        if r.lower() not in lower_skills:
                            recommendations.add(r)
                            
        # If no specific matches, provide high-value tech defaults
        if not recommendations:
            defaults = ["Docker", "AWS", "TypeScript", "System Design"]
            for d in defaults:
                if d.lower() not in lower_skills:
                    recommendations.add(d)
            
        return list(recommendations)[:4]

    def update_profile(self, user_id: int, update_data: Dict[str, Any]):
        now = datetime.utcnow()
        existing = self.profiles.find_one({"user_id": int(user_id)})
        
        if not existing:
            doc = {
                "id": get_next_sequence(self.db, "jobseeker_profiles"),
                "user_id": int(user_id),
                "first_name": update_data.get("first_name", ""),
                "last_name": update_data.get("last_name", ""),
                "headline": update_data.get("headline"),
                "skills": update_data.get("skills", []),
                "experience_years": float(update_data.get("experience_years", 0) or 0),
                "education_level": update_data.get("education_level"),
                "portfolio_url": update_data.get("portfolio_url"),
                "github_url": update_data.get("github_url"),
                "created_at": now,
                "updated_at": now,
            }
            self.profiles.insert_one(doc)
            profile = doc_to_entity(doc)
        else:
            update_data["updated_at"] = now
            if "experience_years" in update_data:
                update_data["experience_years"] = float(update_data["experience_years"] or 0)
            self.profiles.update_one({"user_id": int(user_id)}, {"$set": update_data})
            profile = self.get_profile(user_id)

        self._sync_domain_snapshot(user_id)
        return profile

    def upload_resume(self, user_id: int, file_name: str, file_bytes: bytes, user_email: str, job_description: str = ""):
        # 1. Save physical file to database/jobseeker/Files/<user_email>
        from pathlib import Path
        db_base = Path(__file__).resolve().parents[3] / "database" / "jobseeker" / "Files" / user_email
        db_base.mkdir(parents=True, exist_ok=True)
        file_path = db_base / file_name
        file_path.write_bytes(file_bytes)

        # 2. Extract content
        from services.resumeParserService import resume_parser_service
        resume_text = resume_parser_service.extract_text_from_bytes(file_bytes, file_name)

        parsed = self.parser.parse_text(resume_text)
        resume_data = {
            "skills": parsed.get("skills", []),
            "experience_years": parsed.get("experience_years", 0),
            "parsed_text": resume_text,
            "projects": parsed.get("projects", []),
            "education": parsed.get("education", []),
        }
        if job_description.strip():
            required_skills = self.parser._extract_skills(job_description.lower())
            ats_result = self.ats_scorer.score_against_jd(
                resume_data,
                {
                    "required_skills": required_skills,
                    "required_experience_years": 0,
                    "description": job_description,
                },
            )
            ats_score = ats_result.get("ats_score", 0)
            missing_skills = ats_result.get("missing_keywords", [])
            matched_skills = ats_result.get("matched_keywords", [])
        else:
            ats_result = self.ats_scorer.score_resume(resume_data)
            ats_score = ats_result.get("ats_score", 0)
            missing_skills = []
            matched_skills = []
        now = datetime.utcnow()
        resume_doc = {
            "id": get_next_sequence(self.db, "resumes"),
            "user_id": int(user_id),
            "file_name": file_name,
            "raw_text": resume_text,
            "parsed_data": parsed,
            "resume_data": resume_data,
            "ats_score": ats_score,
            "missing_skills": missing_skills,
            "semantic_score": 0,
            "file_path": str(file_path), 
            "created_at": now,
            "updated_at": now,
        }
        self.resumes.insert_one(resume_doc)

        existing_profile = self.profiles.find_one({"user_id": int(user_id)})
        if existing_profile:
            self.profiles.update_one(
                {"user_id": int(user_id)},
                {
                    "$set": {
                        "skills": list(set(parsed.get("skills", []))),
                        "experience_years": float(parsed.get("experience_years", 0)),
                        "education_level": parsed.get("education", "unknown"),
                        "ats_score": float(ats_score),
                        "ats_breakdown": ats_result.get("breakdown", {}),
                        "resume_data": resume_data,
                        "missing_skills": missing_skills,
                        "updated_at": now,
                    }
                },
            )
        else:
            self.profiles.insert_one(
                {
                    "id": get_next_sequence(self.db, "jobseeker_profiles"),
                    "user_id": int(user_id),
                    "headline": "",
                    "skills": parsed.get("skills", []),
                    "ats_score": ats_score,
                    "ats_breakdown": ats_result.get("breakdown", {}),
                    "resume_data": resume_data,
                    "missing_skills": missing_skills,
                    "experience_years": parsed.get("experience_years", 0),
                    "education_level": parsed.get("education", "unknown"),
                    "portfolio_url": None,
                    "github_url": None,
                    "created_at": now,
                    "updated_at": now,
                }
            )

        resume = doc_to_entity(resume_doc)
        self._sync_domain_snapshot(user_id)
        return resume

    def get_latest_resume(self, user_id: int):
        return doc_to_entity(self.resumes.find_one({"user_id": int(user_id)}, sort=[("id", -1)]))

    def get_latest_insight(self, user_id: int):
        return self.db["resume_insights"].find_one({"user_id": int(user_id)}, sort=[("id", -1)])

    def list_recommended_jobs(self, user_id: int) -> List[Dict[str, Any]]:
        profile = self.get_profile(user_id)
        jobs = docs_to_entities(self.jobs.find().sort("id", 1))
        profile_payload = {
            "skills": getattr(profile, "skills", []),
            "experience_years": getattr(profile, "experience_years", 0),
        }
        return self.recommender.recommend_jobs(profile_payload, jobs)

    def apply_for_job(self, user_id: int, job_id: int):
        print(f"[AUTH_DEBUG] User {user_id} attempting to apply for Job {job_id}")
        existing = self.applications.find_one({"user_id": int(user_id), "job_id": int(job_id)})
        if existing:
            print(f"[AUTH_DEBUG] User {user_id} has already applied for Job {job_id}. Skipping.")
            return doc_to_entity(existing)
            
        job_doc = self.jobs.find_one({"id": int(job_id)})
        if not job_doc:
            raise ValueError(f"Job with id {job_id} not found")
            
        resume_doc = self.resumes.find_one({"user_id": int(user_id)}, sort=[("id", -1)])
        if not resume_doc:
            raise ValueError("Resume not found or not processed. Please upload a resume before applying.")
            
        resume_data = {
            "skills": resume_doc.get("parsed_data", {}).get("skills", []),
            "experience_years": resume_doc.get("parsed_data", {}).get("experience_years", 0),
            "parsed_text": resume_doc.get("raw_text", ""),
        }
        
        jd_data = {
            "required_skills": job_doc.get("required_skills", []),
            "required_experience_years": job_doc.get("min_experience", 0),
            "description": job_doc.get("description", ""),
        }
        
        try:
            ats_result = self.ats_scorer.score_against_jd(resume_data, jd_data)
            ats_score = ats_result.get("ats_score", 0)
            skills_match = ats_result.get("breakdown", {})
            matched_skills = ats_result.get("matched_keywords", [])
            missing_keywords = ats_result.get("missing_keywords", [])
            
            # AI Certificate Checking Engine Integration
            cert_cursor = self.db["certificates"].find({"user_id": int(user_id), "verification_status": {"$in": ["ai_reviewed", "verified"]}})
            cert_bonus = 0
            from datetime import date, datetime as dt
            
            for cert in cert_cursor:
                expiry = cert.get("expiry_date")
                if expiry:
                    try:
                        if isinstance(expiry, str):
                            exp_d = dt.strptime(expiry.split('T')[0], "%Y-%m-%d").date()
                        else:
                            exp_d = expiry.date() if hasattr(expiry, "date") else None
                        if exp_d and exp_d < date.today():
                            continue
                    except:
                        pass
                    cert_bonus += 5
                    
            cert_bonus = min(cert_bonus, 20)
            ats_score = min(100, ats_score + cert_bonus)
            print(f"ATS score after Certificate bounded injection: {ats_score} (+{cert_bonus} cert bonus)")
        except Exception as e:
            print(f"ATS score computed: Failed with error {e}")
            ats_score = 0
            skills_match = {}
            matched_skills = []
            missing_keywords = []

        # ROADMAP STEP 27: AI Summary Generation
        from services.llmService import llm_service
        ai_summary = llm_service.generate_hr_feedback(ats_score, matched_skills)

        now = datetime.utcnow()
        application_doc = {
            "id": get_next_sequence(self.db, "job_applications"),
            "user_id": int(user_id),
            "job_id": int(job_id),
            "employer_id": int(job_doc["employer_id"]),
            "status": "applied",
            "ats_match_score": ats_score,
            "matched_skills": matched_skills,
            "missing_skills": missing_keywords,
            "ai_summary": ai_summary,
            "created_at": now,
            "updated_at": now,
            # Legacy/Internal compat
            "ats_score": ats_score,
            "ranking_score": ats_score,
            "skills_match": skills_match,
        }
        self.applications.insert_one(application_doc)
        print("Application inserted with score")
        application = doc_to_entity(application_doc)
        self._sync_domain_snapshot(user_id)
        return application

    def list_applications(self, user_id: int) -> List[Any]:
        pipeline = [
            {"$match": {"user_id": int(user_id)}},
            {"$lookup": {
                "from": "job_postings",
                "localField": "job_id",
                "foreignField": "id",
                "as": "job_info"
            }},
            {"$unwind": {"path": "$job_info", "preserveNullAndEmptyArrays": True}},
            {"$sort": {"id": -1}}
        ]
        results = list(self.applications.aggregate(pipeline))
        for r in results:
            if "job_info" in r:
                r["job"] = r.pop("job_info")
        return docs_to_entities(results)

    def verify_projects(self, github_url: Optional[str], portfolio_url: Optional[str]) -> Dict[str, Any]:
        return self.verifier.verify_candidate(github_url=github_url, portfolio_url=portfolio_url)

    def get_insights(self, user_id: int) -> List[Dict[str, Any]]:
        profile = self.get_profile(user_id)
        skills = profile.skills if profile and profile.skills else []
        resume = doc_to_entity(self.resumes.find_one({"user_id": int(user_id)}, sort=[("id", -1)]))
        ats_score = resume.ats_score if resume else 0
        experience_years = profile.experience_years if profile else 0
        return self.recommender.get_insights(skills, ats_score, experience_years)

    def get_learning_recommendations(self, user_id: int) -> Dict[str, Any]:
        # 1. Fetch missing keywords from profile or latest resume insights
        profile = self.profiles.find_one({"user_id": int(user_id)})
        missing_keywords = profile.get("missing_skills", []) if profile else []
        
        if not missing_keywords:
            insights_collection = self.db["resume_insights"]
            latest_insight = insights_collection.find_one({"user_id": int(user_id)}, sort=[("id", -1)])
            missing_keywords = latest_insight.get("missing_keywords", []) if latest_insight else []
        
        # 2. Delegate to centralized recommendation service
        recs = self.recommender.get_learning_recommendations(missing_keywords)
        
        # 3. Format into the structure expected by the frontend
        return {
            "courses": [r for r in recs if r.get("type") == "Course"],
            "roadmap": [r for r in recs if r.get("type") == "Project"],
            "certifications": [r for r in recs if r.get("type") == "Certification"]
        }

    def get_notifications(self, user_id: int) -> List[Dict[str, Any]]:
        # Pull real notifications pushed by employer status changes
        real_notifs = list(
            self.db["notifications"]
            .find({"user_id": int(user_id)})
            .sort("id", -1)
            .limit(20)
        )
        
        result = []
        for n in real_notifs:
            result.append({
                "id": n.get("id"),
                "type": n.get("type", "update"),
                "title": n.get("title", "Notification"),
                "message": n.get("message", ""),
                "read": n.get("read", False),
                "created_at": n.get("created_at", "").isoformat() if hasattr(n.get("created_at", ""), "isoformat") else str(n.get("created_at", "")),
            })
        
        # Fallback: if no real notifications, show system defaults
        if not result:
            applications = self.list_applications(user_id)
            result = [
                {"type": "application", "title": "Applications", "message": f"You have {len(applications)} tracked applications.", "read": True, "created_at": ""},
                {"type": "recommendation", "title": "Job Matches", "message": "New high-match roles are available for your profile.", "read": True, "created_at": ""},
                {"type": "learning", "title": "Learning", "message": "A new skill-gap module is available. Check it out!", "read": True, "created_at": ""},
            ]
        
        return result

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


def get_jobseeker_service(db=Depends(get_db)) -> JobSeekerService:
    return JobSeekerService(db)
