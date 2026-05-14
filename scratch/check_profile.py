
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["career_auto1"]
profiles = db["employer_profiles"]

print("Listing all profiles in career_auto1.employer_profiles:")
for p in profiles.find():
    print(p)
