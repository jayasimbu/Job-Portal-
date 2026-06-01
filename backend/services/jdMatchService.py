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
            "ats_score": ats_score,
            "final_score": rank_score,
            "matchedSkills": ats_result.get("matched_keywords", []),
            "missingSkills": ats_result.get("missing_keywords", []),
            "matched_keywords": ats_result.get("matched_keywords", []),
            "missing_keywords": ats_result.get("missing_keywords", []),
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
        llm_timeout: int = 25,
    ) -> Dict[str, Any]:
        """
        Async match pipeline including LLM-enhanced explanation.
        Attempts deep AI matching using Ollama/Cloud provider first,
        falling back to deterministic keyword match if it fails.
        """
        resume_text = resume_data.get("parsed_text", "")
        jd_text = jd_data.get("description", "")

        # Step 1: Deep AI matching using Ollama/Cloud provider
        if resume_text.strip() and jd_text.strip():
            try:
                ai_match = await asyncio.wait_for(
                    llm_service.generate_deep_ats_match(resume_text, jd_text),
                    timeout=float(llm_timeout)
                )
                if ai_match and ai_match.get("match_score", 0) > 0:
                    match_score = ai_match.get("match_score", 0)
                    return {
                        "matchScore": match_score,
                        "ats_score": match_score,
                        "final_score": match_score,
                        "matchedSkills": ai_match.get("matched_skills", []),
                        "missingSkills": ai_match.get("missing_skills", []),
                        "matched_keywords": ai_match.get("matched_skills", []),
                        "missing_keywords": ai_match.get("missing_skills", []),
                        "semantic_score": match_score,
                        "rank_score": match_score,
                        "mode": "Ollama Deep AI Matching",
                        "breakdown": {
                            "skills": match_score,
                            "experience": match_score,
                            "projects": match_score,
                            "education": match_score,
                            "certifications": match_score
                        },
                        "suggestions": [f"Focus on learning these missing skills: {', '.join(ai_match.get('missing_skills', []))}"] if ai_match.get("missing_skills") else [],
                        "llm_enhanced_feedback": ai_match.get("reasoning", "Analysis complete."),
                        "queued": False,
                        "queue_id": None,
                        "error_code": None,
                        "error_message": None,
                        "attempted_models": ["deepseek-v3.1:671b-cloud"]
                    }
            except Exception as exc:
                log.warning("[JDMatchService] Deep AI matching failed, falling back to deterministic: %s", exc)

        # Step 2: Fallback to deterministic scoring (instant)
        result = self.match(resume_data, jd_data)

        # Step 3: Local LLM explanation fallback (async, non-blocking)
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
                        model=settings.OLLAMA_MODEL,
                        system="You are a senior recruitment expert."
                    ),
                ),
                timeout=10,
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
