VALID_ROLES = {"jobseeker", "employer", "admin"}


def validate_role(role: str) -> str:
    normalized = role.strip().lower()
    if normalized not in VALID_ROLES:
        raise ValueError("Invalid role. Allowed values: jobseeker, employer, admin")
    return normalized
