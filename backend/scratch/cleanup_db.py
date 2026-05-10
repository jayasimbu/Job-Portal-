from core.database import get_database, get_next_sequence
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("db_cleanup")

def cleanup():
    db = get_database()
    collections = [
        "users", 
        "jobseeker_profiles", 
        "employer_profiles", 
        "resumes", 
        "job_applications", 
        "job_postings"
    ]
    
    for coll_name in collections:
        coll = db[coll_name]
        log.info(f"Cleaning {coll_name}...")
        
        # 1. Find documents with id: null
        bad_docs = list(coll.find({"id": None}))
        if not bad_docs:
            log.info(f"  No bad docs in {coll_name}")
            continue
            
        log.info(f"  Found {len(bad_docs)} documents with id: null in {coll_name}")
        
        for doc in bad_docs:
            new_id = get_next_sequence(db, coll_name)
            coll.update_one({"_id": doc["_id"]}, {"$set": {"id": new_id}})
            log.info(f"    Assigned id {new_id} to doc {doc['_id']}")

    # 2. Handle Duplicate user_id in jobseeker_profiles (must be unique)
    profiles = list(db["jobseeker_profiles"].find())
    seen_user_ids = set()
    for p in profiles:
        u_id = p.get("user_id")
        if u_id in seen_user_ids:
            log.warning(f"  Deleting duplicate profile for user {u_id}")
            db["jobseeker_profiles"].delete_one({"_id": p["_id"]})
        else:
            seen_user_ids.add(u_id)

    log.info("Cleanup complete.")

if __name__ == "__main__":
    cleanup()
