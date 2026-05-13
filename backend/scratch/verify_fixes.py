from core.security import get_password_hash, verify_password
from core.database import get_database
from modules.jobseeker.service import JobSeekerService
import json

def test_security():
    print("--- Testing Security Fixes ---")
    password = "a" * 100 # Very long password
    hashed = get_password_hash(password)
    print(f"Hashed password (truncated if > 72 bytes): {hashed[:20]}...")
    
    # Verify works
    is_valid = verify_password(password, hashed)
    print(f"Verify long password: {'SUCCESS' if is_valid else 'FAILED'}")
    
    is_valid_truncated = verify_password(password[:72], hashed)
    print(f"Verify truncated password: {'SUCCESS' if is_valid_truncated else 'FAILED'}")

def test_recommendations():
    print("\n--- Testing Learning Recommendations ---")
    db = get_database()
    service = JobSeekerService(db)
    
    print("Test with no missing skills (should return defaults):")
    recs = service.get_learning_recommendations(4)
    print(f"Courses count: {len(recs['courses'])}")
    
    print("\nTest with specific missing skills (React, Docker):")
    # Simulate missing skills in profile
    db["jobseeker_profiles"].update_one({"user_id": 4}, {"$set": {"missing_skills": ["React", "Docker"]}})
    recs = service.get_learning_recommendations(4)
    print(f"Recommendations for simulated gaps: {json.dumps(recs, indent=2)}")
    
    # Cleanup
    db["jobseeker_profiles"].update_one({"user_id": 4}, {"$set": {"missing_skills": []}})

if __name__ == "__main__":
    test_security()
    test_recommendations()
