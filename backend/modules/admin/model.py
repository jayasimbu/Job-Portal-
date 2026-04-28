"""
backend/modules/admin/model.py — Admin Data Models
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class SystemLog:
    id: str
    level: str          # "INFO", "WARNING", "ERROR", "CRITICAL"
    category: str       # "auth", "job", "resume", "system", "ai", "admin"
    message: str
    user_id: Optional[int] = None
    user_email: Optional[str] = None
    ip_address: Optional[str] = None
    extra: Optional[dict] = None
    timestamp: datetime = field(default_factory=datetime.utcnow)


@dataclass
class AdminAudit:
    id: str
    action: str         # "ban_user", "verify_company", "approve_resume", "flag_resume"
    performed_by: int   # admin user_id
    target_type: str    # "user", "company", "resume"
    target_id: str
    reason: Optional[str] = None
    timestamp: datetime = field(default_factory=datetime.utcnow)


@dataclass
class VerificationQueueItem:
    id: str
    user_id: int
    user_email: str
    user_name: str
    resume_id: Optional[str] = None
    certificate_name: Optional[str] = None
    risk_level: str = "low"    # "low", "medium", "high"
    status: str = "pending"    # "pending", "approved", "flagged", "rejected"
    submitted_at: datetime = field(default_factory=datetime.utcnow)
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    notes: Optional[str] = None
