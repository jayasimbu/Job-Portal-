from pymongo import MongoClient

def verify():
    client = MongoClient("mongodb://localhost:27017")
    db = client["career_auto"]
    count = db.job_postings.count_documents({})
    print(f"Total jobs in 'job_postings': {count}")
    
    if count > 0:
        print("\nSample Jobs:")
        for job in db.job_postings.find().limit(3):
            print(f"- {job.get('title')} at {job.get('company')} ({job.get('location')})")
            print(f"  Skills: {job.get('skills')}")
            print(f"  Salary: {job.get('salary')}")

if __name__ == "__main__":
    verify()
