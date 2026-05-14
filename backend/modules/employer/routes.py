from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile

from pydantic import BaseModel, Field
import os
from pathlib import Path


from core.security import require_roles, get_current_user_db
from core.serialization import model_to_dict, models_to_dict
from modules.employer.service import EmployerService, get_employer_service


class CompanyPayload(BaseModel):
    company_name: str
    company_type: Optional[str] = None
    domain: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None
    location: Optional[str] = None
    size: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    hr_name: Optional[str] = None
    designation: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    preferred_skills: Optional[str] = None
    job_categories: Optional[str] = None
    hiring_mode: Optional[str] = None
    hiring_locations: Optional[str] = None
    hiring_frequency: Optional[str] = None



class JobPayload(BaseModel):
    employer_id: int
    title: str
    description: str
    required_skills: List[str] = Field(default_factory=list)
    experience_level: str = "Entry"
    min_experience: float = 0
    salary: Optional[str] = None
    education_required: Optional[str] = None
    location: Optional[str] = None
    job_type: str = "Full-time"


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


router = APIRouter(dependencies=[Depends(require_roles("employer", "admin"))])




@router.get("/company/{user_id}")
def get_company(
    user_id: int,
    service: EmployerService = Depends(get_employer_service),
) -> Dict[str, Any]:
    profile = service.profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"profile": model_to_dict(profile)}


@router.put("/company/{user_id}")

def upsert_company(
    user_id: int,
    payload: CompanyPayload,
    service: EmployerService = Depends(get_employer_service),
) -> Dict[str, Any]:
    profile = service.upsert_company_profile(user_id, payload.model_dump())
    return {"message": "company profile updated", "profile": model_to_dict(profile)}


@router.post("/company/logo/{user_id}")
async def upload_logo(
    user_id: int,
    file: UploadFile = File(...),
    service: EmployerService = Depends(get_employer_service),
) -> Dict[str, Any]:
    # Ensure it is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    # Save file
    file_ext = os.path.splitext(file.filename)[1] or ".png"
    # For simplicity, we use .png as extension or keep original
    filename = f"logo_{user_id}{file_ext}"
    
    # Define storage path
    storage_dir = Path(__file__).resolve().parents[3] / "database" / "employer" / "logos"
    storage_dir.mkdir(parents=True, exist_ok=True)
    file_path = storage_dir / filename
    
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    # Update profile in DB
    logo_url = f"/database/employer/logos/{filename}"
    service.save_company_logo(user_id, logo_url)
    
    return {"message": "logo uploaded", "logo_url": logo_url}



@router.post("/jobs")
async def create_job(
    payload: JobPayload, 
    service: EmployerService = Depends(get_employer_service),
    user=Depends(get_current_user_db)
) -> Dict[str, Any]:
    job_data = payload.model_dump()
    job_data['employer_id'] = getattr(user, 'id', payload.employer_id) 
    posting = service.create_job_posting(job_data)
    return {"message": "job created", "job": model_to_dict(posting)}


@router.get("/jobs/{employer_id}")
def list_jobs(employer_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    return {"jobs": models_to_dict(service.list_job_postings(employer_id))}



@router.get("/jobs")
async def list_jobs_alias(
    employer_id: int = Query(...),
    service: EmployerService = Depends(get_employer_service),
) -> Dict[str, Any]:
    return {"jobs": models_to_dict(service.list_job_postings(employer_id))}


@router.delete("/jobs/{job_id}")
async def delete_job(
    job_id: int,
    service: EmployerService = Depends(get_employer_service),
    user=Depends(get_current_user_db),
) -> Dict[str, Any]:
    employer_id = getattr(user, 'id', None)
    if not employer_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        deleted = service.delete_job_posting(job_id, employer_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"message": f"Job {job_id} deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.get("/jobs/{job_id}/ranked-candidates")
async def ranked_candidates(job_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    ranking = service.rank_applicants(job_id)
    return {"job_id": job_id, "ranked_candidates": ranking}


@router.get("/jobs/{job_id}/candidates")
async def ranked_candidates_alias(job_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    ranking = service.rank_applicants(job_id)
    return {"job_id": job_id, "ranked_candidates": ranking}


@router.get("/analytics/{employer_id}")
async def analytics(employer_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    return {"analytics": service.analytics_summary(employer_id)}


@router.get("/top-candidates/{employer_id}")
def top_candidates(employer_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    candidates = service.get_top_candidates(employer_id)
    return {"top_candidates": candidates}



@router.get("/all-candidates/{employer_id}")
def all_candidates(employer_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    candidates = service.get_all_applications(employer_id)
    return {"candidates": candidates}




@router.post("/candidates/status")
async def update_candidate_status(
    payload: CandidateStatusPayload,
    service: EmployerService = Depends(get_employer_service),
    user=Depends(get_current_user_db)
) -> Dict[str, Any]:
    try:
        app = service.update_candidate_status(payload.application_id, payload.status, getattr(user, 'id', None))
        return {"message": "candidate status updated", "application": model_to_dict(app) if app else None}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/applications/{application_id}/status")
async def update_application_status_dedicated(
    application_id: int,
    payload: dict,
    service: EmployerService = Depends(get_employer_service),
    user=Depends(get_current_user_db)
) -> Dict[str, Any]:
    status = payload.get("status")
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")
    try:
        app = service.update_candidate_status(application_id, status, getattr(user, 'id', None))
        return {"message": f"candidate {status} successfully", "application": model_to_dict(app) if app else None}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/candidates/{application_id}/shortlist")
async def shortlist_candidate_alias(
    application_id: int,
    service: EmployerService = Depends(get_employer_service),
) -> Dict[str, Any]:
    app = service.update_candidate_status(application_id, "shortlisted")
    return {"message": "candidate shortlisted", "application": model_to_dict(app) if app else None}


@router.get("/interviews/{employer_id}")
async def list_interviews(employer_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    return {"interviews": service.list_interviews(employer_id)}


@router.post("/interviews")
async def schedule_interview(payload: InterviewPayload, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    interviews = service.schedule_interview(payload.model_dump())
    return {"message": "interview scheduled", "interviews": interviews}


@router.get("/hiring-policy/{employer_id}")
async def get_hiring_policy(employer_id: int, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    return {"policy": service.get_hiring_policy(employer_id)}


@router.put("/hiring-policy")
async def save_hiring_policy(payload: HiringPolicyPayload, service: EmployerService = Depends(get_employer_service)) -> Dict[str, Any]:
    policy = service.save_hiring_policy(payload.model_dump())
    return {"message": "hiring policy updated", "policy": policy}


# ── Recruiter Notes ──────────────────────────────────────────────────────────

class RecruiterNotePayload(BaseModel):
    text: str

@router.get("/candidates/{application_id}/notes")
async def get_notes(
    application_id: int,
    service: EmployerService = Depends(get_employer_service),
    user=Depends(get_current_user_db)
) -> Dict[str, Any]:
    notes = service.get_recruiter_notes(application_id)
    return {"notes": notes}

@router.post("/candidates/{application_id}/notes")
async def add_note(
    application_id: int,
    payload: RecruiterNotePayload,
    service: EmployerService = Depends(get_employer_service),
    user=Depends(get_current_user_db)
) -> Dict[str, Any]:
    note = service.add_recruiter_note(application_id, payload.text, getattr(user, 'id', 0))
    return {"message": "note added", "note": note}


# ── Resume File Serving ──────────────────────────────────────────────────────

@router.get("/candidates/{user_id}/resume-file")
async def get_resume_file(
    user_id: int,
    service: EmployerService = Depends(get_employer_service),
    user=Depends(get_current_user_db)
) -> Any:
    from fastapi.responses import FileResponse
    file_path = service.get_resume_file_path(user_id)
    if not file_path:
        raise HTTPException(status_code=404, detail="Resume file not found")
    return FileResponse(file_path, media_type="application/pdf", filename=f"resume_{user_id}.pdf")
