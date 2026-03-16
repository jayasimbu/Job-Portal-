from datetime import datetime
from typing import Any, Dict


def system_health_snapshot() -> Dict[str, Any]:
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "api": "up",
        "database": "connected",
        "ai_engine": {
            "ats_scoring": "ready",
            "semantic_matching": "ready",
            "recommendation": "ready",
            "verification": "ready",
        },
    }
