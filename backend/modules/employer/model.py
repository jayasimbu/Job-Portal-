from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class EmployerProfile:
    id: int
    user_id: int
    company_name: str
    website: str | None = None
    description: str | None = None
    verified: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None


@dataclass
class JobPosting:
    id: int
    employer_id: int
    title: str
    description: str
    required_skills: list[str] = field(default_factory=list)
    min_experience: float = 0
    education_required: str | None = None
    location: str | None = None
    employment_type: str = "full_time"
    active: bool = True
    created_at: datetime | None = None
    updated_at: datetime | None = None
