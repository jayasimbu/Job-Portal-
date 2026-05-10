from typing import Any, Dict, List, Optional
from pathlib import Path
from datetime import datetime
import json

from fastapi import Depends

from ai_engine.ats_scoring.scorer import ATSScorer
from ai_engine.recommendation.recommender import JobRecommender
from ai_engine.verification.verifier import VerificationEngine
from core.database import doc_to_entity, docs_to_entities, get_db, get_next_sequence
from modules.jobseeker.resume_parser import ResumeParser


bookmark_store: Dict[int, List[int]] = {}
search_history_store: Dict[int, List[str]] = {}


class JobSeekerService:
    def __init__(self, db):
        self.db = db
        self.profiles = db["jobseeker_profiles"]
        self.resumes = db["resumes"]
        self.applications = db["job_applications"]
        self.jobs = db["job_postings"]
        self.parser = ResumeParser()
        self.ats_scorer = ATSScorer()
        self.recommender = JobRecommender()
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
                }
                for a in applications
            ],
        }

        file_path = self._domain_dir() / f"jobseeker_{user_id}_domain.json"
        file_path.write_text(json.dumps(snapshot, ensure_ascii=True, indent=2), encoding="utf-8")

    def get_profile(self, user_id: int):
        return doc_to_entity(self.profiles.find_one({"user_id": int(user_id)}))

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

    def upload_resume(self, user_id: int, file_name: str, resume_text: str, job_description: str = "", file_path: str = ""):
        parsed = self.parser.parse_text(resume_text)
        ats_score = self.ats_scorer.score_resume(parsed, job_description)
        now = datetime.utcnow()
        resume_doc = {
            "id": get_next_sequence(self.db, "resumes"),
            "user_id": int(user_id),
            "file_name": file_name,
            "raw_text": resume_text,
            "parsed_data": parsed,
            "ats_score": ats_score,
            "semantic_score": 0,
            "file_path": file_path, 
            "created_at": now,
            "updated_at": now,
        }
        self.resumes.insert_one(resume_doc)
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
        return self.recommender.recommend(profile_payload, jobs)

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
            from ai_engine.ats_scoring.scorer import score_job_description_ats
            ats_result = score_job_description_ats(resume_data, jd_data)
            ats_score = ats_result.get("ats_score", 0)
            skills_match = ats_result.get("breakdown", {})
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
            missing_keywords = []

        now = datetime.utcnow()
        application_doc = {
            "id": get_next_sequence(self.db, "job_applications"),
            "user_id": int(user_id),
            "job_id": int(job_id),
            "employer_id": int(job_doc["employer_id"]),
            "status": "applied",
            "ats_score": ats_score,
            "skills_match": skills_match,
            "missing_keywords": missing_keywords,
            "created_at": now,
            "updated_at": now,
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
        # 1. Fetch latest resume insights for this user
        insights_collection = self.db["resume_insights"]
        latest_insight = insights_collection.find_one({"user_id": int(user_id)}, sort=[("id", -1)])
        
        missing_keywords = latest_insight.get("missing_keywords", []) if latest_insight else []
        
        # 2. Define a heuristic mapping for common skills to courses
        skill_to_course = {
            "React": {
                "title": "Advanced React Patterns",
                "provider": "Frontend Masters",
                "gap": "Frontend Architecture",
                "impact": "+12% Role Match",
                "duration": "6 Hours",
                "level": "Advanced",
                "imgGradient": "from-blue-800 to-blue-600",
                "imgIcon": "code"
            },
            "Node.js": {
                "title": "Node.js Backend Architecture",
                "provider": "Udemy",
                "gap": "Backend Engineering",
                "impact": "+15% Role Match",
                "duration": "12 Hours",
                "level": "Intermediate",
                "imgGradient": "from-green-800 to-green-600",
                "imgIcon": "dns"
            },
            "AWS": {
                "title": "Cloud Native Infrastructure with AWS",
                "provider": "Coursera",
                "gap": "Cloud / DevOps",
                "impact": "+10% Role Match",
                "duration": "8 Hours",
                "level": "Intermediate",
                "imgGradient": "from-orange-800 to-orange-600",
                "imgIcon": "cloud"
            },
            "Python": {
                "title": "Applied Data Science with Python Specialization",
                "provider": "Coursera",
                "gap": "Data Manipulation",
                "impact": "+20% Role Match",
                "duration": "34 Hours",
                "level": "Intermediate",
                "imgGradient": "from-blue-800 to-blue-600",
                "imgIcon": "data_object"
            },
            "SQL": {
                "title": "The Complete SQL Bootcamp: Go from Zero to Hero",
                "provider": "Udemy",
                "gap": "Database Querying",
                "impact": "+15% Role Match",
                "duration": "22 Hours",
                "level": "Beginner",
                "imgGradient": "from-purple-800 to-purple-600",
                "imgIcon": "storage"
            },
            "Machine Learning": {
                "title": "Machine Learning Specialization",
                "provider": "Coursera",
                "gap": "ML Algorithms",
                "impact": "+12% Role Match",
                "duration": "40 Hours",
                "level": "Advanced",
                "imgGradient": "from-blue-800 to-blue-600",
                "imgIcon": "psychology"
            },
            "Docker": {
                "title": "Docker & Kubernetes: The Practical Guide",
                "provider": "Udemy",
                "gap": "Containerization",
                "impact": "+12% Role Match",
                "duration": "18 Hours",
                "level": "Advanced",
                "imgGradient": "from-blue-500 to-cyan-500",
                "imgIcon": "box"
            },
            "MongoDB": {
                "title": "MongoDB University: Data Modeling",
                "provider": "MongoDB",
                "gap": "NoSQL Database Design",
                "impact": "+7% Role Match",
                "duration": "4 Hours",
                "level": "Intermediate",
                "imgGradient": "from-green-700 to-emerald-500",
                "imgIcon": "database"
            }
        }

        recommendations = []
        seen_courses = set()

        # 3. Match missing keywords to courses
        for skill in missing_keywords:
            # Check for direct or partial match
            for key, course in skill_to_course.items():
                if key.lower() in skill.lower() and course["title"] not in seen_courses:
                    recommendations.append({
                        **course,
                        "matchReason": f"Detected '{skill}' as a missing keyword in your profile. This course directly addresses that gap.",
                        "status": "Recommended",
                        "progress": 0,
                        "url": "#"
                    })
                    seen_courses.add(course["title"])

        # 4. Fallback/Default recommendations if no missing keywords or too few recommendations
        if len(recommendations) < 2:
            defaults = [
                {
                    "title": "System Design for Product Engineers",
                    "provider": "Educative",
                    "gap": "Software Architecture",
                    "impact": "+10% ATS Score",
                    "duration": "15 hours",
                    "level": "Advanced",
                    "matchReason": "Recommended based on industry trends for your target role.",
                    "status": "Recommended",
                    "progress": 0,
                    "url": "#"
                },
                {
                    "title": "Professional Communication for Tech",
                    "provider": "LinkedIn Learning",
                    "gap": "Soft Skills",
                    "impact": "+5% ATS Score",
                    "duration": "3 hours",
                    "level": "Beginner",
                    "matchReason": "Essential for high-impact technical roles.",
                    "status": "Recommended",
                    "progress": 0,
                    "url": "#"
                }
            ]
            for d in defaults:
                if d["title"] not in seen_courses and len(recommendations) < 4:
                    recommendations.append(d)
                    seen_courses.add(d["title"])

        return recommendations

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
