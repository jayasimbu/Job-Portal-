import json
import asyncio

from fastapi import FastAPI
from fastapi import Request
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.routing import APIRoute
from fastapi.responses import JSONResponse
import uvicorn
from starlette.responses import Response

from core.api_response import normalize_error_payload, normalize_success_payload
from core.config import settings
from core.database import create_db_and_tables
from ai_engine.routes import router as ai_router
from modules.admin.routes import router as admin_router
from modules.auth.routes import router as auth_router
from modules.employer.routes import router as employer_router
from modules.jobseeker.routes import router as jobseeker_router
from modules.jobseeker.job_fetcher import router as crawler_router
from modules.jobseeker.project_verifier import router as verifier_router
from modules.certificates.routes import router as certificates_router


from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    create_db_and_tables()
    yield

app = FastAPI(
    title="AI Job Portal API",
    description="AI-powered hiring platform with ATS scoring, ranking, and recommendations",
    version="1.0.0",
    lifespan=lifespan
)


class StandardizedAPIRoute(APIRoute):
    def get_route_handler(self):
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            response: Response = await original_route_handler(request)

            if not isinstance(response, JSONResponse):
                return response

            try:
                raw_body = response.body.decode("utf-8") if response.body else "null"
                payload = json.loads(raw_body)
            except Exception:
                return response

            if isinstance(payload, dict) and payload.get("success") is False:
                error_details = normalize_error_payload(payload.get("error") or payload.get("message") or payload, response.status_code)
                return JSONResponse(
                    status_code=response.status_code,
                    content={
                        "success": False,
                        "message": error_details["message"],
                        "error": error_details["error"],
                    },
                    headers={k: v for k, v in response.headers.items() if k.lower() != "content-length"},
                )

            if response.status_code >= 400:
                if isinstance(payload, dict) and {"success", "message", "error"}.issubset(payload.keys()):
                    return response
                if isinstance(payload, dict):
                    error_details = normalize_error_payload(payload.get("error") or payload.get("message") or payload, response.status_code)
                else:
                    error_details = normalize_error_payload(payload, response.status_code)
                return JSONResponse(
                    status_code=response.status_code,
                    content={
                        "success": False,
                        "message": error_details["message"],
                        "error": error_details["error"],
                    },
                    headers={k: v for k, v in response.headers.items() if k.lower() != "content-length"},
                )

            envelope = normalize_success_payload(payload)
            return JSONResponse(
                status_code=response.status_code,
                content=envelope,
                headers={k: v for k, v in response.headers.items() if k.lower() != "content-length"},
            )

        return custom_route_handler


app.router.route_class = StandardizedAPIRoute

_request_semaphore = asyncio.Semaphore(max(1, int(settings.MAX_CONCURRENT_REQUESTS)))


# @app.middleware("http")
# async def concurrency_guard(request: Request, call_next):
#     """Bound in-flight requests so one hot endpoint cannot starve the whole API."""
#     try:
#         await asyncio.wait_for(_request_semaphore.acquire(), timeout=max(0.1, float(settings.REQUEST_QUEUE_WAIT_SECONDS)))
#     except asyncio.TimeoutError:
#         return JSONResponse(
#             status_code=503,
#             content={
#                 "success": False,
#                 "message": "Server is handling high traffic. Please retry shortly.",
#                 "error": "BACKEND_BUSY",
#             },
#         )
# 
#     try:
#         return await call_next(request)
#     finally:
#         _request_semaphore.release()


if settings.ENABLE_GZIP:
    app.add_middleware(GZipMiddleware, minimum_size=max(256, int(settings.GZIP_MIN_SIZE)))

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from modules.mcp.routes import router as mcp_router

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(jobseeker_router, prefix="/api/jobseeker", tags=["jobseeker"])
app.include_router(employer_router, prefix="/api/employer", tags=["employer"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(ai_router, prefix="/api/ai", tags=["ai"])
app.include_router(certificates_router, prefix="/api/certificates", tags=["certificates"])
app.include_router(mcp_router, prefix="/api/mcp", tags=["mcp"])
app.include_router(crawler_router, tags=["External Jobs"])
app.include_router(verifier_router, tags=["Project Verification"])


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    error_details = normalize_error_payload(exc.detail, exc.status_code)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": error_details["message"],
            "error": error_details["error"],
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation failed",
            "error": "VALIDATION_ERROR",
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception):
    message = str(exc) if settings.DEBUG else "Internal server error"
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": message,
            "error": "INTERNAL_SERVER_ERROR",
        },
    )


@app.get("/api/health")
async def health_check() -> dict:
    return {"status": "healthy", "service": "ai-job-portal"}


# ... lifespan handled by wrapper or defined above


if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
