import sys
import os
from pathlib import Path

# Add parent directory to path to import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.resumeParserService import resume_parser_service

def test_parsing():
    sample_text = """
    JAYASIMBU
    Email: jayasimbu@example.com
    Phone: +91 9876543210
    
    Education:
    Bachelor of Technology in Computer Science (B.Tech)
    
    Experience:
    3+ years of experience as a Software Engineer.
    
    Skills:
    Python, JavaScript, React, Node.js, MongoDB, Docker, AWS, SQL.
    
    Projects:
    - AI Resume Analyzer: github.com/jayasimbu/resume-analyzer
    - E-commerce Platform: portfolio.jayasimbu.dev
    """
    
    print("Testing Resume Parser Service...")
    parsed = resume_parser_service.parse_text(sample_text)
    
    print("\n[EXTRACTED SKILLS]")
    print(parsed.get("skills"))
    
    print("\n[EXTRACTED EDUCATION]")
    print(parsed.get("education"))
    
    print("\n[EXTRACTED EXPERIENCE]")
    print(parsed.get("experience_years"))
    
    print("\n[EXTRACTED PROJECTS]")
    for p in parsed.get("projects", []):
        print(f"- {p['title']}")

    # Check if all required fields are present
    success = (
        len(parsed.get("skills", [])) > 0 and
        parsed.get("education") == "bachelors" and
        parsed.get("experience_years") >= 3.0 and
        len(parsed.get("projects", [])) >= 2
    )
    
    if success:
        print("\n✅ TEST PASSED: Resume engine correctly extracted all components.")
    else:
        print("\n❌ TEST FAILED: Some components were missing or incorrect.")

if __name__ == "__main__":
    test_parsing()
