from core.database import get_database, get_next_sequence
from core.security import get_password_hash
from datetime import datetime

def setup_test_users():
    db = get_database()
    users_collection = db["users"]
    
    users = [
        {
            "email": "admin@LINKUP.com",
            "password": "Admin@2026Secure",
            "role": "admin",
            "first_name": "System",
            "last_name": "Admin"
        },
        {
            "email": "employer@test.com",
            "password": "Employer@2026Secure",
            "role": "employer",
            "first_name": "Hiring",
            "last_name": "Manager"
        },
        {
            "email": "jobseeker@test.com",
            "password": "Jobseeker@2026Secure",
            "role": "jobseeker",
            "first_name": "John",
            "last_name": "Doe"
        }
    ]
    
    for u in users:
        hashed_pw = get_password_hash(u["password"])
        existing = users_collection.find_one({"email": u["email"]})
        
        now = datetime.utcnow()
        if existing:
            users_collection.update_one(
                {"email": u["email"]}, 
                {"$set": {
                    "role": u["role"], 
                    "hashed_password": hashed_pw, 
                    "is_verified": True,
                    "is_active": True,
                    "first_name": u["first_name"],
                    "last_name": u["last_name"],
                    "updated_at": now
                }}
            )
            print(f"Updated user: {u['email']} ({u['role']})")
        else:
            doc = {
                "id": get_next_sequence(db, "users"),
                "email": u["email"],
                "username": u["email"],
                "hashed_password": hashed_pw,
                "first_name": u["first_name"],
                "last_name": u["last_name"],
                "role": u["role"],
                "auth_method": "email",
                "is_active": True,
                "is_verified": True,
                "created_at": now,
                "updated_at": now,
            }
            users_collection.insert_one(doc)
            print(f"Created user: {u['email']} ({u['role']})")

if __name__ == "__main__":
    setup_test_users()
