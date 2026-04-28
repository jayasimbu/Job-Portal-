"""
web_scraper.py — Dedicated Web Scraper Module for Job Portals
"""
import time
import logging
from datetime import datetime, timezone
from typing import Set

log = logging.getLogger(__name__)

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

try:
    import feedparser
    _HAS_FEEDPARSER = True
except ImportError:
    _HAS_FEEDPARSER = False

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

_COMMON_TECH_SKILLS = [
    "react", "node", "nodejs", "javascript", "typescript", "python", "java",
    "c++", "c#", "angular", "vue", "html", "css", "mongodb", "mysql",
    "postgresql", "sql", "nosql", "express", "django", "flask", "fastapi",
    "spring", "docker", "kubernetes", "aws", "azure", "gcp", "git",
    "linux", "rest", "graphql", "redis", "kafka", "spark", "hadoop",
    "machine learning", "deep learning", "tensorflow", "pytorch", "nlp",
    "data science", "data analysis", "tableau", "power bi", "excel",
    "pandas", "numpy", "scikit", "php", "laravel", "ruby", "rails",
    "swift", "kotlin", "flutter", "react native", "android", "ios",
    "devops", "ci/cd", "jenkins", "terraform", "ansible",
    "salesforce", "sap", "mern", "mean", "full stack", "backend", "frontend",
    "ui/ux", "figma", "photoshop", "agile", "scrum", "jira",
    "communication", "leadership", "teamwork", "problem solving",
]

def _extract_skills(text: str) -> Set[str]:
    low = text.lower()
    return {s for s in _COMMON_TECH_SKILLS if s in low}

def crawl_indeed_rss(query: str, location: str) -> list:
    if not _HAS_FEEDPARSER or not query:
        return []
    try:
        q_enc = query.replace(" ", "+")
        l_enc = location.replace(" ", "+") if location else "remote"
        url = f"https://indeed.com/rss?q={q_enc}&l={l_enc}"
        feed = feedparser.parse(url)
        jobs = []
        for i, entry in enumerate(feed.entries[:10]):
            title = entry.get("title", "")
            company = entry.get("author", "Unknown")
            link = entry.get("link", "")
            summary = entry.get("summary", "")
            pub_date = entry.get("published", "")
            parts = title.split(" - ")
            job_title = parts[0].strip() if parts else title
            location_str = parts[-1].strip() if len(parts) >= 3 else location or "Not specified"
            skills_set = _extract_skills(f"{job_title} {summary}")
            jobs.append({
                "id": f"ext_indeed_{i}_{int(time.time())}",
                "platform": "Indeed",
                "title": job_title,
                "company": company,
                "location": location_str,
                "url": link,
                "description": summary[:300],
                "tags": list(skills_set)[:8],
                "skills_set": list(skills_set),
                "posted_at": pub_date,
                "crawled_at": datetime.now(timezone.utc).isoformat(),
                "salary": "Not disclosed",
            })
        log.info(f"[WebScraper] Indeed RSS: {len(jobs)} jobs")
        return jobs
    except Exception as e:
        log.warning(f"[WebScraper] Indeed RSS failed: {e}")
        return []

def crawl_naukri(query: str, location: str) -> list:
    if not _HAS_REQUESTS or not _HAS_BS4 or not query:
        return []
    try:
        q_enc = query.lower().replace(" ", "-")
        l_enc = location.lower().replace(" ", "-") if location else ""
        base = f"https://www.naukri.com/{q_enc}-jobs"
        if l_enc:
            base += f"-in-{l_enc}"
        resp = http_requests.get(base, headers=_HEADERS, timeout=10)
        if resp.status_code != 200:
            return []
        soup = BeautifulSoup(resp.text, "html.parser")
        cards = soup.select('article.jobTuple, div.jobTupleCard, div[class*="srp-jobtuple"]')
        jobs = []
        for i, card in enumerate(cards[:10]):
            title_el = (
                card.select_one("a.title")
                or card.select_one('a[class*="title"]')
                or card.select_one(".jobTitle a")
                or card.select_one("h2 a")
            )
            title = title_el.get_text(strip=True) if title_el else ""
            link = title_el.get("href", "") if title_el else ""
            comp_el = (
                card.select_one("a.subTitle")
                or card.select_one(".companyInfo a")
                or card.select_one('[class*="comp-name"]')
            )
            company = comp_el.get_text(strip=True) if comp_el else "Unknown"
            loc_el = (
                card.select_one(".location")
                or card.select_one('[class*="location"]')
                or card.select_one(".locWdth")
            )
            location_str = loc_el.get_text(strip=True) if loc_el else location or "India"
            tags_el = card.select('li.tag, li[class*="tag"], span[class*="tag"]')
            tags = [t.get_text(strip=True) for t in tags_el[:6]] if tags_el else []
            skills = _extract_skills(f"{title} {' '.join(tags)}")
            if title:
                jobs.append({
                    "id": f"ext_naukri_{i}_{int(time.time())}",
                    "platform": "Naukri",
                    "title": title,
                    "company": company,
                    "location": location_str,
                    "url": link if link.startswith("http") else f"https://www.naukri.com{link}",
                    "description": f"{title} at {company}",
                    "tags": tags[:8] or list(skills)[:8],
                    "skills_set": list(skills),
                    "posted_at": "Recent",
                    "crawled_at": datetime.now(timezone.utc).isoformat(),
                    "salary": "Not disclosed",
                })
        log.info(f"[WebScraper] Naukri: {len(jobs)} jobs")
        return jobs
    except Exception as e:
        log.warning(f"[WebScraper] Naukri failed: {e}")
        return []

def crawl_internshala(query: str, location: str) -> list:
    if not _HAS_REQUESTS or not _HAS_BS4 or not query:
        return []
    try:
        q_enc = query.lower().replace(" ", "-")
        url = f"https://internshala.com/internships/{q_enc}-internship"
        resp = http_requests.get(url, headers=_HEADERS, timeout=10)
        if resp.status_code != 200:
            return []
        soup = BeautifulSoup(resp.text, "html.parser")
        containers = soup.select('.individual_internship, div[class*="internship_meta"]')
        jobs = []
        for i, card in enumerate(containers[:10]):
            title_el = (
                card.select_one(".profile")
                or card.select_one("h3")
                or card.select_one("a.view_detail_button")
            )
            title = title_el.get_text(strip=True) if title_el else ""
            if not title:
                heading = card.find(class_="internship_heading")
                if heading:
                    a = heading.find("a")
                    title = a.get_text(strip=True) if a else ""
            comp_el = card.select_one(".company_name a, .company-name")
            company = comp_el.get_text(strip=True) if comp_el else "Unknown"
            loc_el = card.select_one(".location_link, .locations span")
            loc_str = loc_el.get_text(strip=True) if loc_el else "Remote/India"
            stip_el = card.select_one(".stipend, .stipend_slot")
            salary = stip_el.get_text(strip=True) if stip_el else "Not disclosed"
            link_el = card.select_one('a.view_detail_button, a[href*="/internships/"]')
            link = link_el.get("href", "") if link_el else ""
            skills = _extract_skills(f"{title} {company}")
            if title:
                jobs.append({
                    "id": f"ext_internshala_{i}_{int(time.time())}",
                    "platform": "Internshala",
                    "title": title,
                    "company": company,
                    "location": loc_str,
                    "url": link if link.startswith("http") else f"https://internshala.com{link}",
                    "description": f"{title} at {company}",
                    "tags": list(skills)[:8],
                    "skills_set": list(skills),
                    "posted_at": "Active",
                    "crawled_at": datetime.now(timezone.utc).isoformat(),
                    "salary": salary,
                })
        log.info(f"[WebScraper] Internshala: {len(jobs)} jobs")
        return jobs
    except Exception as e:
        log.warning(f"[WebScraper] Internshala failed: {e}")
        return []

def crawl_wellfound(query: str) -> list:
    if not _HAS_REQUESTS or not _HAS_BS4 or not query:
        return []
    try:
        q_enc = query.lower().replace(" ", "-")
        url = f"https://wellfound.com/role/{q_enc}"
        resp = http_requests.get(url, headers=_HEADERS, timeout=10)
        if resp.status_code != 200:
            return []
        soup = BeautifulSoup(resp.text, "html.parser")
        cards = soup.select('div[data-test*="job"], div[class*="JobListing"], div[class*="startup-link"]')
        jobs = []
        for i, card in enumerate(cards[:10]):
            title_el = (
                card.select_one("h2")
                or card.select_one('span[class*="title"]')
                or card.select_one('a[class*="job"]')
            )
            title = title_el.get_text(strip=True) if title_el else ""
            comp_el = card.select_one('a[class*="startup"], span[class*="company"]')
            company = comp_el.get_text(strip=True) if comp_el else "Startup"
            link_el = card.select_one('a[href*="/jobs/"]')
            link = link_el.get("href", "") if link_el else ""
            skills = _extract_skills(title)
            if title:
                jobs.append({
                    "id": f"ext_wellfound_{i}_{int(time.time())}",
                    "platform": "Wellfound",
                    "title": title,
                    "company": company,
                    "location": "Remote/Startup",
                    "url": link if link.startswith("http") else f"https://wellfound.com{link}",
                    "description": f"{title} at {company} (startup)",
                    "tags": list(skills)[:8],
                    "skills_set": list(skills),
                    "posted_at": "Active",
                    "crawled_at": datetime.now(timezone.utc).isoformat(),
                    "salary": "Equity + salary",
                })
        log.info(f"[WebScraper] Wellfound: {len(jobs)} jobs")
        return jobs
    except Exception as e:
        log.warning(f"[WebScraper] Wellfound failed: {e}")
        return []

def fetch_crawled_jobs(query: str, location: str) -> list:
    """Aggregates all crawled jobs."""
    jobs = []
    if not query:
        return jobs
    jobs.extend(crawl_indeed_rss(query, location))
    jobs.extend(crawl_naukri(query, location))
    jobs.extend(crawl_internshala(query, location))
    jobs.extend(crawl_wellfound(query))
    return jobs
