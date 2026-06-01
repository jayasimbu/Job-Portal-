
import sys
import io
from core.database import get_database

# Fix for windows console unicode issues
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

db = get_database()
user = db["users"].find_one({"email": "seeker@test.com"})

if user:
    notifs = list(db["notifications"].find({"user_id": user["id"]}).sort("created_at", -1))
    print(f"Notifications for seeker (ID {user['id']}):")
    for n in notifs:
        print(f"- [{n.get('type')}] {n.get('title')}: {n.get('message')} (Read: {n.get('read')})")
    
    app = db["job_applications"].find_one({"user_id": user["id"]})
    print(f"\nApplication Status: {app.get('status') if app else 'Not found'}")
else:
    print("User seeker@test.com not found")
