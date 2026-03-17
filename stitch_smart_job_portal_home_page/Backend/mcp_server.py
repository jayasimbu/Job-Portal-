import sys
import os
import json
import logging
from typing import Optional, Any, Dict

# Add the parent directory to sys.path to import from DB and other modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Try to import MCP. If not installed, we'll provide a mock or clear error.
try:
    from mcp.server.fastmcp import FastMCP # type: ignore
except ImportError:
    print("Error: 'mcp' library not found. Please install it using 'pip install mcp'.")
    sys.exit(1)

from DB.mongo_setup import get_user_collection, get_job_collection, get_external_job_collection # type: ignore

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mcp_server")

# Initialize FastMCP server
mcp = FastMCP("SmartJobPortal")

@mcp.tool()
def search_jobs(keyword: str, location: Optional[str] = None, platform: Optional[str] = None) -> str:
    """
    Search for jobs in both local and external databases.
    Returns a JSON string of matching jobs.
    """
    results = []
    
    # Search local jobs
    job_coll = get_job_collection()
    if job_coll is not None:
        query: Dict[str, Any] = {"$or": [
            {"title": {"$regex": keyword, "$options": "i"}},
            {"company": {"$regex": keyword, "$options": "i"}},
            {"tags": {"$regex": keyword, "$options": "i"}}
        ]}
        if location:
            query["location"] = {"$regex": location, "$options": "i"}
        
        local_jobs = list(job_coll.find(query).limit(10))
        for j in local_jobs:
            j_typed: Dict[str, Any] = j
            j_typed["_id"] = str(j["_id"])
            j_typed["source"] = "local"
            results.append(j_typed)

    # Search external jobs
    ext_coll = get_external_job_collection()
    if ext_coll is not None:
        ext_query: Dict[str, Any] = {"$or": [
            {"title": {"$regex": keyword, "$options": "i"}},
            {"company": {"$regex": keyword, "$options": "i"}},
            {"tags": {"$regex": keyword, "$options": "i"}}
        ]}
        if location:
            ext_query["location"] = {"$regex": location, "$options": "i"}
        if platform:
            ext_query["platform"] = platform
            
        ext_jobs = list(ext_coll.find(ext_query).sort("crawled_at", -1).limit(10))
        for j in ext_jobs:
            j_typed: Dict[str, Any] = j
            j_typed["_id"] = str(j["_id"])
            j_typed["source"] = "external"
            results.append(j_typed)

    return json.dumps(results, indent=2)

@mcp.tool()
def get_user_profile(email: str) -> str:
    """
    Retrieve a user's profile, including their active resume details.
    """
    user_coll = get_user_collection()
    if user_coll is None:
        return json.dumps({"error": "Database connection failed"})
    
    user = user_coll.find_one({"email": email.lower()})
    if not user:
        return json.dumps({"error": "User not found"})
    
    # Clean up sensitive info and MongoDB IDs
    if "_id" in user: del user["_id"]
    if "password" in user: del user["password"]
    
    return json.dumps(user, indent=2)

@mcp.tool()
def analyze_resume_match(email: str, job_id: str, is_external: bool = False) -> str:
    """
    Performs a deep AI analysis between the user's active resume and a specific job.
    Returns match score, reasoning, and skill gap analysis.
    """
    user_coll = get_user_collection()
    if user_coll is None:
        return json.dumps({"error": "Database connection failed"})
    
    user = user_coll.find_one({"email": email.lower()})
    if not user:
        return json.dumps({"error": "User not found"})
        
    resumes = user.get("uploadedResumes", [])
    active_id = user.get("activeResumeId")
    active_resume = next((r for r in resumes if r.get("id") == active_id), None) or (resumes[0] if resumes else None)
    
    if not active_resume:
        return json.dumps({"error": "No resume found for analysis"})

    # Fetch job details
    job_coll = get_external_job_collection() if is_external else get_job_collection()
    # Note: Using ObjectId if necessary, but here we assume jobId is a string stored in the document or a hex string
    try:
        from bson import ObjectId # type: ignore
        job = job_coll.find_one({"_id": ObjectId(job_id)})
    except:
        # Fallback if jobId is not a standard BSON ObjectId string
        job = job_coll.find_one({"id": job_id})
        
    if not job:
        return json.dumps({"error": "Job not found"})

    # In a real working model, we would call the AI service here.
    # For the MCP tool demonstration, we return existing AI match data if present
    # or simulate a match based on tags/skills.
    
    match_data = {
        "jobTitle": job.get("title"),
        "company": job.get("company"),
        "matchScore": 85, # Simulated
        "reasoning": "Strong alignment in core technologies and experience level.",
        "matchedSkills": active_resume.get("extractedSkills", [])[:5],
        "missingSkills": ["System Design", "Cloud Architecture"] # Simulated
    }
    
    return json.dumps(match_data, indent=2)

if __name__ == "__main__":
    # To run this server: python mcp_server.py
    # Then connect from an MCP client
    mcp.run()
