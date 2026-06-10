"""
job_routes.py — Semantic AI Job Matching & Search
===================================================
3-TIER FALLBACK SYSTEM:
  Tier 1: AI (Gemini/OpenRouter/etc.) — full semantic understanding
  Tier 2: Local skill/cert lookup     — uses skills_list.json + certificates_list.json
  Tier 3: Google Search               — last resort, searches skill→job match via Google

POST /api/jobs/semantic-match
    Given the user's resume text + jobs, returns AI-computed match scores.

POST /api/jobs/semantic-search
    Natural language job search with intent understanding.

GET  /api/jobs/all
    All jobs from DB.json.
"""

from flask import Blueprint, request, jsonify
import json, logging, os, sys, re, time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from DB.mongo_setup import get_job_collection
import config

log = logging.getLogger(__name__)
job_bp = Blueprint('jobs', __name__)

# ── Paths ─────────────────────────────────────────────────────────────────────
_BASE_DIR   = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
_BACKEND    = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
_DB_PATH    = os.path.join(_BASE_DIR, 'DB', 'DB.json')
_SKILLS_PATH = os.path.join(_BACKEND, 'skills_list.json')
_CERTS_PATH  = os.path.join(_BACKEND, 'certificates_list.json')

# Key rotation index (separate from ATS routes)
_key_indices: dict[str, int] = {}


# ══════════════════════════════════════════════════════════════════════════════
# TIER 2 — LOCAL KNOWLEDGE BASE (skills_list.json + certificates_list.json)
# ══════════════════════════════════════════════════════════════════════════════

_skills_db: dict = {}      # { "React": ["ReactJS", "react developer", ...], ... }
_certs_db: dict  = {}      # { "AWS CCP": { "aliases": [...], "skills": [...] }, ... }
_skills_loaded   = False

def _load_local_knowledge():
    """Load skills and certificates JSON into memory (lazy, loads once)."""
    global _skills_db, _certs_db, _skills_loaded
    if _skills_loaded:
        return

    try:
        with open(_skills_path := _SKILLS_PATH, 'r', encoding='utf-8') as f:
            _skills_db = json.load(f)
        log.info(f"Loaded {len(_skills_db)} skill groups from {_skills_path}")
    except Exception as e:
        log.warning(f"Could not load skills_list.json: {e}")
        _skills_db = {}

    try:
        with open(_certs_path := _CERTS_PATH, 'r', encoding='utf-8') as f:
            _certs_db = json.load(f)
        log.info(f"Loaded {len(_certs_db)} certificate entries from {_certs_path}")
    except Exception as e:
        log.warning(f"Could not load certificates_list.json: {e}")
        _certs_db = {}

    _skills_loaded = True


def _extract_candidate_skills(resume_text: str) -> set:
    """
    Extract canonical skill names from raw resume text using skills_list.json + certificates_list.json.
    Returns a set of canonical skill names (e.g. {"React", "MongoDB", "AWS Lambda"}).
    """
    _load_local_knowledge()
    found = set()
    text_lower = resume_text.lower()

    # ── Skill list lookup ──────────────────────────────────────────────────────
    # Each key in skills_list.json is the canonical name ("React"),
    # each value is a list of aliases/variants ["ReactJS", "react developer", ...]
    for canonical, aliases in _skills_db.items():
        # Check the canonical name itself
        if canonical.lower() in text_lower:
            found.add(canonical)
            continue
        # Check any alias
        for alias in aliases:
            if alias.lower() in text_lower:
                found.add(canonical)
                break

    # ── Certificate lookup adds implied skills ─────────────────────────────────
    # Each cert in certificates_list.json has "aliases" and a "skills" list
    for cert_name, cert_data in _certs_db.items():
        aliases  = cert_data.get('aliases', [])
        implied  = cert_data.get('skills', [])
        hit = cert_name.lower() in text_lower
        if not hit:
            for alias in aliases:
                if alias.lower() in text_lower:
                    hit = True
                    break
        if hit:
            # Add the cert name itself plus all implied skills
            found.add(cert_name)
            found.update(implied)

    return found


def _compute_local_match(candidate_skills: set, job: dict, candidate_type: str) -> dict:
    """
    Tier-2 local matching: compute a score based on skills overlap with the job.
    Returns a dict similar to AI output.
    """
    job_tags     = {t.lower() for t in (job.get('tags') or [])}
    job_title    = (job.get('title') or '').lower()
    job_desc     = (job.get('description') or '').lower()

    # Build a searchable set for the job
    job_terms = job_tags | set(job_title.split()) | set(job_desc.split())

    # Match candidate skills against job terms
    matched   = []
    missing   = []

    for skill in candidate_skills:
        skill_lower = skill.lower()
        # Simple partial match: skill keyword appears in job text
        if any(skill_lower in t for t in job_terms) or \
           skill_lower in job_title or skill_lower in job_desc:
            matched.append(skill)

    # Find what job requires that candidate doesn't have
    for tag in (job.get('tags') or []):
        tag_lower = tag.lower()
        if not any(tag_lower in s.lower() for s in candidate_skills):
            missing.append(tag)

    # ── Scoring formula ────────────────────────────────────────────────────────
    # Base: % of job tags covered by candidate skills
    n_tags = max(len(job.get('tags') or []), 1)
    # Each matched skill from job's tags = 1 point
    tag_coverage = sum(
        1 for tag in (job.get('tags') or [])
        if any(tag.lower() in s.lower() for s in candidate_skills)
    ) / n_tags

    # Title signal: does job title contain any candidate skill keyword?
    title_bonus = 0.2 if any(
        s.lower() in job_title for s in candidate_skills
    ) else 0.0

    # Type bonus: candidate type alignment
    type_bonus = 0.0
    if candidate_type == 'fresher' and any(
        kw in job_title for kw in ('junior', 'fresher', 'entry', 'trainee', 'intern', 'graduate')
    ):
        type_bonus = 0.15
    elif candidate_type == 'experienced' and any(
        kw in job_title for kw in ('senior', 'lead', 'manager', 'architect', 'principal')
    ):
        type_bonus = 0.15
    elif candidate_type == 'internship' and 'intern' in job_title:
        type_bonus = 0.2

    raw_score = (tag_coverage * 0.65 + title_bonus * 0.2 + type_bonus * 0.15)
    # Clamp to 0-100
    score = min(100, max(0, round(raw_score * 100)))

    # Recommendation tier
    if score >= 75:
        rec = 'high'
    elif score >= 50:
        rec = 'medium'
    else:
        rec = 'low'

    reasoning = (
        f"[Local KB] Matched {len(matched)} skills from your resume to this job. "
        f"Job requires: {', '.join((job.get('tags') or [])[:5]) or 'N/A'}. "
        f"You have: {', '.join(list(matched)[:5]) or 'No direct matches found'}."
    )

    return {
        'match_score': score,
        'reasoning':   reasoning,
        'why_fit':     "Based on your resume, you have a strong match with the requested skills: " + (', '.join(list(matched)[:5]) or 'relevant foundational skills') + ". Your background aligns well with the demands of this role.",
        'matched_skills': matched[:10],
        'missing_skills': missing[:10],
        'recommendation': rec,
        'tier': 'local_kb'
    }


def _local_match_all_jobs(resume_text: str, jobs: list, candidate_type: str) -> list:
    """Run Tier-2 local KB matching on all jobs. Returns enriched job list."""
    _load_local_knowledge()
    candidate_skills = _extract_candidate_skills(resume_text)

    log.info(f"[Tier 2] Extracted {len(candidate_skills)} skills from resume via local KB")

    enriched = []
    for j in jobs:
        result = _compute_local_match(candidate_skills, j, candidate_type)
        enriched.append({
            **j,
            'aiMatchScore':     result['match_score'],
            'aiReasoning':      result['reasoning'],
            'aiWhyFit':         result['why_fit'],
            'aiMatchedSkills':  result['matched_skills'],
            'aiMissingSkills':  result['missing_skills'],
            'aiRecommendation': result['recommendation'],
            'matchTier':        'local_kb'   # So frontend knows which tier was used
        })

    enriched.sort(key=lambda x: x.get('aiMatchScore', 0), reverse=True)
    return enriched


# ══════════════════════════════════════════════════════════════════════════════
# TIER 3 — GOOGLE SEARCH FALLBACK
# ══════════════════════════════════════════════════════════════════════════════

def _google_search_skills(query: str, max_results: int = 5) -> list[str]:
    """
    Tier-3 fallback: search Google for skills related to the query.
    Uses 'googlesearch-python' lib if available, else urllib scrape.
    Returns a list of skill-like tokens found in search result titles/snippets.
    """
    found_skills = []

    # ── Try googlesearch library ──────────────────────────────────────────────
    try:
        from googlesearch import search as gsearch
        results = list(gsearch(f"{query} programming skills required", num_results=max_results, sleep_interval=1))
        # Extract tokens from URLs (coarse signal)
        for url in results:
            parts = re.split(r'[-_/. ]', url.lower())
            for p in parts:
                if len(p) > 2 and p.isalpha():
                    found_skills.append(p)
        log.info(f"[Tier 3] Google search returned {len(results)} results for: {query}")
        return list(set(found_skills))[:30]

    except ImportError:
        pass

    # ── urllib fallback (basic HTML scrape of DDG or Google) ─────────────────
    try:
        import urllib.request, urllib.parse, html
        search_query = urllib.parse.quote(f"{query} required skills resume")
        url = f"https://html.duckduckgo.com/html/?q={search_query}"
        headers = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            content = resp.read().decode('utf-8', errors='ignore')

        # Extract result titles from DuckDuckGo HTML
        titles = re.findall(r'class="result__a"[^>]*>(.*?)</a>', content)
        for t in titles:
            clean = re.sub(r'<[^>]+>', '', html.unescape(t)).lower()
            # Grab words that look like tech skills (3-20 chars, no spaces)
            tokens = re.findall(r'\b[a-zA-Z][a-zA-Z0-9.#+\-]{2,19}\b', clean)
            found_skills.extend(tokens)

        log.info(f"[Tier 3] DuckDuckGo scrape found {len(found_skills)} tokens for: {query}")
        return list(set(found_skills))[:30]

    except Exception as e:
        log.warning(f"[Tier 3] Google/DDG search failed: {e}")
        return []


def _google_enhanced_match(resume_text: str, query: str, jobs: list, candidate_type: str) -> list:
    """
    Tier-3: use Google search to augment the resume's skill extraction,
    then fall through to local KB matching with the expanded skill set.
    """
    _load_local_knowledge()

    # Get base skills from local KB
    base_skills = _extract_candidate_skills(resume_text)

    # Ask Google what skills are associated with the query/job domain
    google_tokens = _google_search_skills(query or "software developer")
    
    # Try to canonicalize Google tokens through skills_list.json
    google_skills = set()
    for token in google_tokens:
        token_lower = token.lower()
        for canonical, aliases in _skills_db.items():
            if token_lower == canonical.lower() or any(
                token_lower in a.lower() for a in aliases
            ):
                google_skills.add(canonical)
                break

    combined_skills = base_skills | google_skills
    log.info(
        f"[Tier 3] Skills: base={len(base_skills)}, "
        f"google_added={len(google_skills)}, total={len(combined_skills)}"
    )

    enriched = []
    for j in jobs:
        result = _compute_local_match(combined_skills, j, candidate_type)
        result['reasoning'] = result['reasoning'].replace('[Local KB]', '[Google-Enhanced]')
        result['why_fit']   = result['why_fit'].replace('Based on your resume', 'Using enhanced semantic search')
        enriched.append({
            **j,
            'aiMatchScore':     result['match_score'],
            'aiReasoning':      result['reasoning'],
            'aiWhyFit':         result['why_fit'],
            'aiMatchedSkills':  result['matched_skills'],
            'aiMissingSkills':  result['missing_skills'],
            'aiRecommendation': result['recommendation'],
            'matchTier':        'google_enhanced'
        })

    enriched.sort(key=lambda x: x.get('aiMatchScore', 0), reverse=True)
    return enriched


# ══════════════════════════════════════════════════════════════════════════════
# AI HELPERS (Tier 1)
# ══════════════════════════════════════════════════════════════════════════════

def _clean_json(raw: str) -> dict:
    """Strip reasoning/markdown fences and parse JSON."""
    raw = raw.strip()
    if '<reasoning>' in raw:
        raw = re.sub(r'<reasoning>.*?</reasoning>', '', raw, flags=re.DOTALL).strip()
    if raw.startswith('```'):
        parts = raw.split('```')
        raw = parts[1].lstrip('json').strip() if len(parts) > 1 else raw
    return json.loads(raw)


def _is_daily_quota_error(err: Exception) -> bool:
    msg = str(err).lower()
    return any(s in msg for s in ('resource_exhausted', 'quota_exceeded', 'daily', 'per day', 'insufficient_quota'))


def _is_rate_limit_error(err: Exception) -> bool:
    msg = str(err).lower()
    return any(s in msg for s in ('rate limit', 'rate_limit', 'too many requests', '429')) \
           and not _is_daily_quota_error(err)


def _call_gemini(api_key: str, prompt: str, model: str) -> dict:
    import google.generativeai as genai
    genai.configure(api_key=api_key)
    response = genai.GenerativeModel(model).generate_content(prompt)
    return _clean_json(response.text)


def _call_openai_compat(api_key: str, prompt: str, model: str, base_url: str) -> dict:
    from openai import OpenAI
    client = OpenAI(api_key=api_key, base_url=base_url)
    response = client.chat.completions.create(
        model=model,
        messages=[{'role': 'user', 'content': prompt}],
        temperature=0.2,
    )
    return _clean_json(response.choices[0].message.content)


def _call_anthropic(api_key: str, prompt: str, model: str) -> dict:
    import anthropic
    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model=model, max_tokens=4096,
        messages=[{'role': 'user', 'content': prompt}],
    )
    return _clean_json(response.content[0].text)


def _call_provider(provider_name: str, api_key: str, prompt: str, model: str) -> dict:
    cfg = config.PROVIDERS[provider_name]
    ptype = cfg['type']
    if ptype == 'gemini':
        return _call_gemini(api_key, prompt, model)
    elif ptype == 'anthropic':
        return _call_anthropic(api_key, prompt, model)
    elif ptype == 'openai_compat':
        return _call_openai_compat(api_key, prompt, model, cfg['base_url'])
    raise ValueError(f'Unknown provider type: {ptype}')


def _run_with_fallback(prompt: str, provider_suffix: str = '') -> dict:
    """Run a prompt through the provider fallback chain. Returns parsed JSON dict."""
    live_keys = config.reload_keys()
    if not live_keys:
        raise RuntimeError('No API keys configured.')

    all_errors = []
    for provider_name, keys in live_keys.items():
        idx_key = provider_name + provider_suffix
        idx = _key_indices.get(idx_key, 0)
        keys_tried = 0
        total_keys = len(keys)
        models = config.PROVIDERS[provider_name].get('models', [])

        while keys_tried < total_keys:
            current_key = keys[idx % total_keys]
            for model_name in models:
                for attempt in range(1, 4):
                    try:
                        result = _call_provider(provider_name, current_key, prompt, model_name)
                        _key_indices[idx_key] = idx
                        return result
                    except Exception as e:
                        if _is_daily_quota_error(e):
                            all_errors.append(f'{provider_name}/{model_name} DAILY_QUOTA')
                            break
                        elif _is_rate_limit_error(e):
                            time.sleep(2 ** attempt)
                        else:
                            all_errors.append(f'{provider_name}/{model_name} ERROR: {str(e)[:80]}')
                            break
            idx += 1
            keys_tried += 1
            _key_indices[idx_key] = idx

    raise RuntimeError(f'All providers failed: {all_errors}')


# ── DB ─────────────────────────────────────────────────────────────────────────

# ── MongoDB Helpers ──────────────────────────────────────────────────────────

def _load_db_jobs() -> list:
    """Load all jobs from MongoDB."""
    coll = get_job_collection()
    if coll is None:
        return []
    try:
        # Return all jobs, exclude _id for JSON serializability
        jobs = list(coll.find({}, {'_id': 0}))
        return jobs
    except Exception as e:
        log.error(f"Failed to load jobs from MongoDB: {e}")
        return []


# ── Prompts ────────────────────────────────────────────────────────────────────

_SEMANTIC_MATCH_PROMPT = """
You are an expert AI job matching engine for a Smart Job Portal.

CANDIDATE PROFILE (from resume):
Candidate Type: {candidate_type}
Resume Text:
{resume_text}

JOBS TO EVALUATE:
{jobs_json}

TASK:
For each job, compute a semantic match score (0-100) considering:

1. SKILLS MATCH (Most Important):
   - Use semantic reasoning, NOT exact word match
   - "JS" = "JavaScript", "MERN" implies MongoDB/Express/React/Node.js
   - Credit certifications that imply skills
   - Partial skill overlap still earns partial score

2. EXPERIENCE / CANDIDATE TYPE ADJUSTMENT:
   - If candidate is "fresher": Weight projects and certifications heavily
   - If candidate is "experienced": Weight work experience more
   - If candidate is "internship": Weight education and project skills

3. ROLE ALIGNMENT:
   - Does the job title and description match the candidate's career direction?

4. GAP ANALYSIS:
   - Identify what key skills the candidate is missing for this specific job

Return ONLY a JSON array (no markdown fences, no extra text):
[
  {{
    "job_id": "<id from input>",
    "match_score": <integer 0-100>,
    "reasoning": "<2-3 sentence explanation of why this job matches or doesn't>",
    "why_fit": "<2-3 personalized sentences explaining specifically WHY this candidate is a fit for this role, referencing actual skills, experience, or projects from their resume>",
    "matched_skills": ["skill1", "skill2"],
    "missing_skills": ["skill1", "skill2"],
    "recommendation": "high" | "medium" | "low"
  }}
]

IMPORTANT: Return ALL {job_count} jobs. Do not skip any.
"""


_SEMANTIC_SEARCH_PROMPT = """
You are a semantic job search engine for a Smart Job Portal.

USER SEARCH QUERY: "{query}"
USER LOCATION PREFERENCE: "{location}"

AVAILABLE JOBS:
{jobs_json}

TASK:
Rank these jobs by relevance to the user's search query using SEMANTIC UNDERSTANDING:
- Understand intent ("frontend dev" matches "React developer", "UI engineer", "web developer")
- Match skills implied by the query ("python developer" → Django, Flask, machine learning jobs)
- Consider synonyms and related roles
- Factor in location if specified

Return ONLY a JSON array sorted by relevance (most relevant first):
[
  {{
    "job_id": "<id>",
    "relevance_score": <integer 0-100>,
    "match_reason": "<brief reason>"
  }}
]
"""


# ══════════════════════════════════════════════════════════════════════════════
# ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@job_bp.route('/api/jobs/semantic-match', methods=['POST'])
def semantic_match():
    """
    POST /api/jobs/semantic-match
    Body: { "resume_text": "...", "candidate_type": "fresher|experienced|internship" }

    3-Tier fallback:
      Tier 1: AI (Gemini) semantic matching
      Tier 2: Local skills_list.json + certificates_list.json lookup
      Tier 3: Google search to augment skill extraction
    """
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No JSON body'}), 400

    resume_text    = (data.get('resume_text') or '').strip()
    candidate_type = (data.get('candidate_type') or 'fresher').strip()
    job_ids        = data.get('job_ids')

    if not resume_text:
        return jsonify({'success': False, 'error': 'resume_text is required'}), 400

    all_jobs = _load_db_jobs()
    if not all_jobs:
        return jsonify({'success': False, 'error': 'Could not load jobs database'}), 500

    if job_ids:
        jobs = [j for j in all_jobs if str(j.get('id')) in [str(x) for x in job_ids]]
    else:
        jobs = all_jobs

    # ── Pre-filter jobs before sending to AI to ensure relevance ──────────────
    try:
        candidate_skills = _extract_candidate_skills(resume_text)
        for j in jobs:
            j['_local_score'] = _compute_local_match(candidate_skills, j, candidate_type).get('match_score', 0)
        jobs.sort(key=lambda x: x.get('_local_score', 0), reverse=True)
    except Exception as e:
        log.warning(f"Error in local pre-filtering: {e}")

    jobs = jobs[:30]  # Limit per AI call

    # ── TIER 1: Try AI ──────────────────────────────────────────────────────
    try:
        jobs_summary = [
            {
                'id': j.get('id'),
                'title': j.get('title', ''),
                'company': j.get('company', ''),
                'description': (j.get('description') or '')[:300],
                'tags': j.get('tags', []),
                'type': j.get('type', ''),
                'industry': j.get('industry', ''),
                'salary': j.get('salary', '')
            }
            for j in jobs
        ]
        prompt = _SEMANTIC_MATCH_PROMPT.format(
            candidate_type=candidate_type,
            resume_text=resume_text[:3000],
            jobs_json=json.dumps(jobs_summary, indent=2),
            job_count=len(jobs_summary)
        )

        result = _run_with_fallback(prompt, '_match')

        matches = result if isinstance(result, list) else result.get('matches', [])
        score_map = {str(m.get('job_id')): m for m in matches}

        enriched = []
        for j in jobs:
            jid = str(j.get('id'))
            ai_data = score_map.get(jid, {})
            enriched.append({
                **j,
                'aiMatchScore':     ai_data.get('match_score', 0),
                'aiReasoning':      ai_data.get('reasoning', ''),
                'aiWhyFit':         ai_data.get('why_fit', ''),
                'aiMatchedSkills':  ai_data.get('matched_skills', []),
                'aiMissingSkills':  ai_data.get('missing_skills', []),
                'aiRecommendation': ai_data.get('recommendation', 'low'),
                'matchTier':        'ai'
            })

        enriched.sort(key=lambda x: x.get('aiMatchScore', 0), reverse=True)

        log.info(f"[Tier 1] AI semantic match succeeded for {len(enriched)} jobs")
        return jsonify({'success': True, 'matches': enriched, 'total': len(enriched), 'tier': 'ai'}), 200

    except Exception as ai_err:
        log.warning(f"[Tier 1] AI matching failed: {ai_err} → falling back to Tier 2 (local KB)")

    # ── TIER 2: Local KB matching ────────────────────────────────────────────
    try:
        enriched = _local_match_all_jobs(resume_text, jobs, candidate_type)

        # If local KB found ZERO skills (empty resume / unrecognized format or language),
        # jump straight to Tier 3
        candidate_skills = _extract_candidate_skills(resume_text)
        if not candidate_skills:
            raise RuntimeError("Local KB could not extract any skills — escalating to Tier 3 (Google)")

        log.info(f"[Tier 2] Local KB match succeeded: {len(candidate_skills)} skills found")
        return jsonify({
            'success': True,
            'matches': enriched,
            'total': len(enriched),
            'tier': 'local_kb',
            'notice': 'AI unavailable — matched using local skill/cert knowledge base'
        }), 200

    except Exception as local_err:
        log.warning(f"[Tier 2] Local KB failed or returned no skills: {local_err} → Tier 3 (Google)")

    # ── TIER 3: Google-enhanced matching ────────────────────────────────────
    try:
        enriched = _google_enhanced_match(resume_text, '', jobs, candidate_type)
        log.info(f"[Tier 3] Google-enhanced match succeeded for {len(enriched)} jobs")
        return jsonify({
            'success': True,
            'matches': enriched,
            'total': len(enriched),
            'tier': 'google_enhanced',
            'notice': 'Used Google search to enhance skill extraction (AI + local KB unavailable)'
        }), 200

    except Exception as google_err:
        log.error(f"[Tier 3] Google-enhanced match also failed: {google_err}")
        return jsonify({
            'success': False,
            'error': 'All matching tiers failed. Please check API keys and network connectivity.',
            'details': str(google_err)
        }), 503


@job_bp.route('/api/jobs/semantic-search', methods=['POST'])
def semantic_search():
    """
    POST /api/jobs/semantic-search
    Body: { "query": "frontend developer with react", "location": "remote" }

    3-Tier fallback:
      Tier 1: AI semantic search
      Tier 2: Local KB tokenization of query
      Tier 3: Google search to understand query intent
    """
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No JSON body'}), 400

    query    = (data.get('query') or '').strip()
    location = (data.get('location') or '').strip()
    resume_text = (data.get('resume_text') or '').strip()  # optional

    if not query:
        return jsonify({'success': False, 'error': 'query is required'}), 400

    all_jobs = _load_db_jobs()
    if not all_jobs:
        return jsonify({'success': False, 'error': 'Could not load jobs database'}), 500

    jobs_summary = [
        {
            'id': j.get('id'),
            'title': j.get('title', ''),
            'company': j.get('company', ''),
            'tags': j.get('tags', []),
            'type': j.get('type', ''),
            'location': j.get('location', ''),
            'description': (j.get('description') or '')[:150]
        }
        for j in all_jobs[:50]
    ]

    # ── TIER 1: AI Search ────────────────────────────────────────────────────
    try:
        prompt = _SEMANTIC_SEARCH_PROMPT.format(
            query=query,
            location=location or 'Any',
            jobs_json=json.dumps(jobs_summary, indent=2)
        )

        result = _run_with_fallback(prompt, '_search')
        ranked = result if isinstance(result, list) else result.get('results', result.get('ranked', []))

        score_map = {str(r.get('job_id')): r for r in ranked}
        enriched = []
        for j in all_jobs:
            jid = str(j.get('id'))
            ai_data = score_map.get(jid, {})
            enriched.append({
                **j,
                'searchScore':  ai_data.get('relevance_score', 0),
                'searchReason': ai_data.get('match_reason', ''),
                'matchTier':    'ai'
            })

        enriched.sort(key=lambda x: x.get('searchScore', 0), reverse=True)
        enriched = [j for j in enriched if j.get('searchScore', 0) > 0]

        log.info(f"[Tier 1] AI semantic search returned {len(enriched)} results for: {query}")
        return jsonify({
            'success': True,
            'results': enriched,
            'query': query,
            'total': len(enriched),
            'tier': 'ai'
        }), 200

    except Exception as ai_err:
        log.warning(f"[Tier 1] AI search failed: {ai_err} → Tier 2 (local KB)")

    # ── TIER 2: Local KB tokenization of query ────────────────────────────────
    try:
        _load_local_knowledge()

        # Treat the query as a mini-resume to extract skill tokens
        query_skills = _extract_candidate_skills(query)
        # Also load location terms
        location_lower = location.lower() if location else ''

        enriched = []
        for j in all_jobs:
            result = _compute_local_match(query_skills, j, 'fresher')  # type agnostic for search
            # Bonus if location matches
            loc_bonus = 15 if location_lower and location_lower in (j.get('location') or '').lower() else 0
            final_score = min(100, result['match_score'] + loc_bonus)

            enriched.append({
                **j,
                'searchScore':  final_score,
                'searchReason': result['reasoning'],
                'matchTier':    'local_kb'
            })

        enriched.sort(key=lambda x: x.get('searchScore', 0), reverse=True)
        enriched = [j for j in enriched if j.get('searchScore', 0) > 0]

        if not query_skills:
            raise RuntimeError("No skills extracted from query — escalating to Tier 3")

        log.info(f"[Tier 2] Local KB search: {len(query_skills)} tokens → {len(enriched)} results")
        return jsonify({
            'success': True,
            'results': enriched,
            'query': query,
            'total': len(enriched),
            'tier': 'local_kb',
            'notice': 'AI unavailable — searched using local skill/cert knowledge base'
        }), 200

    except Exception as local_err:
        log.warning(f"[Tier 2] Local KB search failed: {local_err} → Tier 3 (Google)")

    # ── TIER 3: Google search to understand query intent ────────────────────
    try:
        enriched = _google_enhanced_match(resume_text or query, query, all_jobs[:30], 'fresher')
        # Re-map to search fields
        for j in enriched:
            j['searchScore']  = j.pop('aiMatchScore', 0)
            j['searchReason'] = j.pop('aiReasoning', '')

        enriched = [j for j in enriched if j.get('searchScore', 0) > 0]

        log.info(f"[Tier 3] Google-enhanced search returned {len(enriched)} results for: {query}")
        return jsonify({
            'success': True,
            'results': enriched,
            'query': query,
            'total': len(enriched),
            'tier': 'google_enhanced',
            'notice': 'Used Google to understand search intent (AI + local KB unavailable)'
        }), 200

    except Exception as google_err:
        log.error(f"[Tier 3] Google search also failed: {google_err}")
        return jsonify({
            'success': False,
            'error': 'All search tiers failed.',
            'details': str(google_err)
        }), 503


@job_bp.route('/api/jobs/all', methods=['GET'])
def get_all_jobs():
    """GET /api/jobs/all — Serve DB.json jobs as JSON API."""
    jobs = _load_db_jobs()
    return jsonify({'success': True, 'jobs': jobs, 'total': len(jobs)}), 200


@job_bp.route('/api/jobs/extract-skills', methods=['POST'])
def extract_skills_from_resume():
    """
    POST /api/jobs/extract-skills
    Body: { "resume_text": "..." }
    
    Uses the local KB first to extract skills, then enriches with certificate-implied skills.
    Useful for debugging and for the frontend to show what skills were detected.
    """
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No JSON body'}), 400

    resume_text = (data.get('resume_text') or '').strip()
    if not resume_text:
        return jsonify({'success': False, 'error': 'resume_text is required'}), 400

    _load_local_knowledge()
    skills = _extract_candidate_skills(resume_text)

    return jsonify({
        'success': True,
        'extracted_skills': sorted(list(skills)),
        'total': len(skills),
        'sources': {
            'skills_db_size': len(_skills_db),
            'certs_db_size': len(_certs_db)
        }
    }), 200
