import sys
from pathlib import Path
backend_root = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_root))

from core.database import get_database
db = get_database()
apps = list(db["job_applications"].find().sort("id", -1).limit(5))
for a in apps:
    print(f"ID: {a['id']}, UserID: {a['user_id']}, JobID: {a['job_id']}, Score: {a.get('ats_score')}")
