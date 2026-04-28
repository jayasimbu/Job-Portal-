from __future__ import annotations

import argparse
import os
from pathlib import Path
from typing import Dict, Tuple
from urllib.parse import urlparse


def parse_env(path: Path) -> Dict[str, str]:
    data: Dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        data[key.strip()] = value.strip()
    return data


def _validate_backend_env(path: Path) -> Tuple[int, list[str]]:
    errors: list[str] = []
    env = parse_env(path)
    required = [
        "HOST",
        "PORT",
        "FRONTEND_URL",
        "DATABASE_URL",
        "OLLAMA_BASE_URL",
        "SECRET_KEY",
        "GOOGLE_CLIENT_ID",
    ]
    for key in required:
        if not env.get(key):
            errors.append(f"backend missing: {key}")

    db_url = env.get("DATABASE_URL", "")
    if db_url and not db_url.startswith("mongodb"):
        errors.append(f"DATABASE_URL must be MongoDB URI, found: {db_url}")

    frontend_url = env.get("FRONTEND_URL", "")
    if frontend_url and not frontend_url.startswith(("http://", "https://")):
        errors.append(f"FRONTEND_URL invalid: {frontend_url}")

    ollama_url = env.get("OLLAMA_BASE_URL", "")
    if ollama_url and not ollama_url.startswith(("http://", "https://")):
        errors.append(f"OLLAMA_BASE_URL invalid: {ollama_url}")

    model_count_raw = env.get("OLLAMA_MODEL_COUNT", "1").strip() or "1"
    try:
        model_count = max(1, int(model_count_raw))
    except ValueError:
        model_count = 1
        errors.append(f"OLLAMA_MODEL_COUNT invalid integer: {model_count_raw}")

    configured_models = []
    if env.get("OLLAMA_MODEL", "").strip():
        configured_models.append(env["OLLAMA_MODEL"].strip())
    for idx in range(1, model_count + 1):
        value = env.get(f"OLLAMA_MODEL{idx}", "").strip()
        if value:
            configured_models.append(value)
    if not configured_models:
        errors.append("At least one model is required: OLLAMA_MODEL or OLLAMA_MODEL1")

    require_remote_key = env.get("OLLAMA_REQUIRE_API_KEY_FOR_REMOTE", "").lower() == "true"
    parsed = urlparse(ollama_url)
    host = (parsed.hostname or "").lower()
    is_local = host in {"localhost", "127.0.0.1", "::1"}
    if require_remote_key and not is_local and not env.get("OLLAMA_API_KEY", ""):
        errors.append("OLLAMA_API_KEY required for remote OLLAMA_BASE_URL")

    return len(errors), errors


def _validate_frontend_env(path: Path) -> Tuple[int, list[str]]:
    errors: list[str] = []
    env = parse_env(path)
    required = ["VITE_API_BASE_URL", "VITE_GOOGLE_CLIENT_ID"]
    for key in required:
        if not env.get(key):
            errors.append(f"frontend missing: {key}")

    api_url = env.get("VITE_API_BASE_URL", "")
    if api_url and not api_url.startswith(("http://", "https://")):
        errors.append(f"VITE_API_BASE_URL invalid: {api_url}")

    return len(errors), errors


def activate_profile(profile: str, *, verbose: bool = True) -> int:
    backend_dir = Path(__file__).resolve().parent
    root_dir = backend_dir.parent
    frontend_dir = root_dir / "frontend"

    backend_profiles = {
        "local": backend_dir / "local.env",
        "server": backend_dir / "server.env",
    }
    frontend_profiles = {
        "local": frontend_dir / "local.env",
        "server": frontend_dir / "server.env",
    }

    if profile not in {"local", "server"}:
        if verbose:
            print(f"[ERROR] Unsupported profile: {profile}")
        return 1

    backend_path = backend_profiles[profile]
    frontend_path = frontend_profiles[profile]
    if not backend_path.exists() or not frontend_path.exists():
        if verbose:
            print(f"[ERROR] Missing profile files for: {profile}")
        return 1

    backend_count, backend_errors = _validate_backend_env(backend_path)
    frontend_count, frontend_errors = _validate_frontend_env(frontend_path)

    if verbose:
        print(f"[INFO] Using {profile.upper()} profile for backend and frontend")
        for issue in backend_errors + frontend_errors:
            print(f"[ERROR] {issue}")

    total = backend_count + frontend_count
    if total == 0:
        if verbose:
            print("[SUCCESS] Environment files are ready")
        return 0

    if verbose:
        print(f"[FAIL] Validation found {total} issue(s)")
    return 1


def auto_activate_profile() -> int:
    profile = os.getenv("APP_ENV_PROFILE", "local").strip().lower() or "local"
    return activate_profile(profile, verbose=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="Switch and validate environment profiles")
    parser.add_argument("profile", choices=["local", "server", "validate"], help="Profile to use")
    args = parser.parse_args()

    backend_dir = Path(__file__).resolve().parent
    root_dir = backend_dir.parent
    frontend_dir = root_dir / "frontend"

    if args.profile == "validate":
        active_profile = (os.getenv("APP_ENV_PROFILE", "local") or "local").strip().lower()
        if active_profile not in {"local", "server"}:
            active_profile = "local"
        backend_count, backend_errors = _validate_backend_env(backend_dir / f"{active_profile}.env")
        frontend_count, frontend_errors = _validate_frontend_env(frontend_dir / f"{active_profile}.env")
        for issue in backend_errors + frontend_errors:
            print(f"[ERROR] {issue}")
        total = backend_count + frontend_count
        if total == 0:
            print("[SUCCESS] Environment files are ready")
            return 0
        print(f"[FAIL] Validation found {total} issue(s)")
        return 1

    return activate_profile(args.profile, verbose=True)


if __name__ == "__main__":
    raise SystemExit(main())
