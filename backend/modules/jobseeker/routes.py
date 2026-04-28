from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, UploadFile, File, Form
from pydantic import BaseModel

from ai_engine.llm_service import llm_service
from ai_engine.prompts import ATS_FEEDBACK_PROMPT, JD_MATCH_EXPLANATION_PROMPT
from ai_engine.verification.certificate_verifier import CertificateVerifier
from core.security import get_current_user_db, require_roles
from core.serialization import model_to_dict, models_to_dict
from modules.jobseeker.ats_algorithm import score_job_description_ats, score_resume_ats
from modules.jobseeker.model import JobApplication
from modules.jobseeker.resume_auto_fill import build_profile_from_resume_text
from modules.jobseeker.service import JobSeekerService, get_jobseeker_service
import logging

log = logging.getLogger(__name__)

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
    projects: List[str] = []
    education: List[str] = []


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
    profile = service.upsert_profile(user_id, payload.model_dump())
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
    resume = service.upload_resume(
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
    
    # 1. Determine user email for folder
    user_email = getattr(user, "email", f"user_{user_id}@example.com")
    
    # 2. Create physical target directory: database/jobseeker/Files/<user_email>
    import os
    from pathlib import Path
    db_base = Path(__file__).resolve().parents[3] / "database" / "jobseeker" / "Files" / user_email
    db_base.mkdir(parents=True, exist_ok=True)
    
    # 3. Save physical file
    filename = file.filename or "resume.pdf"
    file_path = db_base / filename
    file_path.write_bytes(file_bytes)
    
    # 4. Extract text carefully using fitz (PyMuPDF) if PDF
    content = ""
    if filename.lower().endswith(".pdf"):
        try:
            import fitz
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            content = chr(10).join([page.get_text() for page in doc])
            doc.close()
        except Exception as e:
            content = file_bytes.decode("utf-8", errors="ignore")
    else:
        content = file_bytes.decode("utf-8", errors="ignore")

    actual_user_id = getattr(user, "id", user_id)
    resume = service.upload_resume(
        user_id=actual_user_id,
        file_name=filename,
        resume_text=content,
        job_description=job_description,
        file_path=str(file_path),
    )
    return {"message": "resume processed", "resume": model_to_dict(resume)}


@router.post("/resume/parse")
async def parse_resume(payload: ResumeParsePayload) -> Dict[str, Any]:
    parsed = build_profile_from_resume_text(payload.resume_text)
    return {"parsed": parsed}


@router.post("/ats/resume")
async def run_resume_ats(
    payload: ATSResumePayload, 
    user=Depends(get_current_user_db),
    service: JobSeekerService = Depends(get_jobseeker_service)
) -> Dict[str, Any]:
    score = score_resume_ats(
        {
            "resume_text": payload.resume_text,
            "skills": payload.skills,
            "experience_years": payload.experience_years,
            "projects": payload.projects,
            "education": payload.education,
        }
    )
    feedback_prompt = f"{ATS_FEEDBACK_PROMPT}\n\nATS_RESULT: {score}"
    enhanced = llm_service.generate_with_fallback(
        feedback_prompt,
        user_id=getattr(user, "id", None),
        request_type="jobseeker_resume_ats",
        request_payload={
            "skills": payload.skills[:30],
            "experience_years": payload.experience_years,
        },
    )
    score["llm_enhanced_feedback"] = enhanced.get("result")
    score["queued"] = enhanced.get("queued", False)
    score["queue_id"] = enhanced.get("queue_id")
    score["error_code"] = enhanced.get("error_code")
    score["error_message"] = enhanced.get("error_message")
    score["attempted_models"] = enhanced.get("attempted_models", [])
    
    # Save the ATS result
    if getattr(user, "id", None):
        try:
            # Use bracket access which works for both PyMongo and mock DBs
            collection = service.db["resume_insights"]
            collection.insert_one({
                "user_id": int(user.id),
                "ats_score": score.get("final_score", score.get("overall_score", 0)),
                "skills_match": score.get("skills_match", getattr(payload, "skills", [])),
                "missing_keywords": score.get("missing_keywords", []),
                "breakdown": score.get("breakdown", score.get("score_breakdown", {"skills": 0, "experience": 0, "education": 0}))
            })
        except Exception as e:
            log.warning(f"Failed to save resume insights: {e}")
        
    return score


@router.post("/ats/jd")
async def run_jd_ats(
    payload: ATSJDPayload, 
    user=Depends(get_current_user_db),
    service: JobSeekerService = Depends(get_jobseeker_service)
) -> Dict[str, Any]:
    score = score_job_description_ats(
        {"resume_text": payload.resume_text},
        {"job_description": payload.job_description},
    )
    explain_prompt = (
        f"{JD_MATCH_EXPLANATION_PROMPT}\n\n"
        f"SCORE: {score.get('final_score')}\n"
        f"MISSING_KEYWORDS: {score.get('missing_keywords', [])}"
    )
    enhanced = llm_service.generate_with_fallback(
        explain_prompt,
        user_id=getattr(user, "id", None),
        request_type="jobseeker_jd_ats",
        request_payload={
            "resume_text": payload.resume_text[:1200],
            "job_description": payload.job_description[:1200],
        },
    )
    score["llm_enhanced_feedback"] = enhanced.get("result")
    score["queued"] = enhanced.get("queued", False)
    score["queue_id"] = enhanced.get("queue_id")
    score["error_code"] = enhanced.get("error_code")
    score["error_message"] = enhanced.get("error_message")
    score["attempted_models"] = enhanced.get("attempted_models", [])
    
    # Save the ATS result
    if getattr(user, "id", None):
        try:
            collection = service.db["resume_insights"]
            collection.insert_one({
                "user_id": int(user.id),
                "ats_score": score.get("final_score", score.get("overall_score", 0)),
                "skills_match": score.get("skills_match", []),
                "missing_keywords": score.get("missing_keywords", []),
                "breakdown": score.get("breakdown", score.get("score_breakdown", {"skills": 0, "experience": 0, "education": 0}))
            })
        except Exception as e:
            log.warning(f"Failed to save resume insights: {e}")
        
    return score


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
    jobs = service.list_recommended_jobs(user_id)
    return {"recommendations": jobs}


@router.post("/applications")
async def apply_job(
    payload: ApplyPayload,
    service: JobSeekerService = Depends(get_jobseeker_service),
    user=Depends(get_current_user_db)
) -> Dict[str, Any]:
    try:
        application = service.apply_for_job(getattr(user, "id"), payload.job_id)
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
        application = service.apply_for_job(getattr(user, "id"), payload.job_id)
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
