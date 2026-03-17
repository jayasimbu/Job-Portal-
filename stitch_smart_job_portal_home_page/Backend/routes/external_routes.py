"""
external_routes.py — External Job Crawl & Admin Cache System
=============================================================
POST /api/external/crawl
  Body: { "query": "mern stack", "location": "remote", "resume_skills": ["React","Node.js"] }
  
Logic:
  1. Check Admin/web_crawling.json cache (TTL 6hr, ≥80% skill overlap → serve from cache)
  2. Cache miss → crawl Naukri, Internshala, IndeedRSS, Wellfound
  3. Score crawled jobs against resume_skills (local KB matching)
  4. Save to Admin/web_crawling.json
  5. Save anonymized skill profile to Admin/user_skill_profiles.json
  6. Return ranked, scored external jobs
"""

import sys
import os
import json
import logging
import time
import hashlib
from datetime import datetime, timezone
from typing import cast, Set

from flask import Blueprint, request, jsonify # type: ignore

# Add the parent directory to sys.path to import from DB
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from DB.mongo_setup import get_external_job_collection, get_user_collection

log = logging.getLogger(__name__)

# Optional crawl dependencies — gracefully degrade if missing
try:
    import requests
    _HAS_REQUESTS = True
except ImportError:
    _HAS_REQUESTS = False

try:
    from bs4 import BeautifulSoup
    _HAS_BS4 = True
except ImportError:
    _HAS_BS4 = False

try:
    import feedparser
    _HAS_FEEDPARSER = True
except ImportError:
    _HAS_FEEDPARSER = False

log = logging.getLogger(__name__)

external_bp = Blueprint('external', __name__)

# ── Paths ─────────────────────────────────────────────────────────────────────
_BASE_DIR     = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
_ADMIN_DIR    = os.path.join(_BASE_DIR, 'Admin')
_CRAWL_CACHE  = os.path.join(_ADMIN_DIR, 'web_crawling.json')
_SKILL_PROF   = os.path.join(_ADMIN_DIR, 'user_skill_profiles.json')

_CACHE_TTL_HOURS = 6
_SKILL_OVERLAP_THRESHOLD = 0.70  # 70% overlap is good enough to serve from cache

# ── HTTP request headers to avoid basic bot detection ─────────────────────────
_HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/122.0.0.0 Safari/537.36'
    ),
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

# ── Skills extractor (simple keyword match) ────────────────────────────────────
_COMMON_TECH_SKILLS = [
    'react', 'node', 'nodejs', 'javascript', 'typescript', 'python', 'java',
    'c++', 'c#', 'angular', 'vue', 'html', 'css', 'mongodb', 'mysql',
    'postgresql', 'sql', 'nosql', 'express', 'django', 'flask', 'fastapi',
    'spring', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git',
    'linux', 'rest', 'graphql', 'redis', 'kafka', 'spark', 'hadoop',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp',
    'data science', 'data analysis', 'tableau', 'power bi', 'excel',
    'pandas', 'numpy', 'scikit', 'php', 'laravel', 'ruby', 'rails',
    'swift', 'kotlin', 'flutter', 'react native', 'android', 'ios',
    'devops', 'ci/cd', 'jenkins', 'terraform', 'ansible',
    'salesforce', 'sap', 'mern', 'mean', 'full stack', 'backend', 'frontend',
    'ui/ux', 'figma', 'photoshop', 'agile', 'scrum', 'jira',
    'communication', 'leadership', 'teamwork', 'problem solving'
]


def _extract_skills_from_text(text: str) -> set:
    """Extract tech skills from job/resume text by simple keyword matching."""
    low = text.lower()
    found = set()
    for skill in _COMMON_TECH_SKILLS:
        if skill in low:
            found.add(skill)
    return found


def _skill_overlap(skills_a: set, skills_b: set) -> float:
    """Jaccard-style overlap: intersection / union."""
    if not skills_a or not skills_b:
        return 0.0
    inter = len(skills_a & skills_b)
    union = len(skills_a | skills_b)
    return inter / union if union > 0 else 0.0


def _score_job_vs_skills(job_skills: set, resume_skills: set) -> int:
    """Return match score 0-100 based on skill overlap."""
    if not resume_skills:
        return 0
    matched = len(job_skills & resume_skills)
    return min(100, int((matched / len(resume_skills)) * 100))


# ── MongoDB Helpers ──────────────────────────────────────────────────────────────

def _load_crawl_cache() -> dict:
    """Note: This function is refactored to work with MongoDB in crawl_external."""
    # We won't use a single "cache" object anymore, we'll query the collection.
    return {'jobs': []} 

def _save_crawl_cache(jobs: list):
    """Save jobs to MongoDB external_jobs collection."""
    coll = get_external_job_collection()
    if coll is None: return
    for job in jobs:
        # Use (title, company) as unique key for external jobs to avoid duplicates
        coll.update_one(
            {'title': job['title'], 'company': job['company']},
            {'$set': job},
            upsert=True
        )

def _is_cache_valid(job: dict) -> bool:
    """Check if a specific job record is still valid (under 6 hours old)."""
    lu = job.get('crawled_at')
    if not lu: return False
    try:
        updated = datetime.fromisoformat(lu)
        age_hours = (datetime.now(timezone.utc) - updated).total_seconds() / 3600
        return age_hours < _CACHE_TTL_HOURS
    except Exception:
        return False

def _load_skill_profiles():
    """Skill profiles are now managed via the 'user_profiles' collection in MongoDB."""
    # This is a placeholder as the logic is moved to _upsert_skill_profile
    return []


def _save_skill_profiles(profiles: list):
    os.makedirs(_ADMIN_DIR, exist_ok=True)
    with open(_SKILL_PROF, 'w', encoding='utf-8') as f:
        json.dump(profiles, f, indent=2, ensure_ascii=False)


def _upsert_skill_profile(resume_skills: set, matched_job_ids: list):
    """Save/update anonymized skill profile in MongoDB."""
    if not resume_skills: return
    skills_list = sorted(list(resume_skills))
    skill_str   = ','.join(skills_list)
    skill_hash = str(hashlib.sha256(skill_str.encode()).hexdigest())[:16]

    coll = get_user_collection() # Using users collection for skill profiles (anonymized)
    if coll is None: return

    existing = coll.find_one({'skill_hash': skill_hash})

    if existing:
        coll.update_one(
            {'skill_hash': skill_hash},
            {
                '$set': {'last_searched': datetime.now(timezone.utc).isoformat()},
                '$addToSet': {'matched_job_ids': {'$each': matched_job_ids}},
                '$inc': {'search_count': 1}
            }
        )
    else:
        coll.insert_one({
            'skill_hash':      skill_hash,
            'skills':          skills_list,
            'last_searched':   datetime.now(timezone.utc).isoformat(),
            'matched_job_ids': matched_job_ids[:50],
            'search_count':    1,
            'is_anonymized_profile': True
        })

def _get_search_count(resume_skills: set) -> int:
    """Return how many times this skill profile has triggered a search."""
    if not resume_skills: return 0
    skills_list = sorted(list(resume_skills))
    skill_str   = ','.join(skills_list)
    skill_hash = str(hashlib.sha256(skill_str.encode()).hexdigest())[:16]

    coll = get_user_collection()
    if coll is None: return 0
    existing = coll.find_one({'skill_hash': skill_hash})
    return existing.get('search_count', 0) if existing else 0

# ── Crawlers ───────────────────────────────────────────────────────────────────

def _crawl_indeed_rss(query: str, location: str) -> list:
    """Crawl Indeed via their public RSS feed — no ToS violation."""
    if not _HAS_FEEDPARSER:
        log.warning('[ExtCrawl] feedparser not installed — skipping Indeed RSS')
        return []
    
    try:
        q_enc = query.replace(' ', '+')
        l_enc = location.replace(' ', '+') if location else 'remote'
        url = f'https://indeed.com/rss?q={q_enc}&l={l_enc}'
        
        feed = feedparser.parse(url)
        jobs = []
        for i, entry in enumerate(feed.entries[:15]):
            title    = entry.get('title', '')
            company  = entry.get('author', 'Unknown')
            link     = entry.get('link', '')
            summary  = entry.get('summary', '')
            pub_date = entry.get('published', '')
            
            # Extract location from title (Indeed format: "Job Title - Company - Location")
            parts     = title.split(' - ')
            job_title = parts[0].strip() if parts else title
            location_str = parts[-1].strip() if len(parts) >= 3 else location or 'Not specified'
            
            skills_set = cast(Set[str], _extract_skills_from_text(f'{job_title} {summary}'))
            
            jobs.append({
                'id':          f'ext_indeed_{i}_{int(time.time())}',
                'platform':    'Indeed',
                'title':       job_title,
                'company':     company,
                'location':    location_str,
                'url':         link,
                'description': summary[:300],
                'tags':        [list(skills_set)[i] for i in range(min(8, len(skills_set)))],
                'skills_set':  list(skills_set),
                'posted_at':   pub_date,
                'crawled_at':  datetime.now(timezone.utc).isoformat(),
                'salary':      'Not disclosed'
            })
        
        log.info(f'[ExtCrawl] Indeed RSS: {len(jobs)} jobs')
        return jobs
    except Exception as e:
        log.warning(f'[ExtCrawl] Indeed RSS failed: {e}')
        return []


def _crawl_naukri(query: str, location: str) -> list:
    """Crawl Naukri.com job listings."""
    if not _HAS_REQUESTS or not _HAS_BS4:
        log.warning('[ExtCrawl] requests/bs4 not installed — skipping Naukri')
        return []
    
    try:
        q_enc = query.lower().replace(' ', '-')
        l_enc = location.lower().replace(' ', '-') if location else ''
        base  = f'https://www.naukri.com/{q_enc}-jobs'
        if l_enc:
            base += f'-in-{l_enc}'
        
        resp = requests.get(base, headers=_HEADERS, timeout=10)
        if resp.status_code != 200:
            log.warning(f'[ExtCrawl] Naukri returned status {resp.status_code}')
            return []
        
        soup = BeautifulSoup(resp.text, 'html.parser')
        job_cards = soup.select('article.jobTuple, div.jobTupleCard, div[class*="srp-jobtuple"]')
        
        jobs = []
        for i, card in enumerate(job_cards[:15]):
            # Title
            title_el = (card.select_one('a.title') or 
                       card.select_one('a[class*="title"]') or 
                       card.select_one('.jobTitle a') or
                       card.select_one('h2 a'))
            title = title_el.get_text(strip=True) if title_el else ''
            link  = title_el.get('href', '') if title_el else ''
            
            # Company
            comp_el = (card.select_one('a.subTitle') or 
                      card.select_one('.companyInfo a') or 
                      card.select_one('[class*="comp-name"]'))
            company = comp_el.get_text(strip=True) if comp_el else 'Unknown'
            
            # Location
            loc_el = (card.select_one('.location') or 
                     card.select_one('[class*="location"]') or
                     card.select_one('.locWdth'))
            location_str = loc_el.get_text(strip=True) if loc_el else location or 'India'
            
            # Experience / Skills tags
            tags_el = card.select('li.tag, li[class*="tag"], span[class*="tag"]')
            tags = [t.get_text(strip=True) for t in tags_el[:6]] if tags_el else []
            
            # Skills from tags + title
            skills = _extract_skills_from_text(f'{title} {" ".join(tags)}')
            
            if title:
                jobs.append({
                    'id':          f'ext_naukri_{i}_{int(time.time())}',
                    'platform':    'Naukri',
                    'title':       title,
                    'company':     company,
                    'location':    location_str,
                    'url':         link if link.startswith('http') else f'https://www.naukri.com{link}',
                    'description': f'{title} at {company}',
                    'tags':        ([tags[i] for i in range(min(8, len(tags)))] if tags else []) or ([list(skills)[i] for i in range(min(8, len(list(skills))))] if skills else []),
                    'skills_set':  list(skills),
                    'posted_at':   'Recent',
                    'crawled_at':  datetime.now(timezone.utc).isoformat(),
                    'salary':      'Not disclosed'
                })
        
        log.info(f'[ExtCrawl] Naukri: {len(jobs)} jobs')
        return jobs
    except Exception as e:
        log.warning(f'[ExtCrawl] Naukri crawl failed: {e}')
        return []


def _crawl_internshala(query: str, location: str) -> list:
    """Crawl Internshala job listings (internships & entry-level jobs)."""
    if not _HAS_REQUESTS or not _HAS_BS4:
        log.warning('[ExtCrawl] requests/bs4 not installed — skipping Internshala')
        return []
    
    try:
        q_enc = query.lower().replace(' ', '-')
        url   = f'https://internshala.com/internships/{q_enc}-internship'
        
        resp = requests.get(url, headers=_HEADERS, timeout=10)
        if resp.status_code != 200:
            return []
        
        soup = BeautifulSoup(resp.text, 'html.parser')
        containers = soup.select('.individual_internship, div[class*="internship_meta"]')
        
        jobs = []
        for i, card in enumerate(containers[:12]):
            title_el = (card.select_one('.profile') or 
                       card.select_one('h3') or 
                       card.select_one('a.view_detail_button'))
            title = title_el.get_text(strip=True) if title_el else ''
            
            if not title:
                # Fallback: look for internship_heading
                heading = card.find(class_='internship_heading')
                if heading:
                    a = heading.find('a')
                    title = a.get_text(strip=True) if a else ''
            
            comp_el  = card.select_one('.company_name a, .company-name')
            company  = comp_el.get_text(strip=True) if comp_el else 'Unknown'
            
            loc_el   = card.select_one('.location_link, .locations span')
            loc_str  = loc_el.get_text(strip=True) if loc_el else 'Remote/India'
            
            stip_el  = card.select_one('.stipend, .stipend_slot')
            salary   = stip_el.get_text(strip=True) if stip_el else 'Not disclosed'
            
            link_el  = card.select_one('a.view_detail_button, a[href*="/internships/"]')
            link     = link_el.get('href', '') if link_el else ''
            
            skills   = _extract_skills_from_text(f'{title} {company}')
            
            if title:
                jobs.append({
                    'id':          f'ext_internshala_{i}_{int(time.time())}',
                    'platform':    'Internshala',
                    'title':       title,
                    'company':     company,
                    'location':    loc_str,
                    'url':         link if link.startswith('http') else f'https://internshala.com{link}',
                    'description': f'{title} at {company}',
                    'tags':        [list(skills)[i] for i in range(min(8, len(list(skills))))] if skills else [],
                    'skills_set':  list(skills),
                    'posted_at':   'Active',
                    'crawled_at':  datetime.now(timezone.utc).isoformat(),
                    'salary':      salary
                })
        
        log.info(f'[ExtCrawl] Internshala: {len(jobs)} jobs')
        return jobs
    except Exception as e:
        log.warning(f'[ExtCrawl] Internshala crawl failed: {e}')
        return []


def _crawl_wellfound(query: str) -> list:
    """Crawl Wellfound (formerly AngelList) startup jobs."""
    if not _HAS_REQUESTS or not _HAS_BS4:
        log.warning('[ExtCrawl] requests/bs4 not installed — skipping Wellfound')
        return []
    
    try:
        q_enc = query.lower().replace(' ', '-')
        url   = f'https://wellfound.com/role/{q_enc}'
        
        resp  = requests.get(url, headers=_HEADERS, timeout=10)
        if resp.status_code != 200:
            return []
        
        soup  = BeautifulSoup(resp.text, 'html.parser')
        # Wellfound renders JS — only static listings may be present
        cards = soup.select('div[data-test*="job"], div[class*="JobListing"], div[class*="startup-link"]')
        
        jobs  = []
        for i, card in enumerate(cards[:10]):
            title_el = (card.select_one('h2') or card.select_one('span[class*="title"]') or 
                       card.select_one('a[class*="job"]'))
            title    = title_el.get_text(strip=True) if title_el else ''
            
            comp_el  = card.select_one('a[class*="startup"], span[class*="company"]')
            company  = comp_el.get_text(strip=True) if comp_el else 'Startup'
            
            link_el  = card.select_one('a[href*="/jobs/"]')
            link     = link_el.get('href', '') if link_el else ''
            
            skills   = _extract_skills_from_text(title)
            
            if title:
                jobs.append({
                    'id':          f'ext_wellfound_{i}_{int(time.time())}',
                    'platform':    'Wellfound',
                    'title':       title,
                    'company':     company,
                    'location':    'Remote/Startup',
                    'url':         link if link.startswith('http') else f'https://wellfound.com{link}',
                    'description': f'{title} at {company} (startup)',
                    'tags':        [list(skills)[i] for i in range(min(8, len(list(skills))))] if skills else [],
                    'skills_set':  list(skills),
                    'posted_at':   'Active',
                    'crawled_at':  datetime.now(timezone.utc).isoformat(),
                    'salary':      'Equity + salary'
                })
        
        log.info(f'[ExtCrawl] Wellfound: {len(jobs)} jobs')
        return jobs
    except Exception as e:
        log.warning(f'[ExtCrawl] Wellfound crawl failed: {e}')
        return []


# ── Main Route ─────────────────────────────────────────────────────────────────

@external_bp.route('/api/external/crawl', methods=['POST'])
def crawl_external():
    """
    POST /api/external/crawl
    Body: { "query": "mern stack", "location": "remote", "resume_skills": ["React","Node.js"] }

    Returns scored and ranked external job results.
    Uses Admin/web_crawling.json as a 6-hour cache to avoid frequent site hits.
    """
    data = request.get_json() or {}
    query         = (data.get('query') or '').strip()
    location      = (data.get('location') or '').strip()
    resume_skills = set(s.lower() for s in (data.get('resume_skills') or []))

    if not query and not resume_skills:
        return jsonify({'success': False, 'error': 'query or resume_skills required'}), 400

    # If no explicit query, build one from top resume skills
    if not query and resume_skills:
        skill_list = sorted(resume_skills)
        query = ' '.join(skill_list[:3])

    # ── Cache lookup & Pruning (10-Day Policy) ───────────────────────────────
    cache      = _load_crawl_cache()
    from_cache = False
    now        = datetime.now(timezone.utc)

    # Prune jobs older than 10 days
    fresh_jobs = []
    for j in cache.get('jobs', []):
        try:
            crawled_dt = datetime.fromisoformat(j.get('crawled_at', ''))
            if (now - crawled_dt).total_seconds() / 86400 <= 10:
                fresh_jobs.append(j)
        except:
            pass
    cache['jobs'] = fresh_jobs

    # ── Smart Fallback API ───────────────────────────────────────────────────
    search_count = _get_search_count(resume_skills)
    force_fallback = (search_count >= 3)

    if not force_fallback and _is_cache_valid(cache) and cache.get('jobs'):
        # Check if cached jobs sufficiently match resume_skills
        all_cached_skills = set()
        for j in cache['jobs']:
            all_cached_skills.update(set(s.lower() for s in j.get('skills_set', [])))

        overlap = _skill_overlap(resume_skills, all_cached_skills) if resume_skills else 0
        
        # Check query match too — only serve cache if query matches any cached job title
        query_words = set(query.lower().split()) if query else set()
        title_match = any(
            any(w in j.get('title', '').lower() for w in query_words)
            for j in cache['jobs']
        ) if query_words else True

        if overlap >= _SKILL_OVERLAP_THRESHOLD and title_match:
            from_cache = True
            log.info(f'[ExtCrawl] Cache hit: overlap={overlap:.0%}, TTL valid')

    # ── Live crawl (Normal or Enriched) if cache miss ─────────────────────────
    if not from_cache:
        if force_fallback:
            log.info(f'[ExtCrawl] Fallback Triggered (Count: {search_count}) for "{query}"')
        else:
            log.info(f'[ExtCrawl] Live crawl for query="{query}" location="{location}"')
        
        new_jobs = []
        new_jobs.extend(_crawl_indeed_rss(query, location))
        new_jobs.extend(_crawl_naukri(query, location))
        new_jobs.extend(_crawl_internshala(query, location))
        new_jobs.extend(_crawl_wellfound(query))

        if new_jobs:
            # Merge with existing cache (APPEND, avoid duplicates) - 10-day policy
            existing_keys = {(j.get('title','').lower(), j.get('company','').lower()) 
                           for j in cache.get('jobs', [])}
            for j in new_jobs:
                k = (j.get('title','').lower(), j.get('company','').lower())
                if k not in existing_keys:
                    cache.setdefault('jobs', []).append(j)
                    existing_keys.add(k)
            
            # Allow cache to grow larger since time-pruning controls it now
            cache['jobs'] = cache['jobs'][-1000:]
            cache['sources'] = ['Naukri', 'Internshala', 'Wellfound', 'IndeedRSS']
            if force_fallback:
                cache['sources'].append('Enriched/Fallback')
                
            _save_crawl_cache(cache)
            log.info(f'[ExtCrawl] Saved {len(new_jobs)} new jobs to Admin/web_crawling.json. Total cache: {len(cache["jobs"])}')

    # ── Score jobs against resume skills ─────────────────────────────────────
    jobs_to_score = cache.get('jobs', [])
    
    # Filter by query if provided
    if query:
        query_words = query.lower().split()
        def _query_relevance(job):
            text = f"{job.get('title','')} {job.get('description','')} {' '.join(job.get('tags',[]))}".lower()
            return sum(1 for w in query_words if w in text)
        
        scored_jobs = []
        for j in jobs_to_score:
            rel = _query_relevance(j)
            j_skills = set(s.lower() for s in j.get('skills_set', []))
            resume_score = _score_job_vs_skills(j_skills, resume_skills) if resume_skills else 50
            query_score  = min(100, rel * 25)  # Each matching word adds 25 pts
            
            # Blended: 60% resume match + 40% query relevance
            blended = int(resume_score * 0.6 + query_score * 0.4) if resume_skills else query_score
            
            scored_jobs.append({**j, 'matchScore': blended, 'resumeScore': resume_score})
        
        scored_jobs = [j for j in scored_jobs if j.get('matchScore', 0) > 0]
    else:
        scored_jobs = []
        for j in jobs_to_score:
            j_skills     = set(s.lower() for s in j.get('skills_set', []))
            resume_score = _score_job_vs_skills(j_skills, resume_skills) if resume_skills else 30
            scored_jobs.append({**j, 'matchScore': resume_score, 'resumeScore': resume_score})

    # Sort by match score descending
    scored_jobs.sort(key=lambda x: x.get('matchScore', 0), reverse=True)
    
    # Return top 30
    scored_jobs = scored_jobs[:30]

    # ── Save anonymized skill profile ────────────────────────────────────────
    try:
        matched_ids = [j['id'] for j in scored_jobs[:10] if j.get('matchScore', 0) >= 50]
        if resume_skills:
            _upsert_skill_profile(resume_skills, matched_ids)
    except Exception as e:
        log.warning(f'[ExtCrawl] Could not save skill profile: {e}')

    return jsonify({
        'success':    True,
        'jobs':       scored_jobs,
        'total':      len(scored_jobs),
        'from_cache': from_cache,
        'query':      query,
        'location':   location,
        'crawled_at': cache.get('last_updated', '')
    }), 200


@external_bp.route('/api/external/cache-status', methods=['GET'])
def cache_status():
    """GET /api/external/cache-status — returns cache metadata for admin/debug."""
    cache = _load_crawl_cache()
    return jsonify({
        'last_updated': cache.get('last_updated'),
        'ttl_hours':    _CACHE_TTL_HOURS,
        'is_valid':     _is_cache_valid(cache),
        'job_count':    len(cache.get('jobs', [])),
        'sources':      cache.get('sources', [])
    }), 200


# ── AI Job Comparison logic (Phase 3 - Feature 4) ─────────────────────────────

def _extract_job_content(url):
    """Fetch URL and extract main visible text."""
    if not _HAS_REQUESTS or not _HAS_BS4:
        return ""
    try:
        resp = requests.get(url, headers=_HEADERS, timeout=8)
        if resp.status_code != 200:
            return ""
        
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # Remove scripts, styles, and boilerplate
        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
            tag.decompose()
            
        # Try to find common job description containers
        # Many sites use specific classes, but we'll fall back to body text
        main = soup.find('main') or soup.find('article') or soup.body
        if not main:
            return ""
            
        text = main.get_text(separator='\n', strip=True)
        # Limit text length to avoid token bloat
        return text[:4000] 
    except Exception as e:
        log.warning(f"[ExtCompare] Failed to extract from {url}: {e}")
        return ""


@external_bp.route('/api/external/compare', methods=['POST'])
def compare_jobs():
    """
    POST /api/external/compare
    Body: { "jobs": [ { "url": "...", "title": "...", "company": "..." }, ... ] }
    Max 5 jobs.
    """
    data = request.get_json()
    if not data or 'jobs' not in data:
        return jsonify({"success": False, "error": "No jobs provided for comparison."}), 400
    
    jobs_list = data['jobs']
    if not jobs_list:
        return jsonify({"success": False, "error": "Job list is empty."}), 400
    
    if len(jobs_list) > 5:
        jobs_list = jobs_list[:5] # Enforce max 5
        
    extracted_data = []
    for j in jobs_list:
        url = j.get('url')
        title = j.get('title', 'Unknown Title')
        company = j.get('company', 'Unknown Company')
        
        content = _extract_job_content(url) if url and url.startswith('http') else ""
        
        extracted_data.append({
            "title": title,
            "company": company,
            "url": url,
            "content": content or "Could not extract detailed content from this URL."
        })

    # Build AI Prompt
    comparison_context = ""
    for idx, ed in enumerate(extracted_data):
        comparison_context += f"### Job {idx+1}: {ed['title']} at {ed['company']}\n"
        comparison_context += f"URL: {ed['url']}\n"
        comparison_context += f"CONTENT:\n{ed['content']}\n\n"
        comparison_context += "---\n"

    prompt = f"""
You are a senior career consultant. Compare the following {len(extracted_data)} job opportunities.
Provide a clear, professional comparison in Markdown format.

Your comparison MUST include:
1. A **Comparison Table** at the top with columns for: 
   - Role & Company
   - Estimated Tech Stack
   - Key Responsibilities
   - Perceived Values (Benefits/Work Culture if found)
   - Suitability Score (1-100 based on modern developer standards)

2. A **Detailed Analysis** for each job, noting:
   - Pros & Cons
   - Skill gaps for a typical software developer
   - Competitive edge of one over others

3. Final **Recommendation**: Which one should be the priority to apply to first and why.

--- JOB DATA ---
{comparison_context}
--- END JOB DATA ---

Return ONLY Markdown. Use headings, bold text, and tables to make it beautiful.
"""

    try:
        # Get Gemini key from config
        from . import config # ensure we use the package level config
        import google.generativeai as genai
        
        keys = config.get_live_keys().get('gemini', [])
        if not keys:
            return jsonify({"success": False, "error": "AI comparison unavailable (no API keys)."}), 503
        
        genai.configure(api_key=keys[0])
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        return jsonify({
            "success": True,
            "comparison_markdown": response.text
        }), 200
        
    except Exception as e:
        log.error(f"[ExtCompare] Comparison failed: {e}")
        return jsonify({"success": False, "error": f"Comparison failed: {str(e)}"}), 500
