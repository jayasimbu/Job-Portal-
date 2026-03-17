import requests # type: ignore
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test_verification")

BASE_URL = "http://localhost:5000"

def test_active_resume_endpoint(email):
    logger.info(f"Testing /api/user/active-resume for {email}...")
    try:
        resp = requests.get(f"{BASE_URL}/api/user/active-resume?email={email}")
        data = resp.json()
        if data.get("success"):
            logger.info("Success! Active resume retrieved.")
            logger.info(f"Resume ID: {data['activeResume'].get('id')}")
            logger.info(f"Filename: {data['activeResume'].get('filename')}")
        else:
            logger.error(f"Failed: {data.get('error')}")
    except Exception as e:
        logger.error(f"Error connecting to backend: {e}")

def test_bookmarks(email):
    logger.info(f"Testing /api/user/bookmarks for {email}...")
    try:
        resp = requests.get(f"{BASE_URL}/api/user/bookmarks?email={email}")
        data = resp.json()
        if data.get("success"):
            logger.info(f"Success! {len(data.get('savedJobs', []))} bookmarks found.")
        else:
            logger.error(f"Failed: {data.get('error')}")
    except Exception as e:
        logger.error(f"Error connecting to backend: {e}")

if __name__ == "__main__":
    # Note: Ensure the backend (app.py) is running before executing this test.
    # Replace with a test email from your local MongoDB instance.
    test_email = "test@example.com" # Valid test email from DB
    test_active_resume_endpoint(test_email)
    test_bookmarks(test_email)
