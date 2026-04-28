import uvicorn
import requests
import subprocess
import time
import asyncio
from urllib.parse import urlparse
from contextlib import asynccontextmanager
from fastapi import FastAPI

from ai_engine.queue_worker import start_queue_worker, stop_queue_worker
from core.config import settings
from main import app
from core.database import mongo_healthcheck, create_db_and_tables

_ollama_process = None

def _is_local_ollama_target(base_url: str) -> bool:
    host = (urlparse(base_url).hostname or "").lower()
    return host in {"localhost", "127.0.0.1", "::1"}

def _is_ollama_reachable(base_url: str) -> bool:
    try:
        response = requests.get(f"{base_url.rstrip('/')}/api/tags", timeout=2)
        response.raise_for_status()
        return True
    except Exception:
        return False

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("[BACKEND] Running startup tasks...")
    try:
        create_db_and_tables() # Ensure DB indexes are created
    except Exception as e:
        print(f"[DATABASE] Error during initialization: {e}")
        
    await _ensure_ollama_started()
    start_queue_worker()
    print("[BACKEND] Startup complete. Queue worker active.")
    yield
    # Shutdown logic
    global _ollama_process
    stop_queue_worker()
    if _ollama_process is not None and _ollama_process.poll() is None:
        _ollama_process.terminate()
    _ollama_process = None

async def _ensure_ollama_started() -> None:
    global _ollama_process

    if not settings.OLLAMA_AUTOSTART:
        return

    configured_urls = settings.get_ollama_base_urls()
    for candidate in configured_urls:
        if _is_ollama_reachable(candidate):
            return

    local_url = "http://localhost:11434"
    if _is_ollama_reachable(local_url):
        return

    print("[OLLAMA] Attempting to start local Ollama server...")
    try:
        _ollama_process = subprocess.Popen(
            ["ollama", "serve"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except Exception as e:
        print(f"[OLLAMA] Failed to start: {e}")
        _ollama_process = None
        return

    deadline = time.time() + max(1, int(settings.OLLAMA_STARTUP_TIMEOUT_SECONDS))
    while time.time() < deadline:
        if _is_ollama_reachable(local_url):
            print("[OLLAMA] Local server reachable.")
            break
        await asyncio.sleep(0.5)

# Attach lifespan to the existing app from main
app.router.lifespan_context = lifespan

@app.get("/health")
def detailed_health():
    db_status = "ok"
    ollama_status = "ok"

    if not mongo_healthcheck():
        db_status = "error"

    try:
        requests.get(f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/tags", timeout=2)
    except Exception:
        ollama_status = "unreachable"

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "db": db_status,
        "ollama": ollama_status,
        "service": settings.PROJECT_NAME,
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
