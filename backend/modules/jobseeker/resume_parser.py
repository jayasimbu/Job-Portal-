import re
import json
from pathlib import Path
from typing import Any, Dict, List

_REF_DIR = Path(__file__).resolve().parents[3] / "database" / "reference"

def _load_skills() -> set:
    try:
        with open(_REF_DIR / "skills_list.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            lookup = set()
            for canonical, aliases in data.items():
                lookup.add(canonical.lower())
                if isinstance(aliases, list):
                    for alias in aliases:
                        if isinstance(alias, str) and alias.strip():
                            lookup.add(alias.lower().strip())
            return lookup
    except Exception:
        # Fallback to a generous default if file missing
        return {
            "python", "java", "javascript", "typescript", "react", "fastapi", "node", "sql", "docker", "aws",
            "html", "css", "c++", "c#", "ruby", "go", "php", "swift", "kotlin", "rust", "scala", "angular", "vue",
            "spring", "django", "flask", "express", "mongodb", "postgresql", "mysql", "redis", "kubernetes",
            "terraform", "ansible", "jenkins", "gitlab ci", "github actions", "linux", "git", "machine learning",
            "data analysis", "nlp", "computer vision", "pandas", "numpy", "tensorflow", "pytorch", "scikit-learn"
        }

_GLOBAL_SKILLS = _load_skills()

class ResumeParser:
    """Advanced parser extracting skills, projects, and passing full text for content analysis."""

    def parse_text(self, text: str) -> Dict[str, Any]:
        lowered = text.lower()
        
        # Skill extraction based on global dictionary
        tokens = re.split(r'\W+', lowered)
        # Check single words
        skills_found = {t for t in tokens if t in _GLOBAL_SKILLS}
        # Check double words (e.g. "machine learning")
        for i in range(len(tokens)-1):
            phrase = f"{tokens[i]} {tokens[i+1]}"
            if phrase in _GLOBAL_SKILLS:
                skills_found.add(phrase)
                
        skills = sorted(list(skills_found))

        experience_years = self._extract_experience_years(lowered)
        education = self._extract_education(lowered)
        projects = self._extract_projects(text)

        return {
            "skills": skills,
            "experience_years": experience_years,
            "education": education,
            "projects": projects,
            "parsed_text": text # Required for deep content analysis in scorer
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
            if "github.com" in line or "project" in line.lower() or "portfolio" in line.lower():
                projects.append({"title": line[:80], "reference": line})
            if len(projects) >= 5:
                break
        return projects
