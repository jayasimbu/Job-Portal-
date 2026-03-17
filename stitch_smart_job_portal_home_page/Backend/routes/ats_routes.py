"""
ats_routes.py — ATS Resume Analysis (Multi-Provider)
======================================================
POST /api/ats/analyze

Provider priority:
  gemini (1.5-flash) → gemini_8b (1.5-flash-8b) → OpenRouter → Groq → OpenAI → Anthropic → DeepSeek

Key rotation:
  On TEMPORARY rate-limit (RPM): waits with exponential backoff and retries same key (up to 3 times)
  On DAILY quota (RPD): rotates to next key immediately
  On non-quota error: skips to next provider
  No server restart ever needed — .env is hot-reloaded on every request.
"""

from flask import Blueprint, request, jsonify  # type: ignore
import json, logging, sys, os, time, re, random

import pdfplumber  # type: ignore
import pytesseract  # type: ignore
from pdf2image import convert_from_bytes  # type: ignore

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import config # type: ignore

log = logging.getLogger(__name__)
ats_bp = Blueprint('ats', __name__)

# Per-provider current key index (persists across requests within same server run)
_key_indices: dict[str, int] = {}

# ── Load Reference Dictionaries ───────────────────────────────────────────────
_BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def _load_json_ref(filename: str) -> dict:
    path = os.path.join(_BASE_DIR, filename)
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        log.warning(f"Could not load {filename}: {e}")
        return {}

_SKILLS_DICT   = _load_json_ref('skills_list.json')
_CERTS_DICT    = _load_json_ref('certificates_list.json')

# Build compact cert→skills summary for prompt injection (limit size)
def _build_cert_summary(certs: dict, max_entries: int = 80) -> str:
    lines = []
    # type: ignore (pyre doesn't track list slicing of dict items well)
    for cert_name, data in list(certs.items())[:max_entries]:
        aliases = ', '.join(data.get('aliases', [])[:4])
        skills  = ', '.join(data.get('skills', [])[:5])
        lines.append(f"- {cert_name} [{aliases}] → validates: {skills}")
    return '\n'.join(lines)

_CERT_SUMMARY = _build_cert_summary(_CERTS_DICT)


# ── Hybrid Formula — Pre-build Semantic Lookup Sets (runs once at startup) ────
#
# These flat sets include EVERY canonical name + ALL aliases from both JSON files.
# Built at module load time so _compute_base_score() is fast at request time.

def _build_skills_lookup(skills_dict: dict) -> set:
    """
    Returns a flat set of lowercased strings: canonical skill names + all aliases.
    e.g. {"react", "react js", "reactjs", "react.js", "react 18", ...}
    """
    lookup = set()
    for canonical, aliases in skills_dict.items():
        lookup.add(canonical.lower())
        if isinstance(aliases, list):
            for alias in aliases:
                if isinstance(alias, str) and alias.strip():
                    lookup.add(alias.lower().strip())
    return lookup


def _build_certs_lookup(certs_dict: dict) -> set:
    """
    Returns a flat set of lowercased strings: canonical cert names + all aliases.
    e.g. {"aws saa", "saa-c03", "aws certified solutions architect associate", ...}
    """
    lookup = set()
    for canonical, data in certs_dict.items():
        lookup.add(canonical.lower())
        if isinstance(data, dict):
            for alias in data.get('aliases', []):
                if isinstance(alias, str) and alias.strip():
                    lookup.add(alias.lower().strip())
    return lookup


_SKILLS_LOOKUP : set = _build_skills_lookup(_SKILLS_DICT)
_CERTS_LOOKUP  : set = _build_certs_lookup(_CERTS_DICT)

log.info(
    f"[HybridFormula] Loaded {len(_SKILLS_LOOKUP):,} skill tokens "
    f"and {len(_CERTS_LOOKUP):,} cert tokens from JSON reference files."
)


# ── PDF Structured Extraction Logic ──────────────────────────────────────────
def _extract_text_structured(file_storage) -> str:
    """
    Extracts text from a PDF while attempting to preserve layout structure.
    Uses pdfplumber to detect logical line breaks and columns.
    """
    full_text = []
    try:
        # Load PDF from memory (file_storage is a Werkzeug FileStorage object)
        with pdfplumber.open(file_storage) as pdf:  # type: ignore
            for page in pdf.pages:
                # Use extract_text with layout=True to maintain columns/spacing
                page_text = page.extract_text(
                    layout=True,
                    use_text_flow=True,
                    x_tolerance=3,
                    y_tolerance=3
                )
                if page_text:
                    full_text.append(page_text)
                
                # Optionally extract links (positives for ATS or contact info)
                # Hyperlinks are stored in page.hyperlinks
                if hasattr(page, 'hyperlinks') and page.hyperlinks:
                    links_text = "\n[Extracted Links]: " + ", ".join([h.get('uri', '') for h in page.hyperlinks if h.get('uri')])
                    full_text.append(links_text)

        return "\n\n".join(full_text).strip()
    except Exception as e:
        log.error(f"Structured PDF extraction failed: {e}")
        return ""


# ── Hybrid Formula Pre-Score ──────────────────────────────────────────────────
def _compute_base_score(resume_text: str) -> dict:
    """
    Semantic heuristic pass on raw resume text using skills_list.json and
    certificates_list.json (canonical names + ALL aliases).
    Does NOT replace AI scoring — used only to enrich the response with formula fields.

    Formula:
        ATS Score = (Skills×0.40) + (Experience×0.30) + (Education×0.20) + (Certs×0.10)

    Matching strategy (mirrors AI semantic philosophy):
      - Skills: canonical name OR any alias from skills_list.json
      - Certs:  canonical name OR any alias from certificates_list.json
      - No exact-boundary requirement — substring match (same approach as AI prompts)
    """
    text_lower = resume_text.lower()

    # ── Skills Score (0-100) ──────────────────────────────────────────────────
    # Match against the full flat set: canonical names + all aliases
    # Cap at 20 distinct skill tokens found → 100%
    found_skills = sum(1 for token in _SKILLS_LOOKUP if token in text_lower)
    # Normalise: each canonical skill may have many aliases so use original key count as cap
    total_canonical_skills = len(_SKILLS_DICT)
    # Scale: 20% of all known skills → 100% (generous, mirrors AI expectations)
    skills_cap = max(1, int(total_canonical_skills * 0.20))
    skills_pct = min(found_skills / skills_cap, 1.0)

    # ── Experience Score (0-100) ──────────────────────────────────────────────
    # Explicit "X years" pattern
    exp_year_matches = re.findall(
        r'(\d+)\s*\+?\s*years?\s*(?:of\s*)?(?:experience|exp)',
        text_lower
    )
    years = max([int(y) for y in exp_year_matches], default=0)

    # Count distinct experience/role mentions (title keywords = signal of exp depth)
    role_blocks = len(re.findall(
        r'\b(?:engineer|developer|analyst|manager|intern|consultant|'
        r'designer|architect|lead|director|specialist|officer|executive)\b',
        text_lower
    ))
    # Detected present/past sections also count
    exp_sections = len(re.findall(
        r'\b(?:experience|employment|work history|professional background|'
        r'career history|positions? held)\b',
        text_lower
    ))
    exp_pct = min((years * 0.15) + (role_blocks * 0.04) + (exp_sections * 0.10), 1.0)

    # ── Education Score (0-100) ───────────────────────────────────────────────
    # Highest detected degree level wins; ordered highest → lowest
    edu_signals = [
        (1.00, ['phd', 'ph.d', 'doctorate', 'doctor of philosophy']),
        (0.85, ['master of', "master's", 'm.tech', 'mtech', 'mba', 'm.e.',
                'msc', 'm.sc', 'pgdm', 'post graduate diploma', 'pg diploma']),
        (0.70, ['bachelor of', "bachelor's", 'b.tech', 'btech', 'b.e.',
                'b.sc', 'bsc', 'b.com', 'bca', 'b.a.', 'undergraduate']),
        (0.50, ['diploma', 'polytechnic', 'associate degree']),
        (0.40, ['hsc', '12th grade', '12th std', 'higher secondary',
                'intermediate', 'pu college', '+2', 'class xii', 'class 12']),
        (0.30, ['sslc', '10th grade', '10th std', 'secondary school',
                'class x', 'class 10', 'matric']),
    ]
    edu_pct = 0.0
    for score, keywords in edu_signals:
        if any(kw in text_lower for kw in keywords):
            edu_pct = max(edu_pct, score)
            break   # stop at the highest match found

    # ── Certification Score (0-100) ───────────────────────────────────────────
    # Match against full flat set: cert canonical names + ALL aliases
    # Cap at 3 distinct cert tokens found → 100% (conservative, mirrors formula intent)
    found_certs = sum(1 for token in _CERTS_LOOKUP if token in text_lower)
    cert_pct = min(found_certs / 3.0, 1.0)

    # ── Weighted Formula ──────────────────────────────────────────────────────
    overall_weighted_pct = (
        (skills_pct * 0.40) +  # type: ignore
        (exp_pct    * 0.30) +  # type: ignore
        (edu_pct    * 0.20) +  # type: ignore
        (cert_pct   * 0.10)    # type: ignore
    ) * 100

    return {
        "base_score"         : round(overall_weighted_pct, 1), # type: ignore
        "skills_score"       : round(skills_pct  * 100, 1), # type: ignore
        "experience_score"   : round(exp_pct     * 100, 1), # type: ignore
        "education_score"    : round(edu_pct     * 100, 1), # type: ignore
        "cert_score"         : round(cert_pct    * 100, 1), # type: ignore
        "skills_found"       : found_skills,
        "certs_found"        : found_certs,
        "formula"            : "(Skills×0.40) + (Experience×0.30) + (Education×0.20) + (Certs×0.10)"
    }

# Signals that mean daily quota is truly gone → rotate to next key
_DAILY_QUOTA_SIGNALS = (
    "resource_exhausted", "quota_exceeded", "daily", "per day",
    "insufficient_quota", "you exceeded"
)

# Signals that mean temporary rate-limit (RPM) → backoff + retry same key
_RATE_LIMIT_SIGNALS = (
    "rate limit", "rate_limit", "too many requests", "429",
    "retry_after", "requests per minute",
)


def _is_daily_quota_error(err: Exception) -> bool:
    msg = str(err).lower()
    return any(s in msg for s in _DAILY_QUOTA_SIGNALS)


def _is_rate_limit_error(err: Exception) -> bool:
    msg = str(err).lower()
    # Only a rate-limit if NOT a daily quota
    return any(s in msg for s in _RATE_LIMIT_SIGNALS) and not _is_daily_quota_error(err)


def _is_quota_error(err: Exception) -> bool:
    """Any kind of quota / rate error → rotate or retry."""
    return _is_daily_quota_error(err) or _is_rate_limit_error(err)


# ── ATS Prompt ────────────────────────────────────────────────────────────────
_ATS_PROMPT_TEMPLATE = """
You are an expert ATS (Applicant Tracking System) evaluator and career coach with universal domain knowledge.

Analyze the resume against the job description using a Deep Semantic Matching Algorithm.
DO NOT rely on exact substring matches. Use logical deductive reasoning:

1. **Conceptual Demonstration**: If a required skill (e.g. "Data Analysis") is demonstrated through work/projects (e.g. "Analyzed 2M rows using Pandas"), count it as MATCHED.

2. **Acronym & Stack Unrolling**: If the resume mentions a stack/acronym (e.g., "MERN", "LAMP", "AWS", "MEAN") that encompasses required individual technologies (e.g., "React", "Node.js", "MongoDB"), you MUST mark ALL those implied technologies as MATCHED.
   - Example: "React (Implied by MERN Stack)" — DO NOT list these under `missing_keywords`.

3. **Universal Typographical & Synonym Handling (Critical)**: Act as a Universal Semantic Normalizer for ALL industries — IT, engineering, medicine, finance, design, law, etc.:
   - Match ANY typographical variant, abbreviation, or synonym (e.g. 'Springboot'='Spring Boot', 'K8s'='Kubernetes', 'SEO'='Search Engine Optimization', 'BIM'='Building Information Modeling', 'CPA'='Certified Public Accountant').
   - DO NOT penalize spacing, casing, or phrasing differences.
   - If ANY valid variant found → list under `matched_keywords`. Never penalize aliases.

4. **Certificate-to-Skill Inference (Important)**: If the resume contains a certification, you MUST infer and credit all skills that certification validates:
   - AWS SAA / SAA-C03 → validates: Cloud Architecture, AWS EC2, AWS S3, AWS RDS, AWS VPC
   - CKA / Kubernetes Admin cert → validates: Kubernetes, Docker, Linux, DevOps
   - PMP / Project Management Professional → validates: Project Management, Risk Management, Agile
   - CISSP → validates: Cybersecurity, Security Architecture, Risk Management
   - CFA → validates: Financial Analysis, Investment Analysis, Financial Modeling
   - Six Sigma Green Belt / Black Belt → validates: Six Sigma, Lean, Process Improvement
   - CCNA → validates: Cisco Networking, Routing Protocols, Switching, Network Engineering
   - And ALL other recognized certifications — treat them as direct proof of their validated skills.
   Use the CERTIFICATE REFERENCE provided below to do this for ALL certificates.

5. **Before outputting JSON**, write a `<reasoning>` block:
<reasoning>
- Briefly note each semantic inference made (stack unrolling, synonym matching, cert-to-skill mapping)
</reasoning>
Then return ONLY valid JSON — no markdown fences, no text outside JSON.

--- CERTIFICATE REFERENCE (cert name [aliases] → skills it validates) ---
{cert_summary}
--- END CERTIFICATE REFERENCE ---

--- SKILL → CATEGORY MAPPING (CRITICAL — read before marking anything missing) ---
When a job description uses a CATEGORY LABEL (like "Backend Technologies", "Java Frameworks"),
you MUST check if the candidate already has ANY specific skill that belongs to that category.
If they do → the category is SATISFIED → do NOT add it to missing_keywords.

BACKEND TECHNOLOGIES category is satisfied by ANY of:
  Spring Boot, Node.js, Django, Flask, FastAPI, Express.js, ASP.NET, Laravel, Ruby on Rails,
  NestJS, Gin, Echo, Fiber, Spring MVC, Spring Framework, Hibernate, JPA, Ktor, Vert.x,
  Grails, Play Framework, Micronaut, Quarkus, Struts, JSF, Servlet/JSP, PHP, CodeIgniter,
  Symfony, CakePHP, Yii, Slim, Sinatra, Hapi.js, Adonis.js, Sails.js, Tornado, Bottle,
  Pyramid, Falcon, Starlette, Lumen, Phalcon

JAVA FRAMEWORKS category is satisfied by ANY of:
  Spring Boot, Spring MVC, Spring Framework, Hibernate, JPA, Spring Data JPA, MyBatis,
  Struts, JSF, Java EE, Jakarta EE, Micronaut, Quarkus, Vert.x, Grails, Play Framework,
  Dropwizard, Jersey, Spark Java, GWT

FRONTEND TECHNOLOGIES / FRONTEND FRAMEWORKS category is satisfied by ANY of:
  React, Angular, Vue.js, Svelte, Next.js, Nuxt.js, Remix, Gatsby, Ember.js, Backbone.js,
  jQuery, Alpine.js, Lit, Solid.js, Qwik, HTML5, CSS3, Bootstrap, Tailwind CSS, Material UI

DATABASES / DATABASE MANAGEMENT category is satisfied by ANY of:
  MySQL, PostgreSQL, MongoDB, SQLite, Oracle DB, MS SQL Server, Redis, Cassandra, DynamoDB,
  Firebase, Neo4j, MariaDB, CockroachDB, H2, Derby, Elasticsearch

CLOUD / CLOUD TECHNOLOGIES / CLOUD SERVICES category is satisfied by ANY of:
  AWS, Azure, GCP, Google Cloud, Heroku, DigitalOcean, Vercel, Netlify, Render, Railway,
  AWS EC2, AWS S3, AWS Lambda, AWS RDS, Azure Functions, GKE, EKS

DEVOPS / CI-CD category is satisfied by ANY of:
  Docker, Kubernetes, Jenkins, GitHub Actions, GitLab CI, Travis CI, CircleCI, ArgoCD,
  Terraform, Ansible, Puppet, Chef, Helm, Spinnaker

VERSION CONTROL / VCS category is satisfied by ANY of:
  Git, GitHub, GitLab, Bitbucket, SVN, Mercurial

PROGRAMMING LANGUAGES category is satisfied by ANY Java, Python, JavaScript, TypeScript,
  C, C++, C#, Go, Rust, Kotlin, Swift, Ruby, PHP, Scala, R, MATLAB, Dart, Elixir

MOBILE DEVELOPMENT category is satisfied by ANY of:
  React Native, Flutter, Android (Kotlin/Java), iOS (Swift/ObjC), Xamarin, Ionic, Cordova,
  Expo, NativeScript, Capacitor

DATA SCIENCE / MACHINE LEARNING category is satisfied by ANY of:
  TensorFlow, PyTorch, scikit-learn, Keras, Pandas, NumPy, Matplotlib, Seaborn,
  XGBoost, LightGBM, OpenCV, Hugging Face, NLTK, spaCy

TESTING / QA category is satisfied by ANY of:
  JUnit, TestNG, Mockito, Selenium, Cypress, Jest, Mocha, Chai, PyTest, Robot Framework,
  Postman, REST Assured, Playwright

--- END SKILL → CATEGORY MAPPING ---

5. **Candidate Type Detection**: At the end, add a `"candidate_type"` field:
   - `"fresher"` → 0 work experience, or only student internships
   - `"experienced"` → 1+ years of industry work experience
   - `"internship"` → Currently a student applying for internship roles

6. **Project Quality (For Freshers)**: If candidate is fresher, evaluate project quality:
   - `"project_score"` (0-30): Rate projects on innovation (0-10), complexity (0-8), own logic (0-5), real-world impact (0-4), deployment/GitHub (0-3)
   - Innovative/AI projects → 26-30, own logic full-stack → 18-22, basic template → 10-16

7. **"Currently Learning" Handling (Important)**: If a skill is listed as "Currently Learning" in the resume:
   - STILL count it as MATCHED (the candidate IS learning it, showing initiative)
   - Add a note like "Spring Boot (Currently Learning — add practical project to strengthen)"
   - Never put "Currently Learning" skills under missing_keywords
   - Instead, add it as an improvement: "Build a Spring Boot REST API project and add to GitHub to demonstrate practical experience"

JSON format:
{{
  "ats_score": <integer 0-100>,
  "candidate_type": "fresher" | "experienced" | "internship",
  "project_score": <integer 0-30, 0 if not fresher>,
  "summary": "<2-3 sentence overall assessment>",
  "why_fit": "<2-3 localized sentences explaining specifically WHY this candidate is a fit for this specific job, referencing actual skills, experience, or projects from their resume>",
  "matched_keywords": ["keyword1 (Demonstrated via...)", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2"],
  "improvements": [
    "DISTINGUISH CLEARLY between 'Format Issues' (e.g., 'Add a summary section') and 'Skill Match Gaps' (e.g., 'The JD requires MongoDB, which is missing from your Tech Stack'). Suggestions MUST BE ACTIONABLE and mention SPECIFIC LOCATIONS in the resume (e.g., 'Add Python to your skills list' or 'Elaborate on your React experience in the Software Engineer role at Google'). DO NOT give generic advice. MUST TAILOR suggested bullet points to match the verbs/keywords in the JOB DESCRIPTION.",
    "Another specific, location-aware suggestion focused entirely on bridging the gap between the candidate's existing experience and the specific requirements of THIS job description..."
  ],
  "section_scores": {{
    "skills_match": <0-100>,
    "experience_relevance": <0-100>,
    "education_match": <0-100>,
    "format_ats_friendliness": <0-100>
  }},
  "breakdown": {{
    "resume_score": <0-100>,
    "skill_breadth": <integer out of 15, representing skill coverage>,
    "learning_consistency": <integer representing streak or activity level (e.g., 3)>
  }},
  "personal_info": {{
    "name": "<extracted full name or empty string>",
    "email": "<extracted email or empty string>",
    "phone": "<extracted phone number or empty string>",
    "links": ["<extracted url (e.g. github/linkedin/portfolio)>"]
  }},
  "experience": [
    {{
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<e.g., 2020-2023>"
    }}
  ],
  "education": [
    {{
      "institution": "<school name>",
      "degree": "<degree obtained>",
      "year": "<graduation year>"
    }}
  ]
}}

FRESHER SCORING GUIDANCE (apply when candidate_type == "fresher"):
Use weighted scoring: Skills 40% + Projects 30% + Alt-Exp(internship/OSS/hackathon) 15% + Certs 5% + Education 10%.
For experienced candidates: Skills 50% + Experience 30% + Projects 10% + Certs 10%.
For internship candidates: Skills 40% + Projects 30% + Education 20% + Certs 10%.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""


def _build_ats_prompt(resume_text: str, job_description: str) -> str:
    """Build the final ATS prompt injecting cert reference + resume + JD."""
    return _ATS_PROMPT_TEMPLATE.format(
        cert_summary=_CERT_SUMMARY,
        resume_text=resume_text,
        job_description=job_description
    )


# ── candidateType Persistence ─────────────────────────────────────────────────

_DB_ROOT      = os.path.abspath(os.path.join(_BASE_DIR, '..', 'DB'))
_JOBSEEKER_DIR = os.path.join(_DB_ROOT, 'Job Seeker')
_EMPLOYER_DIR  = os.path.join(_DB_ROOT, 'Employer')

def _persist_candidate_type(email: str, candidate_type: str):
    """
    Save the detected candidateType to the user's JSON file in DB/Job Seeker/.
    Called silently after every successful ATS analysis — does not block response.
    """
    if not email:
        return
    try:
        for folder in [_JOBSEEKER_DIR, _EMPLOYER_DIR]:
            if not os.path.isdir(folder):
                continue
            for fname in os.listdir(folder):
                if not fname.endswith('.json'):
                    continue
                fpath = os.path.join(folder, fname)
                try:
                    with open(fpath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    if data.get('email', '').lower() == email.lower():
                        if data.get('candidateType') != candidate_type:
                            data['candidateType'] = candidate_type
                            with open(fpath, 'w', encoding='utf-8') as f:
                                json.dump(data, f, indent=2)
                            log.info(f"[ATS] Persisted candidateType='{candidate_type}' for {email}")
                        return
                except Exception:
                    continue
    except Exception as ex:
        log.warning(f"[ATS] Could not persist candidateType: {ex}")



def _clean_json(raw: str) -> dict:
    """Strip reasoning blocks and parse JSON."""
    raw = raw.strip()
    
    # Strip <reasoning> blocks if the LLM outputted them
    if "<reasoning>" in raw:
        raw = re.sub(r'<reasoning>.*?</reasoning>', '', raw, flags=re.DOTALL).strip()
        
    if raw.startswith("```"):
        parts = raw.split("```")
        raw = parts[1].lstrip("json").strip() if len(parts) > 1 else raw
    return json.loads(raw)


def _call_gemini(api_key: str, prompt: str, model: str) -> dict:
    import google.generativeai as genai # type: ignore
    genai.configure(api_key=api_key)
    response = genai.GenerativeModel(model).generate_content(prompt)
    return _clean_json(response.text)


def _call_openai_compat(api_key: str, prompt: str, model: str, base_url: str) -> dict:
    from openai import OpenAI # type: ignore
    client = OpenAI(api_key=api_key, base_url=base_url)
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    return _clean_json(response.choices[0].message.content)


def _call_ollama_local(prompt: str, model: str) -> dict:
    """
    Call the local Ollama daemon via its OpenAI-compatible endpoint.
    No real API key is required — uses 'ollama' as a placeholder.
    Raises ConnectionRefusedError if the Ollama daemon is not running.
    Raises RuntimeError if the model is not installed locally.
    """
    from openai import OpenAI # type: ignore
    import httpx # type: ignore
    try:
        client = OpenAI(
            api_key="ollama",
            base_url="http://localhost:11434/v1",
            timeout=90.0,  # local inference can be slow
        )
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        return _clean_json(response.choices[0].message.content)
    except httpx.ConnectError as e:
        raise ConnectionRefusedError(f"Ollama daemon not running: {e}")
    except Exception as e:
        err = str(e)
        # Ollama returns 404 for models that haven't been pulled
        if "404" in err or "not found" in err.lower() or "pull" in err.lower():
            raise RuntimeError(f"Ollama model '{model}' not installed (run: ollama pull {model})")
        raise


def _call_anthropic(api_key: str, prompt: str, model: str) -> dict:
    import anthropic # type: ignore
    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model=model,
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )
    return _clean_json(response.content[0].text)


def _call_provider(provider_name: str, api_key: str, prompt: str, model: str) -> dict:
    """Dispatch call to the correct SDK based on provider type."""
    cfg = config.PROVIDERS[provider_name]
    ptype = cfg["type"]

    if ptype == "ollama_local":
        return _call_ollama_local(prompt, model)
    elif ptype == "gemini":
        return _call_gemini(api_key, prompt, model)
    elif ptype == "anthropic":
        return _call_anthropic(api_key, prompt, model)
    elif ptype == "openai_compat":
        return _call_openai_compat(api_key, prompt, model, cfg["base_url"])
    else:
        raise ValueError(f"Unknown provider type: {ptype}")


def _call_with_fallback(prompt: str) -> dict:
    """
    Generic provider fallback chain.
    Priority: ollama_local → ollama_cloud → gemini → openrouter → groq → ...
    Returns the parsed dict on success, raises RuntimeError with all errors if exhausted.
    """
    live_keys = config.reload_keys()
    if not live_keys:
        raise RuntimeError("NO_PROVIDERS: No AI providers are available. Add API keys to backend/.env or install Ollama.")

    all_errors = []
    for provider_name, keys in live_keys.items():
        models = config.PROVIDERS[provider_name].get("models", [])
        is_local = provider_name == "ollama_local"

        # For ollama_local: try model loop with retries
        if is_local:
            brand_failures = 0
            for model_name in models:
                if brand_failures >= 5:
                    break
                key_model_label = f"{provider_name}[local][{model_name}]"
                log.info(f"[extract] Trying {key_model_label}")
                for attempt in range(1, 4):
                    try:
                        result = _call_provider(provider_name, "__local__", prompt, model_name)
                        log.info(f"[extract] ✓ success via {key_model_label}")
                        return result
                    except ConnectionRefusedError:
                        log.warning("[extract] Ollama daemon not running — skipping all local models")
                        all_errors.append(f"{provider_name} OFFLINE")
                        brand_failures = 99
                        break
                    except Exception as e:
                        log.warning(f"[extract] ✗ {key_model_label} attempt {attempt}: {e}")
                        if _is_rate_limit_error(e) and attempt < 3:
                            wait = (2 ** attempt) + random.uniform(0.5, 1.5)
                            time.sleep(wait)
                            continue
                        err_msg = str(e)
                        all_errors.append(f"{key_model_label} ERROR: {err_msg[:60]}")
                        brand_failures += 1
                        break
                if brand_failures == 99: break
            continue

        # For keyed providers (ollama_cloud, gemini, groq, etc.)
        idx = _key_indices.get(provider_name, 0)
        keys_tried = 0
        total_keys = len(keys)
        brand_failures = 0

        while keys_tried < total_keys and brand_failures < 5:
            current_key = keys[idx % total_keys]  # type: ignore
            skip_key = False
            for model_name in models:
                if skip_key or brand_failures >= 5:
                    break
                
                key_model_label = f"{provider_name}[key{(idx % total_keys)+1}/{total_keys}][{model_name}]"  # type: ignore
                log.info(f"[extract] Trying {key_model_label}")
                for attempt in range(1, 4):
                    try:
                        result = _call_provider(provider_name, current_key, prompt, model_name)
                        _key_indices[provider_name] = idx
                        log.info(f"[extract] ✓ success via {key_model_label}")
                        return result
                    except Exception as e:
                        log.warning(f"[extract] ✗ {key_model_label} attempt {attempt}: {e}") # type: ignore
                        if _is_daily_quota_error(e):
                            all_errors.append(f"{key_model_label} DAILY_QUOTA")
                            brand_failures += 1
                            skip_key = True
                            break
                        elif _is_rate_limit_error(e):
                            # Backoff for temporary RPM with a bit of jitter (more human-like)
                            wait = (2 ** attempt) + random.uniform(0.5, 1.5)
                            log.info(f"[extract] Rate limit hit. Waiting {wait:.2f}s before retry {attempt}...")
                            time.sleep(wait)
                            if attempt == 3:
                                # Failed this model 3 times
                                brand_failures += 1
                                # If brand failures high, skip to next provider
                                if brand_failures >= 5:
                                    break
                                # Otherwise, decide whether to skip key or try next model
                                if provider_name not in ("groq", "ollama_cloud"):
                                    skip_key = True
                        else:
                            err_txt = str(e)
                            all_errors.append(f"{key_model_label} ERROR: {err_txt[:80]}")
                            brand_failures += 1
                            if "401" in err_txt or "invalid_api_key" in err_txt.lower() or "authentication" in err_txt.lower():
                                skip_key = True
                            break
            # Proceed to the next key since this key failed on all its models or was skipped
            idx += 1  # type: ignore
            keys_tried += 1  # type: ignore
            _key_indices[provider_name] = idx

    raise RuntimeError(f"NO_PROVIDERS: All providers exhausted. Errors: {all_errors}")


# ── Extraction Prompt ─────────────────────────────────────────────────────────

_EXTRACT_PROMPT_TEMPLATE = """
You are a precise resume parser. Extract ALL structured information from the resume below.

CRITICAL RULES:
1. Extract EVERY URL/link present — GitHub, LinkedIn, LeetCode, HackerRank, Codeforces, Kaggle,
   CodeChef, GeeksForGeeks, HackerEarth, portfolio sites, personal websites, any other profile URL.
   DO NOT skip any URL under any circumstances.
2. Extract EVERY education entry — including 10th/SSLC, 12th/HSc/Intermediate, diploma, UG degree,
   PG degree, PhD.
3. Extract ALL certificates, online courses, or bootcamp certifications into a dedicated certificates array.
4. Extract the location even if it's just a city or region (e.g. "Chennai, TN" or "India").
5. Extract the About Me / Professional Summary / Objective section if present.
6. DO NOT invent or assume anything not in the resume. Use empty string "" or [] for missing fields.

Return ONLY valid JSON — no markdown fences, no text outside JSON.

JSON format:
{{
  "about_me": "<full text of About Me / Summary / Objective section, or empty string>",
  "location": "<city, state, country or any location found, or empty string>",
  "links": [
    "<full URL or profile handle — include ALL links found in the resume>"
  ],
  "personal_info": {{
    "name": "<full name>",
    "email": "<email>",
    "phone": "<phone number>"
  }},
  "education": [
    {{
      "type": "<one of: ug | pg | phd | hsc | sslc | diploma | other>",
      "degree": "<full degree/qualification name, e.g. 'Bachelor of Engineering in CSE', 'HSc (12th Grade)', 'SSLC (10th Grade)'>",
      "institution": "<school/college/university name>",
      "board_or_university": "<board or university name, e.g. 'CBSE', 'Anna University', or empty>",
      "percentage_or_cgpa": "<marks/grade/cgpa if mentioned, or empty>",
      "year": "<graduation/passing year or expected year>"
    }}
  ],
  "certificates": [
    {{
      "name": "<name of the certificate/course>",
      "issuer": "<issuing organization, e.g. 'AWS', 'Coursera', 'HackerRank', or empty>",
      "issue_date": "<date/year issued, or empty>",
      "credential_id": "<credential ID or URL if mentioned, or empty>"
    }}
  ],
  "experience": [
    {{
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<date range, e.g. Jun 2023 – Present>",
      "description": "<key responsibilities or achievements, or empty>"
    }}
  ],
  "skills": ["<skill 1>", "<skill 2>"]
}}

RESUME:
{resume_text}
"""


def _build_extract_prompt(resume_text: str) -> str:
    return _EXTRACT_PROMPT_TEMPLATE.format(resume_text=resume_text)


# ── Main Route ────────────────────────────────────────────────────────────────

@ats_bp.route('/api/ats/analyze', methods=['POST'])
def analyze_resume():
    """
    Analyze resume vs job description for ATS compatibility.

    Body: { "resume_text": "...", "job_description": "..." }
    Response: { "success": true, "data": {...}, "provider": "gemini", "key_index": 1 }
    """
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No JSON body provided"}), 400

    resume_text    = (data.get("resume_text") or "").strip()
    job_description = (data.get("job_description") or "").strip()

    if not resume_text:
        return jsonify({"success": False, "error": "resume_text is required"}), 400
    if not job_description:
        return jsonify({"success": False, "error": "job_description is required"}), 400

    prompt = _build_ats_prompt(resume_text, job_description)

    # Hot-reload .env to pick up any newly added keys on every request
    live_keys = config.reload_keys()

    if not live_keys:
        return jsonify({
            "success": False,
            "error": "No API keys found. Add at least one key to backend/.env"
        }), 503

    all_errors = []

    # ── Provider → Key → Model fallback chain ─────────────────────────────────
    for provider_name, keys in live_keys.items():
        idx = _key_indices.get(provider_name, 0)
        keys_tried = 0
        total_keys = len(keys)
        models = config.PROVIDERS[provider_name].get("models", [])

        # For ollama_local: only one iteration (no key rotation), just model loop
        is_local = provider_name == "ollama_local"
        if is_local:
            for model_name in models:
                key_model_label = f"{provider_name}[local][{model_name}]"
                log.info(f"Trying {key_model_label}")
                try:
                    result = _call_provider(provider_name, "__local__", prompt, model_name)
                    log.info(f"✓ ATS success via {key_model_label}")
                    if "improvements" not in result or not result["improvements"]:
                        result["improvements"] = ["Tailor your resume more specifically to the job description keywords."]
                    if "breakdown" not in result:
                        result["breakdown"] = {"resume_score": result.get("ats_score", 50), "skill_breadth": min(15, len(result.get("matched_keywords", []))), "learning_consistency": 3}
                    if "section_scores" not in result:
                        result["section_scores"] = {"format_ats_friendliness": result.get("ats_score", 50)}
                    if "candidate_type" not in result:
                        result["candidate_type"] = "fresher"
                    if "project_score" not in result:
                        result["project_score"] = 0

                    # ── Hybrid Formula Fields (additive — AI scoring unchanged) ──
                    _base = _compute_base_score(resume_text)
                    matched_kw = result.get('matched_keywords', [])
                    missing_kw = result.get('missing_keywords', [])
                    _total_kw  = len(matched_kw) + len(missing_kw)
                    _match_score   = round((len(matched_kw) / max(_total_kw, 1)) * 100, 1) # type: ignore
                    _ranking_score = round((result.get('ats_score', 0) * 0.6) + (_match_score * 0.4), 1) # type: ignore
                    result['match_score']   = _match_score
                    result['ranking_score'] = _ranking_score
                    result['formula_base']  = _base

                    return jsonify({"success": True, "data": result, "provider": provider_name, "model": model_name, "key_index": 0, "candidate_type": result.get("candidate_type", "fresher")}), 200
                except ConnectionRefusedError:
                    log.warning("Ollama daemon not running — skipping all local models")
                    all_errors.append(f"{provider_name} OFFLINE")
                    break
                except Exception as e:
                    log.warning(f"✗ {key_model_label}: {e}") # type: ignore
                    all_errors.append(f"{key_model_label} ERROR: {e}") # type: ignore
            continue   # skip key-rotation loop for local

        while keys_tried < total_keys:
            current_key = keys[idx % total_keys]  # type: ignore
            skip_key = False
            
            for model_name in models:
                if skip_key:
                    break
                    
                key_model_label = f"{provider_name}[key{(idx % total_keys) + 1}/{total_keys}][{model_name}]"  # type: ignore
                log.info(f"Trying {key_model_label}")

                # ── Smart retry: backoff for RPM, immediate rotate for RPD ────────
                for attempt in range(1, 4):  # up to 3 attempts per key+model
                    try:
                        result = _call_provider(provider_name, current_key, prompt, model_name)
                        _key_indices[provider_name] = idx
                        log.info(f"✓ ATS success via {key_model_label} (attempt {attempt})")

                        # ── Fallback logic for critical missing fields ────────
                        if "improvements" not in result or not result["improvements"]:
                            result["improvements"] = [
                                "Tailor your resume more specifically to the job description keywords.",
                                "Ensure your impact is quantifiable in your experience section (e.g., increased sales by X%).",
                                "Review the missing keywords and incorporate them where appropriate to boost your ATS score."
                            ]
                        if "why_fit" not in result or not result["why_fit"]:
                            result["why_fit"] = (
                                f"Based on our analysis, your profile demonstrates strong foundational skills "
                                f"that align with the core requirements of this role. Your background in "
                                f"{', '.join(result.get('matched_keywords', [])[:3]) or 'relevant technologies'} "
                                f"makes you a competitive candidate."
                            )
                        if "breakdown" not in result:
                            total = result.get("ats_score", 50)
                            result["breakdown"] = {
                                "resume_score": total,
                                "skill_breadth": min(15, len(result.get("matched_keywords", []))),
                                "learning_consistency": 3
                            }
                        if "section_scores" not in result:
                            result["section_scores"] = {
                                "format_ats_friendliness": result.get("ats_score", 50)
                            }
                        # Ensure candidateType is always present
                        if "candidate_type" not in result:
                            exp = result.get("experience", [])
                            has_work_exp = any(
                                e.get("company") and "intern" not in (e.get("role") or "").lower()
                                for e in exp
                            )
                            result["candidate_type"] = "experienced" if has_work_exp else "fresher"
                        if "project_score" not in result:
                            result["project_score"] = 0

                        # ── Hybrid Formula Fields (additive — AI scoring unchanged) ──
                        _base = _compute_base_score(resume_text)
                        matched_kw = result.get('matched_keywords', [])
                        missing_kw = result.get('missing_keywords', [])
                        _total_kw  = len(matched_kw) + len(missing_kw)
                        _match_score   = round((len(matched_kw) / max(_total_kw, 1)) * 100, 1) # type: ignore
                        _ranking_score = round((result.get('ats_score', 0) * 0.6) + (_match_score * 0.4), 1) # type: ignore
                        result['match_score']   = _match_score
                        result['ranking_score'] = _ranking_score
                        result['formula_base']  = _base

                        # ── Persist candidateType to user DB ─────────────────
                        _persist_candidate_type(
                            email=request.json.get("email") or request.json.get("userEmail") or "",
                            candidate_type=result.get("candidate_type", "fresher")
                        )

                        return jsonify({
                            "success"        : True,
                            "data"           : result,
                            "provider"       : provider_name,
                            "model"          : model_name,
                            "key_index"      : (idx % total_keys) + 1,
                            "candidate_type" : result.get("candidate_type", "fresher")
                        }), 200

                    except Exception as e:
                        log.warning(f"✗ {key_model_label} attempt {attempt}: {e}") # type: ignore

                        if _is_daily_quota_error(e):
                            # Daily limit hit → rotate to NEXT KEY entirely
                            all_errors.append(f"{key_model_label} DAILY_QUOTA: {e}") # type: ignore
                            skip_key = True
                            break  # out of retry loop
                        
                        elif _is_rate_limit_error(e):
                            # Temporary RPM limit → backoff and retry same key+model
                            wait = 2 ** attempt  # 2s, 4s, 8s
                            log.info(f"  RPM limit — waiting {wait}s before retry...")
                            time.sleep(wait)
                            all_errors.append(f"{key_model_label} RPM_attempt{attempt}: retrying after {wait}s")
                            if attempt == 3:
                                # On max RPM retries:
                                # - groq/ollama_cloud: try the next model on the same key
                                # - others: skip to the next key entirely to save time
                                if provider_name not in ("groq", "ollama_cloud"):
                                    skip_key = True
                                    log.info(f"  Max RPM retries reached. Skipping remaining models for {provider_name} key.")
                            # continue retry loop
                        
                        else:
                            # Non-quota error (bad key, network, parse error) -> skip key if auth error, else next model
                            all_errors.append(f"{key_model_label} ERROR: {e}")
                            if "401" in str(e) or "invalid_api_key" in str(e).lower() or "authentication" in str(e).lower():
                                skip_key = True
                            break  # out of retry loop
                else:
                    # All 3 RPM-retry attempts failed for this model -> skip to next model (if not skipped above)
                    pass

            # All models exhausted on this key -> rotate to next key
            idx += 1  # type: ignore
            keys_tried += 1  # type: ignore
            fresh = config.reload_keys()
            keys  = fresh.get(provider_name, keys)
            total_keys = len(keys)
            _key_indices[provider_name] = idx

    # All providers exhausted
    log.error(f"All providers failed. Errors: {all_errors}")

    return jsonify({
        "success": False,
        "error_code": "no_providers",
        "error": "No AI providers are available. Install Ollama locally or add API keys to backend/.env.",
        "details": all_errors
    }), 503

    # Give the user a friendly message based on what actually happened
    all_daily = all(("DAILY_QUOTA" in e or "RPM" in e) for e in all_errors)
    if all_daily:
        user_msg = (
            "All API keys have hit their rate/daily limit. "
            "Install Ollama or add a new key to backend/.env — no restart needed."
        )
    else:
        user_msg = (
            "All API keys across all providers are exhausted or errored. "
            "Add new keys to backend/.env — they are picked up automatically."
        )

    return jsonify({
        "success": False,
        "error"  : user_msg,
        "details": all_errors
    }), 429


def _extract_text_ocr(file_bytes) -> str:
    """
    Fallback OCR extraction using pytesseract and pdf2image.
    Requires Tesseract-OCR and Poppler installed on the system.
    """
    # Common Tesseract paths on Windows
    tess_paths = [
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',
        r'C:\Users\{}\AppData\Local\Tesseract-OCR\tesseract.exe'.format(os.getlogin()),
        'tesseract' # If in PATH
    ]
    
    found_tess = False
    for path in tess_paths:
        try:
            # Check if execution works
            if path == 'tesseract':
                import subprocess
                subprocess.run(['tesseract', '--version'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            elif os.path.exists(path):
                pytesseract.pytesseract.tesseract_cmd = path
            else:
                continue
            
            pytesseract.pytesseract.tesseract_cmd = path
            found_tess = True
            break
        except Exception:
            continue
            
    if not found_tess:
        log.warning("Tesseract-OCR not found. OCR extraction skipped.")
        return "[OCR Error]: Tesseract-OCR is not installed or not in the expected path (C:\\Program Files\\Tesseract-OCR\\). Please install it to enable OCR for scanned resumes."

    try:
        # Convert PDF to images
        # Note: poppler_path can be added here if needed, e.g., poppler_path=r"C:\poppler-xx\bin"
        images = convert_from_bytes(file_bytes)
        ocr_text = []
        for i, image in enumerate(images):
            text = pytesseract.image_to_string(image)
            ocr_text.append(f"--- Page {i+1} ---\n{text}")
        
        return "\n\n".join(ocr_text).strip()
    except Exception as e:
        log.error(f"OCR extraction failed: {e}")
        return f"[OCR Error]: {str(e)}. (Note: Poppler must also be installed and in PATH for pdf2image to work on Windows)."


@ats_bp.route('/api/ats/extract-file', methods=['POST'])
def extract_from_file():
    """
    Accepts a PDF file upload, extracts structured text via pdfplumber,
    and then runs the AI extraction logic.
    """
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400

    # 1. Structured Text Extraction
    file.seek(0)
    structured_text = _extract_text_structured(file)
    
    # 1.5 OCR Fallback if text is too short (likely scanned PDF)
    if not structured_text or len(structured_text.strip()) < 150:
        log.info(f"[extract-file] Structured extraction yielded very little text ({len(structured_text) if structured_text else 0} chars). Falling back to OCR.")
        file.seek(0)
        file_bytes = file.read()
        ocr_text = _extract_text_ocr(file_bytes)
        
        # If OCR returned valid text (not an error message), use it
        if ocr_text and "[OCR Error]" not in ocr_text:
            structured_text = ocr_text
            log.info(f"[extract-file] OCR fallback successful ({len(structured_text)} chars).")
        else:
            log.warning(f"[extract-file] OCR fallback failed or skipped: {ocr_text}") # type: ignore
            # Keep original structured_text (might be empty or short)
    
    if not structured_text or len(structured_text.strip()) < 50:
        # Fallback to simple filename if extraction fails completely
        structured_text = file.filename

    # 2. Call the AI extraction logic using the high-quality structured text
    prompt = _build_extract_prompt(structured_text)

    try:
        result = _call_with_fallback(prompt)
    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 429

    # Normalise links
    raw_links = result.get("links", [])
    result["links"] = [str(lnk).strip() if str(lnk).startswith("http") else "https://" + str(lnk).strip() for lnk in raw_links if lnk]
    
    # Include the raw structured text for reference/debugging
    result["raw_structured_text"] = structured_text

    return jsonify({"success": True, "data": result}), 200


# ── Resume Extraction Route ───────────────────────────────────────────────────

@ats_bp.route('/api/ats/extract', methods=['POST'])
def extract_resume():
    """
    Deep-extract all structured content from a resume (completely separate from ATS scoring).

    Body: { "resume_text": "..." }
    Response: {
      "success": true,
      "data": {
        "about_me": "...",
        "location": "...",
        "links": ["https://github.com/...", "https://leetcode.com/...", ...],
        "personal_info": { "name": "...", "email": "...", "phone": "..." },
        "education": [...],   // ALL levels: UG, HSc, SSLC, diplomas, certs
        "experience": [...],
        "skills": [...]
      }
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No JSON body provided"}), 400

    resume_text = (data.get("resume_text") or "").strip()
    if not resume_text:
        return jsonify({"success": False, "error": "resume_text is required"}), 400

    prompt = _build_extract_prompt(resume_text)

    try:
        result = _call_with_fallback(prompt)
    except RuntimeError as e:
        err = str(e)
        log.error(f"[extract] All providers exhausted: {err}")
        no_providers = "NO_PROVIDERS" in err
        if no_providers:
            user_msg = (
                "No AI providers are available. "
                "Install Ollama locally or add API keys to backend/.env."
            )
            return jsonify({
                "success": False,
                "error_code": "no_providers",
                "error": user_msg,
                "details": err
            }), 503
        user_msg = (
            "All API keys have hit their rate/daily limit. "
            "Install Ollama or add new keys to backend/.env — picked up automatically."
        )
        return jsonify({"success": False, "error": user_msg, "details": err}), 429

    # Normalise links to ensure they are all proper URLs
    raw_links = result.get("links", [])
    cleaned_links = []
    for lnk in raw_links:
        lnk = str(lnk).strip()
        if lnk and not lnk.startswith("http"):
            lnk = "https://" + lnk
        if lnk:
            cleaned_links.append(lnk)
    result["links"] = cleaned_links

    return jsonify({"success": True, "data": result}), 200


# ── AI Missing Skills Route ────────────────────────────────────────────────────

_MISSING_SKILLS_PROMPT = """
You are a precise career skills gap analyst. A candidate is applying for a job role.

CANDIDATE'S CURRENT SKILLS (already matched/available):
{matched_skills}

JOB DESCRIPTION:
{job_description}

Your task: Identify SPECIFIC skills that are genuinely missing for this role.

STRICT RULES:
1. NEVER return broad category labels like "Backend Frameworks", "Databases", "Cloud Technologies".
   Always name the specific technology (e.g., "PostgreSQL", "Redis", "Kubernetes").
2. If the candidate has ANY skill in a category the JD mentions, do NOT list other skills from that same category
   unless the JD specifically names them. Example: if they have Spring Boot and JD says "backend frameworks",
   do NOT list Node.js or Django — Spring Boot already covers it.
3. Only list skills that are EXPLICITLY required or strongly implied by the specific job description text.
4. If the candidate has 80%+ of required skills, return an empty array — do not invent gaps.
5. Distinguish priorities:
   - "high": required by the JD explicitly, direct blocker for the role
   - "medium": mentioned in JD or strongly expected for the role type
   - "low": nice-to-have, mentioned as preferred/bonus

Return ONLY valid JSON — no markdown fences, no text outside JSON.

JSON format:
{{
  "missing_skills": [
    {{
      "skill": "<exact technology/skill name>",
      "reason": "<one concise sentence: why this matters for this specific role>",
      "priority": "high" | "medium" | "low",
      "learn_tip": "<quick 1-line tip: e.g., 'Build a CRUD app with PostgreSQL to demonstrate practical usage'>"
    }}
  ]
}}
"""


@ats_bp.route('/api/ats/missing_skills', methods=['POST'])
def get_missing_skills():
    """
    AI-powered missing skills analysis — returns specific gaps with reasons and priority.

    Body: {
        "matched_skills": ["Spring Boot (Demonstrated via...)", "Core Java", ...],
        "job_description": "..."
    }
    Response: {
        "success": true,
        "missing_skills": [
            { "skill": "PostgreSQL", "reason": "...", "priority": "high", "learn_tip": "..." },
            ...
        ]
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No JSON body provided"}), 400

    matched_skills = data.get("matched_skills") or []
    job_description = (data.get("job_description") or "").strip()

    if not job_description:
        return jsonify({"success": False, "error": "job_description is required"}), 400

    # Format skills list for prompt
    skills_text = "\n".join(f"- {s}" for s in matched_skills) if matched_skills else "None provided"

    prompt = _MISSING_SKILLS_PROMPT.format(
        matched_skills=skills_text,
        job_description=job_description
    )

    try:
        result = _call_with_fallback(prompt)
    except RuntimeError as e:
        log.error(f"[missing_skills] All providers exhausted: {e}")
        user_msg = (
            "All API keys exhausted. Add new keys to backend/.env — they are picked up automatically."
        )
        return jsonify({"success": False, "error": user_msg, "details": str(e)}), 429

    missing = result.get("missing_skills", [])

    # Sanitise and ensure required fields
    cleaned = []
    for item in missing:
        if not isinstance(item, dict):
            continue
        skill = str(item.get("skill", "")).strip()
        if not skill:
            continue
        cleaned.append({
            "skill": skill,
            "reason": str(item.get("reason", "")).strip() or "Required for this role.",
            "priority": item.get("priority", "medium") if item.get("priority") in ("high", "medium", "low") else "medium",
            "learn_tip": str(item.get("learn_tip", "")).strip()
        })

    return jsonify({"success": True, "missing_skills": cleaned}), 200


# ── Normal (Resume-Only) ATS Route ────────────────────────────────────────────

_NORMAL_ATS_PROMPT = """
You are a professional ATS (Applicant Tracking System) resume quality evaluator.
Analyze ONLY the resume below — there is NO job description to compare against.
Your job is to score the resume purely on format, structure, language quality, and skill presence.

Evaluate strictly on these axes:
1. **Format & ATS Friendliness** (0-100): Are sections clearly labeled? Standard section headers (Summary, Experience, Skills, Education)? No tables/images that confuse parsers? Clean bullet points?
2. **Language & Impact** (0-100): Action verbs used? Quantified achievements? Concise bullets? Avoid filler phrases (e.g., "responsible for", "team player")?
3. **Completeness** (0-100): Are all standard sections present (Contact, Summary/Objective, Experience, Skills, Education)?
4. **Skill Keyword Density** (0-100): Are relevant technical/professional keywords present? Would ATS parsers find enough keywords?
5. **Experience Description Quality** (0-100): Are experience bullets detailed and achievement-oriented? Includes impact metrics?

IMPORTANT:
- Do NOT fabricate weaknesses. Only report real issues found in the resume.
- Focus on RESUME QUALITY, not job-fit.
- `improvements` must be SPECIFIC to what you see in THIS resume (e.g., "Your TechFlow Inc. experience bullets don't include any numbers — add metrics like '↑ performance by 30%'")
- `strengths` must also be resume-specific (e.g., "Good use of action verbs across all experience entries")
- Return ONLY valid JSON — no markdown fences, no text outside JSON.

JSON format:
{{
  "overall_score": <integer 0-100>,
  "candidate_type": "fresher" | "experienced" | "internship",
  "summary": "<2-3 sentence overall assessment of the resume quality>",
  "section_scores": {{
    "format_ats_friendliness": <0-100>,
    "language_impact": <0-100>,
    "completeness": <0-100>,
    "keyword_density": <0-100>,
    "experience_quality": <0-100>
  }},
  "skills": ["<skill1>", "<skill2>"],
  "strengths": ["<resume-specific strength 1>", "<strength 2>"],
  "improvements": [
    "<Specific, location-aware improvement for THIS resume — e.g., 'Add a 2-3 line Summary/Objective section at the top — currently missing'>",
    "<Another specific suggestion...>"
  ]
}}

RESUME:
{resume_text}
"""


@ats_bp.route('/api/ats/analyze-normal', methods=['POST'])
def analyze_resume_normal():
    """
    Analyze resume FORMAT quality without any job description.
    Returns a format/structure score, skills list, strengths, and improvements.

    Body: { "resume_text": "...", "email": "..." }
    Response: { "success": true, "data": { "overall_score": 78, "skills": [...], ... } }
    """
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No JSON body provided"}), 400

    resume_text = (data.get("resume_text") or "").strip()
    if not resume_text:
        return jsonify({"success": False, "error": "resume_text is required"}), 400

    prompt = _NORMAL_ATS_PROMPT.format(resume_text=resume_text)

    try:
        result = _call_with_fallback(prompt)
    except RuntimeError as e:
        err = str(e)
        log.error(f"[analyze-normal] All providers exhausted: {err}")
        if "NO_PROVIDERS" in err:
            user_msg = (
                "No AI providers are available. "
                "Install Ollama locally or add API keys to backend/.env."
            )
            return jsonify({
                "success": False,
                "error_code": "no_providers",
                "error": user_msg,
                "details": err
            }), 503
        user_msg = (
            "All API keys have hit their rate/daily limit. "
            "Install Ollama or add new keys to backend/.env — picked up automatically."
        )
        return jsonify({"success": False, "error": user_msg, "details": err}), 429

    # Ensure all expected fields exist
    if "overall_score" not in result:
        result["overall_score"] = result.get("ats_score", 50)
    if "skills" not in result or not isinstance(result["skills"], list):
        result["skills"] = []
    if "strengths" not in result or not isinstance(result["strengths"], list):
        result["strengths"] = ["Resume structure is acceptable."]
    if "improvements" not in result or not isinstance(result["improvements"], list):
        result["improvements"] = ["Consider adding quantified achievements to your experience section."]
    if "section_scores" not in result or not isinstance(result["section_scores"], dict):
        score = result["overall_score"]
        result["section_scores"] = {
            "format_ats_friendliness": score,
            "language_impact": score,
            "completeness": score,
            "keyword_density": score,
            "experience_quality": score
        }
    if "candidate_type" not in result:
        result["candidate_type"] = "fresher"
    if "summary" not in result:
        result["summary"] = f"Overall resume format score: {result['overall_score']}%."

    # ── Hybrid Formula Fields (additive — AI scoring unchanged) ──────────────
    _base = _compute_base_score(resume_text)
    result['formula_components'] = {
        "base_score"      : _base['base_score'],
        "skills_score"    : _base['skills_score'],
        "experience_score": _base['experience_score'],
        "education_score" : _base['education_score'],
        "cert_score"      : _base['cert_score'],
        "formula"         : _base['formula'],
    }

    # ── Add history_record for score tracking ────────────────────────────────
    import datetime
    result['history_record'] = {
        'format_score': result['overall_score'],
        'timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
        'note': 'format_analysis'
    }

    return jsonify({"success": True, "data": result}), 200

