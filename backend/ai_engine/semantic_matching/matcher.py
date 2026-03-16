import math
from collections import Counter


class SemanticMatcher:
    """Lightweight cosine matcher placeholder for sentence-transformers integration."""

    def match_score(self, candidate_text: str, job_text: str) -> float:
        v1 = self._bow_vector(candidate_text)
        v2 = self._bow_vector(job_text)
        similarity = self._cosine(v1, v2)
        return round(similarity * 100, 2)

    def _bow_vector(self, text: str) -> Counter:
        tokens = [token.lower().strip() for token in text.split() if token.strip()]
        return Counter(tokens)

    def _cosine(self, c1: Counter, c2: Counter) -> float:
        if not c1 or not c2:
            return 0.0

        common = set(c1).intersection(c2)
        numerator = sum(c1[token] * c2[token] for token in common)

        norm1 = math.sqrt(sum(v * v for v in c1.values()))
        norm2 = math.sqrt(sum(v * v for v in c2.values()))
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return numerator / (norm1 * norm2)
