"""
backend/modules/admin/service.py — Full Admin Service
"""
from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import Depends
from core.database import get_db, get_next_sequence, docs_to_entities, doc_to_entity

log = logging.getLogger(__name__)

# ── Database path for file-based logs ────────────────────────────────────────
_DB_ROOT = Path(__file__).resolve().parents[3] / "database"
_ADMIN_DIR = _DB_ROOT / "admin"
_ADMIN_DIR.mkdir(parents=True, exist_ok=True)
_LOG_FILE = _ADMIN_DIR / "system_logs.jsonl"


# ── System Log Helpers ────────────────────────────────────────────────────────

def write_system_log(
    level: str,
    category: str,
    message: str,
    user_id: Optional[int] = None,
    user_email: Optional[str] = None,
    ip_address: Optional[str] = None,
    extra: Optional[dict] = None,
    db: Any = None,
) -> None:
    """Write a system log entry to MongoDB and a flat JSONL file."""
    entry = {
        "id": str(uuid.uuid4()),
        "level": level.upper(),
        "category": category,
        "message": message,
        "user_id": user_id,
        "user_email": user_email,
        "ip_address": ip_address,
        "extra": extra or {},
        "timestamp": datetime.utcnow().isoformat(),
    }
    # Always write to file (does not depend on MongoDB)
    try:
        with _LOG_FILE.open("a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception as exc:
        log.warning("[AdminService] Could not write log file: %s", exc)

    # Also persist to MongoDB if available
    if db is not None:
        try:
            db["system_logs"].insert_one(dict(entry))
        except Exception as exc:
            log.warning("[AdminService] Could not insert log to MongoDB: %s", exc)


class AdminService:
    def __init__(self, db):
        self.db = db
        self.users = db["users"]
        self.resumes = db["resumes"]
        self.job_postings = db["job_postings"]
        self.companies = db["employer_profiles"]
        self.applications = db["job_applications"]
        self.logs = db["system_logs"]
        self.queue = db["verification_queue"]
        self.audit = db["admin_audit"]

    # ── Dashboard Stats ───────────────────────────────────────────────────────

    def get_dashboard_stats(self) -> Dict[str, Any]:
        """Return aggregated system stats for the admin dashboard."""
        now = datetime.utcnow()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)

        try:
            total_users = self.users.count_documents({})
            total_jobseekers = self.users.count_documents({"role": "jobseeker"})
            total_employers = self.users.count_documents({"role": "employer"})
            new_users_week = self.users.count_documents({"created_at": {"$gte": week_ago}})
            new_users_month = self.users.count_documents({"created_at": {"$gte": month_ago}})
            active_jobs = self.job_postings.count_documents({"status": "active"})
            total_jobs = self.job_postings.count_documents({})
            total_applications = self.applications.count_documents({})
            total_resumes = self.resumes.count_documents({})
            pending_verification = self.queue.count_documents({"status": "pending"})
            total_companies = self.companies.count_documents({})
            verified_companies = self.companies.count_documents({"is_verified": True})
        except Exception as exc:
            log.warning("[AdminService] MongoDB stats error: %s", exc)
            # Return safe defaults if MongoDB is unavailable
            total_users = total_jobseekers = total_employers = 0
            new_users_week = new_users_month = 0
            active_jobs = total_jobs = total_applications = 0
            total_resumes = pending_verification = 0
            total_companies = verified_companies = 0

        # System health check
        ollama_status = self._check_ollama()

        return {
            "users": {
                "total": total_users,
                "jobseekers": total_jobseekers,
                "employers": total_employers,
                "new_this_week": new_users_week,
                "new_this_month": new_users_month,
            },
            "jobs": {
                "total": total_jobs,
                "active": active_jobs,
                "inactive": total_jobs - active_jobs,
            },
            "applications": {"total": total_applications},
            "resumes": {"total": total_resumes, "pending_verification": pending_verification},
            "companies": {"total": total_companies, "verified": verified_companies},
            "system_health": {
                "database": True,
                "ollama": ollama_status,
                "api": True,
            },
        }

    def _check_ollama(self) -> bool:
        try:
            import requests
            r = requests.get("http://localhost:11434/api/tags", timeout=2)
            return r.status_code == 200
        except Exception:
            return False

    # ── User Management ───────────────────────────────────────────────────────

    def get_all_users(
        self,
        role: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Dict[str, Any]:
        """Paginated list of users with optional filters."""
        query: Dict[str, Any] = {}
        if role:
            query["role"] = role
        if status == "active":
            query["is_active"] = True
        elif status == "inactive":
            query["is_active"] = False
        if search:
            query["$or"] = [
                {"email": {"$regex": search, "$options": "i"}},
                {"first_name": {"$regex": search, "$options": "i"}},
                {"last_name": {"$regex": search, "$options": "i"}},
            ]

        try:
            total = self.users.count_documents(query)
            skip = (page - 1) * page_size
            users_cursor = self.users.find(query, {"hashed_password": 0}).skip(skip).limit(page_size).sort("created_at", -1)
            users = []
            for doc in users_cursor:
                doc.pop("_id", None)
                doc.pop("hashed_password", None)
                if "created_at" in doc and hasattr(doc["created_at"], "isoformat"):
                    doc["created_at"] = doc["created_at"].isoformat()
                users.append(doc)
        except Exception as exc:
            log.warning("[AdminService] get_all_users error: %s", exc)
            total, users = 0, []

        return {
            "users": users,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, -(-total // page_size)),
        }

    def get_user_by_id(self, user_id: int) -> Optional[Dict]:
        doc = self.users.find_one({"id": int(user_id)}, {"hashed_password": 0})
        if doc:
            doc.pop("_id", None)
            if "created_at" in doc and hasattr(doc.get("created_at"), "isoformat"):
                doc["created_at"] = doc["created_at"].isoformat()
        return doc

    def update_user_role(self, user_id: int, new_role: str, admin_id: int) -> bool:
        result = self.users.update_one(
            {"id": int(user_id)},
            {"$set": {"role": new_role, "updated_at": datetime.utcnow()}},
        )
        if result.modified_count > 0:
            self._write_audit("change_role", admin_id, "user", str(user_id), f"Role changed to {new_role}")
            write_system_log("INFO", "admin", f"User {user_id} role changed to {new_role}", db=self.db)
            return True
        return False

    def set_user_status(self, user_id: int, is_active: bool, admin_id: int) -> bool:
        action = "activate_user" if is_active else "ban_user"
        result = self.users.update_one(
            {"id": int(user_id)},
            {"$set": {"is_active": is_active, "updated_at": datetime.utcnow()}},
        )
        if result.modified_count > 0:
            status_str = "activated" if is_active else "deactivated"
            self._write_audit(action, admin_id, "user", str(user_id), f"User {status_str}")
            write_system_log("WARNING", "admin", f"User {user_id} {status_str} by admin {admin_id}", db=self.db)
            return True
        return False

    # ── Companies ─────────────────────────────────────────────────────────────

    def get_all_companies(
        self,
        verified: Optional[bool] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {}
        if verified is not None:
            query["is_verified"] = verified
        if search:
            query["$or"] = [
                {"company_name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
            ]
        try:
            total = self.companies.count_documents(query)
            skip = (page - 1) * page_size
            companies = []
            for doc in self.companies.find(query).skip(skip).limit(page_size):
                doc.pop("_id", None)
                companies.append(doc)
        except Exception as exc:
            log.warning("[AdminService] get_all_companies error: %s", exc)
            total, companies = 0, []

        return {
            "companies": companies,
            "total": total,
            "page": page,
            "total_pages": max(1, -(-total // page_size)),
        }

    def verify_company(self, company_id: str, admin_id: int, approve: bool) -> bool:
        result = self.companies.update_one(
            {"id": int(company_id)},
            {"$set": {"is_verified": approve, "updated_at": datetime.utcnow()}},
        )
        if result.modified_count > 0:
            action = "verify_company" if approve else "reject_company"
            self._write_audit(action, admin_id, "company", company_id)
            status = "verified" if approve else "rejected"
            write_system_log("INFO", "admin", f"Company {company_id} {status} by admin {admin_id}", db=self.db)
            return True
        return False

    # ── Verification Queue ─────────────────────────────────────────────────────

    def get_verification_queue(
        self,
        status: str = "pending",
        page: int = 1,
        page_size: int = 20,
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {}
        if status != "all":
            query["status"] = status
        try:
            total = self.queue.count_documents(query)
            skip = (page - 1) * page_size
            items = []
            for doc in self.queue.find(query).skip(skip).limit(page_size).sort("submitted_at", -1):
                doc.pop("_id", None)
                if "submitted_at" in doc and hasattr(doc.get("submitted_at"), "isoformat"):
                    doc["submitted_at"] = doc["submitted_at"].isoformat()
                items.append(doc)
        except Exception as exc:
            log.warning("[AdminService] get_verification_queue error: %s", exc)
            total, items = 0, []

        return {
            "items": items,
            "total": total,
            "page": page,
            "total_pages": max(1, -(-total // page_size)),
        }

    def mark_verification_result(
        self,
        item_id: str,
        action: str,  # "approved", "rejected", "flagged"
        admin_id: int,
        notes: Optional[str] = None,
    ) -> bool:
        result = self.queue.update_one(
            {"id": item_id},
            {"$set": {
                "status": action,
                "reviewed_by": admin_id,
                "reviewed_at": datetime.utcnow().isoformat(),
                "notes": notes,
            }},
        )
        if result.modified_count > 0:
            self._write_audit(f"verification_{action}", admin_id, "resume", item_id, notes)
            write_system_log("INFO", "admin", f"Verification item {item_id} {action}", db=self.db)
            return True
        return False

    def add_to_verification_queue(
        self,
        user_id: int,
        user_email: str,
        user_name: str,
        resume_id: Optional[str] = None,
        certificate_name: Optional[str] = None,
        risk_level: str = "low",
    ) -> str:
        """Add a resume/certificate to the admin verification queue."""
        item_id = str(uuid.uuid4())
        doc = {
            "id": item_id,
            "user_id": user_id,
            "user_email": user_email,
            "user_name": user_name,
            "resume_id": resume_id,
            "certificate_name": certificate_name,
            "risk_level": risk_level,
            "status": "pending",
            "submitted_at": datetime.utcnow(),
            "reviewed_by": None,
            "reviewed_at": None,
            "notes": None,
        }
        self.queue.insert_one(doc)
        return item_id

    # ── System Logs ───────────────────────────────────────────────────────────

    def get_system_logs(
        self,
        level: Optional[str] = None,
        category: Optional[str] = None,
        page: int = 1,
        page_size: int = 50,
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {}
        if level:
            query["level"] = level.upper()
        if category:
            query["category"] = category

        try:
            total = self.logs.count_documents(query)
            skip = (page - 1) * page_size
            logs_list = []
            for doc in self.logs.find(query).skip(skip).limit(page_size).sort("timestamp", -1):
                doc.pop("_id", None)
                if "timestamp" in doc and hasattr(doc.get("timestamp"), "isoformat"):
                    doc["timestamp"] = doc["timestamp"].isoformat()
                logs_list.append(doc)
        except Exception:
            # Fallback to reading the flat JSONL file
            logs_list = self._read_log_file(page, page_size, level, category)
            total = len(logs_list)

        return {
            "logs": logs_list,
            "total": total,
            "page": page,
            "total_pages": max(1, -(-total // page_size)),
        }

    def _read_log_file(
        self,
        page: int,
        page_size: int,
        level: Optional[str],
        category: Optional[str],
    ) -> List[Dict]:
        entries = []
        try:
            with _LOG_FILE.open("r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        entry = json.loads(line)
                        if level and entry.get("level") != level.upper():
                            continue
                        if category and entry.get("category") != category:
                            continue
                        entries.append(entry)
                    except json.JSONDecodeError:
                        continue
        except FileNotFoundError:
            pass
        entries.reverse()  # newest first
        start = (page - 1) * page_size
        return entries[start : start + page_size]

    # ── Analytics ─────────────────────────────────────────────────────────────

    def get_analytics(self, days: int = 30) -> Dict[str, Any]:
        """Return analytics data for the admin panel."""
        since = datetime.utcnow() - timedelta(days=days)
        try:
            # User growth by day
            pipeline_users = [
                {"$match": {"created_at": {"$gte": since}}},
                {"$group": {
                    "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                    "count": {"$sum": 1},
                }},
                {"$sort": {"_id": 1}},
            ]
            user_growth = list(self.users.aggregate(pipeline_users))

            # Application pipeline
            app_statuses = {}
            for status in ["pending", "reviewed", "shortlisted", "rejected", "hired"]:
                app_statuses[status] = self.applications.count_documents({
                    "status": status,
                    "created_at": {"$gte": since},
                })

            # Top skills in demand (from job postings)
            top_jobs = list(self.job_postings.find(
                {"created_at": {"$gte": since}},
                {"title": 1},
                limit=10,
            ))
            top_job_titles = [j.get("title", "") for j in top_jobs]
        except Exception as exc:
            log.warning("[AdminService] get_analytics error: %s", exc)
            user_growth, app_statuses, top_job_titles = [], {}, []

        return {
            "user_growth": user_growth,
            "application_pipeline": app_statuses,
            "top_job_titles": top_job_titles,
            "period_days": days,
        }

    # ── Internal Audit Trail ──────────────────────────────────────────────────

    def _write_audit(
        self,
        action: str,
        performed_by: int,
        target_type: str,
        target_id: str,
        reason: Optional[str] = None,
    ) -> None:
        doc = {
            "id": str(uuid.uuid4()),
            "action": action,
            "performed_by": performed_by,
            "target_type": target_type,
            "target_id": target_id,
            "reason": reason,
            "timestamp": datetime.utcnow(),
        }
        try:
            self.audit.insert_one(doc)
        except Exception as exc:
            log.warning("[AdminService] Could not write audit: %s", exc)


def get_admin_service(db=Depends(get_db)):
    return AdminService(db)
