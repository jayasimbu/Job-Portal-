from typing import Any, Dict, List

from sqlalchemy.inspection import inspect


def model_to_dict(instance: Any) -> Dict[str, Any]:
    if instance is None:
        return {}
    mapper = inspect(instance).mapper
    return {column.key: getattr(instance, column.key) for column in mapper.column_attrs}


def models_to_dict(instances: List[Any]) -> List[Dict[str, Any]]:
    return [model_to_dict(instance) for instance in instances]
