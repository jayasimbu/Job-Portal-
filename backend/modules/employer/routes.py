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
