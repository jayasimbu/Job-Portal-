from pymongo import MongoClient  # type: ignore
import os

def get_database():
    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    CONNECTION_STRING = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

    try:
        client = MongoClient(CONNECTION_STRING, serverSelectionTimeoutMS=5000)
        # Verify connection
        client.admin.command('ping')
        return client['career_auto']
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

def get_user_collection():
    db = get_database()
    return db['users'] if db is not None else None

def get_job_collection():
    db = get_database()
    return db['jobs'] if db is not None else None

def get_external_job_collection():
    db = get_database()
    return db['external_jobs'] if db is not None else None

def get_interviews_collection():
    db = get_database()
    return db['interviews'] if db is not None else None

# Initial setup or verification
if __name__ == "__main__":
    db = get_database()
    if db is not None:
        print("Connected to MongoDB successfully!")
        print(f"Collections: {db.list_collection_names()}")
    else:
        print("Failed to connect to MongoDB.")
