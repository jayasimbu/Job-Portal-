from core.database import get_database
import json

def check_db():
    db = get_database()
    
    print("--- Jobseeker Profiles ---")
    profiles = list(db["jobseeker_profiles"].find().limit(5))
    for p in profiles:
        print(p)
        
    print("\n--- Resume Insights ---")
    insights = list(db["resume_insights"].find().limit(5))
    for i in insights:
        print(i)

if __name__ == "__main__":
    check_db()
