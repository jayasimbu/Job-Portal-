from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from bson import ObjectId
from pymongo import ASCENDING, ReturnDocument

from core.config import settings
from core.database import get_database


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class AIQueueService:
    def __init__(self) -> None:
        self.collection = get_database()["ai_request_queue"]

    @staticmethod
    def _payload_key(request_payload: Optional[Dict[str, Any]]) -> str:
        payload = request_payload or {}
        items = sorted((str(k), str(v)) for k, v in payload.items())
        return "|".join(f"{k}:{v}" for k, v in items)

    def enqueue_request(
        self,
        *,
        user_id: int,
        request_type: str,
        prompt: str,
        system: Optional[str],
        request_payload: Optional[Dict[str, Any]],
        attempted_models: list[str],
        error_code: int,
        error_message: str,
    ) -> str:
        now = _utcnow()
        payload_key = self._payload_key(request_payload)

        existing = self.collection.find_one(
            {
                "user_id": int(user_id),
                "request_type": request_type,
                "payload_key": payload_key,
                "status": {"$in": ["queued", "processing"]},
            }
        )
        if existing:
            return str(existing.get("_id"))

        pending_count = self.collection.count_documents(
            {
                "user_id": int(user_id),
                "status": {"$in": ["queued", "processing"]},
            }
        )
        if pending_count >= int(settings.OLLAMA_QUEUE_MAX_PENDING_PER_USER):
            raise ValueError("AI queue limit reached for this user. Please wait for queued tasks to finish.")

        doc = {
            "user_id": int(user_id),
            "request_type": request_type,
            "prompt": prompt,
            "system": system,
            "request_payload": request_payload or {},
            "payload_key": payload_key,
            "status": "queued",
            "attempted_models": attempted_models,
            "model_used": None,
            "base_url_used": None,
            "result": None,
            "error_code": int(error_code),
            "error_message": error_message,
            "attempt_count": 0,
            "retry_count": 0,
            "max_retries": int(settings.OLLAMA_QUEUE_MAX_RETRIES),
            "next_attempt_at": now,
            "created_at": now,
            "updated_at": now,
            "last_attempted_at": None,
            "completed_at": None,
        }
        result = self.collection.insert_one(doc)
        return str(result.inserted_id)

    def claim_next_request(self) -> Optional[Dict[str, Any]]:
        now = _utcnow()
        return self.collection.find_one_and_update(
            {
                "status": "queued",
                "next_attempt_at": {"$lte": now},
            },
            {
                "$set": {
                    "status": "processing",
                    "updated_at": now,
                    "last_attempted_at": now,
                },
                "$inc": {"attempt_count": 1},
            },
            sort=[("created_at", ASCENDING)],
            return_document=ReturnDocument.AFTER,
        )

    def mark_completed(self, queue_id: str, *, result: str, model_used: str, base_url_used: str) -> None:
        now = _utcnow()
        self.collection.update_one(
            {"_id": ObjectId(queue_id)},
            {
                "$set": {
                    "status": "completed",
                    "result": result,
                    "model_used": model_used,
                    "base_url_used": base_url_used,
                    "updated_at": now,
                    "completed_at": now,
                    "error_code": None,
                    "error_message": "",
                }
            },
        )

    def mark_retry(
        self,
        queue_id: str,
        *,
        error_code: int,
        error_message: str,
        retry_count: int,
        cooldown_seconds: int,
    ) -> None:
        now = _utcnow()
        self.collection.update_one(
            {"_id": ObjectId(queue_id)},
            {
                "$set": {
                    "status": "queued",
                    "error_code": error_code,
                    "error_message": error_message,
                    "retry_count": retry_count,
                    "next_attempt_at": now + timedelta(seconds=max(1, cooldown_seconds)),
                    "updated_at": now,
                }
            },
        )

    def mark_failed(self, queue_id: str, *, error_code: int, error_message: str) -> None:
        now = _utcnow()
        self.collection.update_one(
            {"_id": ObjectId(queue_id)},
            {
                "$set": {
                    "status": "failed",
                    "error_code": error_code,
                    "error_message": error_message,
                    "updated_at": now,
                }
            },
        )

    def get_user_queue_status(self, user_id: int, *, limit: int = 20) -> Dict[str, Any]:
        query = {"user_id": int(user_id)}
        queued = self.collection.count_documents({**query, "status": "queued"})
        processing = self.collection.count_documents({**query, "status": "processing"})
        completed = self.collection.count_documents({**query, "status": "completed"})
        failed = self.collection.count_documents({**query, "status": "failed"})

        items = list(
            self.collection.find(query)
            .sort("created_at", -1)
            .limit(max(1, int(limit)))
        )

        serialized = []
        for item in items:
            serialized.append(
                {
                    "id": str(item.get("_id")),
                    "request_type": item.get("request_type"),
                    "status": item.get("status"),
                    "attempt_count": item.get("attempt_count", 0),
                    "retry_count": item.get("retry_count", 0),
                    "max_retries": item.get("max_retries", 0),
                    "error_code": item.get("error_code"),
                    "error_message": item.get("error_message"),
                    "model_used": item.get("model_used"),
                    "created_at": item.get("created_at").isoformat() if item.get("created_at") else None,
                    "completed_at": item.get("completed_at").isoformat() if item.get("completed_at") else None,
                }
            )

        return {
            "user_id": int(user_id),
            "queued": queued,
            "processing": processing,
            "completed": completed,
            "failed": failed,
            "has_rate_limit_issue": any(
                item.get("error_code") == 429 and item.get("status") in {"queued", "processing", "failed"}
                for item in serialized
            ),
            "items": serialized,
        }


queue_service = AIQueueService()
