from dataclasses import asdict, is_dataclass
from types import SimpleNamespace
from typing import Any, Dict, List


def model_to_dict(instance: Any) -> Dict[str, Any]:
    if instance is None:
        return {}
    if isinstance(instance, dict):
        return dict(instance)
    if isinstance(instance, SimpleNamespace):
        return dict(vars(instance))
    if is_dataclass(instance):
        return asdict(instance)

    # Fallback for object-like entities.
    if hasattr(instance, "__dict__"):
        return {k: v for k, v in vars(instance).items() if not k.startswith("_")}
    return {}


def models_to_dict(instances: List[Any]) -> List[Dict[str, Any]]:
    return [model_to_dict(instance) for instance in instances]
