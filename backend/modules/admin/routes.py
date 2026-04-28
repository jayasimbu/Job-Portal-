"""
backend/modules/admin/routes.py — Full Admin API Routes
"""
from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from .service import AdminService, get_admin_service
from core.security import verify_access_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ── Auth helpers ──────────────────────────────────────────────────────────────

def _require_admin(token: str = Depends(oauth2_scheme)) -> dict:
    data = verify_access_token(token)
    if not data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if data.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return data


# ── Request Bodies ─────────────────────────────────────────────────────────────

class UpdateRoleRequest(BaseModel):
    role: str

class UpdateStatusRequest(BaseModel):
    is_active: bool

class VerifyCompanyRequest(BaseModel):
    approve: bool

class VerificationActionRequest(BaseModel):
    action: str       # "approved" | "rejected" | "flagged"
    notes: Optional[str] = None


# ── Dashboard ─────────────────────────────────────────────────────────────────

@router.get("/dashboard")
async def get_dashboard(
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """Admin dashboard with aggregated system statistics."""
    return service.get_dashboard_stats()


# ── Analytics ─────────────────────────────────────────────────────────────────

@router.get("/analytics")
async def get_analytics(
    days: int = Query(30, ge=1, le=90),
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """Time-series analytics: user growth, application pipeline, top job titles."""
    return service.get_analytics(days=days)


# ── User Management ────────────────────────────────────────────────────────────

@router.get("/users")
async def list_users(
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """List all users with pagination and optional filters."""
    return service.get_all_users(role=role, status=status, search=search, page=page, page_size=page_size)


@router.get("/users/{user_id}")
async def get_user(
    user_id: int,
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """Retrieve a single user by ID."""
    user = service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    payload: UpdateRoleRequest,
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """Change a user's role (jobseeker ↔ employer ↔ admin)."""
    allowed = {"jobseeker", "employer", "admin"}
    if payload.role not in allowed:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {allowed}")
    ok = service.update_user_role(user_id, payload.role, admin_data["user_id"])
    if not ok:
        raise HTTPException(status_code=404, detail="User not found or no change made")
    return {"message": f"Role updated to {payload.role}"}


@router.put("/users/{user_id}/status")
async def set_user_status(
    user_id: int,
    payload: UpdateStatusRequest,
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """Activate or deactivate (ban) a user account."""
    ok = service.set_user_status(user_id, payload.is_active, admin_data["user_id"])
    if not ok:
        raise HTTPException(status_code=404, detail="User not found or no change made")
    status_str = "activated" if payload.is_active else "deactivated"
    return {"message": f"User {status_str} successfully"}


# ── Company Management ─────────────────────────────────────────────────────────

@router.get("/companies")
async def list_companies(
    verified: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """List all employer company profiles with optional filters."""
    return service.get_all_companies(verified=verified, search=search, page=page, page_size=page_size)


@router.put("/companies/{company_id}/verify")
async def verify_company(
    company_id: str,
    payload: VerifyCompanyRequest,
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """Verify or reject a company profile."""
    ok = service.verify_company(company_id, admin_data["user_id"], payload.approve)
    if not ok:
        raise HTTPException(status_code=404, detail="Company not found")
    action = "verified" if payload.approve else "rejected"
    return {"message": f"Company {action}"}


# ── Verification Queue ─────────────────────────────────────────────────────────

@router.get("/resumes/queue")
async def get_verification_queue(
    status: str = Query("pending"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """
    List resume / certificate verification queue items.
    status: "pending" | "approved" | "rejected" | "flagged" | "all"
    """
    return service.get_verification_queue(status=status, page=page, page_size=page_size)


@router.put("/resumes/{item_id}/review")
async def review_verification_item(
    item_id: str,
    payload: VerificationActionRequest,
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """
    Approve, reject, or flag a resume/certificate verification request.
    action: "approved" | "rejected" | "flagged"
    """
    valid_actions = {"approved", "rejected", "flagged"}
    if payload.action not in valid_actions:
        raise HTTPException(status_code=400, detail=f"Action must be one of: {valid_actions}")
    ok = service.mark_verification_result(item_id, payload.action, admin_data["user_id"], payload.notes)
    if not ok:
        raise HTTPException(status_code=404, detail="Verification item not found")
    return {"message": f"Item {payload.action}"}


# Keep backward-compatible aliases used by older stitch frontend code
@router.put("/resumes/{item_id}/mark-verified")
async def mark_verified_alias(
    item_id: str,
    notes: Optional[str] = None,
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    service.mark_verification_result(item_id, "approved", admin_data["user_id"], notes)
    return {"message": "Marked as verified"}


@router.put("/resumes/{item_id}/mark-flagged")
async def mark_flagged_alias(
    item_id: str,
    notes: Optional[str] = None,
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    service.mark_verification_result(item_id, "flagged", admin_data["user_id"], notes)
    return {"message": "Marked as flagged"}


# ── System Logs ────────────────────────────────────────────────────────────────

@router.get("/logs")
async def get_system_logs(
    level: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """Retrieve paginated system logs with optional level/category filters."""
    return service.get_system_logs(level=level, category=category, page=page, page_size=page_size)


# ── Health ─────────────────────────────────────────────────────────────────────

@router.get("/health")
async def admin_health(
    admin_data: dict = Depends(_require_admin),
    service: AdminService = Depends(get_admin_service),
):
    """Returns system health indicators (DB, Ollama, API)."""
    stats = service.get_dashboard_stats()
    return stats.get("system_health", {"api": True})
