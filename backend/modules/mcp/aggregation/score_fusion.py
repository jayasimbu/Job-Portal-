class ScoreFusionEngine:
    def compute(self, ats: float, semantic: float, experience: float, trend: float) -> float:
        """
        Computes the final intelligence score based on normalized inputs (0-100).
        Weights: ATS (40%), Semantic (30%), Experience (20%), Trend (10%)
        """
        # Ensure all inputs are bounded 0-100
        ats = max(0, min(100, ats))
        semantic = max(0, min(100, semantic))
        experience = max(0, min(100, experience))
        trend = max(0, min(100, trend))

        final_score = (
            (0.4 * ats) +
            (0.3 * semantic) +
            (0.2 * experience) +
            (0.1 * trend)
        )
        return round(final_score, 2)
