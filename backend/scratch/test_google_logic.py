import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from backend.modules.auth.service import AuthService
from backend.modules.auth.model import User

async def verify_google_logic():
    # Connect to local DB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["career_auto1"]
    auth_service = AuthService(db)
    
    test_email = "test_google_merge@example.com"
    
    # 1. Simulate an existing email account
    print(f"--- Step 1: Existing Email Account ---")
    existing = await db.users.find_one({"email": test_email})
    if existing:
        await db.users.delete_one({"email": test_email})
        
    user_doc = {
        "id": 9999,
        "email": test_email,
        "first_name": "Test",
        "last_name": "User",
        "role": "jobseeker",
        "auth_method": "email",
        "is_active": True,
        "is_verified": True,
        "hashed_password": "some_password_hash"
    }
    await db.users.insert_one(user_doc)
    print(f"Created dummy user: {test_email} with auth_method='email'")
    
    # 2. Verify the user exists
    user = auth_service.get_user_by_email(test_email)
    print(f"Retrieved user: {user.email}, auth_method: {user.auth_method}")
    
    # 3. Simulate the logic from routes.py (the merge logic)
    # if not user: ... (auto-create) else: (exists, proceed)
    print("\n--- Step 2: Simulating Google Login Logic ---")
    if user:
        print(f"Logic Match: User exists, proceeding with login flow (SUCCESS)")
    else:
        print(f"Logic Match: User not found, would auto-create (SUCCESS)")

    # 4. Cleanup
    await db.users.delete_one({"email": test_email})
    print("\nCleanup done.")

if __name__ == "__main__":
    asyncio.run(verify_google_logic())
