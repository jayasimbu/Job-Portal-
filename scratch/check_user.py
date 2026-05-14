
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["career_auto1"]
users = db["users"]

u = users.find_one({"id": 24})
print(f"User 24: {u}")
