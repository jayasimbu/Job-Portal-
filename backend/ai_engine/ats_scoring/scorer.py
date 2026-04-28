"""
ats_scoring/scorer.py — Hybrid ATS Scoring Engine
===================================================
Implements the deterministic hybrid formula required by the Codex master prompt:
  ATS Score = (Skills×0.40) + (Experience×0.25) + (Projects×0.20) + (Certs×0.15)

Reference data loaded from:
  database/reference/skills_list.json
  database/reference/certificates_list.json

Two public functions:
  score_resume_ats(resume_data: dict) -> dict
  score_job_description_ats(resume_data: dict, jd_data: dict) -> dict

Ollama (LLM) is used ONLY to enrich the suggestion text; the numeric score is always
deterministic and never depends on LLM availability.
"""
from __future__ import annotations

import json
import logging
import os
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


# ── Lookup Set Builders (run once at import) ──────────────────────────────────

def _build_skills_lookup(skills_dict: dict) -> set:
    """
    Returns flat set of lowercased canonical skill names + all aliases.
    e.g. {"react", "react js", "reactjs", "react.js", "react 18", ...}
    """
    lookup: set = set()
    for canonical, aliases in skills_dict.items():
        lookup.add(canonical.lower())
        if isinstance(aliases, list):
            for alias in aliases:
                if isinstance(alias, str) and alias.strip():
                    lookup.add(alias.lower().strip())
    return lookup


def _build_certs_lookup(certs_dict: dict) -> set:
    """
    Returns flat set of lowercased canonical cert names + all aliases.
    e.g. {"aws saa", "saa-c03", "aws certified solutions architect associate", ...}
    """
    lookup: set = set()
    for canonical, data in certs_dict.items():
        lookup.add(canonical.lower())
        if isinstance(data, dict):
            for alias in data.get("aliases", []):
                if isinstance(alias, str) and alias.strip():
                    lookup.add(alias.lower().strip())
    return lookup


_SKILLS_LOOKUP: set = _build_skills_lookup(_SKILLS_DICT)
_CERTS_LOOKUP: set = _build_certs_lookup(_CERTS_DICT)

log.info(
    "[ATSScorer] Loaded %s skill tokens and %s cert tokens from reference files.",
    len(_SKILLS_LOOKUP),
    len(_CERTS_LOOKUP),
)


# ── Individual Scoring Components ─────────────────────────────────────────────

def _score_skills(resume_skills: List[str], required_skills: Optional[List[str]] = None) -> float:
    """
    Skills Match (0.0–1.0).
    If required_skills provided: direct overlap ratio (JD-targeted mode).
    Otherwise: counts recognized skills from reference lookup (baseline mode).
    """
    if required_skills:
        if not required_skills:
            return 0.5
        req_lower = {s.lower() for s in required_skills}
        resume_lower = {s.lower() for s in resume_skills}
        # Also check aliases
        matched = 0
        for req in req_lower:
            if req in resume_lower:
                matched += 1
                continue
            # Check alias match
            for rskill in resume_lower:
                if req in rskill or rskill in req:
                    matched += 1
                    break
        return min(matched / max(len(req_lower), 1), 1.0)
    else:
        # Baseline: count how many known skills the resume contains
        text_lower = " ".join(resume_skills).lower()
        found = sum(1 for token in _SKILLS_LOOKUP if token in text_lower)
        cap = max(1, int(len(_SKILLS_DICT) * 0.20))  # 20% of all known skills → 100%
        return min(found / cap, 1.0)


def _score_experience(resume_text: str, required_years: Optional[int] = None) -> float:
    """Experience Match (0.0–1.0)."""
    text_lower = resume_text.lower()
    exp_year_matches = re.findall(
        r"(\d+)\s*\+?\s*years?\s*(?:of\s*)?(?:experience|exp)", text_lower
    )
    detected_years = max([int(y) for y in exp_year_matches], default=0)

    if required_years and required_years > 0:
        if detected_years >= required_years:
            return 1.0
        return max(0.1, detected_years / required_years)

    # Baseline heuristic
    role_blocks = len(re.findall(
        r"\b(?:engineer|developer|analyst|manager|intern|consultant|"
        r"designer|architect|lead|director|specialist|officer|executive)\b",
        text_lower,
    ))
    exp_sections = len(re.findall(
        r"\b(?:experience|employment|work history|professional background|"
        r"career history|positions? held)\b",
        text_lower,
    ))
    return min((detected_years * 0.15) + (role_blocks * 0.04) + (exp_sections * 0.10), 1.0)


def _score_projects(resume_text: str, required_tech: Optional[List[str]] = None) -> float:
    """Projects Match (0.0–1.0)."""
    text_lower = resume_text.lower()
    project_sections = len(re.findall(
        r"\b(?:projects?|portfolio|case study|github|personal work|side project|open.?source)\b",
        text_lower,
    ))
    project_count = max(project_sections, 0)

    if required_tech:
        req_lower = [t.lower() for t in required_tech]
        tech_in_projects = sum(1 for t in req_lower if t in text_lower)
        tech_ratio = tech_in_projects / max(len(req_lower), 1)
        presence_score = min(project_count / 3.0, 1.0)  # up to 3 project sections → 100%
        return min((tech_ratio * 0.6) + (presence_score * 0.4), 1.0)

    return min(project_count / 3.0, 1.0)


def _score_certs(resume_text: str, required_certs: Optional[List[str]] = None) -> float:
    """Certification Match (0.0–1.0)."""
    text_lower = resume_text.lower()
    found = sum(1 for token in _CERTS_LOOKUP if token in text_lower)

    if required_certs:
        req_lower = [c.lower() for c in required_certs]
        matched = sum(1 for c in req_lower if c in text_lower or any(
            alias in text_lower for alias in _CERTS_LOOKUP if c in alias
        ))
        return min(matched / max(len(req_lower), 1), 1.0)

    return min(found / 3.0, 1.0)  # 3 certs → 100%


# ── Education Scoring (bonus component) ──────────────────────────────────────

def _score_education(resume_text: str) -> float:
    """Education level score (0.0–1.0)."""
    text_lower = resume_text.lower()
    edu_signals = [
        (1.00, ["phd", "ph.d", "doctorate", "doctor of philosophy"]),
        (0.85, ["master of", "master's", "m.tech", "mtech", "mba", "m.e.", "msc", "m.sc", "pgdm"]),
        (0.70, ["bachelor of", "bachelor's", "b.tech", "btech", "b.e.", "b.sc", "bsc", "b.com", "bca", "b.a."]),
        (0.55, ["diploma", "polytechnic", "associate degree"]),
        (0.40, ["hsc", "12th", "higher secondary", "intermediate"]),
        (0.30, ["sslc", "10th", "secondary school"]),
    ]
    for score, keywords in edu_signals:
        if any(kw in text_lower for kw in keywords):
            return score
    return 0.3


# ── Public API Functions (required by Codex prompt) ───────────────────────────

def score_resume_ats(resume_data: dict) -> dict:
    """
    Baseline ATS score — no job description.
    Required by Codex master prompt.

    Args:
        resume_data: dict with keys:
            - skills: List[str]
            - experience_years: int (optional)
            - parsed_text: str (full resume text)
            - projects: List[dict] (optional)
            - certifications: List[dict] (optional)

    Returns:
        dict with ats_score (0-100), breakdown, and feedback
    """
    resume_text = resume_data.get("parsed_text", "") or ""
    skills = resume_data.get("skills", []) or []
    experience_years = resume_data.get("experience_years", 0) or 0

    # Build a composite text for pattern matching
    full_text = resume_text + " " + " ".join(skills)

    skills_pct = _score_skills(skills)
    exp_pct = _score_experience(full_text, required_years=None)
    # Override with explicit years if provided
    if experience_years > 0:
        exp_pct = max(exp_pct, min(experience_years / 8.0, 1.0))
    projects_pct = _score_projects(full_text)
    certs_pct = _score_certs(full_text)
    edu_pct = _score_education(full_text)

    # Codex spec weighted formula
    # (Skills×0.40) + (Experience×0.25) + (Projects×0.20) + (Certs×0.15)
    weighted = (
        (skills_pct * 0.40)
        + (exp_pct * 0.25)
        + (projects_pct * 0.20)
        + (certs_pct * 0.15)
    ) * 100

    ats_score = round(max(0.0, min(weighted, 100.0)), 1)

    # Feedback generation
    feedback_parts = []
    if skills_pct < 0.5:
        feedback_parts.append("Add more recognized technical skills to your resume.")
    if exp_pct < 0.4:
        feedback_parts.append("Include specific work experience with years and role titles.")
    if projects_pct < 0.5:
        feedback_parts.append("Add project sections with GitHub links or descriptions.")
    if certs_pct < 0.3:
        feedback_parts.append("Consider adding industry-recognized certifications.")
    if edu_pct < 0.7:
        feedback_parts.append("Ensure your education section includes your highest degree.")

    feedback = " ".join(feedback_parts) if feedback_parts else "Resume looks well-structured for ATS."

    return {
        "ats_score": ats_score,
        "formula": "(Skills×0.40) + (Experience×0.25) + (Projects×0.20) + (Certs×0.15)",
        "breakdown": {
            "skills_score": round(skills_pct * 100, 1),
            "experience_score": round(exp_pct * 100, 1),
            "projects_score": round(projects_pct * 100, 1),
            "cert_score": round(certs_pct * 100, 1),
            "education_score": round(edu_pct * 100, 1),
        },
        "feedback": feedback,
        "skills_found": sum(1 for token in _SKILLS_LOOKUP if token in full_text.lower()),
        "certs_found": sum(1 for token in _CERTS_LOOKUP if token in full_text.lower()),
    }


def score_job_description_ats(resume_data: dict, jd_data: dict) -> dict:
    """
    Advanced ATS engine strictly following the new weighted logic:
    Keyword Match -> 30
    Skills -> 20
    Projects/Experience -> 20
    Content Quality -> 10
    Format -> 10
    Sections -> 10
    """
    resume_text = resume_data.get("parsed_text", "") or ""
    resume_skills = resume_data.get("skills", []) or []
    experience_years = resume_data.get("experience_years", 0) or 0
    projects = resume_data.get("projects", []) or []
    education = resume_data.get("education", "unknown")
    
    required_skills = jd_data.get("required_skills", []) or []
    
    full_resume_text = resume_text + " " + " ".join(resume_skills)
    text_lower = full_resume_text.lower()
    
    # --- 1. Keyword / JD Match (30%) ---
    matched_keywords = []
    missing_keywords = []
    resume_lower_skills = {s.lower() for s in resume_skills}
    
    for skill in required_skills:
        s_lower = skill.lower()
        if s_lower in resume_lower_skills or s_lower in text_lower:
            matched_keywords.append(skill)
        else:
            missing_keywords.append(skill)
            
    if required_skills:
        jd_match_ratio = len(matched_keywords) / max(len(required_skills), 1)
    else:
        jd_match_ratio = 1.0 if resume_skills else 0.0
    keyword_score = jd_match_ratio * 30.0

    # --- 2. Baseline Skills Match (20%) ---
    # Give points based on sheer volume of recognized skills
    found_global = sum(1 for token in _SKILLS_LOOKUP if token in text_lower)
    skills_score = min(found_global / 15.0, 1.0) * 20.0

    # --- 3. Projects/Experience (20%) ---
    # For freshers, projects count heavily as experience
    has_projects = len(projects) > 0 or "github" in text_lower or "project" in text_lower
    exp_points = min(experience_years * 5, 10) # Max 10 points for years of experience
    proj_points = 10 if has_projects else 0 # 10 points for having projects
    if experience_years == 0 and has_projects:
        proj_points = 20 # Projects act as experience for freshers
    proj_exp_score = min(exp_points + proj_points, 20.0)

    # --- 4. Content Quality & Rule Engine (10%) ---
    content_score = 10.0
    suggestions = []
    
    has_numbers = bool(re.search(r'\d+|%', text_lower))
    if not has_numbers:
        content_score -= 5
        suggestions.append("Add measurable results (e.g., 'improved by 30%') to strengthen bullet points.")
        
    strong_verbs = ["developed", "built", "architected", "led", "managed", "designed", "created", "optimized"]
    has_action_verbs = any(verb in text_lower for verb in strong_verbs)
    if not has_action_verbs:
        content_score -= 5
        suggestions.append("Start bullet points with strong action verbs (e.g., 'Developed', 'Led', 'Optimized').")
        
    # Penalty for too much repetition (basic heuristic: highly frequent generic words)
    words = text_lower.split()
    if words:
        common_count = sum(1 for w in words if w in {"worked", "helped", "did", "made"})
        if common_count > 5:
            content_score -= 2
            suggestions.append("Reduce repetition of generic verbs like 'worked' or 'helped'.")
            
    content_score = max(0.0, content_score)

    # --- 5. Format (10%) ---
    format_score = 10.0
    # Basic heuristic: enough words and not just a single massive paragraph
    if len(words) < 100:
        format_score -= 5
        suggestions.append("Your resume is too short. Expand on your experiences and projects.")
    if len(text_lower.splitlines()) < 10:
        format_score -= 5
        suggestions.append("Break your resume into clear bullet points and sections. Avoid massive paragraphs.")
        
    format_score = max(0.0, format_score)

    # --- 6. Sections (10%) ---
    sections_score = 10.0
    if not resume_skills:
        sections_score -= 3
        suggestions.append("Add a dedicated 'Skills' section.")
    if not has_projects:
        sections_score -= 4
        suggestions.append("Include a 'Projects' or 'Portfolio' section to showcase practical experience.")
    if education == "unknown" and "education" not in text_lower:
        sections_score -= 3
        suggestions.append("Ensure your 'Education' section is clearly labeled.")
        
    sections_score = max(0.0, sections_score)

    # Add missing skills suggestion
    if missing_keywords:
        suggestions.append(f"Add missing skills: {', '.join(missing_keywords[:5])}.")

    ats_score = round(keyword_score + skills_score + proj_exp_score + content_score + format_score + sections_score, 1)

    return {
        "ats_score": ats_score,
        "formula": "Keyword(30) + Skills(20) + Proj/Exp(20) + Content(10) + Format(10) + Sections(10)",
        "breakdown": {
            "keyword_match": round(keyword_score, 1),
            "skills": round(skills_score, 1),
            "projects_experience": round(proj_exp_score, 1),
            "content_quality": round(content_score, 1),
            "format": round(format_score, 1),
            "sections": round(sections_score, 1),
        },
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "suggestions": suggestions,
    }


# ── Legacy-compatible wrapper class ──────────────────────────────────────────

class ATSScorer:
    """Drop-in class wrapper for backward compatibility with existing code."""

    def score_resume(self, parsed_resume: Dict[str, Any], job_description: str = "") -> float:
        """Legacy method — returns just the float score."""
        resume_data = {
            "skills": parsed_resume.get("skills", []),
            "experience_years": parsed_resume.get("experience_years", 0),
            "parsed_text": parsed_resume.get("parsed_text", ""),
        }
        if job_description:
            # Extract pseudo-required skills from JD text (simple keyword extraction)
            jd_tokens = set(job_description.lower().split())
            required_skills = [token for token in _SKILLS_LOOKUP if token in jd_tokens][:30]
            jd_data = {
                "required_skills": required_skills,
                "required_experience_years": 0,
                "description": job_description,
            }
            result = score_job_description_ats(resume_data, jd_data)
        else:
            result = score_resume_ats(resume_data)
        return result["ats_score"]

    def score_resume_ats(self, resume_data: dict) -> dict:
        return score_resume_ats(resume_data)

    def score_job_description_ats(self, resume_data: dict, jd_data: dict) -> dict:
        return score_job_description_ats(resume_data, jd_data)
