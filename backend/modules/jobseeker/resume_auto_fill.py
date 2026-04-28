from __future__ import annotations

from typing import Dict, List
import re


def _extract_email(text: str) -> str:
    match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
    return match.group(0) if match else ""


def _extract_phone(text: str) -> str:
    match = re.search(r"(\+?\d[\d\s\-]{8,}\d)", text)
    return match.group(0).strip() if match else ""


def _extract_skills(text: str) -> List[str]:
    candidates = [
        "python", "java", "javascript", "react", "fastapi", "sql", "mongodb", "docker", "aws", "git",
    ]
    lower = text.lower()
    return [skill for skill in candidates if skill in lower]


def build_profile_from_resume_text(resume_text: str) -> Dict:
    lines = [line.strip() for line in resume_text.splitlines() if line.strip()]
    full_name = lines[0] if lines else ""

    return {
        "full_name": full_name,
        "email": _extract_email(resume_text),
        "phone": _extract_phone(resume_text),
        "skills": _extract_skills(resume_text),
    }
