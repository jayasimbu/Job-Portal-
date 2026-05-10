"""
core/logger_service.py — System-Level Audit Logging
===================================================
Tracks user actions and system events for auditing and analytics.
"""
import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from core.database import get_database

log = logging.getLogger(__name__)

def add_system_log(user_id: Optional[int], action: str, data: Dict[str, Any], level: str = "INFO"):
    """
    Persists a system audit log into MongoDB.
    
    Args:
        user_id: The ID of the user performing the action (optional).
        action: A string identifying the action (e.g., 'MATCH_JOB', 'UPLOAD_RESUME').
        data: A dictionary containing relevant metadata.
        level: The severity level (INFO, WARNING, ERROR).
    """
    try:
        db = get_database()
        log_entry = {
            "user_id": user_id,
            "action": action,
            "data": data,
            "level": level,
            "timestamp": datetime.now(timezone.utc)
        }
        db["system_logs"].insert_one(log_entry)
        log.info(f"[SystemLog] {action} by user {user_id}: {data}")
    except Exception as e:
        log.error(f"[SystemLog] Failed to persist log: {e}")

def get_system_logs(limit: int = 100, user_id: Optional[int] = None):
    """Retrieves recent system logs."""
    try:
        db = get_db()
        query = {}
        if user_id:
            query["user_id"] = user_id
            
        logs = list(db["system_logs"].find(query).sort("timestamp", -1).limit(limit))
        for l in logs:
            l["_id"] = str(l["_id"])
            if isinstance(l.get("timestamp"), datetime):
                l["timestamp"] = l["timestamp"].isoformat()
        return logs
    except Exception as e:
        log.error(f"[SystemLog] Failed to fetch logs: {e}")
        return []
