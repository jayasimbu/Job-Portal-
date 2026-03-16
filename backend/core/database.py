from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}  # Needed for SQLite
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

def get_db():
    """Dependency to get DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_db_and_tables():
    """Create all database tables"""
    # Import models so SQLAlchemy metadata includes all module tables.
    from modules.auth.model import User  # noqa: F401
    from modules.employer.model import EmployerProfile, JobPosting  # noqa: F401
    from modules.jobseeker.model import JobApplication, JobSeekerProfile, Resume  # noqa: F401

    # Create tables
    Base.metadata.create_all(bind=engine)