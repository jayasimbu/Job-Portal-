import sys
from pathlib import Path
backend_root = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_root))

from core.database import get_database
db = get_database()
apps = list(db["job_applications"].find({"user_id": 95}))
for a in apps:
    print(f"App ID: {a['id']}, Job ID: {a['job_id']}, ATS Score: {a.get('ats_score')}")
