import json
import os
import sys
from pymongo import UpdateOne

# Add paths
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from DB.mongo_setup import get_user_collection, get_job_collection, get_external_job_collection

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DB_JSON = os.path.join(BASE_DIR, 'DB', 'DB.json')
JOBSEEKER_DIR = os.path.join(BASE_DIR, 'DB', 'Job Seeker')
EXT_CRAWL_JSON = os.path.join(BASE_DIR, 'Admin', 'web_crawling.json')

def migrate_jobs():
    print("Migrating jobs from DB.json...")
    coll = get_job_collection()
    if coll is None:
        print("Could not connect to Jobs collection.")
        return

    if not os.path.exists(DB_JSON):
        print(f"File not found: {DB_JSON}")
        return

    with open(DB_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if not isinstance(data, list):
        print("Invalid DB.json format (expected list).")
        return

    ops = []
    for job in data:
        # Use 'id' as unique filter
        job_id = job.get('id')
        if job_id:
            ops.append(UpdateOne({'id': job_id}, {'$set': job}, upsert=True))

    if ops:
        res = coll.bulk_write(ops)
        print(f"Migrated {res.upserted_count + res.modified_count} jobs.")
    else:
        print("No jobs to migrate.")

def migrate_users():
    print("Migrating users from Job Seeker/ folder...")
    coll = get_user_collection()
    if coll is None:
        print("Could not connect to Users collection.")
        return

    if not os.path.isdir(JOBSEEKER_DIR):
        print(f"Directory not found: {JOBSEEKER_DIR}")
        return

    ops = []
    for fname in os.listdir(JOBSEEKER_DIR):
        if fname.endswith('.json'):
            fpath = os.path.join(JOBSEEKER_DIR, fname)
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    user_data = json.load(f)
                
                email = user_data.get('email')
                if email:
                    ops.append(UpdateOne({'email': email.lower()}, {'$set': user_data}, upsert=True))
            except Exception as e:
                print(f"Error reading {fname}: {e}")

    if ops:
        res = coll.bulk_write(ops)
        print(f"Migrated {res.upserted_count + res.modified_count} users.")
    else:
        print("No users to migrate.")

def migrate_external_jobs():
    print("Migrating external jobs cache...")
    coll = get_external_job_collection()
    if coll is None:
        print("Could not connect to External Jobs collection.")
        return

    if not os.path.exists(EXT_CRAWL_JSON):
        print(f"File not found: {EXT_CRAWL_JSON}")
        return

    try:
        with open(EXT_CRAWL_JSON, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Structure is usually { "source": [jobs...], ... }
        all_ext_jobs = []
        for source, jobs in data.items():
            if isinstance(jobs, list):
                for j in jobs:
                    j['crawl_source'] = source
                    all_ext_jobs.append(j)

        ops = []
        for j in all_ext_jobs:
            # External jobs might not have a unique ID, use URL or title+company
            url = j.get('url')
            if url:
                ops.append(UpdateOne({'url': url}, {'$set': j}, upsert=True))
            else:
                ops.append(UpdateOne({'title': j.get('title'), 'company': j.get('company')}, {'$set': j}, upsert=True))

        if ops:
            res = coll.bulk_write(ops)
            print(f"Migrated {res.upserted_count + res.modified_count} external jobs.")
    except Exception as e:
        print(f"Error migrating external jobs: {e}")

if __name__ == "__main__":
    migrate_jobs()
    migrate_users()
    migrate_external_jobs()
    print("Migration complete.")
