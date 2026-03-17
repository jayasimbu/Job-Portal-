"""
config.py — Multi-Provider API Key Auto-Discovery
===================================================
Supports: Ollama (local) · Ollama (cloud) · Gemini · OpenRouter · Groq · OpenAI · Anthropic · DeepSeek

HOW TO ADD A KEY (zero code changes):
  1. Open backend/.env
  2. Add:  PROVIDER_API_KEY_N=your_key
     e.g.: GEMINI_API_KEY_3=abc
           GROQ_API_KEY_1=xyz
           OLLAMA_API_KEY_1=your_ollama_cloud_key
  3. Done. Keys are auto-discovered and hot-reloaded on quota errors.

OLLAMA LOCAL: No key needed. Works automatically if `ollama serve` is running.
OLLAMA CLOUD: Add OLLAMA_API_KEY_1 to .env to enable cloud model access.
"""

import os
import re
from dotenv import dotenv_values

_ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')

# ── Provider Definitions ──────────────────────────────────────────────────────
# Each entry: prefix → config used by ats_routes to call the right API.
# Priority order = the order in this dict (Gemini first, then OpenRouter, etc.)

PROVIDERS = {
    # ── Ollama Local (highest priority — free, private, no key needed) ──────
    "ollama_local": {
        "prefix":         "OLLAMA_LOCAL",          # not used for key discovery
        "type":           "ollama_local",
        "no_key_required": True,                    # always attempt if Ollama is running
        "base_url":       "http://localhost:11434/v1",
        "models":         [],                       # populated at runtime from ollama_models.py
    },
    # ── Ollama Cloud (second priority — cloud models via Ollama API key) ────
    "ollama_cloud": {
        "prefix":   "OLLAMA_API_KEY",
        "type":     "openai_compat",
        "base_url": "https://ollama.com/v1",
        "models":   [],                             # populated at runtime from ollama_models.py
    },
    # ── Google Gemini ───────────────────────────────────────────────────────
    "gemini": {
        "prefix":   "GEMINI_API_KEY",
        "type":     "gemini",
        "models":   [
            "gemini-2.0-flash", 
            "gemini-2.0-flash-lite-preview-02-05", 
            "gemini-1.5-flash-8b"
        ],
    },
    "openrouter": {
        "prefix":   "OPENROUTER_API_KEY",
        "type":     "openai_compat",
        "models":   [
            "meta-llama/llama-3-8b-instruct:free",
            "google/gemini-exp-1206:free",
            "openai/gpt-4o-mini"
        ],
        "base_url": "https://openrouter.ai/api/v1",
    },
    "groq": {
        "prefix":   "GROQ_API_KEY",
        "type":     "openai_compat",
        "models":   [
            "llama3-8b-8192",
            "llama3-70b-8192",
            "mixtral-8x7b-32768",
            "gemma2-9b-it",
            "llama-3.1-8b-instant",
            "llama-3.3-70b-versatile",
        ],
        "base_url": "https://api.groq.com/openai/v1",
    },
    "openai": {
        "prefix":   "OPENAI_API_KEY",
        "type":     "openai_compat",
        "models":   ["gpt-4o-mini", "gpt-3.5-turbo"],
        "base_url": "https://api.openai.com/v1",
    },
    "anthropic": {
        "prefix":   "ANTHROPIC_API_KEY",
        "type":     "anthropic",
        "models":   ["claude-3-haiku-20240307"],
    },
    "deepseek": {
        "prefix":   "DEEPSEEK_API_KEY",
        "type":     "openai_compat",
        "models":   ["deepseek-chat"],
        "base_url": "https://api.deepseek.com/v1",
    },
}


# ── Key Discovery ─────────────────────────────────────────────────────────────

def _discover_keys_for(prefix: str) -> list[str]:
    """
    Read .env fresh from disk and return all values matching
    PREFIX_1, PREFIX_2, PREFIX_3 ... sorted by number.
    """
    values = dotenv_values(_ENV_FILE)
    pairs = []
    for name, value in values.items():
        if re.fullmatch(rf'{re.escape(prefix)}_(\d+)', name) and value:
            num = int(re.search(r'_(\d+)$', name).group(1))
            pairs.append((num, value.strip()))
    pairs.sort()
    return [v for _, v in pairs]


def _is_ollama_available() -> bool:
    """
    Check if Ollama binary exists on PATH. Returns False silently if not installed.
    Does NOT check if the daemon is running — that's handled per-request.
    """
    import shutil
    return shutil.which("ollama") is not None


def _get_installed_ollama_models() -> list:
    """
    Query the local Ollama daemon for installed models.
    Returns list of model names, or empty list if Ollama is not running.
    """
    try:
        import urllib.request, json as _json
        with urllib.request.urlopen("http://localhost:11434/api/tags", timeout=2) as r:
            data = _json.loads(r.read())
        return [m["name"].split(":")[0] for m in data.get("models", [])]
    except Exception:
        return []


def load_all_keys() -> dict[str, list[str]]:
    """
    Returns a dict mapping provider name → list of API keys (sorted).
    ollama_local is always included if Ollama binary exists (no key needed).
    All other providers are only included if they have at least one key in .env.
    """
    # Lazy-import ollama_models to avoid circular imports
    try:
        from ollama_models import DEFAULT_LOCAL_MODELS, CLOUD_MODELS
    except ImportError:
        DEFAULT_LOCAL_MODELS = ["llama3.2", "mistral", "phi3"]
        CLOUD_MODELS = ["llama3.2", "mistral", "llama3.1:8b"]

    result = {}

    # Ollama local — no key needed, just check binary exists
    if _is_ollama_available():
        PROVIDERS["ollama_local"]["models"] = DEFAULT_LOCAL_MODELS
        result["ollama_local"] = ["__local__"]   # sentinel — not a real key

    # Ollama cloud — only if key is in .env
    PROVIDERS["ollama_cloud"]["models"] = CLOUD_MODELS

    for name, cfg in PROVIDERS.items():
        if name == "ollama_local":
            continue   # already handled above
        keys = _discover_keys_for(cfg["prefix"])
        if keys:
            result[name] = keys
    return result


# Live key table — refreshed on quota error by reload_keys()
_LIVE_KEYS: dict[str, list[str]] = load_all_keys()


def get_live_keys() -> dict[str, list[str]]:
    """Return the current in-memory key table."""
    return _LIVE_KEYS


def reload_keys() -> dict[str, list[str]]:
    """
    Re-read .env from disk and refresh the live key table.
    Called automatically on quota/rate-limit errors — no server restart needed.
    """
    global _LIVE_KEYS
    _LIVE_KEYS = load_all_keys()
    return _LIVE_KEYS


# ── Convenience: legacy Gemini helpers (for backward compat) ─────────────────
def get_gemini_key(index: int = 0) -> str:
    keys = _LIVE_KEYS.get("gemini", [])
    if not keys:
        raise ValueError("No Gemini keys in .env — add GEMINI_API_KEY_1=...")
    return keys[index % len(keys)]


@property
def GEMINI_API_KEYS() -> list[str]:
    return _LIVE_KEYS.get("gemini", [])
