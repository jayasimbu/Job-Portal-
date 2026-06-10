import requests
import time

BASE_URL = "http://localhost:5000"

def test_signup():
    print("\n--- Testing Signup ---")
    data = {"name": "Test User", "email": "test@example.com", "password": "password123"}
    try:
        response = requests.post(f"{BASE_URL}/signup", json=data)
        print(f"Signup Status: {response.status_code}")
        print(f"Signup Response: {response.json()}")
        return response.status_code
    except Exception as e:
        print(f"Signup Failed: {e}")
        return None

def test_signup_duplicate():
    print("\n--- Testing Signup Duplicate ---")
    data = {"name": "Test User", "email": "test@example.com", "password": "password123"}
    try:
        response = requests.post(f"{BASE_URL}/signup", json=data)
        print(f"Duplicate Signup Status: {response.status_code}")
        print(f"Duplicate Signup Response: {response.json()}")
        if response.status_code == 409:
             print("SUCCESS: Correctly identified duplicate.")
        else:
             print("FAILURE: Did not identify duplicate.")
    except Exception as e:
        print(f"Signup Failed: {e}")

def test_login():
    print("\n--- Testing Login ---")
    data = {"email": "test@example.com", "password": "password123"}
    try:
        response = requests.post(f"{BASE_URL}/login", json=data)
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.json()}")
    except Exception as e:
        print(f"Login Failed: {e}")

def test_login_invalid():
    print("\n--- Testing Invalid Login ---")
    data = {"email": "test@example.com", "password": "wrongpassword"}
    try:
        response = requests.post(f"{BASE_URL}/login", json=data)
        print(f"Invalid Login Status: {response.status_code}")
        print(f"Invalid Login Response: {response.json()}")
        if response.status_code == 401:
             print("SUCCESS: Correctly rejected invalid credentials.")
    except Exception as e:
        print(f"Login Failed: {e}")

def test_login_nonexistent():
    print("\n--- Testing Non-existent User Login ---")
    data = {"email": "nobody@example.com", "password": "password123"}
    try:
        response = requests.post(f"{BASE_URL}/login", json=data)
        print(f"Non-existent Status: {response.status_code}")
        print(f"Non-existent Response: {response.json()}")
        if response.status_code == 404:
             print("SUCCESS: Correctly identified non-existent user.")
    except Exception as e:
        print(f"Login Failed: {e}")

if __name__ == "__main__":
    # Wait for server to start if running immediately after spawn
    time.sleep(2) 
    
    # Clean up DB for test (optional, but good for repeatability)
    # For now, we manually checking. If "test@example.com" exists, signup will return 409.
    
    status = test_signup()
    test_signup_duplicate()
    test_login()
    test_login_invalid()
    test_login_nonexistent()
