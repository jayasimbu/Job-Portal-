from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from core.serialization import model_to_dict, models_to_dict
from modules.employer.service import EmployerService, get_employer_service


class CompanyPayload(BaseModel):
    company_name: str
    website: Optional[str] = None
    description: Optional[str] = None


class JobPayload(BaseModel):
    employer_id: int
    title: str
    description: str
    required_skills: List[str] = Field(default_factory=list)
    min_experience: float = 0
    education_required: Optional[str] = None
    location: Optional[str] = None
    employment_type: str = "full_time"


class CandidateStatusPayload(BaseModel):
    application_id: int
    status: str


class InterviewPayload(BaseModel):
    job_id: int
    candidate_name: str
    role_title: str
    date: str
    time: str


class HiringPolicyPayload(BaseModel):
    employer_id: int
    skill_only_evaluation: bool = True
    hide_sensitive_attributes: bool = True
    bias_monitoring_enabled: bool = True


router = APIRouter()


@router.put("/company/{user_id}")
async def upsert_company(
    user_id: int,
    payload: CompanyPayload,
    service: EmployerService = Depends(get_employer_service),
) -> Dict[str, Any]:
    profile = service.upsert_company_profile(user_id, payload.dict())
    return {"message": "company profile updated", "profile": model_to_dict(profile)}


@router.post("/jobs")
async def create_job(payload: JobPayload, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    posting = service.create_job_posting(payload.dict())
    return {"message": "job created", "job": model_to_dict(posting)}


@router.get("/jobs/{employer_id}")
async def list_jobs(employer_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    return {"jobs": models_to_dict(service.list_job_postings(employer_id))}


@router.get("/jobs/{job_id}/ranked-candidates")
async def ranked_candidates(job_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    ranking = service.rank_applicants(job_id)
    return {"job_id": job_id, "ranked_candidates": ranking}


@router.get("/analytics/{employer_id}")
async def analytics(employer_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    return {"analytics": service.analytics_summary(employer_id)}


@router.post("/candidates/status")
async def update_candidate_status(
    payload: CandidateStatusPayload,
    service: EmployerService = Depends(get_employer_service),
) -> Dict[str, Any]:
    app = service.update_candidate_status(payload.application_id, payload.status)
    return {"message": "candidate status updated", "application": model_to_dict(app) if app else None}


@router.get("/interviews/{employer_id}")
async def list_interviews(employer_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    return {"interviews": service.list_interviews(employer_id)}


@router.post("/interviews")
async def schedule_interview(payload: InterviewPayload, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    interviews = service.schedule_interview(payload.dict())
    return {"message": "interview scheduled", "interviews": interviews}


@router.get("/hiring-policy/{employer_id}")
async def get_hiring_policy(employer_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    return {"policy": service.get_hiring_policy(employer_id)}


@router.put("/hiring-policy")
async def save_hiring_policy(payload: HiringPolicyPayload, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    policy = service.save_hiring_policy(payload.dict())
    return {"message": "hiring policy updated", "policy": policy}
