from typing import Any, Dict

from fastapi import APIRouter, Depends

from core.serialization import models_to_dict
from modules.admin.monitoring import system_health_snapshot
from modules.admin.service import AdminService, get_admin_service


router = APIRouter()


@router.get("/users")
async def list_users(service: AdminService = Depends(get_admin_service)) -> Dict[str, Any]:
    return {"users": models_to_dict(service.list_users())}


@router.get("/companies")
async def list_companies(service: AdminService = Depends(get_admin_service)) -> Dict[str, Any]:
    return {"companies": models_to_dict(service.list_companies())}


@router.get("/jobs")
async def list_jobs(service: AdminService = Depends(get_admin_service)) -> Dict[str, Any]:
    return {"jobs": models_to_dict(service.list_jobs())}


@router.get("/logs")
async def list_logs(service: AdminService = Depends(get_admin_service)) -> Dict[str, Any]:
    return {"logs": service.get_system_logs()}


@router.get("/dashboard")
async def dashboard(service: AdminService = Depends(get_admin_service)) -> Dict[str, Any]:
    return {"metrics": service.dashboard_metrics()}


@router.get("/monitoring/health")
async def monitoring_health() -> Dict[str, Any]:
    return system_health_snapshot()
