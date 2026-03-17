"""
verify_hybrid.py
Quick verification that the hybrid formula pre-score works correctly
with alias-based semantic matching from skills_list.json + certificates_list.json
"""
import json, re

skills_dict = json.load(open('skills_list.json', encoding='utf-8'))
certs_dict  = json.load(open('certificates_list.json', encoding='utf-8'))

# Build lookup sets (same logic as ats_routes.py)
skills_lookup = set()
for k, aliases in skills_dict.items():
    skills_lookup.add(k.lower())
    if isinstance(aliases, list):
        for a in aliases:
            if isinstance(a, str):
                skills_lookup.add(a.lower().strip())

certs_lookup = set()
for k, data in certs_dict.items():
    certs_lookup.add(k.lower())
    if isinstance(data, dict):
        for a in data.get('aliases', []):
            if isinstance(a, str):
                certs_lookup.add(a.lower().strip())

print(f'SKILLS LOOKUP : {len(skills_lookup):,} tokens')
print(f'CERTS LOOKUP  : {len(certs_lookup):,} tokens')
print(f'Total canonical skills: {len(skills_dict):,}')

edu_signals = [
    (1.00, ['phd', 'ph.d', 'doctorate', 'doctor of philosophy']),
    (0.85, ['master of', 'masters', 'm.tech', 'mtech', 'mba', 'm.e.', 'msc', 'm.sc', 'pgdm', 'pg diploma']),
    (0.70, ['bachelor of', 'bachelors', 'b.tech', 'btech', 'b.e.', 'b.sc', 'bsc', 'b.com', 'bca', 'b.a.', 'undergraduate']),
    (0.50, ['diploma', 'polytechnic', 'associate degree']),
    (0.40, ['hsc', '12th grade', '12th std', 'higher secondary', 'intermediate', '+2', 'class xii', 'class 12']),
    (0.30, ['sslc', '10th grade', '10th std', 'secondary school', 'class x', 'class 10', 'matric']),
]

def compute(resume, label):
    t = resume.lower()
    cap = max(1, int(len(skills_dict) * 0.20))
    found_s = sum(1 for tok in skills_lookup if tok in t)
    found_c = sum(1 for tok in certs_lookup if tok in t)
    skills_pct = min(found_s / cap, 1.0)
    cert_pct   = min(found_c / 3.0, 1.0)

    exp_yrs = max([int(x) for x in re.findall(r'(\d+)\s*\+?\s*years?', t)], default=0)
    roles   = len(re.findall(
        r'\b(?:engineer|developer|analyst|manager|intern|consultant|designer|architect|lead|director|specialist)\b', t))
    exp_sections = len(re.findall(r'\b(?:experience|employment|work history|professional background)\b', t))
    exp_pct = min(exp_yrs * 0.15 + roles * 0.04 + exp_sections * 0.10, 1.0)

    edu_pct = 0.0
    for score, kws in edu_signals:
        if any(kw in t for kw in kws):
            edu_pct = score
            break

    base = round(
        (skills_pct * 100 * 0.40) +
        (exp_pct    * 100 * 0.30) +
        (edu_pct    * 100 * 0.20) +
        (cert_pct   * 100 * 0.10), 1
    )
    print(f'\n=== {label} ===')
    print(f'  skills_score    : {round(skills_pct*100,1):>5}  (tokens matched: {found_s}, cap: {cap})')
    print(f'  experience_score: {round(exp_pct*100,1):>5}  ({exp_yrs} yrs, {roles} role kws, {exp_sections} exp sections)')
    print(f'  education_score : {round(edu_pct*100,1):>5}')
    print(f'  cert_score      : {round(cert_pct*100,1):>5}  (cert tokens matched: {found_c})')
    print('  ─────────────────────────────')
    print(f'  BASE SCORE      : {base:>5}')


compute("""
Jane Smith | jane@email.com | Chennai, India
Skills: ReactJS, Django, PostgreSQL, Docker, Git, REST APIs, MongoDB
Education: Bachelor of Technology in Computer Science, Anna University, 2022
Experience: 2 years Software Engineer at TechCorp
  - Built REST APIs using Django REST Framework
  - Deployed apps using Docker and AWS
Certifications: AWS SAA certified (SAA-C03)
""", "Experienced Developer (B.Tech + 2yrs + AWS SAA)")


compute("""
Ravi Kumar | Python, Flask, MySQL, HTML, CSS, JavaScript
Education: B.Tech IT 2024 VIT University, CGPA 8.2
Projects: Inventory Management System using Flask and MySQL
Currently Learning: ReactJS
Hackathon: Smart India Hackathon 2023 finalist
""", "Fresher with Projects (B.Tech, no cert, no work exp)")


compute("""
Dr. Priya Nair | Machine Learning, TensorFlow, PyTorch, Python, Keras, scikit-learn
Education: PhD Computer Science, IIT Madras, 2021
5 years Research Scientist at NVIDIA
Certifications: TensorFlow Developer Certificate, AWS Machine Learning Specialty (MLS-C01)
Publications: 12 IEEE papers on Deep Learning
""", "Senior Researcher (PhD + 5yrs + 2 certs)")
