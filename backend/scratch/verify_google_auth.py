import requests
import json
import os
import sys

# Add backend to path to import models if needed
sys.path.append(os.path.join(os.getcwd(), 'backend'))

def test_google_login_flow():
    base_url = "http://localhost:8000/api/auth"
    
    # We can't easily mock the Google token verification without modifying the backend again or having a real token.
    # However, we can check the health and the routes definition.
    
    print("Checking backend health...")
    try:
        resp = requests.get("http://localhost:8000/api/health")
        print(f"Health check: {resp.status_code} - {resp.json()}")
    except Exception as e:
        print(f"Error connecting to backend: {e}")
        return

    print("\nVerifying Google Login Endpoint existence...")
    # OPTIONS request to check if endpoint is up
    try:
        resp = requests.options(f"{base_url}/google")
        print(f"Google endpoint OPTIONS: {resp.status_code}")
    except Exception as e:
        print(f"Error: {e}")

    print("\nNote: Manual verification by clicking the 'Continue with Google' button in the browser is recommended")
    print("since real Google ID tokens are required for security verification.")

if __name__ == "__main__":
    test_google_login_flow()
