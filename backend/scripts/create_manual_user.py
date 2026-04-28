import sys
from pathlib import Path
from datetime import datetime

# Setup path for backend
backend_root = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_root))

from core.database import get_database, get_next_sequence
from core.security import get_password_hash

def create_user(email, password, role="jobseeker"):
    db = get_database()
    
    # Check if user already exists
    if db["users"].find_one({"email": email}):
        print(f"User {email} already exists!")
        return
    
    user_id = get_next_sequence(db, "user_id")
    hashed_password = get_password_hash(password)
    
    user_doc = {
        "id": user_id,
        "email": email,
        "username": email.split('@')[0],
        "hashed_password": hashed_password,
        "first_name": "Test",
        "last_name": "User",
        "role": role,
        "auth_method": "email",
        "is_active": True,
        "is_verified": True,  # Pre-verified for ease of use
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    db["users"].insert_one(user_doc)
    print(f"✅ User created successfully!")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print(f"Role: {role}")

if __name__ == "__main__":
    # You can change these values
    create_user("testuser@example.com", "TestPass123!")
