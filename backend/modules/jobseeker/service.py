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
                "experience_years": getattr(profile, "experience_years", 0),
            },
            "resumes": [{"id": r.id, "file_name": r.file_name} for r in resumes],
            "applications": [{"id": a.id, "job_id": a.job_id, "status": a.status} for a in applications],
        }

        file_path = self._domain_dir() / f"jobseeker_{user_id}_domain.json"
        file_path.write_text(json.dumps(snapshot, ensure_ascii=True, indent=2), encoding="utf-8")

    def get_profile(self, user_id: int):
        profile_doc = self.profiles.find_one({"user_id": int(user_id)})
        if not profile_doc: return None
            
        resumes = list(self.resumes.find({"user_id": int(user_id)}).sort("id", -1))
        profile_doc["uploadedResumes"] = resumes
        profile_doc["hasResume"] = len(resumes) > 0
        
        # Use AI recommendations if available, else use legacy logic
        if not profile_doc.get("recommended_skills"):
            profile_doc["recommended_skills"] = self._get_legacy_skill_recs(profile_doc.get("skills", []))
        
        return doc_to_entity(profile_doc)

    def _get_legacy_skill_recs(self, skills: List[str]) -> List[str]:
        mapping = {"python": ["FastAPI", "Django"], "react": ["Next.js", "Redux"], "java": ["Spring Boot"]}
        recs = set()
        for s in skills:
            for k, v in mapping.items():
                if k in s.lower(): [recs.add(x) for x in v]
        return list(recs)[:4]

    async def upload_resume(self, user_id: int, file_name: str, file_bytes: bytes, user_email: str, job_description: str = ""):
        # 1. Save physical file
        db_base = Path(__file__).resolve().parents[3] / "database" / "jobseeker" / "Files" / user_email
        db_base.mkdir(parents=True, exist_ok=True)
        file_path = db_base / file_name
        file_path.write_bytes(file_bytes)

        # 2. Extract content
        resume_text = self.parser.extract_text_from_bytes(file_bytes, file_name)

        # 3. AI STRUCTURAL PARSING (qwen3-coder:480b-cloud)
        from services.llmService import llm_service
        ai_parsed = await llm_service.parse_resume_structural(resume_text)
        local_parsed = self.parser.parse_text(resume_text)
        
        skills = list(set(ai_parsed.get("skills", []) + local_parsed.get("skills", [])))
        resume_data = {
            "skills": skills,
            "experience_years": float(ai_parsed.get("experience_years") or local_parsed.get("experience_years", 0)),
            "parsed_text": resume_text,
            "projects": ai_parsed.get("projects") or local_parsed.get("projects", []),
            "education": ai_parsed.get("education") or local_parsed.get("education", "unknown"),
        }

        # 4. ATS SCORING & GAP ANALYSIS
        if job_description.strip():
            # Match against specific JD (DeepSeek)
            jd_result = await llm_service.generate_deep_ats_match(resume_text, job_description)
            ats_score = jd_result.get("match_score", 0)
            missing_skills = jd_result.get("missing_skills", [])
            recommended_skills = jd_result.get("recommendations", [])
            ats_breakdown = {"semantic": ats_score, "skills": 100 if len(jd_result.get("matched_skills", [])) > 5 else 50}
        else:
            # General Market Gap Analysis (GPT-OSS)
            ats_result = self.ats_scorer.score_resume(resume_data)
            ats_score = ats_result.get("ats_score", 0)
            ats_breakdown = ats_result.get("breakdown", {})
            
            # CALL AI FOR GAPS
            gap_analysis = await llm_service.generate_skill_gap_analysis(skills)
            missing_skills = gap_analysis.get("missing_skills", [])
            recommended_skills = gap_analysis.get("recommendations", [])

        # 5. HR SUMMARY (GLM 4.6)
        hr_summary = await llm_service.generate_hr_summary(resume_text, ats_score)

        now = datetime.utcnow()
        resume_doc = {
            "id": get_next_sequence(self.db, "resumes"),
            "user_id": int(user_id),
            "file_name": file_name,
            "raw_text": resume_text,
            "parsed_data": resume_data,
            "ats_score": ats_score,
            "hr_summary": hr_summary,
            "missing_skills": missing_skills,
            "recommended_skills": recommended_skills,
            "file_path": str(file_path), 
            "created_at": now,
            "updated_at": now,
        }
        self.resumes.insert_one(resume_doc)

        # Update Profile with AI Insights
        self.profiles.update_one(
            {"user_id": int(user_id)},
            {
                "$set": {
                    "skills": skills,
                    "experience_years": resume_data["experience_years"],
                    "education_level": resume_data["education"],
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

        resume = doc_to_entity(resume_doc)
        self._sync_domain_snapshot(user_id)
        return resume

    async def apply_for_job(self, user_id: int, job_id: int):
        existing = self.applications.find_one({"user_id": int(user_id), "job_id": int(job_id)})
        if existing: return doc_to_entity(existing)
            
        job_doc = self.jobs.find_one({"id": int(job_id)})
        resume_doc = self.resumes.find_one({"user_id": int(user_id)}, sort=[("id", -1)])
        
        from services.llmService import llm_service
        match_result = await llm_service.generate_deep_ats_match(resume_doc.get("raw_text", ""), job_doc.get("description", ""))
        ats_score = match_result.get("match_score", 0)
        ai_summary = await llm_service.generate_hr_summary(resume_doc.get("raw_text", ""), ats_score)

        application_doc = {
            "id": get_next_sequence(self.db, "job_applications"),
            "user_id": int(user_id),
            "job_id": int(job_id),
            "employer_id": int(job_doc["employer_id"]),
            "status": "applied",
            "ats_match_score": ats_score,
            "matched_skills": match_result.get("matched_skills", []),
            "missing_skills": match_result.get("missing_skills", []),
            "ai_summary": ai_summary,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        self.applications.insert_one(application_doc)
        return doc_to_entity(application_doc)

    def list_applications(self, user_id: int) -> List[Any]:
        results = list(self.applications.find({"user_id": int(user_id)}).sort("id", -1))
        return docs_to_entities(results)

    def get_learning_recommendations(self, user_id: int) -> Dict[str, Any]:
        profile = self.profiles.find_one({"user_id": int(user_id)})
        missing = profile.get("missing_skills", []) if profile else []
        recs = self.recommender.get_learning_recommendations(missing)
        return {
            "courses": [r for r in recs if r.get("type") == "Course"],
            "roadmap": [r for r in recs if r.get("type") == "Project"],
            "certifications": [r for r in recs if r.get("type") == "Certification"]
        }

def get_jobseeker_service(db=Depends(get_db)) -> JobSeekerService:
    return JobSeekerService(db)
