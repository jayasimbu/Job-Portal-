import requests

BASE = "http://localhost:8000"

def try_login(email, password):
    print(f"Trying to login user {email}...")
    try:
        r = requests.post(f"{BASE}/api/auth/login", data={"username": email, "password": password})
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

try_login("demo.jobseeker@example.com", "DemoPass123!")
try_login("demo.employer@example.com", "DemoPass123!")
try_login("demo.admin@example.com", "DemoPass123!")
