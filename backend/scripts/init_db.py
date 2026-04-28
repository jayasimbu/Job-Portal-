import sys
import os
from pathlib import Path

# Add backend to sys.path
backend_dir = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_dir))

from core.database import create_db_and_tables, get_database

def initialize():
    print("Connecting to MongoDB and initializing 'career_auto1' database...")
    try:
        # Running index creation will materialize the DB and collections
        create_db_and_tables()
        db = get_database()
        print(f"Successfully initialized database: {db.name}")
        print("Collections created with indexes:")
        for coll in db.list_collection_names():
            print(f" - {coll}")
    except Exception as e:
        print(f"Error initializing database: {str(e)}")

if __name__ == "__main__":
    initialize()
