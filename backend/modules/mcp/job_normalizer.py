from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional


def _to_mapping(job: Any) -> Dict[str, Any]:
    if isinstance(job, dict):
        return dict(job)
    if hasattr(job, "__dict__"):
        return {k: v for k, v in vars(job).items() if not k.startswith("_")}
    return {}


def _as_list(value: Any) -> List[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, tuple):
        return list(value)
    return [value]


def _iso(value: Any) -> str:
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, str):
        return value
    return datetime.utcnow().isoformat()


def _normalize_job_type(value: Any) -> str:
    normalized = str(value or "fulltime").strip().lower().replace("_", "")
    if normalized in {"intern", "internship", "internships"}:
        return "internship"
    return "fulltime"


def _dedupe(values: Iterable[Any]) -> List[Any]:
    seen = set()
    output: List[Any] = []
    for value in values:
        if value is None:
            continue
        normalized = str(value).strip()
        if not normalized or normalized.lower() in seen:
            continue
        seen.add(normalized.lower())
        output.append(value)
    return output


def normalize_job_record(
    job: Any,
    *,
    source: str = "internal",
    final_score: Optional[float] = None,
    category: str = "secondary",
    components: Optional[Dict[str, Any]] = None,
    explain: Optional[Any] = None,
    skill_gap: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    data = _to_mapping(job)

    job_id = data.get("jobId") or data.get("job_id") or data.get("id") or data.get("_id")
    title = data.get("jobTitle") or data.get("title") or data.get("role") or "Untitled Position"
    company = data.get("company") or data.get("company_name") or data.get("employer_name") or "Unknown Company"
    location = data.get("location") or data.get("city") or "Remote"
    description = data.get("description") or data.get("job_description") or data.get("summary") or ""

    required_skills = _dedupe(
        _as_list(data.get("requiredSkills"))
        or _as_list(data.get("required_skills"))
        or _as_list(data.get("skills_set"))
        or _as_list(data.get("skills"))
        or _as_list(data.get("tags"))
    )

    experience = data.get("requiredExperience")
    if experience in (None, ""):
        experience = data.get("required_experience")
    if experience in (None, ""):
        experience = data.get("min_experience")
    if experience in (None, ""):
        experience = data.get("required_experience_years")
    try:
        experience = float(experience or 0)
    except (TypeError, ValueError):
        experience = 0

    created_at = data.get("createdAt") or data.get("created_at") or data.get("posted_at")
    provider = data.get("provider") or data.get("platform") or ("MCP" if source == "external" else "Internal")
    apply_url = data.get("applyUrl") or data.get("apply_url") or data.get("url") or data.get("source_url") or ""

    final_score_value = round(float(final_score or data.get("finalScore") or data.get("matchScore") or 0), 2)
    is_new_today = False
    try:
        if created_at:
            created_text = _iso(created_at)
            is_new_today = created_text[:10] == datetime.utcnow().date().isoformat()
    except Exception:
        is_new_today = False

    payload = {
        "_id": str(job_id or ""),
        "id": str(job_id or ""),
        "jobId": str(job_id or ""),
        "source": source,
        "title": title,
        "jobTitle": title,
        "company": company,
        "location": location,
        "jobType": _normalize_job_type(data.get("jobType") or data.get("employment_type") or data.get("type")),
        "type": _normalize_job_type(data.get("jobType") or data.get("employment_type") or data.get("type")),
        "requiredSkills": required_skills,
        "requiredExperience": experience,
        "description": description,
        "createdAt": _iso(created_at),
        "externalMeta": {
            "provider": provider,
            "applyUrl": apply_url,
        },
        "finalScore": final_score_value,
        "matchScore": final_score_value,
        "category": category,
        "components": components or data.get("components") or {},
        "explain": explain if explain is not None else data.get("explain") or [],
        "skillGap": skill_gap if skill_gap is not None else data.get("skillGap") or {"missing": [], "impact": "+0%", "learningPath": []},
        "isNewToday": bool(is_new_today),
        "platform": provider,
        "url": apply_url,
        "tags": required_skills,
    }

    return payload
