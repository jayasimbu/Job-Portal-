from datetime import datetime
from typing import Any, Dict, List

from fastapi import Depends
from sqlalchemy.orm import Session

from core.database import get_db
from modules.auth.model import User
from modules.employer.model import EmployerProfile, JobPosting


class AdminService:
    def __init__(self, db: Session):
        self.db = db

    def list_users(self) -> List[User]:
        return self.db.query(User).all()

    def list_companies(self) -> List[EmployerProfile]:
        return self.db.query(EmployerProfile).all()

    def list_jobs(self) -> List[JobPosting]:
        return self.db.query(JobPosting).all()

    def get_system_logs(self) -> List[Dict[str, Any]]:
        return [
            {"timestamp": datetime.utcnow().isoformat(), "level": "INFO", "message": "System running normally"},
            {"timestamp": datetime.utcnow().isoformat(), "level": "INFO", "message": "AI verification queue healthy"},
        ]

    def dashboard_metrics(self) -> Dict[str, int]:
        return {
            "users": self.db.query(User).count(),
            "companies": self.db.query(EmployerProfile).count(),
            "jobs": self.db.query(JobPosting).count(),
        }


def get_admin_service(db: Session = Depends(get_db)) -> AdminService:
    return AdminService(db)
