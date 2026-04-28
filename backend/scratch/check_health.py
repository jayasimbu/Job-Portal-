import requests
import os

urls = [
    "http://127.0.0.1:8000/api/health",
    "http://127.0.0.1:8000/health"
]

for url in urls:
    try:
        resp = requests.get(url, timeout=5)
        print(f"URL: {url}")
        print(f"Status: {resp.status_code}")
        print(f"Body: {resp.text}")
    except Exception as e:
        print(f"URL: {url} - Error: {e}")
