from datetime import datetime
from pathlib import Path
import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Dict, Optional
from .service import AuthService, get_auth_service
from .model import User
from core.security import verify_access_token, verify_refresh_token
from core.config import settings
from pydantic import BaseModel

try:
    from google.auth.transport import requests as google_requests
    from google.oauth2 import id_token as google_id_token
except Exception:  # pragma: no cover - optional import at runtime
    google_requests = None
    google_id_token = None

# Pydantic models for request/response
class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str = ""
    last_name: str = ""
    full_name: str = ""
    auth_method: str = "email"
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    role: str
    redirect_to: str
    user: Optional[dict] = None

class RefreshRequest(BaseModel):
    refresh_token: str

class GoogleLoginRequest(BaseModel):
    id_token: str
    role: str = "jobseeker"
    intent: str = "login"  # "login" or "signup"

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    role: str
    auth_method: str
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True

# Create router
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def _serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "full_name": f"{user.first_name} {user.last_name}".strip(),
        "role": user.role,
        "auth_method": user.auth_method,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
    }


def _auth_event_dir(role: str) -> Path:
    base = Path(__file__).resolve().parents[3] / "database" / "auth"
    target = base / ("employer" if role == "employer" else "jobseeker")
    target.mkdir(parents=True, exist_ok=True)
    return target


def _write_auth_event(role: str, email: str, action: str, payload: Dict) -> None:
    folder = _auth_event_dir(role)
    file_path = folder / f"{email}_auth_events.jsonl"
    event = {
        "action": action,
        "timestamp": datetime.utcnow().isoformat(),
        "email": email,
        "role": role,
        "payload": payload,
    }
    with file_path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(event) + "\n")


def _verify_google_token(token: str) -> Dict:
    if not settings.GOOGLE_CLIENT_ID:
        print("[AUTH_DEBUG] Google Login fail: CLIENT_ID missing in settings")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google login is not configured on server",
        )

    if google_requests is None or google_id_token is None:
        print("[AUTH_DEBUG] Google Login fail: Imports missing (google-auth)")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="google-auth dependency is missing",
        )

    try:
        print(f"[AUTH_DEBUG] Verifying token for client: {settings.GOOGLE_CLIENT_ID[:15]}...")
        id_info = google_id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except Exception as e:
        print(f"[AUTH_DEBUG] google_id_token.verify_oauth2_token failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google ID token: {str(e)}",
        )

    issuer = id_info.get("iss", "")
    if issuer not in {"accounts.google.com", "https://accounts.google.com"}:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token issuer")
    if not id_info.get("email") or not id_info.get("email_verified"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Google email is not verified")
    return id_info

@router.post("/register", response_model=Token)
async def register_user(user_data: UserCreate, auth_service: AuthService = Depends(get_auth_service)):
    """Register a new user"""
    try:
        full_name = (user_data.full_name or "").strip()
        derived_first = ""
        derived_last = ""
        if full_name:
            parts = full_name.split()
            derived_first = parts[0]
            derived_last = " ".join(parts[1:]) if len(parts) > 1 else "User"

        first_name = (user_data.first_name or "").strip() or derived_first or "User"
        last_name = (user_data.last_name or "").strip() or derived_last or "User"

        user = auth_service.create_user(
            email=user_data.email,
            password=user_data.password,
            first_name=first_name,
            last_name=last_name,
            role=user_data.role
        )
        _write_auth_event(
            user.role,
            user.email,
            "signup",
            {"email": user.email, "auth_method": user_data.auth_method},
        )
        
        access_token = auth_service.create_access_token_for_user(user)
        refresh_token = auth_service.create_refresh_token_for_user(user)
        auth_service.ensure_profile_exists(user)
        redirect_to = auth_service.get_role_redirect_path(user.role)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "role": user.role,
            "redirect_to": redirect_to,
            "user": _serialize_user(user),
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends(), auth_service: AuthService = Depends(get_auth_service)):
    """Login user and return access token"""
    try:
        user = auth_service.authenticate_user(form_data.username, form_data.password)
    except ValueError as e:
        detail = str(e)
        status_code = status.HTTP_401_UNAUTHORIZED
        if detail == "ACCOUNT_NOT_FOUND":
            status_code = status.HTTP_404_NOT_FOUND
        
        raise HTTPException(
            status_code=status_code,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_service.create_access_token_for_user(user)
    refresh_token = auth_service.create_refresh_token_for_user(user)
    auth_service.ensure_profile_exists(user)
    redirect_to = auth_service.get_role_redirect_path(user.role)
    _write_auth_event(user.role, user.email, "login", {"email": user.email})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role": user.role,
        "redirect_to": redirect_to,
        "user": _serialize_user(user),
    }


@router.post("/login-json", response_model=Token)
async def login_user_json(payload: UserLogin, auth_service: AuthService = Depends(get_auth_service)):
    """JSON login endpoint alias for non-form clients."""
    try:
        user = auth_service.authenticate_user(payload.email, payload.password)
    except ValueError as e:
        detail = str(e)
        status_code = status.HTTP_401_UNAUTHORIZED
        if detail == "ACCOUNT_NOT_FOUND":
            status_code = status.HTTP_404_NOT_FOUND
            
        raise HTTPException(
            status_code=status_code,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth_service.create_access_token_for_user(user)
    refresh_token = auth_service.create_refresh_token_for_user(user)
    auth_service.ensure_profile_exists(user)
    redirect_to = auth_service.get_role_redirect_path(user.role)
    _write_auth_event(user.role, user.email, "login", {"email": user.email})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role": user.role,
        "redirect_to": redirect_to,
        "user": _serialize_user(user),
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(payload: RefreshRequest, auth_service: AuthService = Depends(get_auth_service)):
    token_data = verify_refresh_token(payload.refresh_token)
    if not token_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user_id = token_data.get("user_id")
    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    access_token = auth_service.create_access_token_for_user(user)
    refresh_token_value = auth_service.create_refresh_token_for_user(user)
    redirect_to = auth_service.get_role_redirect_path(user.role)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token_value,
        "token_type": "bearer",
        "role": user.role,
        "redirect_to": redirect_to,
        "user": _serialize_user(user),
    }


@router.post("/google", response_model=Token)
async def google_login(payload: GoogleLoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    token_payload = _verify_google_token(payload.id_token)
    email = token_payload.get("email")
    first_name = token_payload.get("given_name") or "Google"
    last_name = token_payload.get("family_name") or "User"
    google_subject = token_payload.get("sub")

    user = auth_service.get_user_by_email(email)
    
    if not user:
        # Auto-create for both intents if user doesn't exist (signup is implied or login is allowed to auto-create)
        fallback_password = f"google-oauth-{google_subject or 'generated'}"[:64]
        user = auth_service.create_user(
            email=email,
            password=fallback_password,
            first_name=first_name,
            last_name=last_name,
            role=payload.role,
            auth_method="google"
        )
        _write_auth_event(user.role, user.email, "signup_google", {"email": user.email, "google_sub": google_subject})
    else:
        # User exists, just log them in. 
        # We allow this even if they originally registered with email/password.
        print(f"[AUTH_DEBUG] Google Login/Signup: {email} already exists. Proceeding with login flow.")

    if not user.is_verified:
        user = auth_service.mark_user_verified(user.id) or user

    access_token = auth_service.create_access_token_for_user(user)
    refresh_token_value = auth_service.create_refresh_token_for_user(user)
    auth_service.ensure_profile_exists(user)
    redirect_to = auth_service.get_role_redirect_path(user.role)
    _write_auth_event(user.role, user.email, "login_google", {"email": user.email, "google_sub": google_subject})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token_value,
        "token_type": "bearer",
        "role": user.role,
        "redirect_to": redirect_to,
        "user": _serialize_user(user),
    }


@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme), auth_service: AuthService = Depends(get_auth_service)):
    token_data = verify_access_token(token)
    if token_data:
        user = auth_service.get_user_by_id(token_data.get("user_id"))
        if user:
            _write_auth_event(user.role, user.email, "logout", {"email": user.email})
    return {"message": "Logged out"}


@router.post("/signup", response_model=Token)
async def signup_user_alias(user_data: UserCreate, auth_service: AuthService = Depends(get_auth_service)):
    """Alias endpoint for /register to align with master prompt blueprint."""
    return await register_user(user_data, auth_service)


@router.post("/refresh-token", response_model=Token)
async def refresh_token_alias(payload: RefreshRequest, auth_service: AuthService = Depends(get_auth_service)):
    """Alias endpoint for /refresh to align with frontend/backend compatibility."""
    return await refresh_token(payload, auth_service)

@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = Depends(oauth2_scheme), auth_service: AuthService = Depends(get_auth_service)):
    """Get current authenticated user"""
    token_data = verify_access_token(token)
    if not token_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = auth_service.get_user_by_id(token_data.get("user_id"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    auth_service.ensure_profile_exists(user)
    return user

@router.put("/profile/{user_id}", response_model=UserResponse)
async def update_user_profile(
    user_id: int, 
    profile_data: dict,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Update user profile"""
    try:
        user = auth_service.update_user_profile(user_id, **profile_data)
        _write_auth_event(user.role, user.email, "profile_update", {"fields": list(profile_data.keys())})
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.get("/verify-email")
async def verify_email(token: str, auth_service: AuthService = Depends(get_auth_service)):
    """Verify user email using token"""
    user = auth_service.verify_email_with_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="INVALID_OR_EXPIRED_TOKEN"
        )
    return {"message": "Email verified successfully", "email": user.email}

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, auth_service: AuthService = Depends(get_auth_service)):
    """Initiate password reset flow"""
    success = auth_service.generate_password_reset_token(payload.email)
    # Always return 200 to avoid email enumeration
    return {"message": "If the email is registered, a reset link has been sent."}

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest, auth_service: AuthService = Depends(get_auth_service)):
    """Reset password using token"""
    success = auth_service.reset_password_with_token(payload.token, payload.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="INVALID_OR_EXPIRED_TOKEN"
        )
    return {"message": "Password reset successfully"}
