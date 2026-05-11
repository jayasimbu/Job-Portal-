import requests
import json
import os
import time

BASE_URL = "http://localhost:8000/api"

def test_resume_file_upload():
    print("\n[TEST] Testing Resume File Upload (Multipart)")
    
    # 1. Register/Login Jobseeker
    js_email = f"js_file_test_{int(time.time())}@example.com"
    requests.post(f"{BASE_URL}/auth/register", json={
        "email": js_email, "password": "password123", "role": "jobseeker",
        "first_name": "File", "last_name": "Tester"
    })
    login_res = requests.post(f"{BASE_URL}/auth/login", json={"email": js_email, "password": "password123"}).json()
    print(f"[DEBUG] Login Response: {login_res}")
    token = login_res["data"]["access_token"]
    user_id = login_res["data"]["user"]["id"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Find a PDF
    pdf_path = None
    # Check common locations or search
    pdf_path = "c:/Users/JAYASIMBU/Downloads/LINKUP1/LINKUP1/database/jobseeker/Files/test@example.com/resume.pdf"
    if not os.path.exists(pdf_path):
        print(f"[SKIP] PDF not found at {pdf_path}")
        return

    if not pdf_path:
        print("[SKIP] No PDF found in workspace to test real parsing.")
        return

    print(f"[INFO] Using PDF for test: {pdf_path}")
    with open(pdf_path, "rb") as f:
        files = {"file": (os.path.basename(pdf_path), f, "application/pdf")}
        data = {"user_id": user_id}
        res = requests.post(f"{BASE_URL}/jobseeker/upload-resume-file", headers=headers, data=data, files=files)
    
    print(f"[RESULT] Status: {res.status_code}")
    print(f"[RESULT] Response: {res.text}")

    if res.status_code == 200:
        print("[PASS] Resume file upload successful")
        # Check insights
        insights_res = requests.get(f"{BASE_URL}/jobseeker/insights/{user_id}", headers=headers).json()
        print(f"[INFO] ATS Score: {insights_res.get('data', {}).get('atsScore')}")
    else:
        print("[FAIL] Resume file upload failed")

if __name__ == "__main__":
    test_resume_file_upload()
