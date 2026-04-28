from typing import Dict, Any, List

class SkillGapEngine:
    def compute(self, user_skills: List[str], job_skills: List[str]) -> Dict[str, Any]:
        user_skills_lower = set(s.lower() for s in user_skills)
        
        # Calculate true missing skills
        missing = []
        for skill in job_skills:
            if skill.lower() not in user_skills_lower:
                missing.append(skill)
                
        # Simple heuristic for impact: each missing skill represents ~3% potential boost, capped at 25%
        impact_value = min(25, len(missing) * 3)
        
        # Generate structured learning path recommendations (top 3 missing skills)
        learning_path = []
        for skill in missing[:3]:
            # In a real system, this would query a course database.
            learning_path.append({
                "skill": skill,
                "course": f"{skill} Crash Course 2026",
                "project": f"Build a mini-project using {skill}",
                "roadmap": f"View the {skill} Developer Roadmap"
            })

        return {
            "missing": missing,
            "impact": f"+{impact_value}%",
            "learningPath": learning_path
        }
