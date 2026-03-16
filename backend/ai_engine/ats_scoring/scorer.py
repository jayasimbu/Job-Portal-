from collections import Counter
from typing import Any, Dict, Iterable


class ATSScorer:
    """ATS scoring with weighted components and 0-100 output."""

    def score_resume(self, parsed_resume: Dict[str, Any], job_description: str) -> float:
        job_tokens = self._tokenize(job_description)
        resume_tokens = self._tokenize(" ".join(parsed_resume.get("skills", [])))

        keyword_match = self._overlap_ratio(job_tokens, resume_tokens)
        skills_match = self._skills_match(parsed_resume.get("skills", []), job_tokens)
        experience_relevance = self._experience_score(parsed_resume.get("experience_years", 0))
        education_match = self._education_score(parsed_resume.get("education", "unknown"))

        score = (
            keyword_match * 40
            + skills_match * 30
            + experience_relevance * 20
            + education_match * 10
        )
        return round(max(0, min(score, 100)), 2)

    def _tokenize(self, text: str) -> set[str]:
        return {token.strip().lower() for token in text.split() if token.strip()}

    def _overlap_ratio(self, a: Iterable[str], b: Iterable[str]) -> float:
        a_set = set(a)
        b_set = set(b)
        if not a_set:
            return 0.0
        return len(a_set.intersection(b_set)) / len(a_set)

    def _skills_match(self, skills: list[str], job_tokens: set[str]) -> float:
        if not skills:
            return 0.0
        normalized_skills = [s.lower() for s in skills]
        matches = sum(1 for skill in normalized_skills if skill in job_tokens)
        return matches / max(len(normalized_skills), 1)

    def _experience_score(self, years: float) -> float:
        if years >= 8:
            return 1.0
        return max(0.2, years / 8)

    def _education_score(self, education: str) -> float:
        rank = Counter({"unknown": 0.3, "bachelors": 0.7, "masters": 0.9, "phd": 1.0})
        return rank.get(education.lower(), 0.3)
