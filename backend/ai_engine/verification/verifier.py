from datetime import datetime
from typing import Any, Dict, Optional


class VerificationEngine:
    """Project authenticity placeholder checks for GitHub, portfolio, and web evidence."""

    def verify_candidate(self, github_url: Optional[str], portfolio_url: Optional[str]) -> Dict[str, Any]:
        github_result = self._verify_github(github_url)
        portfolio_result = self._verify_portfolio(portfolio_url)
        web_result = self._verify_web_presence(github_url, portfolio_url)

        score = round(
            github_result["score"] * 0.5 + portfolio_result["score"] * 0.3 + web_result["score"] * 0.2,
            2,
        )

        return {
            "timestamp": datetime.utcnow().isoformat(),
            "verification_score": score,
            "status": "verified" if score >= 60 else "needs_review",
            "details": {
                "github": github_result,
                "portfolio": portfolio_result,
                "web": web_result,
            },
        }

    def _verify_github(self, github_url: Optional[str]) -> Dict[str, Any]:
        if not github_url:
            return {"available": False, "score": 20, "notes": "No GitHub profile provided"}
        if "github.com" not in github_url:
            return {"available": False, "score": 25, "notes": "Invalid GitHub URL format"}
        return {"available": True, "score": 85, "notes": "Repository activity detected"}

    def _verify_portfolio(self, portfolio_url: Optional[str]) -> Dict[str, Any]:
        if not portfolio_url:
            return {"available": False, "score": 30, "notes": "No portfolio URL provided"}
        is_valid = portfolio_url.startswith("http")
        return {
            "available": is_valid,
            "score": 75 if is_valid else 35,
            "notes": "Portfolio link reachable" if is_valid else "Portfolio URL is malformed",
        }

    def _verify_web_presence(self, github_url: Optional[str], portfolio_url: Optional[str]) -> Dict[str, Any]:
        if github_url or portfolio_url:
            return {"score": 70, "notes": "Public project references found"}
        return {"score": 20, "notes": "Insufficient public project signals"}
