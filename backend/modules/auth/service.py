from typing import Optional
from datetime import datetime, timedelta

from fastapi import Depends

from .model import User
from .utils import validate_role
from core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from core.database import doc_to_entity, get_db, get_next_sequence
from core.config import settings
from pathlib import Path
import json
import secrets
from core.email_service import EmailService


class AuthService:
    def __init__(self, db):
        self.db = db
        self.users = db["users"]

    def authenticate_user(self, email: str, password: str) -> User:
        """Authenticate a user with email and password or raise ValueError"""
        user = self.get_user_by_email(email)
        if not user:
            raise ValueError("ACCOUNT_NOT_FOUND")
            
        if user.auth_method == "google":
            raise ValueError("GOOGLE_ACCOUNT_USE_GOOGLE_LOGIN")
            
        if not verify_password(password, user.hashed_password):
            raise ValueError("INVALID_PASSWORD")
            
        # Check if profile file exists - if not, delete stale record and force re-signup
        base_db = Path(__file__).resolve().parents[3] / "database"
        role_dir = "employer" if user.role == "employer" else "jobseeker"
        profile_path = base_db / role_dir / f"{email}.json"
        
        if not profile_path.exists():
            print(f"[AUTH_DEBUG] Profile file missing for {email} during login. Deleting stale Mongo record.")
            self.users.delete_one({"_id": user.to_dict()["_id"] if hasattr(user, 'to_dict') else user.id}) 
            raise ValueError("ACCOUNT_NOT_FOUND_PLEASE_SIGNUP")
            
        return user

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email"""
        return doc_to_entity(self.users.find_one({"email": email}))

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get a user by ID"""
        return doc_to_entity(self.users.find_one({"id": int(user_id)}))

    def create_user(self, email: str, password: str, first_name: str, last_name: str, role: str, auth_method: str = "email") -> User:
        """Create a new user"""
        role = validate_role(role)
        # Check for existing user
        existing_user = self.users.find_one({"email": email})
        if existing_user:
            # Check if profile file exists - if not, allow re-signup by deleting stale record
            base_db = Path(__file__).resolve().parents[3] / "database"
            role_dir = "employer" if existing_user['role'] == "employer" else "jobseeker"
            profile_path = base_db / role_dir / f"{email}.json"
            
            if not profile_path.exists():
                print(f"[AUTH_DEBUG] Profile file missing for {email} but Mongo record found. Resetting account for re-signup.")
                self.users.delete_one({"_id": existing_user["_id"]})
            else:
                raise ValueError("ALREADY_EXISTS")

        hashed_password = get_password_hash(password)
        now = datetime.utcnow()
        user_doc = {
            "id": get_next_sequence(self.db, "users"),
            "email": email,
            "username": email,
            "hashed_password": hashed_password,
            "first_name": first_name,
            "last_name": last_name,
            "role": role,
            "auth_method": auth_method,
            "is_active": True,
            "is_verified": False,
            "verification_token": secrets.token_urlsafe(32),
            "created_at": now,
            "updated_at": now,
        }
        self.users.insert_one(user_doc)
        
        # Send verification email
        EmailService.send_verification_email(email, user_doc["verification_token"])
        
        # Initialize profile directory and file
        base_db = Path(__file__).resolve().parents[3] / "database"
        role_dir = "employer" if role == "employer" else "jobseeker"
        profile_path = base_db / role_dir / f"{user_doc['email']}.json"
        
        profile_path.parent.mkdir(parents=True, exist_ok=True)
        # Create a dedicated Files directory for this user
        files_path = base_db / role_dir / "Files" / email
        files_path.mkdir(parents=True, exist_ok=True)
        
        initial_profile = {
            "user_id": user_doc["id"],
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "role": role,
            "created_at": user_doc["created_at"].isoformat(),
            "bio": "",
            "skills": [],
            "experience": [],
            "education": []
        }
        with profile_path.open("w", encoding="utf-8") as f:
            json.dump(initial_profile, f, indent=2)
            
        return doc_to_entity(user_doc)
        
    def ensure_profile_exists(self, user: User) -> None:
        """Ensure that the profile file exists in the filesystem."""
        base_db = Path(__file__).resolve().parents[3] / "database"
        role_dir = "employer" if user.role == "employer" else "jobseeker"
        profile_path = base_db / role_dir / f"{user.email}.json"
        
        # Ensure the user's explicit Files folder exists regardless of profile JSON state
        files_path = base_db / role_dir / "Files" / user.email
        files_path.mkdir(parents=True, exist_ok=True)
        
        if not profile_path.exists():
            print(f"[AUTH_DEBUG] Profile missing for user {user.id}. Initializing at {profile_path}")
            profile_path.parent.mkdir(parents=True, exist_ok=True)
            initial_profile = {
                "user_id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "created_at": datetime.utcnow().isoformat(),
                "bio": "",
                "skills": [],
                "experience": [],
                "education": []
            }
            with profile_path.open("w", encoding="utf-8") as f:
                json.dump(initial_profile, f, indent=2)

    def create_access_token_for_user(self, user: User) -> str:
        """Create an access token for a user"""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return create_access_token(
            data={"sub": user.email, "user_id": user.id, "role": user.role},
            expires_delta=access_token_expires
        )

    def create_refresh_token_for_user(self, user: User) -> str:
        """Create a refresh token for a user"""
        refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
        return create_refresh_token(
            data={"sub": user.email, "user_id": user.id, "role": user.role},
            expires_delta=refresh_token_expires,
        )

    @staticmethod
    def get_role_redirect_path(role: str) -> str:
        mapping = {
            "jobseeker": "/platform/jobseeker/home",
            "employer": "/platform/employer/home",
            "admin": "/platform/admin/dashboard",
        }
        return mapping.get(role, "/")

    def update_user_profile(self, user_id: int, **kwargs) -> User:
        """Update user profile"""
        user = self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        allowed_fields = {
            "first_name",
            "last_name",
            "is_active",
            "is_verified",
            "role",
            "username",
        }
        update_data = {k: v for k, v in kwargs.items() if k in allowed_fields}
        update_data["updated_at"] = datetime.utcnow()
        self.users.update_one({"id": int(user_id)}, {"$set": update_data})
        return self.get_user_by_id(user_id)

    def mark_user_verified(self, user_id: int) -> Optional[User]:
        self.users.update_one(
            {"id": int(user_id)},
            {"$set": {"is_verified": True, "verification_token": None, "updated_at": datetime.utcnow()}},
        )
        return self.get_user_by_id(user_id)

    def verify_email_with_token(self, token: str) -> Optional[User]:
        """Verify user email using the verification token"""
        user_doc = self.users.find_one({"verification_token": token})
        if not user_doc:
            return None
        
        user_id = user_doc["id"]
        return self.mark_user_verified(user_id)

    def generate_password_reset_token(self, email: str) -> bool:
        """Generate a password reset token and send email"""
        user = self.get_user_by_email(email)
        if not user:
            return False
        
        token = secrets.token_urlsafe(32)
        expires = datetime.utcnow() + timedelta(hours=1)
        
        self.users.update_one(
            {"email": email},
            {"$set": {
                "reset_token": token,
                "reset_token_expires": expires,
                "updated_at": datetime.utcnow()
            }}
        )
        
        EmailService.send_password_reset_email(email, token)
        return True

    def reset_password_with_token(self, token: str, new_password: str) -> bool:
        """Reset user password using a valid token"""
        user_doc = self.users.find_one({
            "reset_token": token,
            "reset_token_expires": {"$gt": datetime.utcnow()}
        })
        
        if not user_doc:
            return False
        
        hashed_password = get_password_hash(new_password)
        self.users.update_one(
            {"id": user_doc["id"]},
            {"$set": {
                "hashed_password": hashed_password,
                "reset_token": None,
                "reset_token_expires": None,
                "updated_at": datetime.utcnow()
            }}
        )
        return True

# Dependency to get auth service
def get_auth_service(db=Depends(get_db)):
    """Dependency to get auth service"""
    return AuthService(db)
