import requests
import time
import json

BASE_URL = "http://127.0.0.1:8000/api"

def get_auth_token():
    email = f"test_ai_{int(time.time())}@example.com"
    password = "Password123!"
    
    # Register
    reg_payload = {
        "email": email,
        "password": password,
        "full_name": "AI Test User",
        "role": "jobseeker"
    }
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
        if response.status_code == 200:
            return response.json().get("access_token")
    except Exception as e:
        print(f"Auth error: {e}")
    return None

def test_parsing(token):
    print("--- Testing Resume Parsing ---")
    resume_text = """
    John Doe
    Python Developer with 5 years of experience.
    Skills: Python, FastAPI, MongoDB, React, Spacy, Pandas.
    Experience: 
    - Senior Dev at TechCorp (2020-2025)
    - Junior Dev at StartUp (2018-2020)
    Education:
    - BSc Computer Science, XYZ University
    """
    payload = {"resume_text": resume_text}
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{BASE_URL}/jobseeker/resume/parse", json=payload, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_ats_scoring(token):
    print("\n--- Testing ATS Scoring ---")
    resume_text = "Python Developer with FastAPI expert skills."
    job_description = "Looking for a Python Developer with experience in FastAPI and MongoDB."
    
    payload = {
        "resume_text": resume_text,
        "job_description": job_description
    }
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{BASE_URL}/jobseeker/ats/jd", json=payload, headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            # print without the very long llm text if possible
            if "llm_enhanced_feedback" in result and result["llm_enhanced_feedback"]:
                result["llm_enhanced_feedback"] = result["llm_enhanced_feedback"][:100] + "..."
            print(f"Response: {json.dumps(result, indent=2)}")
        else:
            print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    time.sleep(2)
    print("Getting auth token...")
    token = get_auth_token()
    if not token:
        print("Failed to authenticate.")
        exit(1)
        
    p_success = test_parsing(token)
    a_success = test_ats_scoring(token)
    
    if p_success and a_success:
        print("\nSUCCESS: AI Features (Parsing & Scoring) verified.")
    else:
        print("\nFAILED: One or more AI features failed.")
