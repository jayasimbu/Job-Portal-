from typing import Any, Dict, List
from pathlib import Path
from datetime import datetime
import json
import logging

from fastapi import Depends

from core.database import doc_to_entity, docs_to_entities, get_db, get_next_sequence
from core.email_service import EmailService
from modules.employer.candidate_ranking import CandidateRankingEngine

log = logging.getLogger(__name__)


interview_store: Dict[int, List[Dict[str, Any]]] = {}
hiring_policy_store: Dict[int, Dict[str, Any]] = {}


class EmployerService:
    def __init__(self, db):
        self.db = db
        self.profiles = db["employer_profiles"]
        self.jobs = db["job_postings"]
        self.applications = db["job_applications"]
        self.resumes = db["resumes"]
        self.ranking_engine = CandidateRankingEngine()

    @staticmethod
    def _domain_dir() -> Path:
        folder = Path(__file__).resolve().parents[3] / "database" / "employer"
        folder.mkdir(parents=True, exist_ok=True)
        return folder

    def _sync_domain_snapshot(self, employer_id: int) -> None:
        profile = doc_to_entity(self.profiles.find_one({"user_id": employer_id}))
        jobs = self.list_job_postings(employer_id)
        job_ids = [job.id for job in jobs]
        applications = docs_to_entities(self.applications.find({"job_id": {"$in": job_ids}})) if job_ids else []

        snapshot = {
            "updated_at": datetime.utcnow().isoformat(),
            "employer_id": employer_id,
            "profile": {
                "company_name": profile.company_name if profile else None,
                "website": profile.website if profile else None,
                "description": profile.description if profile else None,
            },
            "jobs": [
                {
                    "id": getattr(job, "id", None),
                    "title": getattr(job, "title", "Untitled Job"),
                    "active": getattr(job, "active", True),
                    "employment_type": getattr(job, "employment_type", "full_time"),
                }
                for job in jobs
            ],
            "applications": [
                {
                    "id": getattr(app, "id", None),
                    "job_id": getattr(app, "job_id", None),
                    "user_id": getattr(app, "user_id", None),
                    "status": getattr(app, "status", "applied"),
                }
                for app in applications
            ],
            "hiring_policy": hiring_policy_store.get(employer_id),
            "interviews": interview_store.get(employer_id, []),
        }

        file_path = self._domain_dir() / f"employer_{employer_id}_domain.json"
        file_path.write_text(json.dumps(snapshot, ensure_ascii=True, indent=2), encoding="utf-8")

    def upsert_company_profile(self, user_id: int, payload: Dict[str, Any]):
        now = datetime.utcnow()
        existing = self.profiles.find_one({"user_id": user_id})
        if not existing:
            doc = {
                "id": get_next_sequence(self.db, "employer_profiles"),
                "user_id": user_id,
                "company_name": payload.get("company_name", ""),
                "website": payload.get("website"),
                "description": payload.get("description"),
                "verified": bool(payload.get("verified", False)),
                "created_at": now,
                "updated_at": now,
            }
            self.profiles.insert_one(doc)
            profile = doc_to_entity(doc)
        else:
            update = {k: v for k, v in payload.items() if k in {"company_name", "website", "description", "verified"}}
            update["updated_at"] = now
            self.profiles.update_one({"user_id": user_id}, {"$set": update})
            profile = doc_to_entity(self.profiles.find_one({"user_id": user_id}))
        self._sync_domain_snapshot(user_id)
        return profile

    def create_job_posting(self, payload: Dict[str, Any]):
        now = datetime.utcnow()
        posting_doc = {
            "id": get_next_sequence(self.db, "job_postings"),
            "employer_id": int(payload["employer_id"]),
            "title": payload["title"],
            "description": payload["description"],
            "required_skills": payload.get("required_skills", []),
            "min_experience": float(payload.get("min_experience", 0) or 0),
            "education_required": payload.get("education_required"),
            "location": payload.get("location"),
            "employment_type": payload.get("employment_type", "full_time"),
            "active": bool(payload.get("active", True)),
            "created_at": now,
            "updated_at": now,
        }
        self.jobs.insert_one(posting_doc)
        posting = doc_to_entity(posting_doc)
        self._sync_domain_snapshot(posting.employer_id)
        return posting

    def list_job_postings(self, employer_id: int) -> List[Any]:
        return docs_to_entities(self.jobs.find({"employer_id": int(employer_id)}).sort("id", 1))

    def rank_applicants(self, job_id: int) -> List[Dict[str, Any]]:
        job = doc_to_entity(self.jobs.find_one({"id": int(job_id)}))
        if not job:
            return []

        # Sort directly from database index (descending)
        applications = docs_to_entities(self.applications.find({"job_id": int(job_id)}).sort("ats_score", -1))
        
        candidates: List[Dict[str, Any]] = []
        for index, app in enumerate(applications, start=1):
            user_profile = doc_to_entity(self.db["jobseeker_profiles"].find_one({"user_id": app.user_id}))
            user_account = doc_to_entity(self.db["users"].find_one({"id": app.user_id}))
            
            name = "Unknown Applicant"
            if user_account:
                name = f"{getattr(user_account, 'first_name', '')} {getattr(user_account, 'last_name', '')}".strip()
            if not name:
                name = f"Applicant #{app.user_id}"
            
            skills = []
            experience = "0 years"
            
            if user_profile:
                skills = getattr(user_profile, 'skills', [])
                exp = getattr(user_profile, 'experience_years', 0)
                experience = f"{exp} years" if exp else "0 years"
            else:
                # Try fallback to resume
                resume_doc = doc_to_entity(self.resumes.find_one({"user_id": app.user_id}, sort=[("id", -1)]))
                if resume_doc and hasattr(resume_doc, 'parsed_data'):
                    skills = resume_doc.parsed_data.get('skills', [])
                    exp = resume_doc.parsed_data.get('experience_years', 0)
                    experience = f"{exp} years" if exp else "0 years"

            # Fetch Certificates
            certs_cursor = self.db["certificates"].find({"user_id": app.user_id, "verification_status": {"$in": ["ai_reviewed", "verified"]}})
            certificates = []
            for cert in certs_cursor:
                certificates.append({
                    "name": cert.get("certificate_name", "Certificate"),
                    "issuer": cert.get("issuer", "Unknown"),
                    "status": cert.get("verification_status", "pending"),
                    "confidence_level": cert.get("confidence_level", "Unknown"),
                    "confidence_score": cert.get("confidence_score", 0),
                })

            candidates.append(
                {
                    "id": app.id,
                    "application_id": app.id,
                    "user_id": app.user_id,
                    "name": name,
                    "role": job.title,
                    "score": getattr(app, "ats_score", 0),
                    "ats_score": getattr(app, "ats_score", 0),
                    "project_score": 0,
                    "github_verified": False,
                    "skills": skills,
                    "experience": experience,
                    "location": "Remote", # Default fallback
                    "certificates": certificates,
                    "status": app.status,
                    "rank": index,
                }
            )

        return candidates

    def analytics_summary(self, employer_id: int) -> Dict[str, Any]:
        jobs = self.list_job_postings(employer_id)
        job_ids = [job.id for job in jobs]
        applications = docs_to_entities(self.applications.find({"job_id": {"$in": job_ids}})) if job_ids else []
        
        shortlisted = [app for app in applications if (app.status or "").lower() in {"shortlisted", "interview_scheduled"}]
        
        # Calculate score metrics
        scores = [getattr(app, "ats_score", 0) for app in applications]
        avg_score = round(sum(scores) / len(scores), 1) if scores else 0
        top_score = max(scores) if scores else 0
        
        return {
            "active_jobs": len([job for job in jobs if job.active]),
            "total_jobs": len(jobs),
            "total_applicants": len(applications),
            "shortlisted": len(shortlisted),
            "interviews": len(interview_store.get(employer_id, [])),
            "avg_ats_score": avg_score,
            "top_ats_score": top_score,
        }

    def update_candidate_status(self, application_id: int, status: str, employer_id: int = None):
        app_doc = self.applications.find_one({"id": int(application_id)})
        app = doc_to_entity(app_doc)
        if not app:
            return None
            
        job_doc = self.jobs.find_one({"id": int(app.job_id)})
        job = doc_to_entity(job_doc)
        if not job:
            return None
            
        # Ownership validation
        if employer_id is not None and int(job.employer_id) != int(employer_id):
            raise ValueError("Unauthorized: Employer does not own this job")

        self.applications.update_one(
            {"id": int(application_id)},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}},
        )
        app = doc_to_entity(self.applications.find_one({"id": int(application_id)}))
        self._sync_domain_snapshot(job.employer_id)

        # ── Push real notification to candidate ──
        status_labels = {
            "shortlisted": ("🎉 You've been shortlisted!", f"Congratulations! You have been shortlisted for '{getattr(job, 'title', 'a role')}'."),
            "rejected": ("Application Update", f"Your application for '{getattr(job, 'title', 'a role')}' was not selected this time."),
            "interview_scheduled": ("📅 Interview Scheduled!", f"An interview has been scheduled for '{getattr(job, 'title', 'a role')}'. Check your email for details."),
            "reviewing": ("👀 Under Review", f"Your application for '{getattr(job, 'title', 'a role')}' is now being reviewed by the hiring team."),
        }
        if status in status_labels:
            title, message = status_labels[status]
            try:
                notif_doc = {
                    "id": get_next_sequence(self.db, "notifications"),
                    "user_id": int(app.user_id),
                    "type": status,
                    "title": title,
                    "message": message,
                    "job_id": int(app.job_id),
                    "read": False,
                    "created_at": datetime.utcnow(),
                }
                self.db["notifications"].insert_one(notif_doc)
                log.info(f"[NOTIF] Notification pushed to user {app.user_id}: {status}")
            except Exception as e:
                log.error(f"[NOTIF] Failed to push notification: {e}")

            # ── Send email to candidate ──
            try:
                user_doc = self.db["users"].find_one({"id": int(app.user_id)})
                if user_doc and user_doc.get("email"):
                    candidate_name = f"{user_doc.get('first_name', '')} {user_doc.get('last_name', '')}".strip() or "Candidate"
                    EmailService.send_status_update_email(
                        email=user_doc["email"],
                        candidate_name=candidate_name,
                        job_title=getattr(job, 'title', 'a role'),
                        new_status=status,
                    )
            except Exception as e:
                log.error(f"[EMAIL] Failed to send status email: {e}")

        return app

    def list_interviews(self, employer_id: int) -> List[Dict[str, Any]]:
        return interview_store.get(employer_id, [])

    def schedule_interview(self, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        job = doc_to_entity(self.jobs.find_one({"id": int(payload["job_id"])}))
        if not job:
            return []
        employer_id = job.employer_id
        current = interview_store.get(employer_id, [])
        current = [*current, payload]
        interview_store[employer_id] = current
        self._sync_domain_snapshot(employer_id)
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
        self._sync_domain_snapshot(employer_id)
        return payload


    # ── Recruiter Notes ──
    def add_recruiter_note(self, application_id: int, note_text: str, employer_id: int) -> Dict[str, Any]:
        note = {
            "id": get_next_sequence(self.db, "recruiter_notes"),
            "application_id": int(application_id),
            "employer_id": int(employer_id),
            "text": note_text,
            "created_at": datetime.utcnow(),
        }
        self.db["recruiter_notes"].insert_one(note)
        log.info(f"[NOTES] Recruiter {employer_id} added note to app {application_id}")
        return {"id": note["id"], "text": note["text"], "created_at": note["created_at"].isoformat()}

    def get_recruiter_notes(self, application_id: int) -> List[Dict[str, Any]]:
        docs = self.db["recruiter_notes"].find({"application_id": int(application_id)}).sort("id", -1)
        return [
            {"id": d.get("id"), "text": d.get("text", ""), "created_at": d.get("created_at", "")}
            for d in docs
        ]

    # ── Resume File Path Lookup ──
    def get_resume_file_path(self, user_id: int) -> str | None:
        user_doc = self.db["users"].find_one({"id": int(user_id)})
        if not user_doc:
            return None
        email = user_doc.get("email", f"user_{user_id}@example.com")
        base = Path(__file__).resolve().parents[3] / "database" / "jobseeker" / "Files" / email
        if base.exists():
            pdfs = list(base.glob("*.pdf"))
            if pdfs:
                return str(pdfs[0])
        # Fallback: check resumes collection for file_path
        resume_doc = self.db["resumes"].find_one({"user_id": int(user_id)}, sort=[("id", -1)])
        if resume_doc and resume_doc.get("file_path"):
            p = Path(resume_doc["file_path"])
            if p.exists():
                return str(p)
        return None


def get_employer_service(db=Depends(get_db)) -> EmployerService:
    return EmployerService(db)
