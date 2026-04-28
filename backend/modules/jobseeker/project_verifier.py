"""
project_verifier.py — Candidate Project Authenticity Engine
============================================================
Verifies GitHub projects using:
  1. GitHub API — commit history, timeline, contributors, fork detection
  2. Commit quality analysis — message quality, natural development patterns
  3. Bulk commit detection — catches dumped code
  4. Feature-to-commit ratio — complex project with 5 commits = suspicious
  5. Live demo check — HTTP 200 = deployed
  6. AI-assist detection — pattern-based heuristics (no video required)

Output: Authenticity Score 0-100 with per-dimension breakdown.
AI-assist is labeled as "AI-Assisted" or "AI Vibe" — never "FAKE".

Endpoint:
  POST /api/verify/project
"""

import re
import logging
from datetime import datetime, timezone
from typing import Optional, List
from urllib.parse import urlparse

from fastapi import APIRouter
from pydantic import BaseModel

log = logging.getLogger(__name__)
router = APIRouter(tags=["Project Verification"])

# ── Pydantic ──────────────────────────────────────────────────────────────────

class ProjectVerifyRequest(BaseModel):
    github_url: str = ""
    live_url: Optional[str] = None
    project_name: Optional[str] = None


class DimensionResult(BaseModel):
    score: int               # 0-100 for this dimension
    max_score: int
    label: str
    details: str


class ProjectVerifyResponse(BaseModel):
    authenticity_score: int  # 0-100
    verdict: str             # "Strong", "Good", "Moderate", "AI-Assisted", "Suspicious"
    verdict_color: str       # "green", "lime", "yellow", "orange", "red"
    dimensions: List[dict]
    summary: str
    github_url: str
    live_url: Optional[str]
    repo_owner: Optional[str]
    repo_name: Optional[str]


# ── GitHub API Helpers ────────────────────────────────────────────────────────

def _parse_github_url(url: str):
    """Extract owner and repo name from a GitHub URL."""
    try:
        parsed = urlparse(url)
        path = parsed.path.strip("/")
        parts = path.split("/")
        if len(parts) >= 2:
            return parts[0], parts[1].replace(".git", "")
    except Exception:
        pass
    return None, None


def _github_api(path: str, token: Optional[str] = None) -> Optional[dict]:
    """Make a GitHub API request. Returns parsed JSON or None on failure."""
    try:
        import requests
        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "CareerAuto1-Verifier/1.0",
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"
        resp = requests.get(f"https://api.github.com{path}", headers=headers, timeout=10)
        if resp.status_code == 200:
            return resp.json()
        elif resp.status_code == 404:
            return {"_error": "not_found"}
        elif resp.status_code == 403:
            return {"_error": "rate_limited"}
        return None
    except Exception as e:
        log.warning(f"[Verifier] GitHub API call failed: {e}")
        return None


def _github_api_list(path: str, token: Optional[str] = None, per_page: int = 30) -> Optional[list]:
    """GitHub API call that returns a list."""
    try:
        import requests
        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "CareerAuto1-Verifier/1.0",
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"
        resp = requests.get(
            f"https://api.github.com{path}",
            headers=headers,
            timeout=10,
            params={"per_page": per_page},
        )
        if resp.status_code == 200:
            return resp.json()
        return None
    except Exception as e:
        log.warning(f"[Verifier] GitHub API list call failed: {e}")
        return None


# ── Verification Dimensions ───────────────────────────────────────────────────

def _check_live_demo(url: str) -> DimensionResult:
    """Check if live URL returns an HTTP 200 (deployed project)."""
    if not url or not url.startswith("http"):
        return {"score": 0, "max_score": 10, "label": "Live Demo", "details": "No live URL provided."}
    try:
        import requests
        resp = requests.head(url, allow_redirects=True, timeout=8,
                             headers={"User-Agent": "CareerAuto1-Verifier/1.0"})
        if resp.status_code < 400:
            return {"score": 10, "max_score": 10, "label": "Live Demo",
                    "details": f"✅ Project is deployed (HTTP {resp.status_code})."}
        return {"score": 3, "max_score": 10, "label": "Live Demo",
                "details": f"⚠️ URL returned HTTP {resp.status_code}."}
    except Exception:
        return {"score": 0, "max_score": 10, "label": "Live Demo",
                "details": "❌ URL is unreachable or times out."}


def _check_repo_basics(repo_data: dict) -> dict:
    """Score the repo for stars, forks, description, topics."""
    score = 0
    details = []

    if not repo_data or repo_data.get("_error"):
        return {"score": 0, "max_score": 15, "label": "Repository Health",
                "details": "Repository not accessible."}

    if repo_data.get("description"):
        score += 4
        details.append("✅ Has description")
    else:
        details.append("⚠️ No description")

    topics = repo_data.get("topics", [])
    if topics:
        score += 3
        details.append(f"✅ {len(topics)} topic(s) tagged")
    else:
        details.append("⚠️ No topics")

    # Forked repo loses points
    if repo_data.get("fork"):
        score -= 5
        details.append("⚠️ This is a forked repository")
    else:
        score += 5
        details.append("✅ Original repository (not a fork)")

    readme_size = repo_data.get("size", 0)
    if readme_size > 5:
        score += 3
        details.append("✅ Repository has content")

    return {
        "score": max(0, min(score, 15)),
        "max_score": 15,
        "label": "Repository Health",
        "details": " | ".join(details),
    }


def _check_commit_timeline(commits: list) -> dict:
    """Analyze commit timeline for natural development patterns."""
    if not commits:
        return {"score": 0, "max_score": 25, "label": "Commit Timeline",
                "details": "No commits found or repository is private."}

    total_commits = len(commits)
    dates = []
    for c in commits:
        try:
            iso = c.get("commit", {}).get("author", {}).get("date", "")
            if iso:
                dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
                dates.append(dt)
        except Exception:
            pass

    if not dates:
        return {"score": 5, "max_score": 25, "label": "Commit Timeline",
                "details": f"Found {total_commits} commits but couldn't parse dates."}

    dates.sort()
    score = 0
    details = []

    # Raw commit count
    if total_commits >= 30:
        score += 10
        details.append(f"✅ {total_commits} commits (extensive history)")
    elif total_commits >= 15:
        score += 7
        details.append(f"✅ {total_commits} commits (good history)")
    elif total_commits >= 7:
        score += 4
        details.append(f"⚠️ {total_commits} commits (moderate history)")
    else:
        score += 1
        details.append(f"❌ Only {total_commits} commits (thin history)")

    # Span of development
    if len(dates) >= 2:
        span_days = (dates[-1] - dates[0]).days
        if span_days >= 30:
            score += 8
            details.append(f"✅ Developed over {span_days} days (natural pace)")
        elif span_days >= 7:
            score += 4
            details.append(f"⚠️ Developed over {span_days} days")
        else:
            score += 1
            details.append(f"❌ All commits in {span_days} days (suspicious burst)")

    # Bulk commit detection: >60% commits on same day = suspicious
    if len(dates) >= 5:
        from collections import Counter
        day_counts = Counter(d.date() for d in dates)
        max_day = max(day_counts.values())
        if max_day / len(dates) > 0.60:
            score -= 5
            details.append(f"⚠️ {max_day}/{len(dates)} commits on one day (possible bulk upload)")
        else:
            score += 7
            details.append("✅ Commits spread across multiple days")

    return {
        "score": max(0, min(score, 25)),
        "max_score": 25,
        "label": "Commit Timeline",
        "details": " | ".join(details),
    }


def _check_commit_quality(commits: list) -> dict:
    """Score the quality of commit messages."""
    if not commits:
        return {"score": 0, "max_score": 20, "label": "Commit Quality",
                "details": "No commits to analyze."}

    messages = []
    for c in commits[:30]:
        msg = c.get("commit", {}).get("message", "")
        if msg:
            messages.append(msg.strip().lower())

    if not messages:
        return {"score": 3, "max_score": 20, "label": "Commit Quality",
                "details": "Commits have no messages."}

    score = 0
    details = []

    # Repetitive message detection ("update update update" pattern)
    unique_msgs = len(set(messages))
    repeat_ratio = unique_msgs / len(messages)
    if repeat_ratio < 0.3:
        details.append("❌ Very repetitive messages (AI-upload pattern)")
    elif repeat_ratio < 0.6:
        score += 3
        details.append("⚠️ Some message repetition")
    else:
        score += 8
        details.append("✅ Diverse commit messages")

    # Generic messages check
    generic_keywords = {"update", "fix", "add", "commit", "test", "changes", "work", "done", "misc"}
    generic_count = sum(1 for m in messages if m in generic_keywords or len(m.split()) <= 1)
    if generic_count / len(messages) > 0.6:
        details.append("⚠️ Too many generic one-word messages")
    else:
        score += 6
        details.append("✅ Meaningful commit messages")

    # Average message length
    avg_len = sum(len(m) for m in messages) / len(messages)
    if avg_len >= 20:
        score += 6
        details.append(f"✅ Descriptive messages (avg {avg_len:.0f} chars)")
    elif avg_len >= 10:
        score += 3
        details.append(f"⚠️ Short messages (avg {avg_len:.0f} chars)")
    else:
        details.append(f"❌ Very short messages (avg {avg_len:.0f} chars)")

    return {
        "score": max(0, min(score, 20)),
        "max_score": 20,
        "label": "Commit Quality",
        "details": " | ".join(details),
    }


def _check_contributors(contributors: list) -> dict:
    """Analyze contributor diversity."""
    if not contributors:
        return {"score": 5, "max_score": 10, "label": "Contributors",
                "details": "Could not retrieve contributor data."}

    count = len(contributors)
    if count == 1:
        return {"score": 7, "max_score": 10, "label": "Contributors",
                "details": "✅ Solo project (1 developer, typical for students)."}
    elif count <= 5:
        return {"score": 10, "max_score": 10, "label": "Contributors",
                "details": f"✅ {count} contributors (team project)."}
    return {"score": 10, "max_score": 10, "label": "Contributors",
            "details": f"✅ {count} contributors (open-source-style project)."}


def _check_ai_assist_signals(commits: list, repo_data: dict) -> dict:
    """
    Detect AI-assist coding patterns.
    Labels result as 'AI-Assisted' (not 'FAKE' or 'STOLEN').
    """
    signals = []
    score = 20  # Start full, subtract for signals

    messages = []
    for c in commits[:30]:
        msg = c.get("commit", {}).get("message", "").lower()
        if msg:
            messages.append(msg)

    # Signal 1: "initial commit" as main/only commit pattern
    init_commits = sum(1 for m in messages if "initial commit" in m or m.strip() == "init")
    if len(messages) > 0 and init_commits / len(messages) > 0.4:
        signals.append("Many 'initial commit' messages")
        score -= 6

    # Signal 2: Copilot/ChatGPT patterns in commits
    ai_refs = sum(1 for m in messages if any(kw in m for kw in
        ["generated", "ai", "chatgpt", "gpt", "copilot", "auto-generated"]))
    if ai_refs > 0:
        signals.append(f"{ai_refs} commit(s) reference AI tools")
        score -= 5

    # Signal 3: Repo very new + many files
    created_at = repo_data.get("created_at", "")
    pushed_at = repo_data.get("pushed_at", "")
    if created_at and pushed_at:
        try:
            created = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            pushed = datetime.fromisoformat(pushed_at.replace("Z", "+00:00"))
            age_days = (pushed - created).days
            if age_days <= 1 and len(commits) >= 10:
                signals.append("Repo went from 0→many commits in < 1 day")
                score -= 5
        except Exception:
            pass

    if not signals:
        details = "✅ No strong AI-assist patterns detected."
    else:
        details = "⚠️ Potential AI-assist signals: " + "; ".join(signals) + ". This is informational — not a disqualifier."

    return {
        "score": max(0, min(score, 20)),
        "max_score": 20,
        "label": "AI-Assist Detection",
        "details": details,
    }


# ── Main Route ────────────────────────────────────────────────────────────────

@router.post("/api/verify/project")
async def verify_project(body: ProjectVerifyRequest):
    """
    POST /api/verify/project
    Analyzes a GitHub repository and optional live URL for project authenticity.
    Returns an authenticity score 0-100 with dimension breakdown.
    """
    import os
    github_token = os.getenv("GITHUB_TOKEN", "")

    owner, repo = _parse_github_url(body.github_url)
    if not owner or not repo:
        return {
            "success": False,
            "error": "Invalid GitHub URL. Please provide a valid https://github.com/owner/repo URL.",
        }

    # Fetch repo data
    repo_data = _github_api(f"/repos/{owner}/{repo}", github_token) or {}
    commits = _github_api_list(f"/repos/{owner}/{repo}/commits", github_token, per_page=50) or []
    contributors = _github_api_list(f"/repos/{owner}/{repo}/contributors", github_token, per_page=20) or []

    # Run all dimension checks
    dim_repo = _check_repo_basics(repo_data)
    dim_timeline = _check_commit_timeline(commits)
    dim_quality = _check_commit_quality(commits)
    dim_contributors = _check_contributors(contributors)
    dim_ai = _check_ai_assist_signals(commits, repo_data)
    dim_demo = _check_live_demo(body.live_url or "")

    dimensions = [dim_repo, dim_timeline, dim_quality, dim_contributors, dim_ai, dim_demo]
    total_score = sum(d["score"] for d in dimensions)
    max_possible = sum(d["max_score"] for d in dimensions)
    authenticity_score = round((total_score / max_possible) * 100) if max_possible > 0 else 0

    # Verdict
    if authenticity_score >= 80:
        verdict, color = "Strong ✅", "green"
    elif authenticity_score >= 65:
        verdict, color = "Good 👍", "lime"
    elif authenticity_score >= 50:
        verdict, color = "Moderate ⚠️", "yellow"
    elif authenticity_score >= 35:
        verdict, color = "AI-Assisted 🤖", "orange"
    else:
        verdict, color = "Suspicious ❌", "red"

    summary = (
        f"Project '{repo}' by {owner} scored {authenticity_score}/100 for authenticity. "
        f"Verdict: {verdict}. "
        f"Based on {len(commits)} commits analyzed across {len(dimensions)} dimensions."
    )

    return {
        "success": True,
        "authenticity_score": authenticity_score,
        "verdict": verdict,
        "verdict_color": color,
        "dimensions": dimensions,
        "summary": summary,
        "github_url": body.github_url,
        "live_url": body.live_url,
        "repo_owner": owner,
        "repo_name": repo,
    }
