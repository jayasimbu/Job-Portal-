from __future__ import annotations

import threading
import time
from typing import Optional

from ai_engine.llm_service import llm_service
from ai_engine.queue_service import queue_service
from core.config import settings


_worker_thread: Optional[threading.Thread] = None
_stop_event = threading.Event()


def _worker_loop() -> None:
    poll_seconds = max(2, int(settings.OLLAMA_QUEUE_POLL_SECONDS))
    while not _stop_event.is_set():
        task = queue_service.claim_next_request()
        if not task:
            _stop_event.wait(poll_seconds)
            continue

        queue_id = str(task.get("_id"))
        retry_count = int(task.get("retry_count") or 0)
        max_retries = int(task.get("max_retries") or settings.OLLAMA_QUEUE_MAX_RETRIES)

        result = llm_service.generate_with_fallback(
            task.get("prompt", ""),
            system=task.get("system"),
            user_id=None,
            request_type=task.get("request_type") or "queued_request",
            request_payload=task.get("request_payload") or {},
            enqueue_on_429=False,
        )

        if result.get("success"):
            queue_service.mark_completed(
                queue_id,
                result=result.get("result") or "",
                model_used=result.get("model_used") or "",
                base_url_used=result.get("base_url_used") or "",
            )
            continue

        error_code = int(result.get("error_code") or 500)
        error_message = str(result.get("error_message") or "Unknown model error")

        if error_code == 429 and retry_count < max_retries:
            queue_service.mark_retry(
                queue_id,
                error_code=error_code,
                error_message=error_message,
                retry_count=retry_count + 1,
                cooldown_seconds=int(settings.OLLAMA_QUEUE_RETRY_COOLDOWN_SECONDS),
            )
            continue

        queue_service.mark_failed(
            queue_id,
            error_code=error_code,
            error_message=error_message,
        )


def start_queue_worker() -> None:
    global _worker_thread

    if not settings.OLLAMA_QUEUE_ENABLED:
        return
    if _worker_thread is not None and _worker_thread.is_alive():
        return

    _stop_event.clear()
    _worker_thread = threading.Thread(target=_worker_loop, name="ai-queue-worker", daemon=True)
    _worker_thread.start()


def stop_queue_worker() -> None:
    global _worker_thread
    _stop_event.set()
    if _worker_thread is not None and _worker_thread.is_alive():
        _worker_thread.join(timeout=2)
    _worker_thread = None
