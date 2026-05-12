"""
ats_scoring/scorer.py — LINKUP Hybrid ATS Scoring Engine (Final Version)
========================================================================
Implements the dual-mode scoring system:
1. Fresher Mode: Prioritizes projects (35%) and skills (40%).
2. Experienced Mode: Balances experience (25%) and projects (25%).

Formula:
  Final = (ATS × 0.60) + (Semantic Similarity × 0.40)
  (Note: Semantic logic is orchestrated in jdMatchService.py)
"""
from __future__ import annotations

import json
import logging
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

log = logging.getLogger(__name__)

# ── Reference Data Paths ──────────────────────────────────────────────────────
_REF_DIR = Path(__file__).resolve().parents[3] / "database" / "reference"

def _load_json_ref(filename: str) -> dict:
    path = _REF_DIR / filename
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as exc:
        log.warning("[ATSScorer] Could not load %s: %s", filename, exc)
        return {}

_SKILLS_DICT: dict = _load_json_ref("skills_list.json")
_CERTS_DICT: dict = _load_json_ref("certificates_list.json")

def _build_lookup(data_dict: dict) -> set:
    lookup: set = set()
    for canonical, aliases in data_dict.items():
        lookup.add(canonical.lower())
        if isinstance(aliases, list):
            for alias in aliases:
                if isinstance(alias, str) and alias.strip():
                    lookup.add(alias.lower().strip())
        elif isinstance(aliases, dict): # Certs dict structure
            for alias in aliases.get("aliases", []):
                lookup.add(alias.lower().strip())
    return lookup

_SKILLS_LOOKUP: set = _build_lookup(_SKILLS_DICT)
_CERTS_LOOKUP: set = _build_lookup(_CERTS_DICT)

# ── Scoring Components ───────────────────────────────────────────────────────

def _calculate_skill_score(resume_skills: List[str], required_skills: List[str]) -> float:
    """
    Skill Score = (Skills Found / len(Required Skills)) * 100
    """
    if not required_skills:
        # If no JD skills provided, calculate score based on total number of recognized skills
        recognized = [s for s in resume_skills if s.lower() in _SKILLS_LOOKUP]
        return min(100.0, (len(recognized) / 10.0) * 100) # 10 recognized skills = 100% baseline
    
    resume_lower = {s.lower() for s in resume_skills}
    required_lower = [s.lower() for s in required_skills]
    matched = sum(1 for s in required_lower if s in resume_lower)
    
    score = (matched / len(required_lower)) * 100
    return min(100.0, score)


def _calculate_experience_score(resume_data: Dict[str, Any], is_fresher: bool, required_years: float = 0) -> float:
    """
    Fresher: Internship(85), Projects(75), None(60)
    Experienced: (Candidate / Required) * 100
    """
    candidate_exp = float(resume_data.get("experience_years", 0))
    text = (resume_data.get("parsed_text", "")).lower()

    if is_fresher:
        if "intern" in text or "internship" in text:
            return 85.0
        if resume_data.get("projects") or "project" in text:
            return 75.0
        return 60.0
    else:
        if required_years <= 0: return 85.0 
        score = (candidate_exp / required_years) * 100
        return min(100.0, score)


def _calculate_project_score(resume_data: Dict[str, Any]) -> float:
    """
    GitHub/Portfolio detected (+40)
    Each valid project (+20)
    """
    score = 0.0
    text = (resume_data.get("parsed_text", "")).lower()
    projects = resume_data.get("projects", [])

    if any(domain in text for domain in ["github.com", "portfolio", "bitbucket", "gitlab", "vercel", "netlify"]):
        score += 40.0
    
    score += (len(projects) * 20.0)
    return min(100.0, score)


def _calculate_education_score(resume_data: Dict[str, Any]) -> float:
    text = (resume_data.get("parsed_text", "")).lower()
    if any(x in text for x in ["phd", "doctorate"]): return 100.0
    if any(x in text for x in ["master", "mtech", "mba", "mca", "ms "]): return 85.0
    if any(x in text for x in ["bachelor", "btech", "bsc", "be ", "bca"]): return 75.0
    if "diploma" in text: return 60.0
    return 40.0


def _calculate_cert_score(resume_data: Dict[str, Any]) -> float:
    text = (resume_data.get("parsed_text", "")).lower()
    found = sum(1 for cert in _CERTS_LOOKUP if cert in text)
    return min(100.0, found * 25.0) # 4 certs = 100%


# ── Main Scoring Logic ───────────────────────────────────────────────────────

def score_job_description_ats(resume_data: Dict[str, Any], jd_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Orchestrates the LINKUP Hybrid ATS Formula.
    """
    candidate_exp = float(resume_data.get("experience_years", 0))
    required_exp = float(jd_data.get("required_experience_years", 0))
    is_fresher = candidate_exp < 1.0 or "fresher" in jd_data.get("description", "").lower()

    # Calculate Component Scores
    s_score = _calculate_skill_score(resume_data.get("skills", []), jd_data.get("required_skills", []))
    e_score = _calculate_experience_score(resume_data, is_fresher, required_exp)
    p_score = _calculate_project_score(resume_data)
    ed_score = _calculate_education_score(resume_data)
    c_score = _calculate_cert_score(resume_data)

    # ROADMAP STANDARDIZED WEIGHTS (Step 9)
    # Skills (35%) + Experience (25%) + Projects (20%) + Education (10%) + Certifications (10%)
    ats_score = (
        (s_score * 0.35) + 
        (e_score * 0.25) + 
        (p_score * 0.20) + 
        (ed_score * 0.10) + 
        (c_score * 0.10)
    )
    
    return {
        "ats_score": round(ats_score, 1),
        "mode": "Hybrid Scoring Engine v2",
        "breakdown": {
            "skills": round(s_score, 1),
            "experience": round(e_score, 1),
            "projects": round(p_score, 1),
            "education": round(ed_score, 1),
            "certifications": round(c_score, 1)
        },
        "matched_keywords": [s for s in jd_data.get("required_skills", []) if s.lower() in [rs.lower() for rs in resume_data.get("skills", [])]],
        "missing_keywords": [s for s in jd_data.get("required_skills", []) if s.lower() not in [rs.lower() for rs in resume_data.get("skills", [])]],
        "suggestions": _generate_suggestions(s_score, p_score, is_fresher)
    }


def _generate_suggestions(s: float, p: float, is_fresher: bool) -> List[str]:
    suggestions = []
    if s < 70: suggestions.append("Upskill in core technologies mentioned in the JD.")
    if p < 60: suggestions.append("Add GitHub links and more project documentation.")
    if is_fresher and p < 80: suggestions.append("Focus on building 2-3 high-quality portfolio projects.")
    return suggestions


def score_resume_ats(resume_data: Dict[str, Any]) -> Dict[str, Any]:
    """Baseline fallback when no specific JD is provided."""
    return score_job_description_ats(resume_data, {"required_skills": [], "description": ""})

class ATSScorer:
    """Wrapper class for backward compatibility."""
    def score_resume(self, parsed_resume: Dict[str, Any], job_description: str = "") -> float:
        jd_data = {"required_skills": [], "required_experience_years": 0, "description": job_description}
        return score_job_description_ats(parsed_resume, jd_data)["ats_score"]

    def score_resume_ats(self, resume_data: dict) -> dict:
        return score_resume_ats(resume_data)

    def score_job_description_ats(self, resume_data: dict, jd_data: dict) -> dict:
        return score_job_description_ats(resume_data, jd_data)
