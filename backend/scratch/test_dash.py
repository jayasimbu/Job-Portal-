import requests
import json

base_url = "http://localhost:8000/api"

# Fallback login
res = requests.post(f"{base_url}/auth/login-json", json={
    "email": "test_script3@test.com",
    "password": "password123"
})
data = res.json()
token = data.get("access_token")
user_id = data.get("user", {}).get("id")

if token:
    print("Uploading resume...")
    try:
        up_res = requests.post(f"{base_url}/jobseeker/upload-resume", headers={"Authorization": f"Bearer {token}"}, json={
            "user_id": user_id,
            "file_name": "test_resume.pdf",
            "resume_text": "I am a software engineer with 5 years of Python experience and React."
        })
        print("Upload Status:", up_res.status_code)
        print("Upload Output:", up_res.text)
    except Exception as e:
        print("Upload error:", e)

    print("Fetching dashboard...")
    try:
        dash_res = requests.get(f"{base_url}/dashboard", headers={"Authorization": f"Bearer {token}"})
        print("Dashboard Status:", dash_res.status_code)
        print("Dashboard Output:", dash_res.text)
    except Exception as e:
        print("Dashboard error:", e)
