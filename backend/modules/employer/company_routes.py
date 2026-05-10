from typing import Any, Dict, List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel

from core.security import require_roles, get_current_user_db
from core.database import get_database

# ── Public router (no auth — jobseekers can view company profiles) ────────────
public_router = APIRouter(prefix="/company", tags=["company"])

# ── Private router (employer-only) ────────────────────────────────────────────
private_router = APIRouter(
    prefix="/company",
    tags=["company"],
    dependencies=[Depends(require_roles("employer", "admin"))]
)


class CompanyUpdatePayload(BaseModel):
    company_name: str
    industry: Optional[str] = None
    company_size: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    founded_year: Optional[int] = None
    description: Optional[str] = None
    about: Optional[str] = None
    tagline: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    logo_url: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    social_links: Optional[Dict] = None


# ─────────────────────────────────────────────────────────────────────────────
# PUBLIC ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@public_router.get("/{employer_id}")
async def get_company_profile(employer_id: int) -> Dict[str, Any]:
    """Public company profile — viewable by jobseekers."""
    db = get_database()
    profile = db["company_profiles"].find_one({"employer_id": employer_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found.")
    profile["_id"] = str(profile["_id"])

    # Fetch active jobs for this employer
    jobs = list(db["job_postings"].find({"employer_id": employer_id, "active": True}))
    for j in jobs:
        j["_id"] = str(j.get("_id", ""))
    
    # Basic stats
    total_jobs = db["job_postings"].count_documents({"employer_id": employer_id})
    total_hires = db["job_applications"].count_documents({
        "employer_id": employer_id, "status": "hired"
    }) if "job_applications" in db.list_collection_names() else 0

    return {
        "company": profile,
        "jobs": jobs,
        "stats": {
            "active_jobs": len(jobs),
            "total_jobs": total_jobs,
            "total_hires": total_hires,
        }
    }


@public_router.get("/{employer_id}/jobs")
async def get_company_jobs(employer_id: int) -> Dict[str, Any]:
    """Public list of jobs for a company."""
    db = get_database()
    jobs = list(db["job_postings"].find({"employer_id": employer_id, "active": True}))
    for j in jobs:
        j["_id"] = str(j.get("_id", ""))
    return {"jobs": jobs, "count": len(jobs)}


# ─────────────────────────────────────────────────────────────────────────────
# PRIVATE ENDPOINTS (employer only)
# ─────────────────────────────────────────────────────────────────────────────

@private_router.get("/me/profile")
async def get_my_company(user=Depends(get_current_user_db)) -> Dict[str, Any]:
    """Get the current employer's company profile."""
    db = get_database()
    employer_id = getattr(user, "id")
    profile = db["company_profiles"].find_one({"employer_id": employer_id})
    if profile:
        profile["_id"] = str(profile["_id"])
    return {"company": profile or {}}


@private_router.put("/me/update")
async def update_company(
    payload: CompanyUpdatePayload,
    user=Depends(get_current_user_db)
) -> Dict[str, Any]:
    """Create or update the employer's company profile."""
    db = get_database()
    employer_id = getattr(user, "id")
    data = payload.model_dump(exclude_none=True)
    # Map frontend field names
    if "description" in data and "about" not in data:
        data["about"] = data.pop("description")
    if "social_links" not in data and ("linkedin" in data or "twitter" in data):
        data["social_links"] = {
            "linkedin": data.pop("linkedin", ""),
            "twitter": data.pop("twitter", ""),
        }
    else:
        data.pop("linkedin", None)
        data.pop("twitter", None)
    data["employer_id"] = employer_id
    data["updatedAt"] = datetime.utcnow().isoformat()

    db["company_profiles"].update_one(
        {"employer_id": employer_id},
        {"$set": data},
        upsert=True
    )
    profile = db["company_profiles"].find_one({"employer_id": employer_id})
    if profile:
        profile["_id"] = str(profile["_id"])
    return {"message": "Company profile updated successfully.", "company": profile}


@private_router.post("/me/upload-logo")
async def upload_logo(
    file: UploadFile = File(...),
    user=Depends(get_current_user_db)
) -> Dict[str, Any]:
    """Upload company logo."""
    import os
    from pathlib import Path
    employer_id = getattr(user, "id")
    file_bytes = await file.read()
    ext = (file.filename or "logo.png").split(".")[-1].lower()
    upload_dir = Path(__file__).resolve().parents[3] / "database" / "company_logos"
    upload_dir.mkdir(parents=True, exist_ok=True)
    logo_path = upload_dir / f"employer_{employer_id}.{ext}"
    logo_path.write_bytes(file_bytes)

    logo_url = f"/static/company_logos/employer_{employer_id}.{ext}"
    db = get_database()
    db["company_profiles"].update_one(
        {"employer_id": employer_id},
        {"$set": {"logo": logo_url, "employer_id": employer_id}},
        upsert=True
    )
    return {"message": "Logo uploaded.", "logo_url": logo_url}
