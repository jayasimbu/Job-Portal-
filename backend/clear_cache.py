from pymongo import MongoClient

def clear_cache():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['career_auto_db']
    result = db.jobseeker_profiles.update_many({}, {"$unset": {"cached_ai_insights": ""}})
    print(f"Cleared cache for {result.modified_count} profiles.")

if __name__ == '__main__':
    clear_cache()
