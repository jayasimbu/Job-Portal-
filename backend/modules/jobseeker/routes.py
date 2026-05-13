import asyncio
import json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, UploadFile, File, Form
from pydantic import BaseModel

# ── Centralized Services Layer (Phase 1 refactor) ──
from services.atsService import ats_service
from services.jdMatchService import jd_match_service
from services.resumeParserService import resume_parser_service

from ai_engine.llm_service import llm_service
from ai_engine.prompts import ATS_FEEDBACK_PROMPT
from ai_engine.verification.certificate_verifier import CertificateVerifier
from core.security import get_current_user_db, require_roles
from core.serialization import model_to_dict, models_to_dict
from modules.jobseeker.model import JobApplication
from modules.jobseeker.service import JobSeekerService, get_jobseeker_service
import logging

log = logging.getLogger(__name__)

# Dedicated thread-pool for blocking LLM / CPU calls so they never block the event loop
_llm_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="llm_worker")

class ProfilePayload(BaseModel):
    headline: Optional[str] = None
    skills: List[str] = []
    experience_years: float = 0
    education_level: Optional[str] = None
    portfolio_url: Optional[str] = None
    github_url: Optional[str] = None


class ResumeUploadPayload(BaseModel):
    user_id: int
    file_name: str
    resume_text: str
    job_description: str = ""


class ResumeParsePayload(BaseModel):
    resume_text: str


class ATSResumePayload(BaseModel):
    resume_text: str
    skills: List[str] = []
    experience_years: float = 0
    projects: List[Any] = []
    education: Any = None


class ATSJDPayload(BaseModel):
    resume_text: str
    job_description: str


class ApplyPayload(BaseModel):
    job_id: int


class ToggleBookmarkPayload(BaseModel):
    user_id: int
    job_id: int


class SearchHistoryPayload(BaseModel):
    user_id: int
    query: str


class CertificateVerifyPayload(BaseModel):
    cert_name: str
    issuer: Optional[str] = None
    credential_id: Optional[str] = None
    user_id: int
    user_email: Optional[str] = None
    user_name: Optional[str] = None


router = APIRouter(dependencies=[Depends(require_roles("jobseeker", "admin"))])


@router.get("/profile/{user_id}")
async def get_profile(user_id: int, service: JobSeekerService = Depends(get_jobseeker_service)) -> Dict[str, Any]:
    profile = service.get_profile(user_id)
    return {"profile": model_to_dict(profile) if profile else None}


@router.put("/profile/{user_id}")
async def upsert_profile(
    user_id: int,
    payload: ProfilePayload,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    profile = service.update_profile(user_id, payload.model_dump())
    return {"message": "profile updated", "profile": model_to_dict(profile)}


@router.get("/profile")
async def get_profile_alias(
    user_id: int = Query(...),
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    profile = service.get_profile(user_id)
    return {"profile": model_to_dict(profile) if profile else None}


@router.put("/profile")
async def upsert_profile_alias(
    payload: ProfilePayload,
    user_id: int = Query(...),
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    profile = service.upsert_profile(user_id, payload.model_dump())
    return {"message": "profile updated", "profile": model_to_dict(profile)}


@router.post("/resume/upload")
async def upload_resume(
    payload: ResumeUploadPayload,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    resume = await service.upload_resume(
        user_id=payload.user_id,
        file_name=payload.file_name,
        resume_text=payload.resume_text,
        job_description=payload.job_description,
    )
    return {"message": "resume processed", "resume": model_to_dict(resume)}


@router.post("/resume/upload-file")
async def upload_resume_file(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    job_description: str = Form(""),
    service: JobSeekerService = Depends(get_jobseeker_service),
    user=Depends(get_current_user_db),
) -> Dict[str, Any]:
    file_bytes = await file.read()
    user_email = getattr(user, "email", f"user_{user_id}@example.com")
    actual_user_id = getattr(user, "id", user_id)
    
    resume = await service.upload_resume(
        user_id=actual_user_id,
        file_name=file.filename or "resume.pdf",
        file_bytes=file_bytes,
        user_email=user_email,
        job_description=job_description,
    )
    return {"message": "resume processed", "resume": model_to_dict(resume)}


@router.post("/resume/parse")
async def parse_resume(payload: ResumeParsePayload) -> Dict[str, Any]:
    parsed = resume_parser_service.build_profile_from_text(payload.resume_text)
    return {"parsed": parsed}


def _save_resume_insight(db, user_id: int, score: dict) -> None:
    """Background helper — saves ATS result to DB without blocking the response."""
    try:
        db["resume_insights"].insert_one({
            "user_id": user_id,
            "ats_score": score.get("ats_score", score.get("final_score", score.get("overall_score", 0))),
            "skills_match": score.get("matched_keywords", score.get("skills_match", [])),
            "missing_keywords": score.get("missing_keywords", []),
            "breakdown": score.get("breakdown", score.get("score_breakdown", {"skills": 0, "experience": 0, "education": 0}))
        })
    except Exception as exc:
        log.warning("Failed to save resume insights: %s", exc)


@router.post("/ats/resume")
async def run_resume_ats(
    background_tasks: BackgroundTasks,
    payload: ATSResumePayload,
    user=Depends(get_current_user_db),
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    # Step 1 — Deterministic ATS score via centralized service
    score = ats_service.score_resume(
        {
            "resume_text": payload.resume_text,
            "skills": payload.skills,
            "experience_years": payload.experience_years,
            "projects": payload.projects,
            "education": payload.education,
        }
    )

    # Step 2 — LLM call runs in thread-pool so it never blocks the event loop
    feedback_prompt = f"{ATS_FEEDBACK_PROMPT}\n\nATS_RESULT: {score}"
    loop = asyncio.get_event_loop()
    try:
        enhanced = await asyncio.wait_for(
            loop.run_in_executor(
                _llm_executor,
                lambda: llm_service.generate_with_fallback(
                    feedback_prompt,
                    user_id=getattr(user, "id", None),
                    request_type="jobseeker_resume_ats",
                    request_payload={
                        "skills": payload.skills[:30],
                        "experience_years": payload.experience_years,
                    },
                ),
            ),
            timeout=10,
        )
    except asyncio.TimeoutError:
        enhanced = {"result": None, "queued": False, "queue_id": None,
                    "error_code": 408, "error_message": "LLM timed out", "attempted_models": []}
    except Exception as exc:
        enhanced = {"result": None, "queued": False, "queue_id": None,
                    "error_code": 500, "error_message": str(exc), "attempted_models": []}

    score["llm_enhanced_feedback"] = enhanced.get("result")
    score["queued"] = enhanced.get("queued", False)
    score["queue_id"] = enhanced.get("queue_id")
    score["error_code"] = enhanced.get("error_code")
    score["error_message"] = enhanced.get("error_message")
    score["attempted_models"] = enhanced.get("attempted_models", [])

    # Step 3 — DB write runs AFTER response is sent
    if getattr(user, "id", None):
        background_tasks.add_task(_save_resume_insight, service.db, int(user.id), score)

    return score


@router.post("/ats/jd")
async def run_jd_ats(
    background_tasks: BackgroundTasks,
    payload: ATSJDPayload,
    user=Depends(get_current_user_db),
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    # Full JD match pipeline via centralized service (ATS + Semantic + LLM)
    result = await jd_match_service.match_with_llm(
        resume_data={"parsed_text": payload.resume_text},
        jd_data={"description": payload.job_description},
        user_id=getattr(user, "id", None),
        llm_timeout=10,
    )

    # DB write runs AFTER response is sent
    if getattr(user, "id", None):
        background_tasks.add_task(_save_resume_insight, service.db, int(user.id), result)

    return result


@router.post("/jobs/{job_id}/match")
async def match_with_specific_job(
    job_id: int,
    user=Depends(get_current_user_db),
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    """
    Roadmap Step 16: Targeted JD Match API.
    Fetches user's latest resume and matches against a specific job_id.
    """
    # 1. Get job description
    from modules.employer.service import get_employer_service
    emp_service = get_employer_service(service.db)
    job = emp_service.get_job_posting(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # 2. Get user resume
    profile = service.get_profile(user.id)
    if not profile or not profile.resume_data:
        raise HTTPException(status_code=400, detail="Please upload a resume first")

    # 3. Match
    result = await jd_match_service.match_with_llm(
        resume_data=profile.resume_data,
        jd_data={
            "required_skills": job.required_skills,
            "description": job.description,
            "required_experience_years": job.min_experience
        },
        user_id=user.id
    )
    return result


@router.get("/resume-insights")
async def get_resume_insights(
    user=Depends(get_current_user_db),
    service: JobSeekerService = Depends(get_jobseeker_service)
) -> Dict[str, Any]:
    user_id = int(getattr(user, "id", 0))
    # Fetch from db
    collection = service.db["resume_insights"]
    record = collection.find_one({"user_id": user_id}, sort=[("id", -1)])
    if not record:
        # Fallback dummy data if nothing exists
        return {
            "ats_score": 0,
            "skills_match": [],
            "missing_keywords": [],
            "breakdown": {"skills": 0, "experience": 0, "education": 0}
        }
    
    return {
        "ats_score": record.get("ats_score", 0),
        "skills_match": record.get("skills_match", []),
        "missing_keywords": record.get("missing_keywords", []),
        "breakdown": record.get("breakdown", {"skills": 0, "experience": 0, "education": 0})
    }

@router.get("/recommendations/{user_id}")
async def get_recommendations(
    user_id: int,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    """Get dynamic job recommendations based on profile and AI resume insights."""
    try:
        # 1. Load user profile and latest resume insights
        profile = service.get_profile(user_id)
        user_skills = set(getattr(profile, "skills", [])) if profile else set()
        
        # Merge in AI-extracted skills from their latest resume upload
        try:
            insight = service.db["resume_insights"].find_one(
                {"user_id": user_id}, 
                sort=[("_id", -1)]
            )
            if insight and insight.get("skills_match"):
                user_skills.update([s.lower() for s in insight.get("skills_match", [])])
        except Exception as e:
            log.warning(f"Could not load resume insights for recommendations: {e}")
            
        # Convert all to lowercase for case-insensitive matching
        user_skills_lower = {s.lower() for s in user_skills}
        
        # 2. Load jobs from JSON
        jobs_path = Path(__file__).resolve().parents[3] / "database" / "jobs" / "jobs.json"
        if not jobs_path.exists():
            return {"recommendations": []}
            
        with open(jobs_path, "r", encoding="utf-8") as f:
            all_jobs = json.load(f)
            
        # 3. Dynamic matching logic against all jobs
        scored_jobs = []
        for job in all_jobs:
            job_tags_raw = job.get("tags", [])
            job_tags_lower = {t.lower() for t in job_tags_raw}
            
            # Intersection & Difference
            matched_tags = job_tags_lower.intersection(user_skills_lower)
            missing_tags = job_tags_lower - user_skills_lower
            
            # Map back to original case for display
            display_matched = [t for t in job_tags_raw if t.lower() in matched_tags]
            display_missing = [t for t in job_tags_raw if t.lower() in missing_tags]
            
            match_count = len(matched_tags)
            
            # Base score logic: 60% if no skills match, +6% per matching skill
            score = min(98, 60 + (match_count * 6)) if user_skills_lower else job.get("matchScore", 60)
            
            scored_jobs.append({
                "id": job.get("id"),
                "title": job.get("title"),
                "company": job.get("company"),
                "location": job.get("location"),
                "matchScore": score,
                "salary": job.get("salary", "Competitive"),
                "type": job.get("type", "Full-time"),
                "postedTime": job.get("postedTime", "2D AGO"),
                "tags": job_tags_raw,
                "matched": display_matched,
                "missing": display_missing
            })
        
        # 4. Sort by match score and return exactly TOP 5 as requested
        scored_jobs.sort(key=lambda x: x["matchScore"], reverse=True)
        top_5_recommendations = scored_jobs[:5]
        
        return {"recommendations": top_5_recommendations}
        
    except Exception as e:
        log.error(f"Error getting recommendations: {e}")
        return {"recommendations": []}


@router.post("/applications")
async def apply_job(
    payload: ApplyPayload,
    service: JobSeekerService = Depends(get_jobseeker_service),
    user=Depends(get_current_user_db)
) -> Dict[str, Any]:
    try:
        application = await service.apply_for_job(getattr(user, "id"), payload.job_id)
        return {"message": "application created", "application": application if isinstance(application, dict) else model_to_dict(application)}
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/apply-job")
async def apply_job_alias(
    payload: ApplyPayload,
    service: JobSeekerService = Depends(get_jobseeker_service),
    user=Depends(get_current_user_db)
) -> Dict[str, Any]:
    try:
        application = await service.apply_for_job(getattr(user, "id"), payload.job_id)
        return {"message": "application created", "application": application if isinstance(application, dict) else model_to_dict(application)}
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/applications/{user_id}")
async def list_applications(
    user_id: int,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    return {"applications": models_to_dict(service.list_applications(user_id))}


@router.get("/verify/{user_id}")
async def verify_candidate_projects(
    user_id: int,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    profile = service.get_profile(user_id)
    github_url = profile.github_url if profile else None
    portfolio_url = profile.portfolio_url if profile else None
    return service.verify_projects(github_url=github_url, portfolio_url=portfolio_url)


@router.get("/insights/{user_id}")
async def get_insights(user_id: int, service: JobSeekerService = Depends(get_jobseeker_service)) -> Dict[str, Any]:
    return {"insights": service.get_insights(user_id)}


@router.get("/learning/{user_id}")
async def get_learning_recommendations(
    user_id: int,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    return {"learning": service.get_learning_recommendations(user_id)}


@router.get("/notifications/{user_id}")
async def get_notifications(
    user_id: int,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    return {"notifications": service.get_notifications(user_id)}


@router.get("/bookmarks/{user_id}")
async def list_bookmarks(
    user_id: int,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    return {"bookmarks": service.list_bookmarks(user_id)}


@router.post("/bookmarks/toggle")
async def toggle_bookmark(
    payload: ToggleBookmarkPayload,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    bookmarks = service.toggle_bookmark(payload.user_id, payload.job_id)
    return {"message": "bookmark updated", "bookmarks": bookmarks}


@router.post("/verify-certificate")
async def verify_certificate(
    payload: CertificateVerifyPayload,
    user=Depends(get_current_user_db),
) -> Dict[str, Any]:
    """
    3-layer certificate verification:
      Layer 1 — Issuer API validation (Coursera, HackerRank, Credly, Udemy)
      Layer 2 — Image EXIF tamper analysis (Pillow)
      Layer 3 — Auto-queue to admin if suspicious
    """
    verifier = CertificateVerifier()
    result = verifier.verify(
        cert_name=payload.cert_name,
        issuer=payload.issuer,
        credential_id=payload.credential_id,
        user_id=payload.user_id,
        user_email=payload.user_email or getattr(user, "email", None),
        user_name=payload.user_name or f"{getattr(user, 'first_name', '')} {getattr(user, 'last_name', '')}".strip(),
    )
    return result


@router.get("/search-history/{user_id}")
async def list_search_history(
    user_id: int,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    return {"history": service.list_search_history(user_id)}


@router.post("/search-history")
async def add_search_history(
    payload: SearchHistoryPayload,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    history = service.add_search_history(payload.user_id, payload.query)
    return {"message": "history updated", "history": history}
@router.get("/resume/{resume_id}/download")
async def download_resume(
    resume_id: int,
    user=Depends(get_current_user_db),
    service: JobSeekerService = Depends(get_jobseeker_service),
):
    from fastapi.responses import FileResponse
    resume = service.db["resumes"].find_one({"id": resume_id, "user_id": user.id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    file_path = resume.get("stored_path")
    if not file_path or not Path(file_path).exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(
        path=file_path,
        filename=resume.get("file_name", "resume.pdf"),
        media_type="application/pdf"
    )

@router.delete("/resume/{resume_id}")
async def delete_resume(
    resume_id: int,
    user=Depends(get_current_user_db),
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    success = service.delete_resume(user.id, resume_id)
    if not success:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"message": "Resume deleted successfully"}

@router.get("/jobs")
async def list_jobs(
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    """Fetch jobs from the local JSON database."""
    try:
        jobs_path = Path(__file__).resolve().parents[3] / "database" / "jobs" / "jobs.json"
        if not jobs_path.exists():
            return {"jobs": []}
        
        with open(jobs_path, "r", encoding="utf-8") as f:
            jobs = json.load(f)
        
        return {"jobs": jobs}
    except Exception as e:
        log.error(f"Error loading jobs: {e}")
        return {"jobs": []}
