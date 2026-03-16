from typing import Optional
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .model import User
from .utils import validate_role
from core.security import get_password_hash, verify_password, create_access_token
from core.database import get_db
from datetime import timedelta
from core.config import settings

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user with email and password"""
        user = self.get_user_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email"""
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get a user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, email: str, password: str, first_name: str, last_name: str, role: str) -> User:
        """Create a new user"""
        role = validate_role(role)
        hashed_password = get_password_hash(password)
        user = User(
            email=email,
            username=email,  # Using email as username for simplicity
            hashed_password=hashed_password,
            first_name=first_name,
            last_name=last_name,
            role=role
        )
        try:
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user
        except IntegrityError:
            self.db.rollback()
            raise ValueError("User with this email already exists")

    def create_access_token_for_user(self, user: User) -> str:
        """Create an access token for a user"""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return create_access_token(
            data={"sub": user.email, "user_id": user.id, "role": user.role},
            expires_delta=access_token_expires
        )

    def update_user_profile(self, user_id: int, **kwargs) -> User:
        """Update user profile"""
        user = self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        
        self.db.commit()
        self.db.refresh(user)
        return user

# Dependency to get auth service
def get_auth_service(db: Session = Depends(get_db)):
    """Dependency to get auth service"""
    return AuthService(db)