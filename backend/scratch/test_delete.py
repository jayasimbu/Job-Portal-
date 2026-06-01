import sys
import os
import requests

def main():
    from core.security import create_access_token
    from pymongo import MongoClient

    client = MongoClient("mongodb://localhost:27017")
    db = client["career_auto1"]
    user = db["users"].find_one({"id": 4})
    if not user:
        print("User 4 not found")
        return 1

    user_id = user["id"]
    token = create_access_token({"user_id": user_id, "role": "jobseeker"})
    headers = {'Authorization': f'Bearer {token}'}

    print("Sending DELETE request to /resume/active:")
    resp = requests.delete('http://localhost:8000/api/jobseeker/resume/active', headers=headers)
    print("Delete active status:", resp.status_code)
    print("Delete active response:", resp.text)
    
    print("\nSending DELETE request to /resume/9003:")
    resp2 = requests.delete('http://localhost:8000/api/jobseeker/resume/9003', headers=headers)
    print("Delete 9003 status:", resp2.status_code)
    print("Delete 9003 response:", resp2.text)
    return 0

if __name__ == "__main__":
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
    sys.exit(main())
