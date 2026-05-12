from dataclasses import asdict, is_dataclass
from types import SimpleNamespace
from typing import Any, Dict, List
try:
    from bson import ObjectId
except ImportError:
    ObjectId = None


def model_to_dict(instance: Any) -> Any:
    if instance is None:
        return None
    
    # Handle basic types and ObjectId
    if ObjectId and isinstance(instance, ObjectId):
        return str(instance)
    
    if isinstance(instance, (str, int, float, bool)):
        return instance

    # Handle lists/iterables recursively
    if isinstance(instance, (list, tuple, set)):
        return [model_to_dict(item) for item in instance]

    # Convert object to dict if it's not already one
    data = {}
    if isinstance(instance, dict):
        data = instance
    elif isinstance(instance, SimpleNamespace):
        data = vars(instance)
    elif is_dataclass(instance):
        data = asdict(instance)
    elif hasattr(instance, "__dict__"):
        data = {k: v for k, v in vars(instance).items() if not k.startswith("_")}
    else:
        return instance

    # Recursively process dict values
    return {k: model_to_dict(v) for k, v in data.items()}


def models_to_dict(instances: List[Any]) -> List[Any]:
    if not instances:
        return []
    return [model_to_dict(instance) for instance in instances]
