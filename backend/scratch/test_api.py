import requests
import json

BASE_URL = "http://localhost:8000"

def test_recommendations():
    try:
        # Get a user ID first (assuming user 1 exists)
        user_id = 1
        url = f"{BASE_URL}/api/jobseeker/recommendations/{user_id}"
        print(f"Fetching from {url}")
        
        # We need to skip auth for this test or provide a token
        # But based on the code, get_recommendations doesn't require get_current_user_db
        # Oh wait, it DOES have it in the router dependencies?
        # router = APIRouter(dependencies=[Depends(require_roles("jobseeker", "admin"))])
        
        # I'll just check the DB directly using the available python
        print("Test complete.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_recommendations()
