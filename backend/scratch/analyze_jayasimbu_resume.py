import sys
import os
import json
import fitz  # PyMuPDF

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from modules.jobseeker.ats_algorithm import score_resume_ats, score_job_description_ats
from modules.jobseeker.resume_parser import ResumeParser

def analyze_resume(file_path):
    print(f"--- NATIONAL LEVEL AI ANALYSIS ---")
    print(f"Target: {os.path.basename(file_path)}")
    
    # 1. Extract Text
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    
    # 2. Parse Intelligence
    parser = ResumeParser()
    extracted_data = parser.parse_text(text)
    # Add the extracted text to data for scorer
    extracted_data['resume_text'] = text
    
    # 3. Calculate Scores (Base ATS Score)
    base_scores = score_resume_ats(extracted_data)
    
    # 4. Calculate Job Specific Match (Simulated Senior Java/React Job)
    target_jd = {
        "text": "Senior Java Developer with React and AWS experience. Must know Spring Boot, Node.js and SQL."
    }
    match_scores = score_job_description_ats(extracted_data, target_jd)
    
    print(f"\n[1] PARSED ENTITIES")
    print(f"Skills Detected: {', '.join(extracted_data.get('skills', []))}")
    print(f"Experience: {extracted_data.get('experience_years', 0)} Years")
    print(f"Education: {extracted_data.get('education', 'N/A')}")
    
    print(f"\n[2] BASE ATS PROFILE SCORE")
    print(f"Score: {base_scores['final_score']}/100")
    print(f"Breakdown:")
    for k, v in base_scores['score_breakdown'].items():
        print(f" - {k.title()}: {v}")
    
    print(f"\n[3] MARKET MATCH (JAVA/REACT STACK)")
    print(f"Match Score: {match_scores['final_score']}%")
    print(f"Missing Key Keywords: {', '.join(match_scores['missing_keywords'][:5])}")
    
    print(f"\n[4] AI RECOMMENDATIONS")
    for sug in match_scores['suggestions']:
        print(f" - {sug}")
    
    print(f"\n>>> FINAL VERDICT: {match_scores['final_score']}% ATS FIT")

if __name__ == "__main__":
    resume_path = r"c:\Users\JAYASIMBU\Downloads\LINKUP1\LINKUP1\Jayasimbu Jayamani (Java).pdf"
    analyze_resume(resume_path)
