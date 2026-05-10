
import sys
import os
from pathlib import Path

# Add backend to path
backend_dir = Path(r"c:\Users\JAYASIMBU\Downloads\Career Auto1\Career Auto1\backend")
sys.path.append(str(backend_dir))

import fitz
from ai_engine.ats_scoring.scorer import ATSScorer

def test_resume_parsing():
    pdf_path = r"c:\Users\JAYASIMBU\Downloads\Career Auto1\Career Auto1\Jayasimbu Jayamani (Java).pdf"
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return

    print(f"Analyzing: {pdf_path}")
    
    # Extract text
    doc = fitz.open(pdf_path)
    text = chr(10).join([page.get_text() for page in doc])
    doc.close()
    
    print(f"Extracted Text Length: {len(text)}")
    if len(text) < 100:
        print("Text too short!")
        print(f"Preview: {text[:200]}")
    
    # Score
    scorer = ATSScorer()
    data = {
        "resume_text": text,
        "skills": [],
        "experience_years": 0
    }
    result = scorer.score_resume_ats(data)
    print("\nScoring Result:")
    import json
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_resume_parsing()
