from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from core.security import get_current_user_db
from core.database import get_db
from modules.jobseeker.service import JobSeekerService
from .service import MCPService
from .notifier.job_alerts import run_daily_alerts

router = APIRouter(tags=["MCP"])

class FeedbackPayload(BaseModel):
    jobId: str
    action: str  # "click" | "apply" | "ignore"


class NotificationReadPayload(BaseModel):
    notification_ids: list[str] = []


class RecruiterMatchPayload(BaseModel):
    job_id: int
    limit: int = 10

@router.get("/status")
async def mcp_status(user=Depends(get_current_user_db), db=Depends(get_db)):
    user_id = getattr(user, "id", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="User ID not found in session")
        
    svc = MCPService(db, JobSeekerService(db))
    return svc.get_status(user_id)

@router.post("/run")
async def mcp_run(user=Depends(get_current_user_db), db=Depends(get_db)):
    user_id = getattr(user, "id", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    svc = MCPService(db, JobSeekerService(db))
    try:
        return svc.run_pipeline(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MCP Pipeline Error: {str(e)}")


@router.get("/jobs")
async def mcp_jobs(type: str = "recommended", user=Depends(get_current_user_db), db=Depends(get_db)):
    user_id = getattr(user, "id", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    svc = MCPService(db, JobSeekerService(db))
    return svc.get_job_feed(user_id, feed_type=type)


@router.get("/notifications")
async def mcp_notifications(user=Depends(get_current_user_db), db=Depends(get_db)):
    user_id = getattr(user, "id", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    svc = MCPService(db, JobSeekerService(db))
    return svc.list_notifications(user_id)


@router.post("/notifications/read")
async def mcp_notifications_read(payload: NotificationReadPayload, user=Depends(get_current_user_db), db=Depends(get_db)):
    user_id = getattr(user, "id", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    svc = MCPService(db, JobSeekerService(db))
    return svc.mark_notifications_read(user_id, payload.notification_ids)


@router.post("/recruiter/match")
async def recruiter_match(payload: RecruiterMatchPayload, user=Depends(get_current_user_db), db=Depends(get_db)):
    role = getattr(user, "role", "")
    if role not in {"employer", "admin"}:
        raise HTTPException(status_code=403, detail="Recruiter matching is available for employers and admins only")

    svc = MCPService(db, JobSeekerService(db))
    try:
        return svc.match_candidates(payload.job_id, limit=max(1, min(25, payload.limit)))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.post("/alerts/run")
async def run_alerts(user=Depends(get_current_user_db), db=Depends(get_db)):
    role = getattr(user, "role", "")
    if role not in {"jobseeker", "employer", "admin"}:
        raise HTTPException(status_code=403, detail="Invalid session")
    return run_daily_alerts(db)

@router.post("/feedback")
async def mcp_feedback(payload: FeedbackPayload, user=Depends(get_current_user_db), db=Depends(get_db)):
    user_id = getattr(user, "id", None)
    if user_id is None:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    if payload.action not in ("click", "apply", "ignore"):
        raise HTTPException(status_code=400, detail="Action must be 'click', 'apply', or 'ignore'")

    db["user_interactions"].insert_one({
        "userId": int(user_id),
        "jobId": payload.jobId,
        "action": payload.action,
        "timestamp": datetime.utcnow().isoformat()
    })
    return {"status": "ok", "message": f"Feedback '{payload.action}' recorded for job {payload.jobId}"}
