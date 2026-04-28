try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseSettings
import os
from pathlib import Path
from typing import List


_BACKEND_DIR = Path(__file__).resolve().parent.parent
_APP_ENV_PROFILE = (os.getenv("APP_ENV_PROFILE", "local") or "local").strip().lower()
if _APP_ENV_PROFILE not in {"local", "server"}:
    _APP_ENV_PROFILE = "local"
_ENV_FILE_PATH = _BACKEND_DIR / f"{_APP_ENV_PROFILE}.env"

class Settings(BaseSettings):
    # Application settings
    PROJECT_NAME: str = "AI Job Portal"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server settings
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    MAX_CONCURRENT_REQUESTS: int = 1200
    REQUEST_QUEUE_WAIT_SECONDS: float = 1.5
    ENABLE_GZIP: bool = True
    GZIP_MIN_SIZE: int = 1024
    
    # MongoDB settings
    DATABASE_URL: str = os.getenv("MONGO_URL", os.getenv("DATABASE_URL", "mongodb://localhost:27017/careerauto"))
    
    # Security settings
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    GOOGLE_CLIENT_ID: str = ""

    # Frontend and CORS
    FRONTEND_URL: str = "http://localhost:5173"

    # Ollama settings (Ollama-only runtime policy)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_FALLBACK_BASE_URLS: str = ""
    OLLAMA_API_KEY: str = ""
    OLLAMA_REQUIRE_API_KEY_FOR_REMOTE: bool = True
    OLLAMA_MODEL: str = "qwen3-coder:latest"
    OLLAMA_MODEL_COUNT: int = 3
    OLLAMA_MAX_MODELS: int = 10
    OLLAMA_MODEL1: str = "qwen3-coder:latest"
    OLLAMA_MODEL2: str = ""
    OLLAMA_MODEL3: str = ""
    OLLAMA_MODEL4: str = ""
    OLLAMA_MODEL5: str = ""
    OLLAMA_MODEL6: str = ""
    OLLAMA_MODEL7: str = ""
    OLLAMA_MODEL8: str = ""
    OLLAMA_MODEL9: str = ""
    OLLAMA_MODEL10: str = ""
    OLLAMA_TIMEOUT: int = 60
    OLLAMA_AUTOSTART: bool = True
    OLLAMA_STARTUP_TIMEOUT_SECONDS: int = 8
    ALLOWED_OLLAMA_MODELS: List[str] = []

    # Queue settings for rate-limited model requests
    OLLAMA_QUEUE_ENABLED: bool = True
    OLLAMA_QUEUE_POLL_SECONDS: int = 30
    OLLAMA_QUEUE_MAX_RETRIES: int = 8
    OLLAMA_QUEUE_RETRY_COOLDOWN_SECONDS: int = 45
    OLLAMA_MAX_PARALLEL_REQUESTS: int = 32
    OLLAMA_HTTP_POOL_CONNECTIONS: int = 100
    OLLAMA_HTTP_POOL_MAXSIZE: int = 1000
    OLLAMA_QUEUE_MAX_PENDING_PER_USER: int = 20
    
    # SMTP Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""
    VERIFICATION_URL: str = "http://localhost:5173/auth/verify"
    RESET_PASSWORD_URL: str = "http://localhost:5173/auth/reset-password"
    
    # AI Engine settings
    AI_ENGINE_ENABLED: bool = True
    RESUME_PARSER_TIMEOUT: int = 30  # seconds

    def get_ollama_models(self) -> List[str]:
        raw_models: List[str] = []
        primary = (self.OLLAMA_MODEL or "").strip()
        if primary:
            raw_models.append(primary)

        model_count = max(0, min(int(self.OLLAMA_MODEL_COUNT), int(self.OLLAMA_MAX_MODELS)))
        for idx in range(1, model_count + 1):
            value = (getattr(self, f"OLLAMA_MODEL{idx}", "") or "").strip()
            if value:
                raw_models.append(value)

        deduped: List[str] = []
        seen = set()
        for model in raw_models:
            if model in seen:
                continue
            seen.add(model)
            deduped.append(model)

        if self.ALLOWED_OLLAMA_MODELS:
            allowed = set(self.ALLOWED_OLLAMA_MODELS)
            deduped = [model for model in deduped if model in allowed]

        return deduped

    def get_ollama_base_urls(self) -> List[str]:
        raw_urls: List[str] = []
        primary = (self.OLLAMA_BASE_URL or "").strip()
        if primary:
            raw_urls.append(primary)

        fallback_csv = (self.OLLAMA_FALLBACK_BASE_URLS or "").strip()
        if fallback_csv:
            for item in fallback_csv.split(","):
                value = item.strip()
                if value:
                    raw_urls.append(value)

        localhost_default = "http://localhost:11434"
        if localhost_default not in raw_urls:
            raw_urls.append(localhost_default)

        deduped: List[str] = []
        seen = set()
        for url in raw_urls:
            normalized = url.rstrip("/")
            if normalized in seen:
                continue
            seen.add(normalized)
            deduped.append(normalized)
        return deduped
    
    class Config:
        env_file = str(_ENV_FILE_PATH)
        extra = "ignore"

settings = Settings()