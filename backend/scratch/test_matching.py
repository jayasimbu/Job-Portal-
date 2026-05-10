import json
import os

def match_score(user_skills, job_skills):
    user_skills = [s.lower().strip() for s in user_skills]
    job_skills = [s.lower().strip() for s in job_skills]

    matched = set(user_skills) & set(job_skills)

    if len(job_skills) == 0:
        return 0

    return len(matched) / len(job_skills)

def run_test(test_name, user_skills, jobs):
    print(f"\n--- TEST: {test_name} ---")
    print(f"User Skills: {user_skills}")
    
    results = []
    for job in jobs:
        score = match_score(user_skills, job["skills"])
        matched = list(set([s.lower().strip() for s in user_skills]) & set([s.lower().strip() for s in job["skills"]]))
        
        results.append({
            "title": job["title"],
            "matched_skills": matched,
            "score": round(score, 2)
        })

    # Sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)

    # Output Top 5
    print("TOP 5 MATCHES:")
    for i, job in enumerate(results[:5]):
        print(f"{i+1}. {job['title']} (Score: {job['score']}) - Matched: {job['matched_skills']}")

# Load jobs
jobs_path = os.path.join(os.path.dirname(__file__), "jobs.json")
with open(jobs_path, "r") as f:
    jobs = json.load(f)

# Test 1: Frontend focus
run_test("Frontend Test", ["react", "javascript", "html", "css"], jobs)

# Test 2: AI/ML focus
run_test("AI/ML Test", ["python", "ml"], jobs)

# Test 3: DevOps focus
run_test("DevOps Test", ["docker", "aws"], jobs)
