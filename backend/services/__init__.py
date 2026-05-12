"""
LINKUP — Centralized Services Layer
====================================
This package provides clean, single-responsibility service facades
that sit between routes/module-services and the ai_engine core.

Services:
    atsService          — Unified ATS scoring (resume baseline + JD-targeted)
    jdMatchService      — JD matching with semantic + LLM feedback
    resumeParserService — Resume text parsing, skill extraction, auto-fill
    recommendationService — Job recommendations + learning paths + insights
"""

from services.atsService import ats_service
from services.jdMatchService import jd_match_service
from services.resumeParserService import resume_parser_service
from services.recommendationService import recommendation_service
from services.llmService import llm_service

__all__ = [
    "ats_service",
    "jd_match_service",
    "resume_parser_service",
    "recommendation_service",
    "llm_service",
]
