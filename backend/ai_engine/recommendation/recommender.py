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
            job_text = f"{job.title} {job.description} {' '.join(job.required_skills or [])}"
            semantic = self.matcher.match_score(skills_text, job_text)
            experience_bonus = min(10, years * 1.5)
            recommendation_score = round(min(100, semantic * 0.9 + experience_bonus), 2)

            scored.append(
                {
                    "job_id": job.id,
                    "title": job.title,
                    "location": job.location,
                    "recommendation_score": recommendation_score,
                }
            )

        scored.sort(key=lambda item: item["recommendation_score"], reverse=True)
        return scored[:10]
