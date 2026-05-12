"""
services/atsService.py — Unified ATS Scoring Service
=====================================================
Single entry-point for ALL ATS scoring across the platform.

Wraps:
    ai_engine/ats_scoring/scorer.py  (the real hybrid engine)

Replaces:
    modules/jobseeker/ats_algorithm.py  (duplicate — now deleted)
    modules/jobseeker/ats_engine.py     (dead mock code — now deleted)

Used by:
    modules/jobseeker/service.py   — resume upload scoring
    modules/jobseeker/routes.py    — /ats/resume, /ats/jd endpoints
    modules/employer/candidate_ranking.py — applicant ranking
"""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from ai_engine.ats_scoring.scorer import (
    ATSScorer,
    score_resume_ats as _score_resume_ats,
    score_job_description_ats as _score_job_description_ats,
)

log = logging.getLogger(__name__)


class ATSService:
    """
    Centralized ATS scoring facade.

    Two modes:
        1. Baseline (no JD)  — general resume quality score
        2. JD-targeted       — resume vs. specific job description
    """

    def __init__(self):
        self._scorer = ATSScorer()
        log.info("[ATSService] Initialized — hybrid formula active.")

    # ── Baseline ATS (no job description) ─────────────────────────────────

    def score_resume(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Score a resume without a job description (baseline mode).

        Args:
            resume_data: dict with keys:
                - skills: List[str]
                - experience_years: float
                - parsed_text: str (full resume text)
                - projects: List[dict] (optional)
                - education: List[str] (optional)

        Returns:
            dict with ats_score (0-100), breakdown, feedback, etc.
        """
        try:
            result = _score_resume_ats(resume_data)
            log.debug("[ATSService] Baseline score: %.1f", result.get("ats_score", 0))
            return result
        except Exception as exc:
            log.error("[ATSService] Baseline scoring failed: %s", exc)
            return self._fallback_score()

    # ── JD-Targeted ATS ──────────────────────────────────────────────────

    def score_against_jd(
        self,
        resume_data: Dict[str, Any],
        jd_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Score a resume against a specific job description (targeted mode).

        Args:
            resume_data: dict with keys:
                - skills: List[str]
                - experience_years: float
                - parsed_text: str
            jd_data: dict with keys:
                - required_skills: List[str]
                - required_experience_years: int (optional)
                - description: str

        Returns:
            dict with ats_score, breakdown, matched_keywords, missing_keywords, suggestions
        """
        try:
            result = _score_job_description_ats(resume_data, jd_data)
            log.debug("[ATSService] JD-targeted score: %.1f", result.get("ats_score", 0))
            return result
        except Exception as exc:
            log.error("[ATSService] JD-targeted scoring failed: %s", exc)
            return self._fallback_score()

    # ── Legacy compat: float-only score (used by JobSeekerService.upload_resume) ──

    def score_resume_float(
        self,
        parsed_resume: Dict[str, Any],
        job_description: str = "",
    ) -> float:
        """
        Legacy method — returns just the float score.
        Drop-in replacement for ATSScorer.score_resume().
        """
        return self._scorer.score_resume(parsed_resume, job_description)

    # ── Certificate bonus injection ───────────────────────────────────────

    @staticmethod
    def apply_certificate_bonus(
        ats_score: float,
        verified_certs_count: int,
        max_bonus: int = 20,
        per_cert_bonus: int = 5,
    ) -> tuple[float, int]:
        """
        Apply certificate bonus to an ATS score.

        Returns:
            (adjusted_score, actual_bonus_applied)
        """
        bonus = min(verified_certs_count * per_cert_bonus, max_bonus)
        adjusted = min(100, ats_score + bonus)
        return adjusted, bonus

    # ── Private ───────────────────────────────────────────────────────────

    @staticmethod
    def _fallback_score() -> Dict[str, Any]:
        return {
            "ats_score": 0,
            "breakdown": {},
            "matched_keywords": [],
            "missing_keywords": [],
            "suggestions": ["ATS scoring engine encountered an error. Please retry."],
            "feedback": "Unable to compute score at this time.",
        }


# Module-level singleton
ats_service = ATSService()
