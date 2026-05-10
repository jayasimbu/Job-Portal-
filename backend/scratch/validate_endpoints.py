import requests
import json
import os
import time

BASE_URL = "http://localhost:8000"
JS_EMAIL = "js_val_user@example.com"
EMP_EMAIL = "emp_val_user@example.com"
PASS = "TestPass123!"

def test_full_system():
    print("--- Phase 1: Infrastructure Validation ---")
    try:
        res = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {res.status_code} - {res.json()}")
    except Exception as e:
        print(f"Health Check Failed: {e}")
        return

    # --- JOBSEEKER ---
    print("\n--- Phase 2: Jobseeker Auth & Resume ---")
    js_token, js_id = get_token(JS_EMAIL, PASS, "jobseeker")
    if not js_token: return
    js_headers = {"Authorization": f"Bearer {js_token}"}

    resume_path = r"C:\Users\JAYASIMBU\Downloads\Career Auto1\Career Auto1\Boopathi-(FSD)Resume.pdf"
    with open(resume_path, "rb") as f:
        res = requests.post(f"{BASE_URL}/api/jobseeker/upload-resume-file", headers=js_headers, files={"file": f}, data={"user_id": js_id})
    print(f"JS Resume Upload: {res.status_code}")

    # --- EMPLOYER ---
    print("\n--- Phase 3: Employer Flow ---")
    emp_token, emp_id = get_token(EMP_EMAIL, PASS, "employer")
    if not emp_token: return
    emp_headers = {"Authorization": f"Bearer {emp_token}"}

    # Post Job
    job_payload = {
        "employer_id": emp_id,
        "title": "Senior React Developer",
        "company_name": "ValTech Corp",
        "location": "Remote",
        "employment_type": "Full-time",
        "experience_level": "Senior",
        "skills_required": ["React", "TypeScript", "Node.js"],
        "job_description": "We are looking for a Senior React Developer with TypeScript experience.",
        "responsibilities": "Building scalable web apps.",
        "qualifications": "5+ years experience."
    }
    res = requests.post(f"{BASE_URL}/api/employer/jobs", headers=emp_headers, json=job_payload)
    print(f"Employer Job Posting: {res.status_code}")
    job_id = res.json().get("job", {}).get("id")
    print(f"Job ID: {job_id}")

    # --- CROSS-MODULE: APPLY ---
    print("\n--- Phase 4: Cross-Module Interaction (Apply) ---")
    res = requests.post(f"{BASE_URL}/api/jobseeker/apply", headers=js_headers, json={"job_id": job_id})
    print(f"JS Apply for Emp Job: {res.status_code} - {res.json().get('message')}")
    app_id = res.json().get("application", {}).get("id")

    # --- EMPLOYER: RANKING ---
    print("\n--- Phase 5: Employer Ranking & Analytics ---")
    res = requests.get(f"{BASE_URL}/api/employer/jobs/{job_id}/ranked-candidates", headers=emp_headers)
    print(f"Employer Ranked Candidates: {res.status_code}")
    ranking = res.json().get("ranked_candidates", [])
    if ranking:
        print(f"Candidate Rank 1 Score: {ranking[0].get('ats_score')}")

    res = requests.get(f"{BASE_URL}/api/employer/analytics/{emp_id}", headers=emp_headers)
    print(f"Employer Analytics: {res.status_code}")
    if res.status_code == 200:
        total = res.json().get("analytics", {}).get("total_applicants")
        print(f"Total Applicants in Analytics: {total}")

    # --- ADMIN ---
    print("\n--- Phase 6: Admin Validation ---")
    admin_token, _ = get_token("admin@careerauto.com", "Admin123!", "admin") # Known admin or register
    if admin_token:
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        res = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=admin_headers)
        print(f"Admin Dashboard: {res.status_code} - Users: {res.json().get('stats', {}).get('total_users')}")

def get_token(email, password, role):
    login_data = {"username": email, "password": password}
    res = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
    if res.status_code != 200:
        reg_data = {"email": email, "password": password, "role": role, "first_name": "Val", "last_name": "User"}
        requests.post(f"{BASE_URL}/api/auth/register", json=reg_data)
        res = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
    
    if res.status_code == 200:
        return res.json().get("access_token"), res.json().get("user", {}).get("id")
    return None, None

if __name__ == "__main__":
    test_full_system()
