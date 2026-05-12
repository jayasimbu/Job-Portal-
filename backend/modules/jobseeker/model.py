from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class JobSeekerProfile:
    id: int
    user_id: int
    headline: str | None = None
    skills: list[str] = field(default_factory=list)
    ats_score: float = 0
    resume_data: dict[str, Any] = field(default_factory=dict)
    missing_skills: list[str] = field(default_factory=list)
    recommendations: list[dict[str, Any]] = field(default_factory=list)
    experience_years: float = 0
    education_level: str | None = None
    portfolio_url: str | None = None
    github_url: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


@dataclass
class Resume:
    id: int
    user_id: int
    file_name: str
    raw_text: str
    parsed_data: dict[str, Any] = field(default_factory=dict)
    missing_skills: list[str] = field(default_factory=list)
    ats_score: float = 0
    semantic_score: float = 0
    created_at: datetime | None = None
    updated_at: datetime | None = None


@dataclass
class JobApplication:
    id: int
    user_id: int
    job_id: int
    status: str = "applied"
    ranking_score: float = 0
    ats_match_score: float = 0
    matched_skills: list[str] = field(default_factory=list)
    missing_skills: list[str] = field(default_factory=list)
    ai_summary: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
