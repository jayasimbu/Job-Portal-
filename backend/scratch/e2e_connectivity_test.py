"""
End-to-End Connectivity Test
=============================
Tests the full lifecycle:  Admin -> Employer -> JobSeeker -> Admin
All three roles connect, post, apply, and verify.

Run:  python scratch/e2e_connectivity_test.py
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import requests, json, time

BASE = "http://localhost:8000"
PASSWORD = "DemoPass123!"
DIVIDER = "=" * 60

results = {}

def log(section, msg, ok=True):
    icon = "✅" if ok else "❌"
    print(f"  {icon} {msg}")
    results.setdefault(section, []).append((msg, ok))

def login(email, password=PASSWORD):
    """Login and return access_token."""
    r = requests.post(f"{BASE}/api/auth/login", data={"username": email, "password": password})
    if r.status_code == 200:
        body = r.json()
        data = body.get("data", body)
        return data.get("access_token")
    return None

def auth_header(token):
    return {"Authorization": f"Bearer {token}"}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0. Health Check
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print(f"\n{DIVIDER}")
print("0️⃣  HEALTH CHECK")
print(DIVIDER)

try:
    r = requests.get(f"{BASE}/api/health", timeout=5)
    log("health", f"Backend is UP (status={r.status_code})", r.status_code == 200)
except Exception as e:
    log("health", f"Backend is DOWN: {e}", False)
    print("\n⛔ Backend unreachable. Aborting.")
    sys.exit(1)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 1. ADMIN LOGIN
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print(f"\n{DIVIDER}")
print("1️⃣  ADMIN LOGIN + DASHBOARD")
print(DIVIDER)

# Try both admin accounts
admin_token = login("admin@LINKUP.com", "Admin@2026Secure")
admin_email = "admin@LINKUP.com"
if not admin_token:
    admin_token = login("demo.admin@example.com")
    admin_email = "demo.admin@example.com"

if admin_token:
    log("admin", f"Admin login successful ({admin_email})")
    
    # Admin Dashboard Stats
    r = requests.get(f"{BASE}/api/admin/dashboard-stats", headers=auth_header(admin_token))
    if r.status_code == 200:
        stats = r.json().get("data", r.json())
        total_users = stats.get("total_users", stats.get("users", "?"))
        total_jobs = stats.get("total_jobs", stats.get("jobs", "?"))
        log("admin", f"Dashboard Stats: {total_users} users, {total_jobs} jobs")
    else:
        log("admin", f"Dashboard Stats failed (HTTP {r.status_code})", False)

    # Admin Users List
    r = requests.get(f"{BASE}/api/admin/users", headers=auth_header(admin_token))
    if r.status_code == 200:
        data = r.json().get("data", r.json())
        users_list = data.get("users", data) if isinstance(data, dict) else data
        count = len(users_list) if isinstance(users_list, list) else "?"
        log("admin", f"User Management: {count} users retrieved")
    else:
        log("admin", f"User Management failed (HTTP {r.status_code})", False)

    # Admin Jobs List
    r = requests.get(f"{BASE}/api/admin/jobs", headers=auth_header(admin_token))
    if r.status_code == 200:
        log("admin", f"Job Management: accessible")
    else:
        log("admin", f"Job Management failed (HTTP {r.status_code})", False)

    # Admin System Logs
    r = requests.get(f"{BASE}/api/admin/logs", headers=auth_header(admin_token))
    if r.status_code == 200:
        log("admin", f"System Logs: accessible")
    else:
        log("admin", f"System Logs failed (HTTP {r.status_code})", False)
else:
    log("admin", "Admin login FAILED", False)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 2. EMPLOYER LOGIN + POST JOB
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print(f"\n{DIVIDER}")
print("2️⃣  EMPLOYER LOGIN + POST JOB")
print(DIVIDER)

employer_token = login("demo.employer@example.com")
employer_user_id = None

if employer_token:
    log("employer", "Employer login successful")
    
    # Get employer user info
    r = requests.get(f"{BASE}/api/auth/me", headers=auth_header(employer_token))
    if r.status_code == 200:
        me = r.json().get("data", r.json())
        employer_user_id = me.get("id")
        log("employer", f"Employer ID: {employer_user_id}, Email: {me.get('email')}")
    else:
        log("employer", f"/auth/me failed (HTTP {r.status_code})", False)

    # Employer Dashboard
    r = requests.get(f"{BASE}/api/employer/dashboard", headers=auth_header(employer_token))
    if r.status_code == 200:
        log("employer", "Employer Dashboard: accessible")
    else:
        log("employer", f"Employer Dashboard failed (HTTP {r.status_code})", False)

    # Post a new job
    job_payload = {
        "employer_id": employer_user_id or 0,
        "title": "E2E Test Engineer",
        "company_name": "LINKUP Test Corp",
        "location": "Chennai, India",
        "employment_type": "Full-time",
        "experience_level": "Mid-level",
        "skills_required": ["Python", "FastAPI", "MongoDB", "React"],
        "job_description": "End-to-end connectivity test job posting. Testing the full lifecycle.",
        "responsibilities": "Test all platform features end-to-end.",
        "qualifications": "2+ years experience in Python and web development.",
        "status": "active"
    }
    r = requests.post(
        f"{BASE}/api/employer/jobs",
        headers={**auth_header(employer_token), "Content-Type": "application/json"},
        json=job_payload
    )
    if r.status_code == 200:
        job_data = r.json().get("data", r.json())
        job = job_data.get("job", job_data)
        new_job_id = job.get("id")
        log("employer", f"Job Posted Successfully! Job ID: {new_job_id}")
    else:
        log("employer", f"Job Post FAILED (HTTP {r.status_code}): {r.text[:200]}", False)
        new_job_id = None

    # List employer's jobs
    if employer_user_id:
        r = requests.get(f"{BASE}/api/employer/jobs/{employer_user_id}", headers=auth_header(employer_token))
        if r.status_code == 200:
            jobs = r.json().get("data", r.json())
            job_list = jobs.get("jobs", jobs) if isinstance(jobs, dict) else jobs
            count = len(job_list) if isinstance(job_list, list) else "?"
            log("employer", f"Employer has {count} total jobs")
        else:
            log("employer", f"List Jobs failed (HTTP {r.status_code})", False)
else:
    log("employer", "Employer login FAILED", False)
    new_job_id = None


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3. JOBSEEKER LOGIN + APPLY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print(f"\n{DIVIDER}")
print("3️⃣  JOBSEEKER LOGIN + SEARCH + APPLY")
print(DIVIDER)

seeker_token = login("demo.jobseeker@example.com")
seeker_user_id = None

if seeker_token:
    log("jobseeker", "Jobseeker login successful")

    # Get jobseeker info
    r = requests.get(f"{BASE}/api/auth/me", headers=auth_header(seeker_token))
    if r.status_code == 200:
        me = r.json().get("data", r.json())
        seeker_user_id = me.get("id")
        log("jobseeker", f"Jobseeker ID: {seeker_user_id}, Email: {me.get('email')}")
    else:
        log("jobseeker", f"/auth/me failed (HTTP {r.status_code})", False)

    # Jobseeker Profile
    r = requests.get(f"{BASE}/api/jobseeker/profile", headers=auth_header(seeker_token))
    if r.status_code == 200:
        log("jobseeker", "Profile endpoint: accessible")
    else:
        log("jobseeker", f"Profile failed (HTTP {r.status_code})", False)

    # Jobseeker Dashboard 
    r = requests.get(f"{BASE}/api/dashboard", headers=auth_header(seeker_token))
    if r.status_code == 200:
        log("jobseeker", "Dashboard endpoint: accessible")
    else:
        log("jobseeker", f"Dashboard failed (HTTP {r.status_code})", False)

    # Search for jobs
    r = requests.get(f"{BASE}/api/jobseeker/jobs", headers=auth_header(seeker_token))
    if r.status_code == 200:
        data = r.json().get("data", r.json())
        job_list = data.get("jobs", data) if isinstance(data, dict) else data
        count = len(job_list) if isinstance(job_list, list) else "?"
        log("jobseeker", f"Job Search: {count} jobs available")
    else:
        log("jobseeker", f"Job Search failed (HTTP {r.status_code})", False)

    # Apply for the job we just created
    if new_job_id:
        r = requests.post(
            f"{BASE}/api/jobseeker/apply",
            headers={**auth_header(seeker_token), "Content-Type": "application/json"},
            json={"job_id": new_job_id}
        )
        if r.status_code == 200:
            app_data = r.json().get("data", r.json())
            application = app_data.get("application", app_data)
            app_id = application.get("id")
            log("jobseeker", f"Applied Successfully! Application ID: {app_id}")
        else:
            log("jobseeker", f"Apply FAILED (HTTP {r.status_code}): {r.text[:200]}", False)
            app_id = None
    else:
        log("jobseeker", "Skipped apply (no job was posted)", False)
        app_id = None

    # List jobseeker applications
    r = requests.get(f"{BASE}/api/jobseeker/applications", headers=auth_header(seeker_token))
    if r.status_code == 200:
        data = r.json().get("data", r.json())
        apps = data.get("applications", data) if isinstance(data, dict) else data
        count = len(apps) if isinstance(apps, list) else "?"
        log("jobseeker", f"Total applications: {count}")
    else:
        log("jobseeker", f"Applications list failed (HTTP {r.status_code})", False)
else:
    log("jobseeker", "Jobseeker login FAILED", False)
    app_id = None


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 4. EMPLOYER VERIFIES APPLICATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print(f"\n{DIVIDER}")
print("4️⃣  EMPLOYER → VERIFY APPLICATION RECEIVED")
print(DIVIDER)

if employer_token and new_job_id:
    r = requests.get(
        f"{BASE}/api/employer/jobs/{new_job_id}/candidates",
        headers=auth_header(employer_token)
    )
    if r.status_code == 200:
        data = r.json().get("data", r.json())
        candidates = data.get("ranked_candidates", data)
        count = len(candidates) if isinstance(candidates, list) else "?"
        log("employer_verify", f"Candidates for E2E Test Engineer: {count}")
        
        if app_id and isinstance(candidates, list) and len(candidates) > 0:
            log("employer_verify", "✓ Jobseeker application is VISIBLE to employer")
        elif isinstance(candidates, list) and len(candidates) == 0:
            log("employer_verify", "Application may need time to propagate or index", False)
    else:
        log("employer_verify", f"Candidates list failed (HTTP {r.status_code})", False)

    # Employer shortlists the candidate
    if app_id:
        r = requests.post(
            f"{BASE}/api/employer/candidates/{app_id}/shortlist",
            headers=auth_header(employer_token)
        )
        if r.status_code == 200:
            log("employer_verify", f"Candidate Shortlisted! (App ID: {app_id})")
        else:
            log("employer_verify", f"Shortlist failed (HTTP {r.status_code})", False)
else:
    log("employer_verify", "Skipped (no employer token or job)", False)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 5. ADMIN FINAL VERIFICATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print(f"\n{DIVIDER}")
print("5️⃣  ADMIN → FINAL SYSTEM VERIFICATION")
print(DIVIDER)

if admin_token:
    # Check applications from admin view
    r = requests.get(f"{BASE}/api/admin/applications", headers=auth_header(admin_token))
    if r.status_code == 200:
        data = r.json().get("data", r.json())
        apps = data.get("applications", data.get("items", data))
        count = len(apps) if isinstance(apps, list) else "?"
        log("admin_verify", f"Admin sees {count} total applications in system")
    else:
        log("admin_verify", f"Admin applications failed (HTTP {r.status_code})", False)

    # Check system logs for latest activity
    r = requests.get(f"{BASE}/api/admin/logs?page_size=5", headers=auth_header(admin_token))
    if r.status_code == 200:
        log("admin_verify", "System Logs: recent activity visible")
    else:
        log("admin_verify", f"System Logs failed (HTTP {r.status_code})", False)

    # Admin Analytics
    r = requests.get(f"{BASE}/api/admin/analytics", headers=auth_header(admin_token))
    if r.status_code == 200:
        log("admin_verify", "Analytics: accessible")
    else:
        log("admin_verify", f"Analytics failed (HTTP {r.status_code})", False)
else:
    log("admin_verify", "Skipped (no admin token)", False)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SUMMARY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
print(f"\n{'━' * 60}")
print("📊 END-TO-END CONNECTIVITY REPORT")
print('━' * 60)

total_pass = 0
total_fail = 0

for section, items in results.items():
    passes = sum(1 for _, ok in items if ok)
    fails = sum(1 for _, ok in items if not ok)
    total_pass += passes
    total_fail += fails
    icon = "✅" if fails == 0 else "⚠️"
    print(f"  {icon} {section}: {passes}/{len(items)} passed")

print(f"\n  Total: {total_pass} passed, {total_fail} failed out of {total_pass + total_fail}")

if total_fail == 0:
    print("\n🎉 ALL CONNECTIONS VERIFIED! End-to-End flow is FULLY CONNECTED.")
else:
    print(f"\n⚠️  {total_fail} issue(s) found. Review the output above.")

print()
