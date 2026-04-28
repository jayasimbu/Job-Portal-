import json
import requests
import time
import os

BASE_URL = "http://127.0.0.1:8000/api"


def payload_of(res):
    body = res.json()
    if isinstance(body, dict) and "data" in body and "success" in body:
        return body["data"]
    return body

def print_step(msg):
    print(f"\n[{time.strftime('%H:%M:%S')}] \033[96m{msg}\033[0m")

def print_success(msg):
    print(f"  \033[92m[PASS] {msg}\033[0m")

def print_fail(msg, res=None):
    print(f"  \033[91m[FAIL] {msg}\033[0m")
    if res:
        print(f"    Status: {res.status_code}")
        print(f"    Body: {res.text}")

def run_tests():
    # 1. Jobseeker Registration & Profile
    print_step("Testing Jobseeker Flow")
    
    # Register Jobseeker
    js_email = f"js_test_{int(time.time())}@example.com"
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": js_email, "password": "password123", "role": "jobseeker", "first_name": "Test", "last_name": "Seeker"
    })
    if res.status_code == 200:
        print_success("Jobseeker registered")
    else:
        print_fail("Jobseeker registration failed", res)
        return

    # Login Jobseeker
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": js_email, "password": "password123"})
    if res.status_code == 200:
        login_data = payload_of(res)
        js_token = login_data["access_token"]
        js_id = login_data["user"]["id"]
        print_success("Jobseeker logged in")
    else:
        print_fail("Jobseeker login failed", res)
        return

    js_headers = {"Authorization": f"Bearer {js_token}"}

    # Upload Resume & ATS
    resume_text = "Experienced software engineer with 5 years in Python, React, and MongoDB."
    res = requests.post(f"{BASE_URL}/jobseeker/resume/upload", headers=js_headers, json={
        "user_id": js_id, "file_name": "resume.pdf", "resume_text": resume_text, "job_description": "Looking for a Python developer"
    })
    if res.status_code == 200:
        print_success("Resume uploaded and ATS processed")
    else:
        print_fail("Resume upload failed", res)

    # 2. Employer Flow
    print_step("Testing Employer Flow")
    
    # Register Employer
    emp_email = f"emp_test_{int(time.time())}@example.com"
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": emp_email, "password": "password123", "role": "employer", "first_name": "Test", "last_name": "Boss"
    })
    
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": emp_email, "password": "password123"})
    if res.status_code == 200:
        login_data = payload_of(res)
        emp_token = login_data["access_token"]
        emp_id = login_data["user"]["id"]
        print_success("Employer logged in")
    else:
        print_fail("Employer login failed", res)
        return

    emp_headers = {"Authorization": f"Bearer {emp_token}"}

    # Post Job
    res = requests.post(f"{BASE_URL}/employer/jobs", headers=emp_headers, json={
        "employer_id": emp_id, "title": "Senior Python Developer", "department": "Engineering", 
        "location": "Remote", "type": "Full-time", "description": "Needs Python and React", 
        "requirements": ["Python", "React"], "salary_range": "$100k-$150k"
    })
    if res.status_code == 200:
        job_data = payload_of(res)
        job_id = job_data["job"]["id"]
        print_success("Job posted")
    else:
        print_fail("Job posting failed", res)
        return

    # 3. Jobseeker Applies
    print_step("Testing Apply Flow")
    res = requests.post(f"{BASE_URL}/jobseeker/applications", headers=js_headers, json={
        "user_id": js_id, "job_id": job_id
    })
    if res.status_code == 200:
        print_success("Jobseeker applied for job")
    else:
        print_fail("Job application failed", res)

    # 4. Employer Views Candidates
    res = requests.get(f"{BASE_URL}/employer/jobs/{job_id}/candidates", headers=emp_headers)
    if res.status_code == 200:
        body = payload_of(res)
        cands = body.get("ranked_candidates", [])
        if len(cands) > 0 and "ats_score" in cands[0]:
            print_success("Employer viewed ranked candidates")
        else:
            print_fail("Employer candidates not ranked properly", res)
    else:
        print_fail("Employer viewing candidates failed", res)

    # 5. Admin Flow
    print_step("Testing Admin Flow")
    
    # We need an admin user. We'll register one, then force role update in DB or use existing if any.
    # To be quick, we'll try to log in to existing admin, or create one and update db directly.
    import pymongo
    try:
        client = pymongo.MongoClient("mongodb://localhost:27017/")
        db = client["career_auto1"]
        admin_email = "admin_smoke@example.com"
        db.users.update_one({"email": admin_email}, {"$set": {"role": "admin"}}, upsert=True)
        # Re-register just to set password if not exists
        requests.post(f"{BASE_URL}/auth/register", json={
            "email": admin_email, "password": "adminpassword", "role": "jobseeker", "first_name": "Admin", "last_name": "Test"
        })
        db.users.update_one({"email": admin_email}, {"$set": {"role": "admin"}})
        
        res = requests.post(f"{BASE_URL}/auth/login", data={"username": admin_email, "password": "adminpassword"})
        if res.status_code == 200:
            admin_data = payload_of(res)
            admin_token = admin_data["access_token"]
            print_success("Admin logged in")
            admin_headers = {"Authorization": f"Bearer {admin_token}"}
            
            # Dashboard stats
            res = requests.get(f"{BASE_URL}/admin/dashboard", headers=admin_headers)
            if res.status_code == 200:
                print_success("Admin dashboard loaded")
            else:
                print_fail("Admin dashboard failed", res)
                
            # Verify cert endpoint (Jobseeker role but tests the verifier)
            res = requests.post(f"{BASE_URL}/jobseeker/verify-certificate", headers=js_headers, json={
                "cert_name": "AWS Certified Solutions Architect",
                "issuer": "Credly",
                "credential_id": "123456",
                "user_id": js_id,
                "user_email": js_email
            })
            if res.status_code == 200:
                print_success("Certificate verifier executed with dummy data")
            else:
                print_fail("Certificate verifier failed", res)
            
        else:
            print_fail("Admin login failed", res)
    except Exception as e:
        print_fail(f"Could not script admin setup via pymongo: {e}")

    print_step("Smoke Tests Complete!")

if __name__ == "__main__":
    run_tests()
