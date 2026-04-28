"""
job_fetcher.py — External Job Search & Crawl Engine
=====================================================
Crawls from Local DB, MCPs, and Web Scrapers.
Caches results in MongoDB with 6-hour TTL.
Scores crawled jobs against candidate resume skills.
Supports AI-powered multi-job comparison via Gemini.

Endpoints:
  POST /api/external/crawl
  GET  /api/external/cache-status
  POST /api/external/compare
"""

import os
import json
import logging
import time
from datetime import datetime, timezone
from typing import List, Set, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from modules.jobseeker.web_scraper import fetch_crawled_jobs
from modules.jobseeker.mcp_client import fetch_mcp_jobs

log = logging.getLogger(__name__)

router = APIRouter(tags=["External Jobs"])

try:
    import requests as http_requests
    _HAS_REQUESTS = True
except ImportError:
    _HAS_REQUESTS = False

try:
    from bs4 import BeautifulSoup
    _HAS_BS4 = True
except ImportError:
    _HAS_BS4 = False

# ── MongoDB optional ──────────────────────────────────────────────────────────
try:
    from pymongo import MongoClient
    _mongo_client: Optional[MongoClient] = None

    def _get_mongo_db():
        global _mongo_client
        if _mongo_client is None:
            url = os.getenv("DATABASE_URL", "mongodb://localhost:27017/career_auto1")
            _mongo_client = MongoClient(url, serverSelectionTimeoutMS=3000)
        return _mongo_client.get_default_database()
except ImportError:
    _get_mongo_db = None  # type: ignore

_CACHE_TTL_HOURS = 6
_SKILL_OVERLAP_THRESHOLD = 0.70

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

class CrawlRequest(BaseModel):
    query: str = ""
    location: str = ""
    resume_skills: List[str] = []

class CompareJob(BaseModel):
    url: str
    title: str
    company: str

class CompareRequest(BaseModel):
    jobs: List[CompareJob]

def _skill_overlap(a: Set[str], b: Set[str]) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)

def _score_job(job_skills: Set[str], resume_skills: Set[str]) -> int:
    if not resume_skills:
        return 0
    matched = len(job_skills & resume_skills)
    return min(100, int((matched / len(resume_skills)) * 100))

# ── MongoDB Cache ─────────────────────────────────────────────────────────────

def _get_collection(name: str):
    if _get_mongo_db is None:
        return None
    try:
        return _get_mongo_db()[name]
    except Exception:
        return None

def _save_jobs_to_cache(jobs: list):
    coll = _get_collection("external_jobs")
    if coll is None:
        return
    for job in jobs:
        try:
            coll.update_one(
                {"title": job["title"], "company": job["company"]},
                {"$set": job},
                upsert=True,
            )
        except Exception:
            pass

def _load_jobs_from_cache(query: str, resume_skills: Set[str]) -> list:
    """Load fresh jobs from MongoDB cache (under 6 hours old)."""
    coll = _get_collection("external_jobs")
    if coll is None:
        return []
    try:
        now = datetime.now(timezone.utc)
        all_jobs = list(coll.find({}, {"_id": 0}).limit(500))
        fresh = []
        for j in all_jobs:
            try:
                crawled_dt = datetime.fromisoformat(j.get("crawled_at", ""))
                age_hours = (now - crawled_dt).total_seconds() / 3600
                if age_hours <= _CACHE_TTL_HOURS:
                    fresh.append(j)
            except Exception:
                pass
        return fresh
    except Exception:
        return []

# ── Local Fetcher ─────────────────────────────────────────────────────────────

def fetch_local_jobs(query: str, location: str) -> list:
    try:
        jobs_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "database", "admin", "Jobs.json")
        with open(jobs_path, "r", encoding="utf-8") as f:
            jobs_data = json.load(f)
            
        q_low = query.lower()
        l_low = location.lower()
        results = []
        
        for j in jobs_data:
            j_title = str(j.get("title", "")).lower()
            j_company = str(j.get("company", "")).lower()
            j_loc = str(j.get("location", "")).lower()
            j_tags = j.get("tags", [])
            j_desc = str(j.get("description", "")).lower()
            
            matches_query = not q_low or q_low in j_title or q_low in j_company or q_low in j_desc or any(q_low in str(t).lower() for t in j_tags)
            matches_loc = not l_low or l_low in j_loc
            
            if matches_query and matches_loc:
                results.append({
                    "id": f"int_db_{j.get('id', int(time.time()))}",
                    "platform": "Career Auto (Local)",
                    "title": j.get("title", "Unknown"),
                    "company": j.get("company", "Unknown"),
                    "location": j.get("location", "Remote"),
                    "url": f"/jobs/{j.get('id', '')}",
                    "description": str(j.get("description", ""))[:300],
                    "tags": j_tags[:8],
                    "skills_set": [str(s).lower() for s in j_tags],
                    "posted_at": j.get("postedTime", "Recent"),
                    "crawled_at": datetime.now(timezone.utc).isoformat(),
                    "salary": j.get("salary", "Not disclosed"),
                })
        log.info(f"[ExtCrawl] Internal DB: {len(results)} jobs")
        return results
    except Exception as e:
        log.warning(f"[ExtCrawl] Internal jobs failed: {e}")
        return []

# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/api/external/crawl")
async def crawl_external(body: CrawlRequest):
    """
    POST /api/external/crawl
    Crawls from 3 sources: Local DB, External Web Scrapers, and MCP tools.
    Uses MongoDB cache (6hr TTL, 70% skill overlap = cache hit).
    Returns ranked, scored jobs.
    """
    query = body.query.strip()
    location = body.location.strip()
    resume_skills: Set[str] = {s.lower() for s in body.resume_skills}

    if not query and resume_skills:
        query = " ".join(sorted(resume_skills)[:3])

    # ── Cache lookup ─────────────────────────────────────────────────────────
    cached_jobs = _load_jobs_from_cache(query, resume_skills)
    from_cache = False
    if cached_jobs:
        all_cached_skills: Set[str] = set()
        for j in cached_jobs:
            all_cached_skills.update(set(s.lower() for s in j.get("skills_set", [])))
        overlap = _skill_overlap(resume_skills, all_cached_skills) if resume_skills else 0
        if overlap >= _SKILL_OVERLAP_THRESHOLD:
            from_cache = True
            log.info(f"[ExtCrawl] Cache hit: overlap={overlap:.0%}")

    # ── Live crawl & Internal  ───────────────────────────────────────────────
    internal_jobs = fetch_local_jobs(query, location)
    
    if not query:
        # User requested to default to Jobs.json without delays
        cached_jobs = [] 
    elif not from_cache:
        new_jobs: list = []
        new_jobs.extend(fetch_crawled_jobs(query, location))
        new_jobs.extend(fetch_mcp_jobs(query, location))
        if new_jobs:
            _save_jobs_to_cache(new_jobs)
            cached_jobs = new_jobs + [j for j in cached_jobs if j not in new_jobs]

    # Combine cached external jobs + internal jobs
    # Use dictionary keyed by 'id' to avoid duplicates
    combined = {j["id"]: j for j in cached_jobs}
    for j in internal_jobs:
        combined[j["id"]] = j
        
    all_jobs_mixed = list(combined.values())

    # ── Score & rank ─────────────────────────────────────────────────────────
    scored: list = []
    query_words = set(query.lower().split()) if query else set()

    for j in all_jobs_mixed:
        j_skills: Set[str] = {s.lower() for s in j.get("skills_set", [])}
        resume_score = _score_job(j_skills, resume_skills) if resume_skills else 50
        query_score = 0
        if query_words:
            text = f"{j.get('title','')} {j.get('description','')} {' '.join(j.get('tags',[]))}".lower()
            rel = sum(1 for w in query_words if w in text)
            query_score = min(100, rel * 25)
        blended = int(resume_score * 0.6 + query_score * 0.4) if resume_skills else query_score
        scored.append({**j, "matchScore": blended, "resumeScore": resume_score})

    if query_words:
        scored = [j for j in scored if j.get("matchScore", 0) > 0]

    scored.sort(key=lambda x: x.get("matchScore", 0), reverse=True)

    return {
        "success": True,
        "jobs": scored,
        "total": len(scored),
        "from_cache": from_cache,
        "query": query,
        "location": location,
    }


@router.get("/api/external/cache-status")
async def cache_status():
    """GET /api/external/cache-status — returns cache metadata for admin/debug."""
    coll = _get_collection("external_jobs")
    count = 0
    if coll is not None:
        try:
            count = coll.count_documents({})
        except Exception:
            pass
    return {
        "ttl_hours": _CACHE_TTL_HOURS,
        "job_count": count,
        "sources": ["Local DB", "MCP", "Naukri", "Internshala", "Wellfound", "IndeedRSS"],
    }


@router.post("/api/external/compare")
async def compare_jobs(body: CompareRequest):
    """
    POST /api/external/compare
    Fetches up to 5 job URLs and compares them with AI (Gemini).
    Returns comparison in Markdown.
    """
    jobs_list = body.jobs[:5]

    def _fetch_content(url: str) -> str:
        if not _HAS_REQUESTS or not _HAS_BS4:
            return ""
        try:
            resp = http_requests.get(url, headers=_HEADERS, timeout=8)
            if resp.status_code != 200:
                return ""
            soup = BeautifulSoup(resp.text, "html.parser")
            for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
                tag.decompose()
            main = soup.find("main") or soup.find("article") or soup.body
            return (main.get_text(separator="\n", strip=True) if main else "")[:4000]
        except Exception:
            return ""

    context = ""
    for idx, job in enumerate(jobs_list):
        content = _fetch_content(job.url) if job.url.startswith("http") else ""
        context += (
            f"### Job {idx+1}: {job.title} at {job.company}\n"
            f"URL: {job.url}\n"
            f"CONTENT:\n{content or 'Could not extract content.'}\n\n---\n"
        )

    prompt = f"""You are a senior career consultant. Compare these {len(jobs_list)} job opportunities.

Return a Markdown document with:
1. **Comparison Table**: Role & Company, Estimated Tech Stack, Key Responsibilities, Suitability Score (1-100)
2. **Detailed Analysis** per job: Pros & Cons, skill gaps, competitive edge
3. **Final Recommendation**: Which to apply to first and why

--- JOB DATA ---
{context}
--- END JOB DATA ---

Return ONLY Markdown. Use headings, bold text, and tables."""

    try:
        import google.generativeai as genai  # type: ignore
        api_key = os.getenv("GEMINI_API_KEY_1") or os.getenv("GEMINI_API_KEY", "")
        if not api_key:
            return {"success": False, "error": "AI comparison unavailable (no Gemini API key configured)."}
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return {"success": True, "comparison_markdown": response.text}
    except Exception as e:
        log.error(f"[ExtCompare] Comparison failed: {e}")
        return {"success": False, "error": str(e)}
