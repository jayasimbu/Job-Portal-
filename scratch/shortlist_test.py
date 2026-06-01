
from modules.employer.service import EmployerService
from core.database import get_database

db = get_database()
service = EmployerService(db)

# Find the application for seeker@test.com
user = db["users"].find_one({"email": "seeker@test.com"})
if user:
    app = db["job_applications"].find_one({"user_id": user["id"]})
    if app:
        print(f"Shortlisting application {app['id']} for user {user['id']}")
        service.update_candidate_status(app["id"], "shortlisted")
        print("Success!")
    else:
        print("Application not found for seeker@test.com")
else:
    print("User seeker@test.com not found")
