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
    user = db["users"].find_one({"role": "job seeker"})
    if not user:
        print("No job seeker found")
        return 1

    user_id = user["id"]

    token = create_access_token({"user_id": user_id, "role": "job seeker"})

    files = {'file': ('test.pdf', b'%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF', 'application/pdf')}
    data = {'user_id': str(user_id)}
    headers = {'Authorization': f'Bearer {token}'}

    resp2 = requests.post('http://localhost:8000/api/jobseeker/resume/upload-file', files=files, data=data, headers=headers)
    print("Upload Status:", resp2.status_code)
    print("Upload Response:", resp2.text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
