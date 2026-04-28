"""
mcp_client.py — External MCP Jobs Fetcher
"""
import time
import logging
from datetime import datetime, timezone
from typing import Set

log = logging.getLogger(__name__)

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

def fetch_mcp_jobs(query: str, location: str) -> list:
    """
    Placeholder for future true MCP integration (e.g. via direct MCP servers).
    Currently returns an empty list. Could be mapped to simulated external APIs.
    """
    try:
        # If we had an actual external MCP tool mapped here, we'd invoke it:
        # results = mcp_call('search_jobs', query=query, location=location)
        jobs = []
        log.info(f"[MCPClient] Fetched {len(jobs)} jobs via MCP")
        return jobs
    except Exception as e:
        log.warning(f"[MCPClient] Fetch failed: {e}")
        return []
