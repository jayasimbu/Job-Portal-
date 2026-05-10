import sys
import os
import pdfplumber

sys.path.append(os.path.abspath('c:/Users/JAYASIMBU/Downloads/Career Auto1/Career Auto1/backend'))

from modules.jobseeker.resume_parser import ResumeParser
from ai_engine.ats_scoring.scorer import ATSScorer

pdf_path = r'c:\Users\JAYASIMBU\Downloads\Career Auto1\Career Auto1\Jayasimbu Jayamani (Java).pdf'

print('Parsing PDF...')
text = ''
with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + '\n'

if not text.strip():
    print('Failed to extract text')
    sys.exit(1)

print('Running Parser...')
parser = ResumeParser()
parsed_data = parser.parse_text(text)

print('Running ATS Scorer...')
scorer = ATSScorer()
score_data = scorer.score_resume_ats(parsed_data)

print('\n=== ATS SCORE RESULTS ===')
print(f'Overall Score: {score_data["ats_score"]}/100')
print('Breakdown:')
for key, value in score_data["breakdown"].items():
    print(f'  {key}: {value}%')
