"""
services/jdMatchService.py — Job Description Matching Service
==============================================================
Handles resume-vs-JD comparison with three layers:
    1. Deterministic ATS score (via atsService)
    2. Semantic similarity   (via ai_engine/semantic_matching)
    3. LLM-enhanced feedback (via ai_engine/llm_service)

Used by:
    modules/jobseeker/routes.py        — /ats/jd endpoint
    modules/employer/candidate_ranking.py — applicant ranking
"""
from __future__ import annotations

import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Dict, List, Optional

from services.atsService import ats_service
from ai_engine.semantic_matching.matcher import SemanticMatcher
from services.llmService import llm_service
from ai_engine.prompts import JD_MATCH_EXPLANATION_PROMPT

log = logging.getLogger(__name__)

# Dedicated thread-pool for blocking LLM / CPU calls
_llm_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="jdmatch_llm")


class JDMatchService:
    """
    Orchestrates resume-to-JD matching across all scoring layers.
    """

    def __init__(self):
        self._semantic = SemanticMatcher()
        log.info("[JDMatchService] Initialized — ATS + Semantic + LLM layers active.")

    # ── Full Match Pipeline ───────────────────────────────────────────────

    def match(
        self,
        resume_data: Dict[str, Any],
        jd_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Synchronous full match: ATS score + semantic similarity.

        Args:
            resume_data: dict with skills, experience_years, parsed_text
            jd_data: dict with required_skills, description

        Returns:
            Combined result with ats_score, semantic_score, rank_score,
            matched/missing keywords, suggestions
        """
        # Layer 1: ATS deterministic score
        ats_result = ats_service.score_against_jd(resume_data, jd_data)
        ats_score = ats_result.get("ats_score", 0)

        # Layer 2: Semantic cosine similarity
        resume_text = resume_data.get("parsed_text", "")
        jd_text = jd_data.get("description", "")
        try:
            semantic_raw = self._semantic.match_score(resume_text, jd_text)
        except Exception as exc:
            log.warning("[JDMatchService] Semantic matching failed: %s", exc)
            semantic_raw = 0.0

        # Combined rank score: ATS 60% + Semantic 40%
        rank_score = round((ats_score * 0.60) + (semantic_raw * 0.40), 2)

        return {
            "matchScore": ats_score,
            "matchedSkills": ats_result.get("matched_keywords", []),
            "missingSkills": ats_result.get("missing_keywords", []),
            "semantic_score": round(semantic_raw, 2),
            "rank_score": rank_score,
            "mode": ats_result.get("mode"),
            "breakdown": ats_result.get("breakdown"),
            "suggestions": ats_result.get("suggestions"),
        }

    # ── Async Match with LLM Enhancement ──────────────────────────────────

    async def match_with_llm(
        self,
        resume_data: Dict[str, Any],
        jd_data: Dict[str, Any],
        user_id: Optional[int] = None,
        llm_timeout: int = 10,
    ) -> Dict[str, Any]:
        """
        Async match pipeline including LLM-enhanced explanation.
        The ATS + Semantic scores are computed instantly;
        the LLM call runs in a thread-pool with a timeout.

        Returns:
            Full match result + llm_enhanced_feedback, queued, error fields
        """
        # Step 1: Deterministic scoring (instant)
        result = self.match(resume_data, jd_data)

        # Step 2: LLM explanation (async, non-blocking)
        explain_prompt = (
            f"{JD_MATCH_EXPLANATION_PROMPT}\n\n"
            f"SCORE: {result.get('ats_score')}\n"
            f"MISSING_KEYWORDS: {result.get('missing_keywords', [])}"
        )

        loop = asyncio.get_event_loop()
        try:
            enhanced = await asyncio.wait_for(
                loop.run_in_executor(
                    _llm_executor,
                    lambda: llm_service.generate_with_fallback(
                        explain_prompt,
                        user_id=user_id,
                        request_type="jd_match_explain",
                        request_payload={
                            "resume_text": resume_data.get("parsed_text", "")[:1200],
                            "job_description": jd_data.get("description", "")[:1200],
                        },
                    ),
                ),
                timeout=llm_timeout,
            )
        except asyncio.TimeoutError:
            enhanced = {
                "result": None, "queued": False, "queue_id": None,
                "error_code": 408, "error_message": "LLM timed out",
                "attempted_models": [],
            }
        except Exception as exc:
            enhanced = {
                "result": None, "queued": False, "queue_id": None,
                "error_code": 500, "error_message": str(exc),
                "attempted_models": [],
            }

        result["llm_enhanced_feedback"] = enhanced.get("result")
        result["queued"] = enhanced.get("queued", False)
        result["queue_id"] = enhanced.get("queue_id")
        result["error_code"] = enhanced.get("error_code")
        result["error_message"] = enhanced.get("error_message")
        result["attempted_models"] = enhanced.get("attempted_models", [])

        return result

    # ── Semantic-only score (lightweight) ─────────────────────────────────

    def semantic_score(self, candidate_text: str, job_text: str) -> float:
        """Raw semantic cosine similarity (0-100)."""
        try:
            return self._semantic.match_score(candidate_text, job_text)
        except Exception as exc:
            log.warning("[JDMatchService] Semantic score failed: %s", exc)
            return 0.0


# Module-level singleton
jd_match_service = JDMatchService()
