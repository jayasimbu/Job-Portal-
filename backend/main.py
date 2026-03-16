from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from core.config import settings
from core.database import create_db_and_tables
from modules.admin.routes import router as admin_router
from modules.auth.routes import router as auth_router
from modules.employer.routes import router as employer_router
from modules.jobseeker.routes import router as jobseeker_router


app = FastAPI(
    title="AI Job Portal API",
    description="AI-powered hiring platform with ATS scoring, ranking, and recommendations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(jobseeker_router, prefix="/api/jobseeker", tags=["jobseeker"])
app.include_router(employer_router, prefix="/api/employer", tags=["employer"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])


@app.get("/api/health")
async def health_check() -> dict:
    return {"status": "healthy", "service": "ai-job-portal"}


@app.on_event("startup")
async def on_startup() -> None:
    create_db_and_tables()


if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
