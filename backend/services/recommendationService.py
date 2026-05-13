"""
services/recommendationService.py — Recommendation Service
============================================================
Handles job recommendations, learning paths, and career insights.

Wraps:
    ai_engine/recommendation/recommender.py
    ai_engine/semantic_matching/matcher.py

Used by:
    modules/jobseeker/service.py — recommendations, insights, learning
"""
from __future__ import annotations
import logging
from typing import Any, Dict, List

from ai_engine.recommendation.recommender import JobRecommender
from ai_engine.semantic_matching.matcher import SemanticMatcher

log = logging.getLogger(__name__)


class RecommendationService:
    """Unified recommendation engine for jobs, learning, and insights."""

    def __init__(self):
        self._recommender = JobRecommender()
        self._matcher = SemanticMatcher()
        log.info("[RecommendationService] Initialized.")

    def recommend_jobs(
        self, profile: Dict[str, Any], jobs: list
    ) -> List[Dict[str, Any]]:
        """Recommend top jobs based on profile skills and experience."""
        try:
            return self._recommender.recommend(profile, jobs)
        except Exception as exc:
            log.error("[RecommendationService] Job recommendation failed: %s", exc)
            return []

    def get_insights(
        self, skills: List[str], ats_score: float, experience_years: float
    ) -> List[Dict[str, Any]]:
        """Generate career insights based on profile data."""
        return [
            {
                "title": "ATS Readiness",
                "description": f"Current ATS score is {ats_score:.1f}. Target 85+ for premium role filters.",
            },
            {
                "title": "Skill Coverage",
                "description": f"Detected {len(skills)} mapped skills. Add project evidence for top 3 skills.",
            },
            {
                "title": "Experience Fit",
                "description": f"Profile maps to {experience_years:.1f}+ years roles based on experience markers.",
            },
        ]

    def get_learning_recommendations(
        self, missing_keywords: List[str]
    ) -> List[Dict[str, Any]]:
        """Generate learning course recommendations based on missing keywords."""
        # ROADMAP STEP 19: STATIC SKILL DB
        skill_db = {
            "React": {
                "courses": [{"title": "Advanced React Patterns", "provider": "Frontend Masters"}],
                "projects": [{"title": "Build a SaaS Dashboard with React", "difficulty": "Hard"}],
                "certifications": [{"title": "Meta Front-End Developer Certificate"}]
            },
            "Node.js": {
                "courses": [{"title": "Node.js Backend Architecture", "provider": "Udemy"}],
                "projects": [{"title": "Real-time Chat App with Socket.io", "difficulty": "Medium"}],
                "certifications": [{"title": "OpenJS Node.js Application Developer (JSNAD)"}]
            },
            "Docker": {
                "courses": [{"title": "Docker & Kubernetes: Practical Guide", "provider": "Udemy"}],
                "projects": [{"title": "Containerize a MERN Stack App", "difficulty": "Medium"}],
                "certifications": [{"title": "Docker Certified Associate"}]
            },
            "AWS": {
                "courses": [{"title": "AWS Cloud Practitioner Essentials", "provider": "Coursera"}],
                "projects": [{"title": "Deploy a Serverless API on AWS Lambda", "difficulty": "Hard"}],
                "certifications": [{"title": "AWS Certified Solutions Architect"}]
            },
            "Python": {
                "courses": [{"title": "Python for Data Science", "provider": "Coursera"}],
                "projects": [{"title": "Automated Web Scraper with BeautifulSoup", "difficulty": "Easy"}],
                "certifications": [{"title": "PCEP – Certified Entry-Level Python Programmer"}]
            },
            "Java": {
                "courses": [{"title": "Java Programming and Software Engineering", "provider": "Coursera"}],
                "projects": [{"title": "Build a Banking System with Spring Boot", "difficulty": "Hard"}],
                "certifications": [{"title": "Oracle Certified Professional: Java SE Developer"}]
            },
            "SQL": {
                "courses": [{"title": "The Complete SQL Bootcamp", "provider": "Udemy"}],
                "projects": [{"title": "Analyze E-commerce Data with PostgreSQL", "difficulty": "Medium"}],
                "certifications": [{"title": "Microsoft Certified: Azure Data Fundamentals"}]
            },
            "Machine Learning": {
                "courses": [{"title": "Machine Learning Specialization", "provider": "Coursera"}],
                "projects": [{"title": "Predict Housing Prices with Scikit-Learn", "difficulty": "Hard"}],
                "certifications": [{"title": "Google Professional Machine Learning Engineer"}]
            }
        }

        recommendations, seen = [], set()
        for skill in missing_keywords:
            normalized_skill = next((k for k in skill_db if k.lower() in skill.lower()), None)
            if normalized_skill:
                data = skill_db[normalized_skill]
                for c in data["courses"]:
                    if c["title"] not in seen:
                        recommendations.append({
                            **c, "type": "Course", "skill": normalized_skill,
                            "matchReason": f"Missing {skill}"
                        })
                        seen.add(c["title"])
                for p in data["projects"]:
                    if p["title"] not in seen:
                        recommendations.append({
                            **p, "type": "Project", "skill": normalized_skill,
                            "matchReason": f"Apply {skill} in a real project"
                        })
                        seen.add(p["title"])
                for cert in data["certifications"]:
                    if cert["title"] not in seen:
                        recommendations.append({
                            **cert, "type": "Certification", "skill": normalized_skill,
                            "matchReason": f"Verify your {skill} expertise"
                        })
                        seen.add(cert["title"])

        if len(recommendations) < 2:
            defaults = [
                {"title":"System Design for Product Engineers","provider":"Educative",
                 "gap":"Software Architecture","impact":"+10% ATS Score",
                 "duration":"15 hours","level":"Advanced", "type": "Course",
                 "matchReason":"Industry trends.","status":"Recommended","progress":0,"url":"#"},
                {"title":"Professional Communication for Tech","provider":"LinkedIn Learning",
                 "gap":"Soft Skills","impact":"+5% ATS Score",
                 "duration":"3 hours","level":"Beginner", "type": "Course",
                 "matchReason":"Essential for tech roles.","status":"Recommended","progress":0,"url":"#"},
            ]
            for d in defaults:
                if d["title"] not in seen and len(recommendations) < 4:
                    recommendations.append(d)
                    seen.add(d["title"])

        return recommendations

    def semantic_match(self, text_a: str, text_b: str) -> float:
        """Raw semantic similarity score (0-100)."""
        try:
            return self._matcher.match_score(text_a, text_b)
        except Exception:
            return 0.0


recommendation_service = RecommendationService()
