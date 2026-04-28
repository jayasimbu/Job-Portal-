from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    id: int
    email: str
    username: str
    hashed_password: str
    first_name: str
    last_name: str
    role: str
    auth_method: str = "email"
    is_active: bool = True
    is_verified: bool = False
    verification_token: str | None = None
    reset_token: str | None = None
    reset_token_expires: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None