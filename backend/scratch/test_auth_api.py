import requests
import time

BASE_URL = "http://127.0.0.1:8000/api"

def test_auth():
    email = f"test_{int(time.time())}@example.com"
    password = "Password123!"
    
    print(f"--- Testing Registration with {email} ---")
    reg_payload = {
        "email": email,
        "password": password,
        "full_name": "Test User",
        "role": "jobseeker"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("\n--- Testing Login ---")
            # Login typically uses Form data or JSON depending on implementation.
            # authService.js uses Form data. login-json uses JSON.
            # Let's try Form data first as per login() in routes.py
            login_data = {
                "username": email,
                "password": password
            }
            login_res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
            print(f"Login Status: {login_res.status_code}")
            print(f"Login Response: {login_res.text}")
            
            if login_res.status_code == 200:
                print("\nSUCCESS: Registration and Login verified.")
            else:
                print("\nFAILED: Login failed.")
        else:
            print("\nFAILED: Registration failed.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_auth()
