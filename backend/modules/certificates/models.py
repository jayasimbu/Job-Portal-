from enum import Enum
from pydantic import BaseModel
from typing import Optional, List

class VerificationStatus(str, Enum):
    pending = "pending"
    ai_reviewed = "ai_reviewed"
    verified = "verified"
    rejected = "rejected"

class ConfidenceLevel(str, Enum):
    high = "High"
    medium = "Medium"
    low = "Low"

class CertificateResponse(BaseModel):
    id: str
    user_id: int
    certificate_name: Optional[str] = None
    issuer: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    file_url: str
    ocr_text: Optional[str] = None
    confidence_score: int = 0
    confidence_level: Optional[ConfidenceLevel] = None
    verification_status: VerificationStatus
    verified_by: Optional[str] = None
    created_at: str
