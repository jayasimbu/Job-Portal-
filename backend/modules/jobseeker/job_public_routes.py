from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from core.database import get_db
from modules.jobseeker.ats_algorithm import match_jobs

router = APIRouter()

class RecommendPayload(BaseModel):
    skills: List[str]

@router.get("/jobs")
async def get_jobs(db=Depends(get_db)):
    """Fetch all available job postings."""
    jobs = list(db["job_postings"].find({}, {"_id": 0}))
    return jobs

@router.post("/recommend")
async def recommend_jobs(payload: RecommendPayload, db=Depends(get_db)):
    """Recommend jobs based on provided skills."""
    all_jobs = list(db["job_postings"].find())
    results = match_jobs({"skills": payload.skills}, all_jobs)
    # Return top 5-10 jobs as requested
    return results[:10]
