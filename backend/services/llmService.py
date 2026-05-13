from __future__ import annotations
import logging
import asyncio
from typing import Any, Dict, Optional, List
import openai
from core.config import settings

log = logging.getLogger(__name__)

class LLMService:
    """
    Unified AI Orchestration Layer.
    Uses OpenRouter for Cloud AI and Ollama for Local Intelligence.
    """

    def __init__(self) -> None:
        # OpenRouter (Cloud)
        self.cloud_api_key = settings.OPENROUTER_API_KEY
        self.cloud_base_url = settings.OPENROUTER_BASE_URL
        self.cloud_model = settings.OPENROUTER_MODEL
        
        # Ollama (Local)
        self.local_base_url = settings.OLLAMA_BASE_URL
        self.local_model = settings.OLLAMA_MODEL
        
        # Clients
        self.cloud_client = openai.OpenAI(
            base_url=self.cloud_base_url,
            api_key=self.cloud_api_key,
        )
        # For Ollama, we can use the same OpenAI-compatible API if Ollama supports it, 
        # or use standard requests. Ollama supports OpenAI-compatible API at /v1.
        self.local_client = openai.OpenAI(
            base_url=f"{self.local_base_url.rstrip('/')}/v1",
            api_key="ollama", # placeholder
        )
        
        log.info(f"[LLMService] Cloud: {self.cloud_model} | Local: {self.local_model}")

    def generate_with_cloud(self, prompt: str, system: str = "You are a career expert.") -> Dict[str, Any]:
        if not self.cloud_api_key or "placeholder" in self.cloud_api_key:
            return {"success": False, "error": "Cloud API Key missing"}
        try:
            response = self.cloud_client.chat.completions.create(
                model=self.cloud_model,
                messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
                temperature=0.7, max_tokens=800
            )
            return {"success": True, "result": response.choices[0].message.content.strip()}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def generate_with_local(self, prompt: str, system: str = "You are a local AI assistant.") -> Dict[str, Any]:
        try:
            response = self.local_client.chat.completions.create(
                model=self.local_model,
                messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
                temperature=0.4, # Lower temperature for intelligence tasks
                max_tokens=800
            )
            return {"success": True, "result": response.choices[0].message.content.strip()}
        except Exception as e:
            log.error(f"[Ollama] Failed: {e}")
            return {"success": False, "error": str(e)}

    # 🚀 INTELLIGENCE LAYER (PHASE 3)

    def get_missing_skills(self, resume_skills: List[str], jd_skills: List[str]) -> List[str]:
        """[LOCAL AI] Identify missing skills between resume and JD."""
        prompt = f"Resume Skills: {', '.join(resume_skills)}\nJD Skills: {', '.join(jd_skills)}\nList only the missing skills as a comma-separated list."
        res = self.generate_with_local(prompt, system="You are a skill gap analyzer. Output only comma-separated skills.")
        if res["success"]:
            return [s.strip() for s in res["result"].split(",") if s.strip()]
        return []

    def get_learning_recommendations(self, skills: List[str]) -> List[Dict[str, str]]:
        """[LOCAL AI] Recommend next steps for career growth."""
        prompt = f"User knows: {', '.join(skills)}. Recommend 3 advanced topics or related tech stacks to learn next."
        res = self.generate_with_local(prompt, system="You are a career coach. Output exactly 3 lines: Topic: Description")
        recs = []
        if res["success"]:
            for line in res["result"].split("\n"):
                if ":" in line:
                    topic, desc = line.split(":", 1)
                    recs.append({"title": topic.strip(), "description": desc.strip()})
        return recs

    def get_resume_feedback(self, resume_text: str) -> str:
        """[LOCAL AI] Provide feedback on resume quality."""
        prompt = f"Resume Content:\n{resume_text[:2000]}\nProvide 3 bullet points of constructive feedback (Weak areas, formatting, impact)."
        res = self.generate_with_local(prompt, system="You are a professional resume reviewer.")
        return res.get("result") or "Focus on quantifiable achievements."

    def generate_resume_summary(self, resume_text: str) -> str:
        """[CLOUD AI] High-quality summary."""
        prompt = f"Summarize this resume in 2 professional sentences:\n\n{resume_text[:2000]}"
        res = self.generate_with_cloud(prompt)
        return res.get("result") or "Professional candidate with relevant experience."

# Module-level singleton
llm_service = LLMService()

# Module-level singleton
llm_service = LLMService()
