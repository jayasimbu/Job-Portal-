"""
Resume upload integration test.

This script tests the resume file upload endpoint with a real job seeker user.
Run directly as: python test_upload.py
Do not import as a module (guarded by __main__ check to preserve pytest compatibility).
"""
import sys
import os
import requests

sys.path.append(os.path.join(os.path.dirname(__file__)))


def main():
    from core.security import create_access_token
    from pymongo import MongoClient

    # We know user 1 exists, or at least some user
    client = MongoClient("mongodb://localhost:27017")
    db = client["career_auto1"]
    user = db["users"].find_one({"id": 4})
    if not user:
        user = db["users"].find_one({"role": "jobseeker"})
    if not user:
        user = db["users"].find_one()
        
    if not user:
        print("No user found in MongoDB at all!")
        return 1

    user_id = user["id"]
    print(f"Testing with user: {user.get('username')} (ID: {user_id}), Role: {user.get('role')}")

    token = create_access_token({"user_id": user_id, "role": "job seeker"})

    resume_path = r"C:\Users\JAYASIMBU\Downloads\Career Auto1\Career Auto1\database\jobseeker\Files\jayasimbu66@gmail.com\20260518_052502_Yagul S D -E22CS035 .pdf"
    with open(resume_path, "rb") as f:
        real_bytes = f.read()

    files = {'file': ('20260518_052502_Yagul S D -E22CS035 .pdf', real_bytes, 'application/pdf')}
    data = {'user_id': str(user_id)}
    headers = {'Authorization': f'Bearer {token}'}

    resp2 = requests.post('http://localhost:8000/api/jobseeker/resume/upload-file', files=files, data=data, headers=headers)
    print("Upload Status:", resp2.status_code)
    try:
        print("Upload Response:", resp2.content.decode('utf-8'))
    except Exception as e:
        print("Upload Response (raw):", resp2.content)
    return 0


if __name__ == "__main__":
    sys.exit(main())
