from pymongo import MongoClient

db = MongoClient("mongodb://localhost:27017")["career_auto1"]
users = list(db["users"].find({}, {"_id": 0, "email": 1, "auth_method": 1, "role": 1, "first_name": 1}))
for u in users:
    print(f"  {u.get('email','?'):40s} auth={u.get('auth_method','?'):8s} role={u.get('role','?'):12s} name={u.get('first_name','?')}")
print(f"\nTotal: {len(users)} users in career_auto1 database")
