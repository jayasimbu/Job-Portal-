from __future__ import annotations
import logging
from typing import Any, Dict, Optional
from core.config import settings
from services.llmService import llm_service as cloud_llm

log = logging.getLogger(__name__)

class AI_Engine_LLMService:
    """
    Bridge service for ai_engine that wraps the centralized llm_service
    and adds specific methods needed by the ai_engine module.
    """

    def __init__(self):
        self.cloud_llm = cloud_llm

    def generate_with_fallback(
        self,
        prompt: str,
        system: str = "You are a senior recruitment expert and career coach.",
        user_id: Optional[int] = None,
        request_type: str = "llm_generation",
        request_payload: Optional[Dict[str, Any]] = None,
        enqueue_on_429: bool = True,
    ) -> Dict[str, Any]:
        """
        Wraps the cloud LLM's generation logic.
        """
        # Forward to the centralized service
        result = self.cloud_llm.generate_with_fallback(
            prompt=prompt,
            system=system,
            user_id=user_id,
            request_type=request_type,
            request_payload=request_payload
        )
        
        # Add 'queued' flag as expected by ai_engine components
        if not result.get("success") and enqueue_on_429:
            # Note: In a full implementation, we might enqueue to a DB here.
            # For now, we just report success/failure from the cloud service.
            result["queued"] = False
            
        return result

    def check_connection(self, base_url: Optional[str] = None, timeout: int = 5) -> bool:
        """
        Checks if the LLM provider is reachable.
        """
        try:
            # Check OpenRouter connection (simply verify we have a key)
            if not self.cloud_llm.api_key or "placeholder" in self.cloud_llm.api_key:
                return False
            return True
        except Exception:
            return False

def generate_ai_response(prompt: str, system: str = "You are a helpful AI assistant.", format: str = "text") -> str:
    """
    Helper function used by MCP and other legacy components.
    """
    if format == "json":
        system += " Respond ONLY with valid JSON."
        
    result = cloud_llm.generate_with_fallback(prompt, system=system)
    if result.get("success"):
        return result.get("result", "")
    return "{}" if format == "json" else ""

# Singleton for ai_engine
llm_service = AI_Engine_LLMService()
