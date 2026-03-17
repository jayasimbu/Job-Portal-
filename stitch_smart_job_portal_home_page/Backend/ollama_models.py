"""
ollama_models.py — Available Ollama Models
===========================================================
User requested specific cloud models.
"""

OLLAMA_CLOUD_MODELS = [
    "gpt-oss:120b-cloud",
    "gpt-oss:20b-cloud",
    "deepseek-v3.1:671b-cloud",
    "qwen3-coder:480b-cloud",
    "qwen3-vl:235b-cloud",
    "minimax-m2:cloud",
    "alm-4.6:cloud",
]

LOCAL_MODELS = []
CLOUD_MODELS = OLLAMA_CLOUD_MODELS.copy()
DEFAULT_LOCAL_MODELS = OLLAMA_CLOUD_MODELS.copy()

