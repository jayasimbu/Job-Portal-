from __future__ import annotations
import logging
import asyncio
import json
import random
from typing import Any, Dict, Optional, List
import openai
from core.config import settings

log = logging.getLogger(__name__)

# FEATURE-MODEL MAPPING
MODELS = {
    "ATS_MATCHING": "deepseek-v3.1:671b-cloud",
    "STRUCTURAL_PARSING": "qwen3-coder:480b-cloud",
    "HR_SUMMARY": "glm-4.6:cloud",
    "CERTIFICATE_VISION": "qwen3-vl:235b-cloud",
    "LEARNING_ROADMAP": "gpt-oss:120b-cloud",
}

class LLMService:
    def __init__(self) -> None:
        self._clients = []
        self._rebuild_clients()
            
    def _rebuild_clients(self):
        self.base_url = settings.OLLAMA_BASE_URL or "http://localhost:11434"
        if "11434" in self.base_url and not self.base_url.endswith("/v1"):
            target_url = self.base_url.rstrip("/") + "/v1"
        else:
            target_url = self.base_url
            
        self.api_keys = settings.get_ollama_api_keys()
        self._clients = []
        
        if not self.api_keys:
            client = openai.OpenAI(base_url=target_url, api_key="ollama")
            self._clients.append({"client": client, "key_id": "LOCAL", "url": target_url})
        else:
            for key in self.api_keys:
                client = openai.OpenAI(base_url=target_url, api_key=key)
                self._clients.append({"client": client, "key_id": key[:6] + "...", "url": target_url})
        
        print(f"\n[AI_DEBUG] Pool Rebuilt: {len(self._clients)} keys | URL: {target_url}")

    def generate_with_fallback(
        self,
        prompt: str,
        model: str,
        system: str = "You are a senior recruitment expert.",
        temperature: float = 0.2, # Lower temperature for STRICTOR extraction
        max_tokens: int = 1000,
        response_format: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        if not self._clients: self._rebuild_clients()
        pool = list(self._clients)
        random.shuffle(pool)
        
        last_error = "Unknown"
        print(f"[AI_CALL] Requesting {model}...")

        for entry in pool:
            client = entry["client"]
            key_hint = entry["key_id"]
            try:
                params = {
                    "model": model,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }
                if response_format: params["response_format"] = response_format

                response = client.chat.completions.create(**params)
                text = response.choices[0].message.content.strip()
                
                print(f"[AI_SUCCESS] Key: {key_hint} | Model: {model}")
                return {"success": True, "result": text}
            except Exception as e:
                print(f"[AI_ERROR] Key {key_hint} failed: {e}")
                last_error = str(e)
                continue

        return {"success": False, "result": None, "error_message": last_error}

    # ── ADVANCED ANALYTICS ──

    async def parse_resume_structural(self, resume_text: str) -> Dict[str, Any]:
        """STRICT PARSING: Only extract what is explicitly written."""
        system = (
            "You are a strict data extractor. ONLY extract information that is EXPLICITLY written in the text. "
            "DO NOT assume or add generic skills like 'Communication', 'Teamwork', or 'Leadership' unless they are literally in the text. "
            "Return ONLY JSON: {skills:[], experience_years:float, education:str, projects:[]}"
        )
        prompt = f"Extract EXPLICIT data from this resume text. Do not hallucinate:\n\n{resume_text[:4000]}"
        
        res = self.generate_with_fallback(
            prompt, model=MODELS["STRUCTURAL_PARSING"], system=system, response_format={"type": "json_object"}
        )
        
        if res["success"] and res["result"]:
            try: 
                data = json.loads(res["result"].replace("```json", "").replace("```", "").strip())
                # Clean keys
                data["skills"] = [s.strip().upper() for s in data.get("skills", []) if s.strip()]
                return data
            except: pass
        return {}

    async def generate_skill_gap_analysis(self, current_skills: List[str]) -> Dict[str, Any]:
        """AI GAP ANALYSIS: Detects missing skills based on current profile."""
        system = "You are a career strategist. Analyze the skills and find the missing 'Power Skills' for a high-end tech role. Return JSON: {missing_skills:[], recommendations:[]}"
        prompt = f"Candidate current skills: {', '.join(current_skills)}. What are the 4 most critical missing skills and 4 recommended advanced technologies for this profile?"
        
        res = self.generate_with_fallback(prompt, model=MODELS["LEARNING_ROADMAP"], system=system, response_format={"type": "json_object"})
        if res["success"] and res["result"]:
            try: return json.loads(res["result"].replace("```json", "").replace("```", "").strip())
            except: pass
        return {"missing_skills": [], "recommendations": []}

    async def generate_hr_summary(self, resume_text: str, ats_score: float) -> str:
        prompt = f"Write a 2-sentence professional HR assessment for a candidate with an ATS score of {ats_score}/100. Be realistic."
        res = self.generate_with_fallback(prompt, model=MODELS["HR_SUMMARY"])
        return res.get("result") or "Professional candidate."

    async def generate_deep_ats_match(self, resume_text: str, jd_text: str) -> Dict[str, Any]:
        prompt = (
            f"You are an ATS Matcher. Extract 'matched_skills' and 'missing_skills' by comparing the resume to the JD. "
            f"Then, calculate the 'match_score' STRICTLY using this formula: "
            f"(number of matched_skills / total skills required by JD) * 100. Round to nearest integer.\n"
            f"Resume:\n{resume_text[:2000]}\n\nJD:\n{jd_text[:2000]}\n\n"
            f"Return JSON: {{'match_score':int, 'reasoning':str, 'matched_skills':[], 'missing_skills':[]}}"
        )
        res = self.generate_with_fallback(prompt, model=MODELS["ATS_MATCHING"], response_format={"type": "json_object"})
        if res["success"] and res["result"]:
            try: return json.loads(res["result"].replace("```json", "").replace("```", "").strip())
            except: pass
        return {"match_score": 0, "reasoning": "AI Matching failed."}

# Singleton
llm_service = LLMService()
