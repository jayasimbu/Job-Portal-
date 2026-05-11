import os
import sys
from pathlib import Path

# Add backend to sys.path
backend_path = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_path))

try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF not found. Please install it with 'pip install PyMuPDF'")
    sys.path.append(os.path.join(backend_path, "venv", "Lib", "site-packages"))
    import fitz

from modules.jobseeker.resume_parser import ResumeParser
from ai_engine.ats_scoring.scorer import ATSScorer

def extract_text_from_pdf(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text

def main():
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
    else:
        pdf_path = r"c:\Users\JAYASIMBU\Downloads\LINKUP1\LINKUP1\Jayasimbu Jayamani (Java).pdf"
    
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found at {pdf_path}")
        return

    print(f"Extracting text from: {pdf_path}")
    text = extract_text_from_pdf(pdf_path)
    
    if not text.strip():
        print("Error: No text extracted from PDF.")
        return

    print("Parsing resume text...")
    parser = ResumeParser()
    resume_data = parser.parse_text(text)
    
    print("Scoring resume...")
    scorer = ATSScorer()
    # Scoring without a JD for baseline
    results = scorer.score_resume_ats(resume_data)
    
    print("\n" + "="*50)
    print("ATS SCORE RESULTS")
    print("="*50)
    print(f"Final ATS Score: {results['ats_score']}/100")
    print(f"Baseline Score:  {results['baseline']}/100")
    print(f"Is Fresher:      {results['is_fresher']}")
    print("-" * 30)
    print("Breakdown:")
    for key, val in results.get('breakdown', {}).items():
        print(f"  - {key}: {val}")
    
    print("-" * 30)
    print("Extracted Skills:")
    print(", ".join(resume_data.get("skills", [])))
    print("-" * 30)
    print(f"Experience Years: {resume_data.get('experience_years')}")
    print(f"Education: {resume_data.get('education')}")
    print("="*50)

if __name__ == "__main__":
    main()
