"""Reset demo user passwords and ensure profile files exist for login."""
import sys
import json
from pathlib import Path
from datetime import datetime

backend_root = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_root))

from core.database import get_database
from core.security import get_password_hash

DEMO_PASSWORD = "DemoPass123!"

def _ensure_profile_file(email, role, user_doc):
    """Create the profile JSON file that auth service checks during login."""
    base_db = Path(__file__).resolve().parents[2] / "database"
    role_dir = "employer" if role == "employer" else "jobseeker"
    profile_path = base_db / role_dir / f"{email}.json"
    files_path = base_db / role_dir / "Files" / email

    profile_path.parent.mkdir(parents=True, exist_ok=True)
    files_path.mkdir(parents=True, exist_ok=True)

    if not profile_path.exists():
        profile_data = {
            "user_id": user_doc.get("id"),
            "email": email,
            "first_name": user_doc.get("first_name", "Demo"),
            "last_name": user_doc.get("last_name", "User"),
            "role": role,
            "created_at": datetime.utcnow().isoformat(),
            "bio": "",
            "skills": [],
            "experience": [],
            "education": []
        }
        with profile_path.open("w", encoding="utf-8") as f:
            json.dump(profile_data, f, indent=2)
        print(f"[OK] Created profile file: {profile_path.name}")
    else:
        print(f"[OK] Profile file already exists: {profile_path.name}")


def reset_passwords():
    db = get_database()
    users = db["users"]
    hashed = get_password_hash(DEMO_PASSWORD)

    demo_accounts = [
        {"email": "demo.jobseeker@example.com", "role": "jobseeker"},
        {"email": "demo.employer@example.com", "role": "employer"},
        {"email": "demo.admin@example.com", "role": "admin"},
    ]

    for account in demo_accounts:
        email = account["email"]
        role = account["role"]

        result = users.update_one(
            {"email": email},
            {"$set": {
                "hashed_password": hashed,
                "is_verified": True,
                "is_active": True,
                "auth_method": "email",
            }},
        )
        if result.matched_count:
            print(f"[OK] Password reset for: {email}")
            user_doc = users.find_one({"email": email})
            _ensure_profile_file(email, role, user_doc)
        else:
            print(f"[WARN] User not found: {email}")

    print(f"\nAll passwords set to: {DEMO_PASSWORD}")


if __name__ == "__main__":
    reset_passwords()
