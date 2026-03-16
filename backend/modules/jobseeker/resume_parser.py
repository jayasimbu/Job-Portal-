import re
from typing import Any, Dict, List


class ResumeParser:
    """Simple parser placeholder for production extension with spaCy/pdfminer/PyMuPDF."""

    _skill_keywords = {
        "python",
        "java",
        "javascript",
        "typescript",
        "react",
        "fastapi",
        "node",
        "sql",
        "docker",
        "aws",
    }

    def parse_text(self, text: str) -> Dict[str, Any]:
        lowered = text.lower()
        skills = sorted([s for s in self._skill_keywords if s in lowered])

        experience_years = self._extract_experience_years(lowered)
        education = self._extract_education(lowered)
        projects = self._extract_projects(text)

        return {
            "skills": skills,
            "experience_years": experience_years,
            "education": education,
            "projects": projects,
        }

    def _extract_experience_years(self, text: str) -> float:
        match = re.search(r"(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)", text)
        return float(match.group(1)) if match else 0.0

    def _extract_education(self, text: str) -> str:
        if "phd" in text:
            return "phd"
        if "master" in text or "m.sc" in text or "mba" in text:
            return "masters"
        if "bachelor" in text or "b.tech" in text or "b.e" in text:
            return "bachelors"
        return "unknown"

    def _extract_projects(self, text: str) -> List[Dict[str, str]]:
        projects: List[Dict[str, str]] = []
        for line in text.splitlines():
            line = line.strip()
            if not line:
                continue
            if "github.com" in line or "project" in line.lower():
                projects.append({"title": line[:80], "reference": line})
            if len(projects) >= 5:
                break
        return projects
