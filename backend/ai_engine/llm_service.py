from __future__ import annotations

from typing import Any, Dict, Optional
import threading
import requests
from requests.adapters import HTTPAdapter
from urllib.parse import urlparse

from ai_engine.queue_service import queue_service
from core.config import settings


class OllamaLLMService:
    def __init__(self) -> None:
        self.base_url = settings.OLLAMA_BASE_URL.rstrip("/")
        self.timeout = settings.OLLAMA_TIMEOUT
        self.api_key = settings.OLLAMA_API_KEY
        self._semaphore = threading.BoundedSemaphore(max(1, int(settings.OLLAMA_MAX_PARALLEL_REQUESTS)))
        self._session = requests.Session()
        adapter = HTTPAdapter(
            pool_connections=max(10, int(settings.OLLAMA_HTTP_POOL_CONNECTIONS)),
            pool_maxsize=max(50, int(settings.OLLAMA_HTTP_POOL_MAXSIZE)),
            max_retries=0,
        )
        self._session.mount("http://", adapter)
        self._session.mount("https://", adapter)

    def _headers(self) -> Dict[str, str]:
        headers: Dict[str, str] = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    @staticmethod
    def _is_local_target(base_url: str) -> bool:
        host = (urlparse(base_url).hostname or "").lower()
        return host in {"localhost", "127.0.0.1", "::1"}

    def _auth_ready(self, *, base_url: Optional[str] = None) -> bool:
        target_url = (base_url or self.base_url).rstrip("/")
        if self._is_local_target(target_url):
            return True
        if not settings.OLLAMA_REQUIRE_API_KEY_FOR_REMOTE:
            return True
        return bool(self.api_key)

    def check_connection(self, *, base_url: Optional[str] = None, timeout: Optional[int] = None) -> bool:
        target_urls = [(base_url or "").rstrip("/")] if base_url else settings.get_ollama_base_urls()
        target_timeout = timeout if timeout is not None else self.timeout
        for target_url in target_urls:
            if not target_url:
                continue
            if not self._auth_ready(base_url=target_url):
                continue
            try:
                response = requests.get(
                    f"{target_url}/api/tags",
                    headers=self._headers(),
                    timeout=target_timeout,
                )
                response.raise_for_status()
                return True
            except Exception:
                continue
        return False

    def generate_with_fallback(
        self,
        prompt: str,
        *,
        system: Optional[str] = None,
        user_id: Optional[int] = None,
        request_type: str = "llm_generation",
        request_payload: Optional[Dict[str, Any]] = None,
        enqueue_on_429: bool = True,
    ) -> Dict[str, Any]:
        models = settings.get_ollama_models()
        if not models:
            return {
                "success": False,
                "queued": False,
                "result": None,
                "error_code": 500,
                "error_message": "No Ollama models configured",
                "attempted_models": [],
                "model_used": None,
                "base_url_used": None,
            }

        last_error_code = 503
        last_error_message = "No reachable Ollama endpoint"
        saw_429 = False
        attempted_models: list[str] = []

        payload: Dict[str, Any] = {
            "prompt": prompt,
            "stream": False,
        }
        if system:
            payload["system"] = system

        for base_url in settings.get_ollama_base_urls():
            if not self._auth_ready(base_url=base_url):
                last_error_code = 401
                last_error_message = "Remote Ollama requires API key"
                continue

            for model in models:
                if model not in attempted_models:
                    attempted_models.append(model)

                request_body = dict(payload)
                request_body["model"] = model

                try:
                    with self._semaphore:
                        response = self._session.post(
                            f"{base_url}/api/generate",
                            json=request_body,
                            headers=self._headers(),
                            timeout=self.timeout,
                        )
                except requests.RequestException as exc:
                    last_error_code = 503
                    last_error_message = str(exc)
                    continue

                if response.status_code == 429:
                    saw_429 = True
                    last_error_code = 429
                    last_error_message = "Model rate limited"
                    continue

                if response.status_code >= 400:
                    last_error_code = int(response.status_code)
                    last_error_message = response.text[:300] or "Model request failed"
                    continue

                try:
                    data = response.json()
                    text = (data.get("response") or "").strip()
                except Exception:
                    last_error_code = 502
                    last_error_message = "Invalid JSON from Ollama"
                    continue

                return {
                    "success": True,
                    "queued": False,
                    "result": text,
                    "error_code": None,
                    "error_message": "",
                    "attempted_models": attempted_models,
                    "model_used": model,
                    "base_url_used": base_url,
                    "queue_id": None,
                }

        if saw_429 and enqueue_on_429 and settings.OLLAMA_QUEUE_ENABLED and user_id is not None:
            try:
                queue_id = queue_service.enqueue_request(
                    user_id=int(user_id),
                    request_type=request_type,
                    prompt=prompt,
                    system=system,
                    request_payload=request_payload,
                    attempted_models=attempted_models,
                    error_code=429,
                    error_message="All configured models are currently rate limited",
                )
            except ValueError as exc:
                return {
                    "success": False,
                    "queued": False,
                    "queue_id": None,
                    "result": None,
                    "error_code": 429,
                    "error_message": str(exc),
                    "attempted_models": attempted_models,
                    "model_used": None,
                    "base_url_used": None,
                }
            return {
                "success": False,
                "queued": True,
                "queue_id": queue_id,
                "result": None,
                "error_code": 429,
                "error_message": "All configured models are currently rate limited",
                "attempted_models": attempted_models,
                "model_used": None,
                "base_url_used": None,
            }

        return {
            "success": False,
            "queued": False,
            "queue_id": None,
            "result": None,
            "error_code": last_error_code,
            "error_message": last_error_message,
            "attempted_models": attempted_models,
            "model_used": None,
            "base_url_used": None,
        }

    def generate(self, prompt: str, *, system: Optional[str] = None) -> Optional[str]:
        response = self.generate_with_fallback(
            prompt,
            system=system,
            enqueue_on_429=False,
        )
        return response.get("result")


llm_service = OllamaLLMService()
