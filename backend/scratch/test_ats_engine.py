import sys
import os
from pathlib import Path

# Add parent directory to path to import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.atsService import ats_service

def test_ats_scoring():
    # Sample candidate data
    resume_data = {
        "skills": ["Python", "JavaScript", "React", "Docker"],
        "experience_years": 3.0,
        "parsed_text": "I have 3 years of experience. I know Python and React. I have a GitHub at github.com/test. I have a Bachelor degree. I have AWS Certification.",
        "projects": [{"title": "Test Project", "url": "github.com/test"}],
        "education": "bachelors"
    }
    
    # Sample JD data
    jd_data = {
        "required_skills": ["Python", "React", "Node.js", "AWS", "Docker"],
        "required_experience_years": 3,
        "description": "Looking for a 3+ year experienced developer with Python and React."
    }
    
    print("Testing ATS Scoring Logic (Phase 3)...")
    result = ats_service.score_against_jd(resume_data, jd_data)
    
    ats_score = result.get("ats_score", 0)
    breakdown = result.get("breakdown", {})
    
    print(f"\n[FINAL ATS SCORE]: {ats_score}")
    print("\n[BREAKDOWN]")
    for component, score in breakdown.items():
        print(f"- {component}: {score}")
        
    # Verification logic based on our 35/25/20/10/10 weights
    # Skills: 4/5 matched = 80. Score = 80 * 0.35 = 28.0
    # Experience: 3/3 = 100. Score = 100 * 0.25 = 25.0
    # Projects: GitHub present + 1 project = 60. Score = 60 * 0.20 = 12.0
    # Education: Bachelors = 70. Score = 70 * 0.10 = 7.0
    # Certifications: AWS Cert present (1 * 20) = 20. Score = 20 * 0.10 = 2.0
    # Expected: 28 + 25 + 12 + 7 + 2 = 74.0
    
    print(f"\nExpected Score: ~74.0")
    
    if 70 <= ats_score <= 80:
        print("\n✅ TEST PASSED: ATS Engine is weighting components correctly.")
    else:
        print("\n❌ TEST FAILED: Score deviation is too high.")

if __name__ == "__main__":
    test_ats_scoring()
