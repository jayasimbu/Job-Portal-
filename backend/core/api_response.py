from __future__ import annotations

from typing import Any, Dict, Tuple


DEFAULT_SUCCESS_MESSAGE = "Operation successful"
DEFAULT_VALIDATION_MESSAGE = "Validation failed"
DEFAULT_INTERNAL_ERROR_MESSAGE = "Internal server error"

_EXPLICIT_ERROR_MAP: Dict[str, Tuple[str, str]] = {
    "INVALID_PASSWORD": ("Invalid credentials", "AUTH_FAILED"),
    "ACCOUNT_NOT_FOUND": ("Invalid credentials", "AUTH_FAILED"),
    "ACCOUNT_NOT_FOUND_PLEASE_SIGNUP": ("Invalid credentials", "AUTH_FAILED"),
    "GOOGLE_ACCOUNT_USE_GOOGLE_LOGIN": ("Use Google login to sign in", "GOOGLE_LOGIN_REQUIRED"),
    "EMAIL_ACCOUNT_USE_EMAIL_LOGIN": ("Use email login to sign in", "EMAIL_LOGIN_REQUIRED"),
    "EMAIL_ACCOUNT_ALREADY_EXISTS": ("Account already exists", "ALREADY_EXISTS"),
    "ALREADY_EXISTS": ("Account already exists", "ALREADY_EXISTS"),
    "INVALID_TOKEN": ("Invalid token", "AUTH_FAILED"),
    "INVALID_REFRESH_TOKEN": ("Invalid refresh token", "AUTH_FAILED"),
    "INVALID_OR_EXPIRED_TOKEN": ("Invalid or expired token", "AUTH_FAILED"),
}


def _is_payload_envelope(payload: Dict[str, Any]) -> bool:
    return set(payload.keys()).issuperset({"success", "message", "data"})


from core.serialization import model_to_dict


def normalize_success_payload(payload: Any) -> Dict[str, Any]:
    # Ensure all data is JSON serializable (converts ObjectIds to strings recursively)
    payload = model_to_dict(payload)

    if isinstance(payload, dict) and _is_payload_envelope(payload):
        return {
            "success": bool(payload.get("success", True)),
            "message": str(payload.get("message") or DEFAULT_SUCCESS_MESSAGE),
            "data": payload.get("data", {}),
        }

    if isinstance(payload, dict):
        success = bool(payload.get("success", True))
        message = str(payload.get("message") or payload.get("error") or DEFAULT_SUCCESS_MESSAGE)
        data = payload.get("data")

        if data is None:
            data = {key: value for key, value in payload.items() if key not in {"success", "message"}}
        elif isinstance(data, dict):
            extras = {key: value for key, value in payload.items() if key not in {"success", "message", "data"}}
            if extras:
                data = {**data, **extras}
        else:
            extras = {key: value for key, value in payload.items() if key not in {"success", "message", "data"}}
            if extras:
                data = {"data": data, **extras}
        return {"success": success, "message": message, "data": data}

    return {"success": True, "message": DEFAULT_SUCCESS_MESSAGE, "data": payload if payload is not None else {}}


def normalize_error_payload(detail: Any, status_code: int) -> Dict[str, Any]:
    detail_text = str(detail) if detail is not None else ""
    mapped = _EXPLICIT_ERROR_MAP.get(detail_text)
    if mapped:
        message, error = mapped
        return {"message": message, "error": error}

    if status_code == 401:
        return {"message": "Invalid credentials", "error": "AUTH_FAILED"}
    if status_code == 403:
        return {"message": detail_text or "Forbidden", "error": "FORBIDDEN"}
    if status_code == 404:
        return {"message": detail_text or "Not found", "error": "NOT_FOUND"}
    if status_code == 422:
        return {"message": DEFAULT_VALIDATION_MESSAGE, "error": "VALIDATION_ERROR"}
    if status_code == 503:
        return {"message": detail_text or "Service unavailable", "error": "SERVICE_UNAVAILABLE"}

    if detail_text:
        sanitized_error = detail_text.replace(" ", "_").replace("-", "_").upper()
        return {"message": detail_text, "error": sanitized_error or "REQUEST_FAILED"}

    return {"message": DEFAULT_INTERNAL_ERROR_MESSAGE, "error": "INTERNAL_SERVER_ERROR"}
