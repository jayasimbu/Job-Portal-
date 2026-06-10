import requests
import time

BASE_URL = "http://127.0.0.1:5000"

def test_auto_extraction():
    print("Testing /api/ats/extract...")
    payload = {
        "resume_text": "Experienced software engineer with 5 years in Python, React, and AWS. BS in Computer Science.",
        "email": "test@example.com",
        "resume_id": "r_123"
    }
    start = time.time()
    try:
        res = requests.post(f"{BASE_URL}/api/ats/extract", json=payload, timeout=25)
        print(f"Extraction Status: {res.status_code} in {time.time()-start:.2f}s")
        if res.status_code == 200:
            data = res.json()
            print(f"Success: {data.get('success')}")
            print(f"Skills Extracted: {data.get('data', {}).get('skills')}")
        else:
            print(res.text)
    except Exception as e:
        print("Error:", e)

def test_normal_ats():
    print("\nTesting /api/ats/analyze-normal...")
    payload = {
        "resume_text": "Experienced software engineer with 5 years in Python, React, and AWS. BS in Computer Science. Strong communication skills. Delivered multiple projects."
    }
    start = time.time()
    try:
        res = requests.post(f"{BASE_URL}/api/ats/analyze-normal", json=payload, timeout=25)
        print(f"Normal ATS Status: {res.status_code} in {time.time()-start:.2f}s")
        if res.status_code == 200:
            data = res.json()
            print(f"Success: {data.get('success')}")
            print(f"Overall Score: {data.get('data', {}).get('overall_score')}")
            print(f"Improvements: {data.get('data', {}).get('improvements')}")
        else:
            print(res.text)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_auto_extraction()
    test_normal_ats()
