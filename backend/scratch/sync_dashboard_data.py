import sys
import os
import json
from datetime import datetime

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from core.database import get_database, get_next_sequence
from ai_engine.ats_scoring.scorer import score_resume_ats

def fix_user_insights(user_id):
    db = get_database()
    # 1. Get latest resume for user
    resume = db["resumes"].find_one({"user_id": user_id}, sort=[("id", -1)])
    if not resume:
        print(f"No resume found for user {user_id}")
        return

    print(f"Analyzing resume: {resume['file_name']} for user {user_id}")
    
    # 2. Run the actual AI scorer
    payload = {
        "parsed_text": resume.get("raw_text", ""),
        "skills": resume.get("parsed_data", {}).get("skills", []),
        "experience_years": resume.get("parsed_data", {}).get("experience_years", 0),
        "projects": resume.get("parsed_data", {}).get("projects", []),
        "education": [resume.get("parsed_data", {}).get("education", "")]
    }
    
    score_result = score_resume_ats(payload)
    print(f"Calculated Score: {score_result['ats_score']}")

    # 3. Save to resume_insights
    insight_doc = {
        "id": get_next_sequence(db, "resume_insights"),
        "user_id": user_id,
        "ats_score": score_result["ats_score"],
        "skills_match": score_result.get("skills_found", []),
        "missing_keywords": [],
        "breakdown": score_result["breakdown"],
        "raw_text": resume.get("raw_text", ""),
        "llm_feedback": score_result.get("feedback"),
        "created_at": datetime.utcnow()
    }
    
    db["resume_insights"].insert_one(insight_doc)
    print("Dashboard data synchronized.")

if __name__ == "__main__":
    fix_user_insights(4)
