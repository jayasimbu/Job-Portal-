import requests
import json
import logging
import re
from core.config import settings
from ai_engine.prompts import AI_ROADMAP_PROMPT

from ai_engine.llm_service import generate_ai_response

log = logging.getLogger(__name__)

def run_mcp(prompt: str) -> str:
    """
    Core MCP Execution: Calls the local Ollama LLM to generate career insights.
    """
    try:
        return generate_ai_response(prompt, format="json")
    except Exception as e:
        log.error(f"MCP Execution Failed: {e}")
        return "{}"

def get_career_insights(resume_data: dict, matched_jobs: list) -> dict:
    """
    Wrapper to build prompt, run MCP, and parse the output with robust error handling.
    """
    skills = resume_data.get('skills', [])
    exp_years = resume_data.get('experience_years', 0)
    target_roles = [j.get('title') for j in matched_jobs[:3] if j.get('title')]
    
    # Use the refined structured prompt with experience context
    prompt = AI_ROADMAP_PROMPT.format(
        skills=skills,
        experience=f"{exp_years} years",
        target_roles=target_roles if target_roles else "General Technical Roles"
    )
    
    mcp_result = run_mcp(prompt)
    
    try:
        # 1. Standard Parsing
        mcp_data = json.loads(mcp_result)
    except Exception as e:
        log.warning(f"Failed to parse MCP JSON: {e}. Attempting repair...")
        
        # 2. Heuristic JSON Repair (Extraction via Regex)
        try:
            json_match = re.search(r'(\{.*\})', mcp_result, re.DOTALL)
            if json_match:
                mcp_data = json.loads(json_match.group(1))
            else:
                raise ValueError("No JSON block found")
        except Exception:
            log.error("MCP JSON Repair Failed. Using deterministic fallback.")
            
            # 3. Deterministic Fallback based on tech stack
            mcp_data = _generate_fallback_roadmap(skills, matched_jobs)
    
    return mcp_data

def _generate_fallback_roadmap(skills: list, matched_jobs: list = None) -> dict:
    """
    Ensures the UI never breaks by providing a high-quality, DYNAMIC fallback roadmap.
    It compares user skills with top job requirements to find real gaps.
    """
    user_skills_set = {s.lower().strip() for s in skills}
    all_required_skills = []
    
    if matched_jobs:
        for job in matched_jobs[:10]: # Look at more jobs for better stats
            req = job.get('required_skills') or job.get('skills') or []
            if isinstance(req, str): 
                req = [s.strip() for s in req.split(',')]
            all_required_skills.extend([s.lower().strip() for s in req if s])

    # Find the most common missing skills
    from collections import Counter
    # Filter out skills the user already has
    missing_candidates = [s for s in all_required_skills if s and s not in user_skills_set]
    missing_counts = Counter(missing_candidates)
    
    # Get top 5 missing skills, capitalizing for UI
    dynamic_missing = [s.title() for s, count in missing_counts.most_common(5)]

    # Real Fallback only if absolutely no jobs were found with skills
    if not dynamic_missing:
        # Semi-dynamic fallback based on common high-level gaps
        if "python" in user_skills_set or "java" in user_skills_set:
            dynamic_missing = ["System Design", "Cloud Architecture", "Unit Testing", "CI/CD Pipelines"]
        else:
            dynamic_missing = ["Algorithms", "Data Structures", "Problem Solving", "Web Fundamentals"]

    focus = "Modern Tech Stack"
    if matched_jobs and len(matched_jobs) > 0:
        first_job = matched_jobs[0]
        focus = first_job.get('title') or first_job.get('job_title') or "Software Engineering"

    # Match frontend expectations: skill, phase, effort
    roadmap = []
    if len(dynamic_missing) > 0:
        roadmap.append({
            "skill": dynamic_missing[0],
            "phase": "Phase 1: Foundations",
            "effort": "2 Weeks",
            "priority": "High",
            "topics": [f"Deep dive into {dynamic_missing[0]} best practices", "Core implementation patterns"]
        })
    if len(dynamic_missing) > 1:
        roadmap.append({
            "skill": dynamic_missing[1],
            "phase": "Phase 2: Advanced",
            "effort": "3 Weeks",
            "priority": "Medium",
            "topics": [f"Integrating {dynamic_missing[1]} into production systems", "Scale and Performance"]
        })
    if len(dynamic_missing) > 2:
        roadmap.append({
            "skill": dynamic_missing[2],
            "phase": "Phase 3: Mastery",
            "effort": "4 Weeks",
            "priority": "Strategic",
            "topics": [f"Expert level {dynamic_missing[2]} and architecture design"]
        })
        
    return {
        "summary": f"Your profile has a solid foundation. To reach 90%+ match for {focus} roles, focus on bridging these specific gaps.",
        "missing_skills": dynamic_missing,
        "recommended_roles": [f"Senior {focus}", "Full Stack Lead", "Solution Architect"],
        "learning_roadmap": roadmap,
        "market_fit": 75,
        "is_fallback": True,
        "is_live_calculated": True
    }
