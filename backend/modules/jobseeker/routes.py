from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from core.serialization import model_to_dict, models_to_dict
from modules.jobseeker.model import JobApplication
from modules.jobseeker.service import JobSeekerService, get_jobseeker_service


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


class ApplyPayload(BaseModel):
    user_id: int
    job_id: int


router = APIRouter()


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
    profile = service.upsert_profile(user_id, payload.dict())
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


@router.get("/recommendations/{user_id}")
async def get_recommendations(
    user_id: int,
    service: JobSeekerService = Depends(get_jobseeker_service),
) -> Dict[str, Any]:
    jobs = service.list_recommended_jobs(user_id)
    return {"recommendations": jobs}


@router.post("/applications")
async def apply_job(payload: ApplyPayload, service: JobSeekerService = Depends(get_jobseeker_service)) -> Dict[str, Any]:
    application: JobApplication = service.apply_for_job(payload.user_id, payload.job_id)
    return {"message": "application created", "application": model_to_dict(application)}


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
