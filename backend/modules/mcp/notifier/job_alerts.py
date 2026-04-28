from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Iterable, List

from core.database import docs_to_entities
from modules.mcp.job_normalizer import normalize_job_record


def _notification_exists(db, user_id: int, job_id: str) -> bool:
    return bool(db["notifications"].find_one({"user_id": int(user_id), "job_id": str(job_id), "type": "new_match"}))


def _build_notification(user_id: int, job: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "user_id": int(user_id),
        "job_id": str(job.get("jobId") or job.get("id") or ""),
        "type": "new_match",
        "title": "New Match Found",
        "message": f"New job matches your profile: {job.get('jobTitle') or job.get('title')}",
        "read": False,
        "created_at": datetime.utcnow(),
        "payload": {
            "source": job.get("source", "internal"),
            "finalScore": job.get("finalScore", 0),
            "jobTitle": job.get("jobTitle") or job.get("title"),
            "company": job.get("company"),
        },
    }


def run_daily_alerts(db, threshold: float = 75.0, max_jobs: int = 3) -> Dict[str, Any]:
    users = docs_to_entities(db["users"].find({"role": "jobseeker"}))
    summary = {
        "processedUsers": 0,
        "createdNotifications": 0,
        "matchedJobs": 0,
        "threshold": threshold,
    }

    from modules.mcp.service import MCPService
    from modules.jobseeker.service import JobSeekerService

    mcp = MCPService(db, JobSeekerService(db))

    for user in users:
        user_id = getattr(user, "id", None)
        if user_id is None:
            continue

        summary["processedUsers"] += 1
        feed = mcp.get_job_feed(user_id, feed_type="recommended")
        jobs = feed.get("jobs", [])[:max_jobs]
        for job in jobs:
            if float(job.get("finalScore", 0)) < float(threshold):
                continue
            job_id = str(job.get("jobId") or job.get("id") or "")
            if not job_id or _notification_exists(db, user_id, job_id):
                continue
            db["notifications"].insert_one(_build_notification(user_id, job))
            summary["createdNotifications"] += 1
            summary["matchedJobs"] += 1

    return summary
