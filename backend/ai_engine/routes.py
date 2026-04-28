from __future__ import annotations

import json
from typing import Any, Dict, Optional

from fastapi import APIRouter
from fastapi import Depends, HTTPException, status
from pydantic import BaseModel, Field

from ai_engine.llm_service import llm_service
from ai_engine.queue_service import queue_service
from ai_engine.prompts import ATS_FEEDBACK_PROMPT, JD_MATCH_EXPLANATION_PROMPT
from ai_engine.semantic_matching.matcher import SemanticMatcher
from core.config import settings
from core.security import require_roles


router = APIRouter()
matcher = SemanticMatcher()


class ATSFeedbackPayload(BaseModel):
    ats_result: Dict[str, Any] = Field(default_factory=dict)
    user_id: Optional[int] = None


class MatchExplainPayload(BaseModel):
    resume_text: str = ""
    job_description: str = ""
    user_id: Optional[int] = None


class ProviderCheckPayload(BaseModel):
    base_url: str = ""
    timeout: int = 5


@router.post("/ats-feedback")
async def ats_feedback(payload: ATSFeedbackPayload) -> Dict[str, Any]:
    prompt = (
        f"{ATS_FEEDBACK_PROMPT}\n\n"
        f"ATS_RESULT_JSON:\n{json.dumps(payload.ats_result, ensure_ascii=True)}"
    )
    generated = llm_service.generate_with_fallback(
        prompt,
        user_id=payload.user_id,
        request_type="ats_feedback",
        request_payload={"ats_result": payload.ats_result},
    )
    return {
        "llm_enhanced_feedback": generated.get("result"),
        "fallback_used": not generated.get("success", False),
        "queued": generated.get("queued", False),
        "queue_id": generated.get("queue_id"),
        "error_code": generated.get("error_code"),
        "error_message": generated.get("error_message"),
        "model_used": generated.get("model_used"),
        "attempted_models": generated.get("attempted_models", []),
    }


@router.post("/match-explain")
async def match_explain(payload: MatchExplainPayload) -> Dict[str, Any]:
    score = matcher.match_score(payload.resume_text, payload.job_description)
    prompt = (
        f"{JD_MATCH_EXPLANATION_PROMPT}\n\n"
        f"MATCH_SCORE: {score}\n"
        f"RESUME_TEXT:\n{payload.resume_text[:3000]}\n\n"
        f"JOB_DESCRIPTION:\n{payload.job_description[:3000]}"
    )
    explanation = llm_service.generate_with_fallback(
        prompt,
        user_id=payload.user_id,
        request_type="match_explain",
        request_payload={
            "resume_text": payload.resume_text[:1200],
            "job_description": payload.job_description[:1200],
        },
    )
    return {
        "semantic_match_score": score,
        "explanation": explanation.get("result"),
        "fallback_used": not explanation.get("success", False),
        "queued": explanation.get("queued", False),
        "queue_id": explanation.get("queue_id"),
        "error_code": explanation.get("error_code"),
        "error_message": explanation.get("error_message"),
        "model_used": explanation.get("model_used"),
        "attempted_models": explanation.get("attempted_models", []),
    }


@router.get("/provider/status")
async def provider_status() -> Dict[str, Any]:
    return {
        "provider": "ollama",
        "base_url": settings.OLLAMA_BASE_URL,
        "model": settings.OLLAMA_MODEL,
        "models": settings.get_ollama_models(),
        "fallback_base_urls": settings.get_ollama_base_urls(),
        "api_key_configured": bool(settings.OLLAMA_API_KEY),
        "require_api_key_for_remote": settings.OLLAMA_REQUIRE_API_KEY_FOR_REMOTE,
        "reachable": llm_service.check_connection(),
    }


@router.post("/provider/check")
async def provider_check(payload: ProviderCheckPayload) -> Dict[str, Any]:
    target_url = (payload.base_url or settings.OLLAMA_BASE_URL).strip()
    reachable = llm_service.check_connection(base_url=target_url, timeout=payload.timeout)
    return {
        "provider": "ollama",
        "base_url": target_url,
        "reachable": reachable,
    }


@router.get("/queue/status/{user_id}")
async def queue_status(
    user_id: int,
    current_user: Dict[str, Any] = Depends(require_roles("jobseeker", "employer", "admin")),
) -> Dict[str, Any]:
    if int(current_user.get("user_id")) != int(user_id) and str(current_user.get("role", "")).lower() != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only access your own queue status")
    return queue_service.get_user_queue_status(user_id)
