import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["career_auto1"]

collections_to_check = [
    "users",
    "jobseeker_profiles",
    "employer_profiles",
    "job_postings",
    "resumes",
    "job_applications",
    "certificates",
    "notifications",
    "recruiter_notes"
]

print("Aligning counters with max IDs...")

for coll_name in collections_to_check:
    max_doc = db[coll_name].find_one(sort=[("id", -1)])
    max_id = max_doc["id"] if max_doc and "id" in max_doc else 0
    
    # Get current counter value
    counter_doc = db.counters.find_one({"_id": coll_name})
    current_counter = counter_doc["value"] if counter_doc and "value" in counter_doc else 0
    
    print(f"{coll_name}: max_id={max_id}, current_counter={current_counter}")
    
    if isinstance(max_id, int) and max_id > current_counter:
        print(f"  -> Updating {coll_name} counter to {max_id}")
        db.counters.update_one(
            {"_id": coll_name},
            {"$set": {"value": max_id}},
            upsert=True
        )

print("Done!")
