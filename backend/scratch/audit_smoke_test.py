import json
import requests
import time
import os

BASE_URL = "http://127.0.0.1:8000/api"

def payload_of(res):
    try:
        body = res.json()
        if isinstance(body, dict) and "data" in body and "success" in body:
            return body["data"]
        return body
    except:
        return res.text

def print_step(msg):
    print(f"\n[{time.strftime('%H:%M:%S')}] {msg}")

def print_success(msg):
    print(f"  [PASS] {msg}")

def print_fail(msg, res=None):
    print(f"  [FAIL] {msg}")
    if res:
        print(f"    Status: {res.status_code}")
        print(f"    Body: {res.text}")

def run_tests():
    # 1. Jobseeker Registration & Profile
    print_step("Testing Jobseeker Flow")
    
    js_email = f"js_audit_{int(time.time())}@example.com"
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": js_email, "password": "password123", "role": "jobseeker", "first_name": "Audit", "last_name": "Seeker"
    })
    if res.status_code == 200:
        print_success("Jobseeker registered")
    else:
        print_fail("Jobseeker registration failed", res)
        return

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

    # Upload Resume
    resume_text = "Experienced software engineer with 5 years in Python, React, and MongoDB."
    res = requests.post(f"{BASE_URL}/jobseeker/upload-resume", headers=js_headers, json={
        "user_id": js_id, "file_name": "resume.pdf", "resume_text": resume_text, "job_description": "Looking for a Python developer"
    })
    if res.status_code == 200:
        print_success("Resume uploaded")
    else:
        print_fail("Resume upload failed", res)

    # 2. Employer Flow
    print_step("Testing Employer Flow")
    
    emp_email = f"emp_audit_{int(time.time())}@example.com"
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": emp_email, "password": "password123", "role": "employer", "first_name": "Audit", "last_name": "Boss"
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
        "employer_id": emp_id, 
        "title": "Senior Python Developer Audit", 
        "company_name": "Audit Corp",
        "location": "Remote", 
        "employment_type": "Full-time", 
        "experience_level": "Senior",
        "skills_required": ["Python", "React"],
        "job_description": "Needs Python and React expertise for scaling services.", 
        "responsibilities": "Develop core features, mentor juniors.",
        "qualifications": "5+ years experience, Degree in CS."
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
    res = requests.post(f"{BASE_URL}/jobseeker/apply", headers=js_headers, json={
        "job_id": job_id
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
        if len(cands) > 0:
            print_success(f"Employer viewed {len(cands)} ranked candidates")
            if "ats_score" in cands[0]:
                print_success(f"Candidate ATS Score: {cands[0]['ats_score']}")
            else:
                print_fail("ATS score missing in ranked candidate")
        else:
            print_fail("No candidates found in ranking")
    else:
        print_fail("Employer viewing candidates failed", res)

    # 5. Admin Flow
    print_step("Testing Admin Flow")
    
    admin_email = f"admin_audit_{int(time.time())}@example.com"
    # Register as jobseeker first
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": admin_email, "password": "adminpassword", "role": "jobseeker", "first_name": "Audit", "last_name": "Admin"
    })
    
    # Manually promote to admin in DB (using existing create_admin.py logic or direct DB access if possible)
    # For the sake of audit, I'll check if I can use an existing admin or if I need to create one.
    # I'll try to find an admin in the DB.
    import pymongo
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["career_auto1"]
    db.users.update_one({"email": admin_email}, {"$set": {"role": "admin"}})
    
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": admin_email, "password": "adminpassword"})
    if res.status_code == 200:
        admin_data = payload_of(res)
        admin_token = admin_data["access_token"]
        print_success("Admin logged in")
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Dashboard stats
        res = requests.get(f"{BASE_URL}/admin/dashboard-stats", headers=admin_headers)
        if res.status_code == 200:
            print_success("Admin dashboard-stats loaded")
        else:
            print_fail("Admin dashboard-stats failed", res)
            
        # Analytics
        res = requests.get(f"{BASE_URL}/admin/analytics", headers=admin_headers)
        if res.status_code == 200:
            print_success("Admin analytics loaded")
        else:
            print_fail("Admin analytics failed", res)
            
    else:
        print_fail("Admin login failed", res)

    print_step("Audit Script Complete!")

if __name__ == "__main__":
    run_tests()
