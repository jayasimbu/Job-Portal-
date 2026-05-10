import asyncio
from modules.jobseeker.service import JobSeekerService
from core.database import get_database

async def main():
    print("Connecting to DB...")
    db = get_database()
    service = JobSeekerService(db)
    print("Calling get_insights for user 1...")
    try:
        res = await service.get_insights(1)
        print("SUCCESS:", res.keys())
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    asyncio.run(main())
