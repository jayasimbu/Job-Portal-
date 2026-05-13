try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseSettings
import os
from pathlib import Path
from typing import List, Optional
from dotenv import load_dotenv

_BACKEND_DIR = Path(__file__).resolve().parent.parent
_APP_ENV_PROFILE = (os.getenv("APP_ENV_PROFILE", "local") or "local").strip().lower()

# Load all potential env files
env_paths = [
    _BACKEND_DIR / f"{_APP_ENV_PROFILE}.env",
    _BACKEND_DIR / "server.env",
    _BACKEND_DIR / "local.env",
    _BACKEND_DIR / ".env"
]
for p in env_paths:
    if p.exists():
        load_dotenv(p, override=True)

class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "AI Job Portal")
    VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", 8000))
    MAX_CONCURRENT_REQUESTS: int = 1200
    REQUEST_QUEUE_WAIT_SECONDS: float = 1.5
    ENABLE_GZIP: bool = True
    GZIP_MIN_SIZE: int = 1024
    
    DATABASE_URL: str = os.getenv("MONGO_URL", os.getenv("DATABASE_URL", "mongodb://localhost:27017/LINKUP"))
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 10080
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # Ollama settings
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_FALLBACK_BASE_URLS: str = os.getenv("OLLAMA_FALLBACK_BASE_URLS", "")
    OLLAMA_API_KEY: str = os.getenv("OLLAMA_API_KEY", "")
    OLLAMA_API_KEY1: str = os.getenv("OLLAMA_API_KEY1", "")
    OLLAMA_API_KEY2: str = os.getenv("OLLAMA_API_KEY2", "")
    OLLAMA_API_KEY3: str = os.getenv("OLLAMA_API_KEY3", "")
    OLLAMA_API_KEY4: str = os.getenv("OLLAMA_API_KEY4", "")
    OLLAMA_API_KEY5: str = os.getenv("OLLAMA_API_KEY5", "")
    OLLAMA_REQUIRE_API_KEY_FOR_REMOTE: bool = True
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "qwen3-coder:latest")
    OLLAMA_MODEL_COUNT: int = 3
    OLLAMA_MAX_MODELS: int = 10
    OLLAMA_MODEL1: str = os.getenv("OLLAMA_MODEL1", "")
    OLLAMA_MODEL2: str = os.getenv("OLLAMA_MODEL2", "")
    OLLAMA_MODEL3: str = os.getenv("OLLAMA_MODEL3", "")
    OLLAMA_TIMEOUT: int = 60
    OLLAMA_AUTOSTART: bool = True
    OLLAMA_STARTUP_TIMEOUT_SECONDS: int = 8

    # RESTORED: Queue settings (Required by app.py)
    OLLAMA_QUEUE_ENABLED: bool = os.getenv("OLLAMA_QUEUE_ENABLED", "True").lower() == "true"
    OLLAMA_QUEUE_POLL_SECONDS: int = int(os.getenv("OLLAMA_QUEUE_POLL_SECONDS", 30))
    OLLAMA_QUEUE_MAX_RETRIES: int = int(os.getenv("OLLAMA_QUEUE_MAX_RETRIES", 8))
    OLLAMA_QUEUE_RETRY_COOLDOWN_SECONDS: int = 45
    OLLAMA_MAX_PARALLEL_REQUESTS: int = 32
    OLLAMA_HTTP_POOL_CONNECTIONS: int = 100
    OLLAMA_HTTP_POOL_MAXSIZE: int = 1000
    OLLAMA_QUEUE_MAX_PENDING_PER_USER: int = 20
    
    # SMTP Settings
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM: str = os.getenv("SMTP_FROM", "")
    VERIFICATION_URL: str = os.getenv("VERIFICATION_URL", "")
    RESET_PASSWORD_URL: str = os.getenv("RESET_PASSWORD_URL", "")
    
    # AI Engine settings
    AI_ENGINE_ENABLED: bool = True
    RESUME_PARSER_TIMEOUT: int = 300

    def get_ollama_api_keys(self) -> List[str]:
        keys: List[str] = []
        if self.OLLAMA_API_KEY: keys.append(self.OLLAMA_API_KEY)
        for i in range(1, 11):
            val = getattr(self, f"OLLAMA_API_KEY{i}", "") or os.getenv(f"OLLAMA_API_KEY{i}", "")
            if val and val not in keys: keys.append(val)
        return [k.strip() for k in keys if k.strip()]

    def get_ollama_models(self) -> List[str]:
        raw_models: List[str] = []
        for i in range(1, 4):
            val = getattr(self, f"OLLAMA_MODEL{i}", "") or os.getenv(f"OLLAMA_MODEL{i}", "")
            if val: raw_models.append(val)
        return list(set(raw_models))

    def get_ollama_base_urls(self) -> List[str]:
        return [self.OLLAMA_BASE_URL.rstrip("/")]
    
    class Config:
        extra = "ignore"

settings = Settings()
