from typing import Any, Dict, List
from ai_engine.semantic_matching.matcher import SemanticMatcher

class JobRecommender:
    def __init__(self):
        self.matcher = SemanticMatcher()

    def recommend(self, profile: Dict[str, Any], jobs: list[Any]) -> List[Dict[str, Any]]:
        skills_text = " ".join(profile.get("skills", []))
        years = profile.get("experience_years", 0)

        scored: List[Dict[str, Any]] = []
        for job in jobs:
            job_title = getattr(job, "title", "")
            job_desc = getattr(job, "description", "")
            job_skills = getattr(job, "required_skills", [])
            job_text = f"{job_title} {job_desc} {' '.join(job_skills or [])}"
            
            semantic = self.matcher.match_score(skills_text, job_text)
            experience_bonus = min(10, years * 1.5)
            recommendation_score = round(min(100, semantic * 0.9 + experience_bonus), 2)

            scored.append(
                {
                    "id": getattr(job, "id", None),
                    "title": job_title,
                    "company": getattr(job, "company", "Confidential"),
                    "location": getattr(job, "location", "Remote"),
                    "match_score": recommendation_score,
                    "required_skills": job_skills,
                    "description": job_desc
                }
            )

        # Fix: Sort by 'match_score' which is the key we actually use
        scored.sort(key=lambda item: item["match_score"], reverse=True)
        return scored[:10]
