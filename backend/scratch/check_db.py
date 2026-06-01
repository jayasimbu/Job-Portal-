from pymongo import MongoClient
import json
from bson import ObjectId

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

client = MongoClient("mongodb://localhost:27017")
db = client["career_auto1"]

print("--- LATEST 3 RESUMES ---")
resumes = list(db["resumes"].find().sort("_id", -1).limit(3))
for r in resumes:
    print(json.dumps(r, indent=2, cls=CustomEncoder, default=str))

print("\n--- JOBSEEKER PROFILE FOR USER 4 ---")
profile = db["jobseeker_profiles"].find_one({"user_id": 4})
print(json.dumps(profile, indent=2, cls=CustomEncoder, default=str))

print("\n--- COUNTERS ---")
counters = list(db["counters"].find())
for c in counters:
    print(c)
