from typing import Dict, Any, List

class ExplainEngine:
    def generate(self, context: Dict[str, Any], scores: Dict[str, float]) -> List[str]:
        reasons = []

        # Analyze Semantic Match
        semantic = scores.get("semantic", 0)
        if semantic >= 85:
            reasons.append("Exceptional semantic skill alignment")
        elif semantic >= 70:
            reasons.append("Strong core skill similarity")
        elif semantic < 50:
            reasons.append("Significant gaps in required skills")

        # Analyze Experience Match
        experience = scores.get("experience", 0)
        if experience >= 80:
            reasons.append("Experience perfectly aligns with role requirements")
        elif experience >= 60:
            reasons.append("Experience level is acceptable")
        elif experience < 40:
            reasons.append("Experience may not meet minimum requirements")
            
        # Analyze ATS Score
        ats = scores.get("ats", 0)
        if ats >= 80:
            reasons.append("Resume is highly optimized for this role")
            
        # Analyze Missing Skills
        missing_skills = context.get("missing_skills", [])
        if missing_skills:
            top_missing = missing_skills[:2]
            skills_str = ", ".join(top_missing)
            reasons.append(f"Missing key skills ({skills_str}) reduces score")
            
        # Analyze Feedback Boost
        boost = context.get("feedback_boost", 0)
        if boost > 0:
            reasons.append("Score boosted by previous positive interaction")
        elif boost < 0:
            reasons.append("Score reduced due to previous disinterest")

        # Fallback if no specific reasons found
        if not reasons:
            reasons.append("Average match based on overall profile")

        return reasons
