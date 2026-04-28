from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List

from core.database import doc_to_entity, docs_to_entities
from modules.employer.candidate_ranking import ranking_engine
from modules.jobseeker.service import JobSeekerService

from .aggregation.score_fusion import ScoreFusionEngine
from .intelligence.explainer import ExplainEngine
from .intelligence.skill_gap import SkillGapEngine
from .job_normalizer import normalize_job_record


class MCPService:
    def __init__(self, db, jobseeker_service: JobSeekerService):
        self.db = db
        self.jobseeker = jobseeker_service
        self.fusion = ScoreFusionEngine()
        self.explainer = ExplainEngine()
        self.skill_gap_engine = SkillGapEngine()

    def _latest_resume(self, user_id: int) -> Dict[str, Any] | None:
        return self.db["resumes"].find_one({"user_id": int(user_id)}, sort=[("id", -1)])

    def _latest_profile(self, user_id: int):
        return doc_to_entity(self.db["jobseeker_profiles"].find_one({"user_id": int(user_id)}))

    def _normalize(self, parsed: Dict[str, Any]) -> Dict[str, Any]:
        parsed = dict(parsed or {})
        mapping = {
            "js": "JavaScript",
            "reactjs": "React",
            "node": "Node.js",
            "nodejs": "Node.js",
            "python3": "Python",
            "aws": "AWS",
            "docker": "Docker",
        }
        skills = [str(s).strip() for s in parsed.get("skills", []) if str(s).strip()]
        normalized = [mapping.get(s.lower(), s) for s in skills]
        parsed["skills"] = list(dict.fromkeys(normalized))
        return parsed

    def _build_resume_payload(self, user_id: int) -> Dict[str, Any]:
        resume_doc = self._latest_resume(user_id)
        profile = self._latest_profile(user_id)

        parsed = dict((resume_doc or {}).get("parsed_data", {}) or {})
        resume_text = str((resume_doc or {}).get("raw_text", "") or "")
        normalized = self._normalize(parsed)

        profile_skills = list(getattr(profile, "skills", []) or []) if profile else []
        user_skills = list(normalized.get("skills", []) or profile_skills)
        experience_years = normalized.get("experience_years", 0) or (getattr(profile, "experience_years", 0) if profile else 0)
        try:
            experience_years = float(experience_years or 0)
        except (TypeError, ValueError):
            experience_years = 0.0

        return {
            "resume_doc": resume_doc,
            "profile": profile,
            "resume_text": resume_text,
            "normalized": normalized,
            "user_skills": user_skills,
            "experience_years": experience_years,
        }

    def _collect_job_pool(self, feed_type: str = "recommended") -> List[Dict[str, Any]]:
        internal_jobs = [
            normalize_job_record(job, source="internal")
            for job in docs_to_entities(self.db["job_postings"].find().sort("id", -1))
        ]
        external_jobs = [
            normalize_job_record(job, source="external")
            for job in docs_to_entities(self.db["external_jobs"].find().sort("created_at", -1))
        ]

        if feed_type == "external":
            return external_jobs
        return [*internal_jobs, *external_jobs]

    def apply_feedback_boost(self, score: float, user_id: int, job_id: str) -> float:
        if not job_id:
            return score

        interactions = self.db["user_interactions"].find(
            {
                "userId": int(user_id),
                "$or": [
                    {"jobId": str(job_id)},
                    {"jobId": int(job_id)} if str(job_id).isdigit() else {"jobId": str(job_id)},
                ],
            }
        )
        boost = 0.0
        for interaction in interactions:
            action = str(interaction.get("action", "")).lower().strip()
            if action == "apply":
                boost += 10
            elif action == "click":
                boost += 5
            elif action == "ignore":
                boost -= 5
        return score + boost

    def _score_job(self, job: Dict[str, Any], user_id: int, resume_ctx: Dict[str, Any]) -> Dict[str, Any]:
        user_skills = list(resume_ctx["user_skills"] or [])
        experience_years = float(resume_ctx["experience_years"] or 0)
        resume_text = str(resume_ctx["resume_text"] or "")
        normalized = dict(resume_ctx["normalized"] or {})

        job_skills = list(job.get("requiredSkills", []) or [])
        job_text = f"{job.get('title', '')} {job.get('description', '')} {' '.join(job_skills)}".strip()
        skills_text = " ".join(user_skills)

        try:
            semantic_score = float(self.jobseeker.recommender.matcher.match_score(skills_text, job_text) * 100)
        except Exception:
            semantic_score = 0.0

        required_exp = float(job.get("requiredExperience") or 0)
        if required_exp <= 0:
            experience_score = 100.0
        elif experience_years >= required_exp:
            experience_score = 100.0
        else:
            experience_score = (experience_years / required_exp) * 100.0

        trend_score = 80.0
        jd_data = {
            "required_skills": job_skills,
            "required_experience_years": required_exp,
            "description": job.get("description", ""),
        }
        resume_data_for_ats = {
            "skills": user_skills,
            "parsed_text": resume_text,
            "experience_years": experience_years,
            "projects": normalized.get("projects", []),
            "education": normalized.get("education", "unknown"),
        }

        try:
            ats_result = self.jobseeker.ats_scorer.score_job_description_ats(resume_data_for_ats, jd_data)
        except Exception:
            ats_result = {"ats_score": 0, "breakdown": {}, "missing_keywords": []}

        ats_breakdown = dict(ats_result.get("breakdown", {}) or {})
        ats_score = float(ats_result.get("final_score", ats_result.get("ats_score", 0)) or 0)
        raw_final_score = self.fusion.compute(ats_score, semantic_score, experience_score, trend_score)

        job_identifier = str(job.get("jobId") or job.get("id") or "")
        final_score = self.apply_feedback_boost(raw_final_score, int(user_id), job_identifier)
        final_score = max(0.0, min(100.0, final_score))

        if final_score >= 75:
            category = "primary"
        elif final_score >= 45:
            category = "secondary"
        else:
            category = "tertiary"

        skill_gap = self.skill_gap_engine.compute(user_skills, job_skills)
        components = {
            "ats": round(ats_score, 2),
            "semantic": round(semantic_score, 2),
            "experience": round(experience_score, 2),
            "trend": round(trend_score, 2),
            **ats_breakdown,
        }
        context = {
            "missing_skills": skill_gap.get("missing", []),
            "feedback_boost": round(final_score - raw_final_score, 2),
        }
        explain = self.explainer.generate(context, components)

        return normalize_job_record(
            job,
            source=job.get("source", "internal"),
            final_score=final_score,
            category=category,
            components=components,
            explain=explain,
            skill_gap=skill_gap,
        )

    def get_job_feed(self, user_id: int, feed_type: str = "recommended") -> Dict[str, Any]:
        resume_ctx = self._build_resume_payload(user_id)
        jobs = self._collect_job_pool(feed_type=feed_type)

        if not jobs:
            return {
                "userId": int(user_id),
                "feedType": feed_type,
                "jobs": [],
                "total": 0,
                "summary": {"internal": 0, "external": 0, "recommended": 0},
                "skills": resume_ctx["user_skills"],
            }

        scored_jobs = [self._score_job(job, int(user_id), resume_ctx) for job in jobs]

        if feed_type == "external":
            scored_jobs = [job for job in scored_jobs if job.get("source") == "external"]
            scored_jobs.sort(key=lambda item: item.get("createdAt", ""), reverse=True)
        elif feed_type == "all":
            scored_jobs.sort(key=lambda item: (item.get("finalScore", 0), item.get("isNewToday", False)), reverse=True)
        else:
            scored_jobs = [job for job in scored_jobs if float(job.get("finalScore", 0)) >= 45]
            scored_jobs.sort(key=lambda item: item.get("finalScore", 0), reverse=True)

        summary = {
            "internal": len([job for job in scored_jobs if job.get("source") == "internal"]),
            "external": len([job for job in scored_jobs if job.get("source") == "external"]),
            "recommended": len([job for job in scored_jobs if float(job.get("finalScore", 0)) >= 75]),
        }

        return {
            "userId": int(user_id),
            "feedType": feed_type,
            "jobs": scored_jobs[:25],
            "total": len(scored_jobs),
            "summary": summary,
            "skills": resume_ctx["user_skills"],
        }

    def list_notifications(self, user_id: int) -> Dict[str, Any]:
        notifications = list(self.db["notifications"].find({"user_id": int(user_id)}).sort("created_at", -1).limit(50))
        normalized = []
        for notification in notifications:
            created_at = notification.get("created_at")
            normalized.append(
                {
                    "id": str(notification.get("id") or ""),
                    "type": notification.get("type", "update"),
                    "title": notification.get("title", "Notification"),
                    "message": notification.get("message", ""),
                    "isRead": bool(notification.get("read", False)),
                    "createdAt": created_at.isoformat() if hasattr(created_at, "isoformat") else str(created_at or ""),
                    "jobId": str(notification.get("job_id") or ""),
                    "payload": notification.get("payload", {}),
                }
            )

        unread = len([item for item in normalized if not item["isRead"]])
        return {"notifications": normalized, "unreadCount": unread, "total": len(normalized)}

    def mark_notifications_read(self, user_id: int, notification_ids: List[str] | None = None) -> Dict[str, Any]:
        query: Dict[str, Any] = {"user_id": int(user_id), "read": False}
        if notification_ids:
            safe_ids = [int(item) for item in notification_ids if str(item).isdigit()]
            if safe_ids:
                query["id"] = {"$in": safe_ids}
        result = self.db["notifications"].update_many(query, {"$set": {"read": True, "updated_at": datetime.utcnow()}})
        return {"updated": int(getattr(result, "modified_count", 0) or 0)}

    def match_candidates(self, job_id: int, limit: int = 10) -> Dict[str, Any]:
        job_doc = self.db["job_postings"].find_one({"id": int(job_id)})
        if not job_doc:
            job_doc = self.db["external_jobs"].find_one({"id": str(job_id)}) or self.db["external_jobs"].find_one({"jobId": str(job_id)})
        if not job_doc:
            raise ValueError("Job not found")

        source = "internal" if job_doc.get("employer_id") is not None else "external"
        job = normalize_job_record(job_doc, source=source)
        job_description = str(job.get("description", ""))

        candidates: List[Dict[str, Any]] = []
        for user in docs_to_entities(self.db["users"].find({"role": "jobseeker"})):
            user_id = getattr(user, "id", None)
            if user_id is None:
                continue

            resume_doc = self.db["resumes"].find_one({"user_id": int(user_id)}, sort=[("id", -1)])
            if not resume_doc:
                continue

            profile = doc_to_entity(self.db["jobseeker_profiles"].find_one({"user_id": int(user_id)}))
            parsed = dict(resume_doc.get("parsed_data", {}) or {})

            candidate_payload = {
                "id": int(user_id),
                "name": f"{getattr(user, 'first_name', '')} {getattr(user, 'last_name', '')}".strip() or getattr(user, "email", "Candidate"),
                "email": getattr(user, "email", ""),
                "parsed_resume": parsed,
                "resume_text": resume_doc.get("raw_text", ""),
                "skills": parsed.get("skills", []) or (getattr(profile, "skills", []) if profile else []),
                "experience_years": parsed.get("experience_years", 0) or (getattr(profile, "experience_years", 0) if profile else 0),
            }
            candidates.append(candidate_payload)

        ranked = ranking_engine.rank_candidates(
            job_description=job_description,
            candidates=candidates,
            required_skills=job.get("requiredSkills", []),
            required_experience_years=int(job.get("requiredExperience", 0) or 0),
        )[:limit]

        return {"job": job, "topCandidates": ranked, "totalCandidates": len(ranked)}

    def run_pipeline(self, user_id: int) -> Dict[str, Any]:
        user_id_int = int(user_id)
        resume_ctx = self._build_resume_payload(user_id_int)
        resume_doc = resume_ctx["resume_doc"]
        if not resume_doc:
            raise ValueError("No resume found. Please upload a resume first.")

        normalized = resume_ctx["normalized"]
        user_skills = resume_ctx["user_skills"]

        try:
            global_ats_score = float(self.jobseeker.ats_scorer.score_resume(normalized, ""))
        except Exception:
            global_ats_score = 0.0

        feed = self.get_job_feed(user_id_int, feed_type="recommended")
        scored_jobs = list(feed.get("jobs", []))

        primary_jobs = [job for job in scored_jobs if job.get("category") == "primary"]
        secondary_jobs = [job for job in scored_jobs if job.get("category") == "secondary"]

        result = {
            "user_id": user_id_int,
            "global_ats": round(global_ats_score, 2),
            "skills": user_skills,
            "total_matches": len(scored_jobs),
            "primary_count": len(primary_jobs),
            "secondary_count": len(secondary_jobs),
            "jobs": scored_jobs[:10],
            "last_run": datetime.utcnow().isoformat(),
            "status": "active",
        }

        self.db["mcp_runs"].update_one({"user_id": user_id_int}, {"$set": result}, upsert=True)
        return result

    def get_status(self, user_id: int) -> Dict[str, Any]:
        doc = self.db["mcp_runs"].find_one({"user_id": int(user_id)})
        if not doc:
            return {"status": "idle", "message": "Pipeline never executed for this user."}

        if "_id" in doc:
            doc["_id"] = str(doc["_id"])
        return doc
