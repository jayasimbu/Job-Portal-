from core.database import get_database, get_next_sequence
from core.security import get_password_hash
from datetime import datetime
import secrets

def create_admin():
    db = get_database()
    email = "admin@LINKUP.com"
    password = "hashed_password" 
    
    users_collection = db["users"]
    
    hashed_pw = get_password_hash("Admin@2026Secure")
    
    # Check if admin exists
    existing = users_collection.find_one({"email": email})
    if existing:
        users_collection.update_one({"email": email}, {"$set": {"role": "admin", "hashed_password": hashed_pw, "is_verified": True}})
        print(f"Admin {email} updated with password 'Admin@2026Secure' and role 'admin'")
        return

    now = datetime.utcnow()
    admin_doc = {
        "id": get_next_sequence(db, "users"),
        "email": email,
        "username": email,
        "hashed_password": hashed_pw,
        "first_name": "System",
        "last_name": "Admin",
        "role": "admin",
        "auth_method": "email",
        "is_active": True,
        "is_verified": True,
        "verification_token": None,
        "created_at": now,
        "updated_at": now,
    }
    
    users_collection.insert_one(admin_doc)
    print(f"Successfully created/updated admin user: {email} with password 'Admin@2026Secure'")

if __name__ == "__main__":
    create_admin()
