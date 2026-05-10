import sys
import os
from pathlib import Path

# Add backend to path so we can import modules
sys.path.append(str(Path(__file__).resolve().parents[1]))

from modules.jobseeker.ats_algorithm import calculate_match

def run_tests():
    print("🚀 Running AI Matcher Validation Tests...\n")

    # 👤 Persona 1: React, JavaScript
    print("👤 Persona 1: Frontend Developer (React, JS)")
    resume_frontend = {
        "skills": ["React", "JS", "HTML", "CSS"],
        "experience": 2,
        "text": "Frontend developer with 2 years of experience building React apps and writing JavaScript."
    }
    
    job_frontend = {
        "title": "Frontend Engineer",
        "skills": ["React", "JavaScript", "TypeScript", "HTML"],
        "experience": 2,
        "text": "Looking for a Frontend Engineer with React and JavaScript experience. TypeScript is a plus."
    }

    job_datascience = {
        "title": "Data Scientist",
        "skills": ["Python", "Machine Learning", "SQL", "Pandas"],
        "experience": 2,
        "text": "Looking for a Data Scientist to build Machine Learning models using Python and SQL."
    }

    score_fe = calculate_match(resume_frontend["skills"], job_frontend["skills"], resume_frontend["experience"], job_frontend["experience"], resume_frontend["text"], job_frontend["text"])
    score_ds = calculate_match(resume_frontend["skills"], job_datascience["skills"], resume_frontend["experience"], job_datascience["experience"], resume_frontend["text"], job_datascience["text"])
    
    print(f"👉 Frontend Job Match Score: {score_fe['score']}%")
    print(f"👉 Data Science Job Match Score: {score_ds['score']}%")
    assert score_fe['score'] > score_ds['score'], "❌ FAIL: Frontend dev should match FE job better than DS job."
    print("✅ PASS: Persona 1\n")

    # 👤 Persona 2: Python, ML
    print("👤 Persona 2: Data Scientist (Python, ML)")
    resume_ds = {
        "skills": ["Python", "Machine Learning", "Pandas"],
        "experience": 3,
        "text": "Data scientist with Python and Machine Learning experience."
    }

    score_ds2 = calculate_match(resume_ds["skills"], job_datascience["skills"], resume_ds["experience"], job_datascience["experience"], resume_ds["text"], job_datascience["text"])
    score_fe2 = calculate_match(resume_ds["skills"], job_frontend["skills"], resume_ds["experience"], job_frontend["experience"], resume_ds["text"], job_frontend["text"])

    print(f"👉 Data Science Job Match Score: {score_ds2['score']}%")
    print(f"👉 Frontend Job Match Score: {score_fe2['score']}%")
    assert score_ds2['score'] > score_fe2['score'], "❌ FAIL: Data Scientist should match DS job better than FE job."
    print("✅ PASS: Persona 2\n")

    # 👤 Persona 3: AWS, Docker
    print("👤 Persona 3: DevOps Engineer (AWS, Docker)")
    resume_devops = {
        "skills": ["AWS", "Docker", "Linux", "CI/CD"],
        "experience": 4,
        "text": "DevOps engineer managing AWS infrastructure, Docker containers, and CI/CD pipelines."
    }

    job_devops = {
        "title": "DevOps Engineer",
        "skills": ["Amazon Web Services", "Docker", "Kubernetes", "Linux"],
        "experience": 4,
        "text": "DevOps engineer needed. Must know Amazon Web Services, Docker, and Kubernetes."
    }

    score_do = calculate_match(resume_devops["skills"], job_devops["skills"], resume_devops["experience"], job_devops["experience"], resume_devops["text"], job_devops["text"])
    score_fe3 = calculate_match(resume_devops["skills"], job_frontend["skills"], resume_devops["experience"], job_frontend["experience"], resume_devops["text"], job_frontend["text"])

    print(f"👉 DevOps Job Match Score: {score_do['score']}%")
    print(f"👉 Frontend Job Match Score: {score_fe3['score']}%")
    assert score_do['score'] > score_fe3['score'], "❌ FAIL: DevOps should match DevOps job better than FE job."
    print("✅ PASS: Persona 3\n")
    
    print("🎉 All AI Matcher validation tests passed successfully!")

if __name__ == "__main__":
    run_tests()
