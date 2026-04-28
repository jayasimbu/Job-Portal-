from __future__ import annotations

from types import SimpleNamespace
from typing import Any, Dict, Iterable
from urllib.parse import urlparse

from pymongo import ASCENDING, MongoClient, ReturnDocument

from .config import settings


def _get_database_name(url: str) -> str:
    parsed = urlparse(url)
    db_name = parsed.path.lstrip("/")
    return db_name or "career_auto1"


_mongo_client = MongoClient(settings.DATABASE_URL, serverSelectionTimeoutMS=3000)
_mongo_db = _mongo_client[_get_database_name(settings.DATABASE_URL)]


def get_database():
    """Return the shared MongoDB database instance for internal services."""
    return _mongo_db


def get_db():
    """Dependency to get MongoDB database object."""
    yield _mongo_db


def mongo_healthcheck() -> bool:
    try:
        _mongo_client.admin.command("ping")
        return True
    except Exception:
        return False


def get_next_sequence(db: Any, key: str) -> int:
    doc = db["counters"].find_one_and_update(
        {"_id": key},
        {"$inc": {"value": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return int(doc["value"])


def doc_to_entity(doc: Dict[str, Any] | None) -> Any:
    if not doc:
        return None
    payload = dict(doc)
    payload.pop("_id", None)
    return SimpleNamespace(**payload)


def docs_to_entities(docs: Iterable[Dict[str, Any]]) -> list[Any]:
    return [doc_to_entity(item) for item in docs]


def create_db_and_tables() -> None:
    """Initialize MongoDB indexes used by the services."""
    _mongo_db["users"].create_index([("email", ASCENDING)], unique=True)
    _mongo_db["users"].create_index([("username", ASCENDING)], unique=True)
    _mongo_db["users"].create_index([("id", ASCENDING)], unique=True)

    _mongo_db["jobseeker_profiles"].create_index([("user_id", ASCENDING)], unique=True)
    _mongo_db["jobseeker_profiles"].create_index([("id", ASCENDING)], unique=True)

    _mongo_db["employer_profiles"].create_index([("user_id", ASCENDING)], unique=True)
    _mongo_db["employer_profiles"].create_index([("id", ASCENDING)], unique=True)

    _mongo_db["job_postings"].create_index([("id", ASCENDING)], unique=True)
    _mongo_db["job_postings"].create_index([("employer_id", ASCENDING)])

    _mongo_db["resumes"].create_index([("id", ASCENDING)], unique=True)
    _mongo_db["resumes"].create_index([("user_id", ASCENDING)])

    _mongo_db["job_applications"].create_index([("id", ASCENDING)], unique=True)
    _mongo_db["job_applications"].create_index([("user_id", ASCENDING)])
    _mongo_db["job_applications"].create_index([("job_id", ASCENDING)])
    _mongo_db["job_applications"].create_index([("employer_id", ASCENDING)])
    _mongo_db["job_applications"].create_index([("user_id", ASCENDING), ("job_id", ASCENDING)], unique=True)

    _mongo_db["certificates"].create_index([("id", ASCENDING)], unique=True)
    _mongo_db["certificates"].create_index([("user_id", ASCENDING)])

    _mongo_db["ai_request_queue"].create_index([("status", ASCENDING), ("next_attempt_at", ASCENDING)])
    _mongo_db["ai_request_queue"].create_index([("user_id", ASCENDING), ("created_at", ASCENDING)])
    _mongo_db["ai_request_queue"].create_index([("user_id", ASCENDING), ("status", ASCENDING)])
    _mongo_db["ai_request_queue"].create_index(
        [("user_id", ASCENDING), ("request_type", ASCENDING), ("payload_key", ASCENDING), ("status", ASCENDING)]
    )