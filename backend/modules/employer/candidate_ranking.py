from typing import Any, Dict, List

from ai_engine.ats_scoring.scorer import ATSScorer
from ai_engine.semantic_matching.matcher import SemanticMatcher


class CandidateRankingEngine:
    def __init__(self):
        self.ats_scorer = ATSScorer()
        self.semantic_matcher = SemanticMatcher()

    def rank_candidates(self, job_description: str, candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        ranked: List[Dict[str, Any]] = []
        for candidate in candidates:
            parsed_resume = candidate.get("parsed_resume", {})
            ats = self.ats_scorer.score_resume(parsed_resume, job_description)
            semantic = self.semantic_matcher.match_score(candidate.get("resume_text", ""), job_description)
            final_score = round((ats * 0.6) + (semantic * 0.4), 2)
            ranked.append({**candidate, "ats_score": ats, "semantic_score": semantic, "rank_score": final_score})

        ranked.sort(key=lambda item: item["rank_score"], reverse=True)
        for index, candidate in enumerate(ranked, start=1):
            candidate["rank"] = index
        return ranked
