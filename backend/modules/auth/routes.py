from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from .service import AuthService, get_auth_service
from .model import User
from core.database import get_db
from pydantic import BaseModel

# Pydantic models for request/response
class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    role: str
    is_active: bool
    is_verified: bool

    class Config:
        orm_mode = True

# Create router
router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate, auth_service: AuthService = Depends(get_auth_service)):
    """Register a new user"""
    try:
        user = auth_service.create_user(
            email=user_data.email,
            password=user_data.password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            role=user_data.role
        )
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends(), auth_service: AuthService = Depends(get_auth_service)):
    """Login user and return access token"""
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_service.create_access_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user(auth_service: AuthService = Depends(get_auth_service)):
    """Get current authenticated user"""
    # In a real implementation, you would get the user from the token
    # This is a simplified version for demonstration
    user = auth_service.get_user_by_id(1)  # Placeholder
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
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
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )