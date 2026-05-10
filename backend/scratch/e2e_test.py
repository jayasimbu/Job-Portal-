"""End-to-end smoke test for critical platform workflows."""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import requests
import json
import time

BASE = "http://127.0.0.1:8000/api"
PASS = "password123"
ts = str(int(time.time()))

def heading(msg):
    print(f"\n{'='*60}\n  {msg}\n{'='*60}")

def test(label, ok, detail=""):
    status = "✅ PASS" if ok else "❌ FAIL"
    print(f"  {status} — {label}" + (f"  ({detail})" if detail else ""))
    return ok

results = []

# ── 1. Health
heading("1. Health Check")
r = requests.get(f"{BASE}/health")
results.append(test("Health endpoint", r.status_code == 200, r.text[:100]))

# ── 2. Register + Login Jobseeker
heading("2. Register + Login Jobseeker")
email = f"js_e2e_{ts}@test.com"
reg = requests.post(f"{BASE}/auth/register", json={
    "email": email, "password": PASS, "role": "jobseeker",
    "first_name": "E2E", "last_name": "Test"
})
results.append(test("Register Jobseeker", reg.status_code in [200, 201], f"status={reg.status_code}"))

login = requests.post(f"{BASE}/auth/login", json={"email": email, "password": PASS})
login_data = login.json()
token = login_data.get("data", {}).get("access_token") or login_data.get("access_token", "")
user_id = login_data.get("data", {}).get("user", {}).get("id") or 0
results.append(test("Login Jobseeker", bool(token), f"user_id={user_id}"))

headers = {"Authorization": f"Bearer {token}"}

# ── 3. Upload Resume (text-based)
heading("3. Upload Resume (text-based)")
resume_text = """
John Smith — Full Stack Developer
Skills: Python, React, Node.js, MongoDB, Docker, AWS, FastAPI
Experience: 3 years at TechCorp as Backend Developer
Education: B.Sc Computer Science, State University 2021
Projects: Built a real-time analytics dashboard using React and FastAPI
"""
upload = requests.post(f"{BASE}/jobseeker/upload-resume", headers=headers, json={
    "user_id": user_id, "file_name": "test_resume.pdf", 
    "resume_text": resume_text, "job_description": ""
})
results.append(test("Upload Resume", upload.status_code == 200, f"status={upload.status_code}"))

# ── 4. Dashboard Data
heading("4. Dashboard Data")
dash = requests.get(f"{BASE}/dashboard", headers=headers)
dash_data = dash.json().get("data", dash.json())
has_resume = dash_data.get("hasResume", False)
ats_score = dash_data.get("stats", {}).get("atsScore", 0)
results.append(test("Dashboard loads", dash.status_code == 200))
results.append(test("Resume detected", has_resume))
results.append(test("ATS Score > 0", ats_score > 0, f"atsScore={ats_score}"))

# ── 5. ATS Score
heading("5. ATS Scoring Endpoint")
ats = requests.post(f"{BASE}/jobseeker/ats-score", headers=headers, json={
    "resume_text": resume_text,
    "skills": ["Python", "React", "Node.js"],
    "experience_years": 3,
    "projects": ["Analytics Dashboard"],
    "education": ["B.Sc Computer Science"]
})
results.append(test("ATS Score endpoint", ats.status_code == 200, f"status={ats.status_code}"))

# ── 6. JD Match
heading("6. JD Match Endpoint")
jd = requests.post(f"{BASE}/jobseeker/jd-match", headers=headers, json={
    "resume_text": resume_text,
    "job_description": "Looking for a Python developer with React and Docker experience. 3+ years required."
})
results.append(test("JD Match endpoint", jd.status_code == 200, f"status={jd.status_code}"))

# ── 7. ATS Engine Routes
heading("7. ATS Engine Routes")
ats_engine = requests.post(f"{BASE}/ats/analyze", json={
    "resume_text": resume_text,
    "job_description": "Python backend developer with AWS experience"
})
results.append(test("ATS Engine /analyze", ats_engine.status_code == 200, f"status={ats_engine.status_code}"))

# ── 8. Register + Login Employer
heading("8. Register + Login Employer")
emp_email = f"emp_e2e_{ts}@test.com"
emp_reg = requests.post(f"{BASE}/auth/register", json={
    "email": emp_email, "password": PASS, "role": "employer",
    "first_name": "E2E", "last_name": "Employer"
})
results.append(test("Register Employer", emp_reg.status_code in [200, 201]))

emp_login = requests.post(f"{BASE}/auth/login", json={"email": emp_email, "password": PASS})
emp_data = emp_login.json()
emp_token = emp_data.get("data", {}).get("access_token") or emp_data.get("access_token", "")
emp_id = emp_data.get("data", {}).get("user", {}).get("id") or 0
emp_headers = {"Authorization": f"Bearer {emp_token}"}
results.append(test("Login Employer", bool(emp_token), f"emp_id={emp_id}"))

# ── 9. Employer Analytics
heading("9. Employer Analytics")
analytics = requests.get(f"{BASE}/employer/analytics/{emp_id}", headers=emp_headers)
results.append(test("Employer Analytics", analytics.status_code == 200, f"status={analytics.status_code}"))

# ── SUMMARY
heading("RESULTS SUMMARY")
passed = sum(results)
total = len(results)
print(f"\n  {passed}/{total} tests passed")
if passed == total:
    print("  🎉 ALL TESTS PASSED — Platform is production-ready!")
else:
    print(f"  ⚠️  {total - passed} tests failed — review above")
