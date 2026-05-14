from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from pathlib import Path
import json
from core.database import get_db

router = APIRouter()

class RecommendPayload(BaseModel):
    skills: List[str]

@router.get("/jobs")
async def get_jobs(db=Depends(get_db)):
    """Fetch all available job postings from MongoDB and fallback JSON."""
    # 1. MongoDB Jobs
    live_jobs = list(db["job_postings"].find({"active": True}, {"_id": 0}))
    
    # 2. JSON Jobs
    jobs_path = Path(__file__).resolve().parents[3] / "database" / "jobs" / "jobs.json"
    static_jobs = []
    if jobs_path.exists():
        with open(jobs_path, "r", encoding="utf-8") as f:
            static_jobs = json.load(f)
            
    return live_jobs + static_jobs

@router.post("/recommend")
async def recommend_jobs(payload: RecommendPayload, db=Depends(get_db)):
    """Recommend jobs based on provided skills across all sources."""
    # This is a simplified version of the logic in jobseeker/routes.py
    # but using the same unified data source
    all_jobs = list(db["job_postings"].find({"active": True}, {"_id": 0}))
    
    jobs_path = Path(__file__).resolve().parents[3] / "database" / "jobs" / "jobs.json"
    if jobs_path.exists():
        with open(jobs_path, "r", encoding="utf-8") as f:
            all_jobs.extend(json.load(f))
            
    # Simple matching for public recommendations
    results = []
    user_skills = {s.lower() for s in payload.skills}
    
    for job in all_jobs:
        tags = {t.lower() for t in job.get("tags", [])}
        match_count = len(tags.intersection(user_skills))
        score = 60 + (match_count * 5)
        results.append({**job, "matchScore": score})
        
    results.sort(key=lambda x: x["matchScore"], reverse=True)
    return results[:10]
