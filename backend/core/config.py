from pydantic import BaseSettings
import os

class Settings(BaseSettings):
    # Application settings
    PROJECT_NAME: str = "AI Job Portal"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server settings
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    
    # Database settings
    DATABASE_URL: str = "sqlite:///./job_portal.db"
    
    # Security settings
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI Engine settings
    AI_ENGINE_ENABLED: bool = True
    RESUME_PARSER_TIMEOUT: int = 30  # seconds
    
    class Config:
        env_file = ".env"

settings = Settings()