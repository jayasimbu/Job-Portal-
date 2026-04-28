from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def _register_and_login(role: str = "jobseeker"):
    email = f"smoke_{role}@example.com"
    register_payload = {
        "email": email,
        "password": "Password1!",
        "first_name": "Smoke",
        "last_name": "Test",
        "role": role,
    }
    client.post("/api/auth/signup", json=register_payload)

    login_payload = {"email": email, "password": "Password1!"}
    resp = client.post("/api/auth/login-json", json=login_payload)
    assert resp.status_code == 200
    body = resp.json()
    return body["access_token"], body


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json().get("status") in {"healthy", "ok", "degraded"}


def test_auth_signup_and_login_json():
    token, login = _register_and_login("jobseeker")
    assert token
    assert login.get("role") == "jobseeker"
    assert "redirect_to" in login


def test_jobseeker_ats_endpoints():
    token, _ = _register_and_login("jobseeker")
    headers = {"Authorization": f"Bearer {token}"}

    resume_payload = {
        "resume_text": "Python React FastAPI SQL project experience.",
        "skills": ["python", "react"],
        "experience_years": 2,
        "projects": ["job portal"],
        "education": ["B.Tech"],
    }
    resp = client.post("/api/jobseeker/ats/resume", json=resume_payload, headers=headers)
    assert resp.status_code == 200
    assert "final_score" in resp.json()

    jd_payload = {
        "resume_text": "Python React FastAPI SQL project experience.",
        "job_description": "Looking for Python FastAPI engineer with React.",
    }
    resp2 = client.post("/api/jobseeker/ats/jd", json=jd_payload, headers=headers)
    assert resp2.status_code == 200
    assert "final_score" in resp2.json()


def test_ai_endpoints_with_auth():
    token, _ = _register_and_login("jobseeker")
    headers = {"Authorization": f"Bearer {token}"}

    ats_feedback_payload = {
        "ats_result": {
            "final_score": 72,
            "missing_keywords": ["docker", "kubernetes"],
            "suggestions": ["Add cloud tools"],
        }
    }
    resp = client.post("/api/ai/ats-feedback", json=ats_feedback_payload, headers=headers)
    assert resp.status_code == 200
    assert "fallback_used" in resp.json()

    match_payload = {
        "resume_text": "Python React FastAPI",
        "job_description": "Need React FastAPI developer",
    }
    resp2 = client.post("/api/ai/match-explain", json=match_payload, headers=headers)
    assert resp2.status_code == 200
    assert "semantic_match_score" in resp2.json()
