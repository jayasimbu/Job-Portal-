from __future__ import annotations
import logging
import asyncio
from typing import Any, Dict, Optional, List
import openai
from core.config import settings

log = logging.getLogger(__name__)

class LLMService:
    """
    Roadmap Phase 6: LLM Cloud Integration (OpenRouter).
    Handles all AI-enhanced feedback, summaries, and insights.
    """

    def __init__(self) -> None:
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = settings.OPENROUTER_BASE_URL
        self.default_model = settings.OPENROUTER_MODEL
        
        # Initialize OpenRouter Client
        self.client = openai.OpenAI(
            base_url=self.base_url,
            api_key=self.api_key,
        )
        log.info(f"[LLMService] Initialized with model: {self.default_model}")

    def generate_with_fallback(
        self,
        prompt: str,
        system: str = "You are a senior recruitment expert and career coach.",
        user_id: Optional[int] = None,
        request_type: str = "llm_generation",
        request_payload: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Primary generation function using OpenRouter (Step 24).
        """
        if not self.api_key or "placeholder" in self.api_key:
            log.warning("[LLMService] OPENROUTER_API_KEY is missing or placeholder.")
            return {"success": False, "result": "AI Service not configured.", "error_message": "Missing API Key"}

        try:
            response = self.client.chat.completions.create(
                model=self.default_model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=800
            )
            text = response.choices[0].message.content.strip()
            return {
                "success": True,
                "result": text,
                "model_used": self.default_model,
            }
        except Exception as e:
            log.error(f"[LLMService] Generation failed: {e}")
            return {
                "success": False,
                "result": None,
                "error_message": str(e)
            }

    # ROADMAP STEP 25: AI FUNCTIONS

    def generate_resume_summary(self, resume_text: str) -> str:
        """Creates a professional 2-3 sentence summary of the candidate."""
        prompt = f"Create a concise 2-sentence professional summary for this candidate based on their resume:\n\n{resume_text[:2000]}"
        res = self.generate_with_fallback(prompt)
        return res.get("result") or "Professional candidate with relevant industry experience."

    def generate_candidate_insights(self, resume_text: str, jd_text: str) -> str:
        """Generates strategic insights about how the candidate fits a specific role."""
        prompt = f"Analyze this candidate against the job description. Provide 3 bullet points on 'Why they fit' and 1 'Growth Area':\n\nRESUME:\n{resume_text[:1500]}\n\nJD:\n{jd_text[:1500]}"
        res = self.generate_with_fallback(prompt)
        return res.get("result") or "Candidate shows strong alignment with core technical requirements."

    def generate_skill_recommendations(self, missing_skills: List[str]) -> str:
        """Explains WHY these skills are important for the candidate's career."""
        if not missing_skills:
            return "Your profile is highly optimized for current market trends."
        prompt = f"Explain in 2 sentences why these missing skills are critical for a modern tech career: {', '.join(missing_skills)}"
        res = self.generate_with_fallback(prompt)
        return res.get("result") or f"Mastering {', '.join(missing_skills)} will significantly increase your market value."

    def generate_hr_feedback(self, ats_score: float, matched_skills: List[str]) -> str:
        """Generates a brief 'recruiter note' for the employer dashboard."""
        prompt = f"Act as an AI recruiter. Write a 1-sentence assessment for a candidate with an ATS score of {ats_score} who matches these skills: {', '.join(matched_skills)}"
        res = self.generate_with_fallback(prompt)
        return res.get("result") or "Strong technical profile with high matching accuracy for core requirements."

# Module-level singleton
llm_service = LLMService()
