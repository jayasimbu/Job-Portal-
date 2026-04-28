"""
backend/modules/employer/candidate_ranking.py — Full ATS + Semantic Ranking Engine
Uses the new hybrid ATS scorer (`score_job_description_ats`) for accurate ranking.
"""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from ai_engine.ats_scoring.scorer import ATSScorer, score_job_description_ats
from ai_engine.semantic_matching.matcher import SemanticMatcher

log = logging.getLogger(__name__)

_ats = ATSScorer()
_semantic = SemanticMatcher()


class CandidateRankingEngine:
    """
    Ranks candidates for a specific job using a combined ATS + semantic score.

    Final rank score = (ATS × 0.60) + (Semantic × 0.40)

    ATS component now uses the full Codex hybrid formula:
      (Skills×0.40) + (Experience×0.25) + (Projects×0.20) + (Certs×0.15)
    """

    def rank_candidates(
        self,
        job_description: str,
        candidates: List[Dict[str, Any]],
        required_skills: Optional[List[str]] = None,
        required_experience_years: Optional[int] = None,
        required_certs: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Rank a list of candidate application dicts.

        Each candidate dict may contain:
            - parsed_resume: dict (output of resume_parser)
            - resume_text: str
            - skills: list[str]
            - experience_years: int

        Returns the list sorted by `rank_score` descending, with rank positions assigned.
        """
        jd_data = {
            "required_skills": required_skills or _extract_skills_from_jd(job_description),
            "required_experience_years": required_experience_years or 0,
            "required_certs": required_certs or [],
            "description": job_description,
        }

        ranked: List[Dict[str, Any]] = []

        for candidate in candidates:
            parsed_resume = candidate.get("parsed_resume") or {}
            resume_text = (
                candidate.get("resume_text")
                or parsed_resume.get("parsed_text")
                or ""
            )
            skills = (
                candidate.get("skills")
                or parsed_resume.get("skills")
                or []
            )
            exp_years = int(
                candidate.get("experience_years")
                or parsed_resume.get("experience_years")
                or 0
            )

            resume_data = {
                "skills": skills,
                "experience_years": exp_years,
                "parsed_text": resume_text,
            }

            # JD-targeted ATS score (hybrid formula)
            try:
                ats_result = score_job_description_ats(resume_data, jd_data)
                ats_score = ats_result["ats_score"]
                matched_keywords = ats_result.get("matched_keywords", [])
                missing_keywords = ats_result.get("missing_keywords", [])
                ats_breakdown = ats_result.get("breakdown", {})
            except Exception as exc:
                log.warning("[CandidateRanking] ATS scoring failed: %s", exc)
                ats_score = 50.0
                matched_keywords = []
                missing_keywords = []
                ats_breakdown = {}

            # Semantic similarity score
            try:
                semantic_score = _semantic.match_score(resume_text, job_description)
            except Exception as exc:
                log.warning("[CandidateRanking] Semantic matching failed: %s", exc)
                semantic_score = 0.0

            # Weighted final score
            final_score = round((ats_score * 0.60) + (semantic_score * 100 * 0.40), 2)

            ranked.append({
                **candidate,
                "ats_score": ats_score,
                "semantic_score": round(semantic_score * 100, 2),
                "rank_score": final_score,
                "matched_keywords": matched_keywords,
                "missing_keywords": missing_keywords,
                "ats_breakdown": ats_breakdown,
            })

        # Sort by rank_score descending, assign rank positions
        ranked.sort(key=lambda item: item["rank_score"], reverse=True)
        for index, candidate in enumerate(ranked, start=1):
            candidate["rank"] = index

        return ranked


def _extract_skills_from_jd(job_description: str) -> List[str]:
    """
    Lightweight skill extraction from a job description text.
    Returns tokens that match our skills reference lookup.
    """
    try:
        from ai_engine.ats_scoring.scorer import _SKILLS_LOOKUP
        text_lower = job_description.lower()
        return [token for token in _SKILLS_LOOKUP if token in text_lower][:30]
    except Exception:
        return []


# Module-level singleton
ranking_engine = CandidateRankingEngine()
