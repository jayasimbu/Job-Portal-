import json
import random
import os
from pathlib import Path

JOBS_FILE = Path(__file__).resolve().parents[2] / "database" / "jobs" / "jobs.json"

INTRO_TEMPLATES = [
    "Are you ready to make a significant impact? {company} is seeking a highly skilled {title} to join our innovative team. As a pioneer in the {industry} sector, we pride ourselves on pushing the boundaries of what's possible and fostering a culture of continuous learning and excellence.",
    "{company} is on a mission to redefine the {industry} landscape. We are looking for a passionate and driven {title} who thrives in dynamic environments. Join us to collaborate with world-class professionals and build solutions that matter.",
    "Join the ranks of top-tier talent at {company}. We are actively recruiting a {title} to spearhead critical projects within our {industry} division. If you are a strategic thinker with a proven track record, we want to hear from you."
]

RESPONSIBILITY_TEMPLATES = [
    "Lead the design, development, and deployment of scalable solutions using {tags}.",
    "Collaborate closely with cross-functional teams (Product, Design, QA) to define project requirements and deliver high-quality features.",
    "Drive architectural decisions and establish best practices for coding standards, code reviews, and testing.",
    "Mentor junior team members and foster a collaborative, knowledge-sharing environment.",
    "Analyze complex system performance bottlenecks and implement effective optimizations.",
    "Ensure security, reliability, and scalability are embedded in the core of all deliverables.",
    "Maintain up-to-date knowledge of industry trends and emerging technologies to keep {company} ahead of the curve."
]

REQUIREMENT_TEMPLATES = [
    "Proven experience working as a {title} or in a similar senior role.",
    "Deep, hands-on expertise with {tags}.",
    "Strong understanding of the {industry} domain and its unique challenges.",
    "Exceptional problem-solving abilities and a strategic mindset.",
    "Excellent communication skills, with the ability to articulate technical concepts to non-technical stakeholders.",
    "Experience with Agile/Scrum methodologies and fast-paced delivery cycles.",
    "Bachelor's or Master's degree in Computer Science, Engineering, or a related field (or equivalent practical experience)."
]

def generate_rich_content(job):
    title = job.get("title", "Professional")
    company = job.get("company", "Our Company")
    industry = job.get("industry", "Technology")
    tags = job.get("tags", [])
    
    tags_str = ", ".join(tags) if tags else "modern technologies"
    
    # Generate Description
    intro = random.choice(INTRO_TEMPLATES).format(company=company, title=title, industry=industry)
    
    desc = f"{intro}\n\nKey Responsibilities:\n"
    resps = random.sample(RESPONSIBILITY_TEMPLATES, k=4)
    for r in resps:
        desc += f"• {r.format(tags=tags_str, company=company)}\n"
        
    job["description"] = desc
    
    # Generate Requirements (which JobDetails.jsx reads as `job.requirements` if present, 
    # but currently JobDetails.jsx falls back to `job.tags`. Let's actually add `requirements` list)
    reqs = random.sample(REQUIREMENT_TEMPLATES, k=4)
    job["requirements"] = [r.format(title=title, tags=tags_str, industry=industry) for r in reqs]
    
    # Add a realistic experience string
    if not job.get("experience") or job.get("experience") == "Depends on role":
        job["experience"] = random.choice(["3-5 Years", "5-7 Years", "7+ Years", "2-4 Years"])
        
    # Add realistic shift
    job["shift"] = random.choice(["Day Shift", "Flexible Hours", "Core Hours (10AM - 4PM)"])
    
    # Add bond status
    job["bond"] = random.choice(["No Bond", "1 Year Agreement", "No Bond"])

    return job

def main():
    print(f"Loading jobs from {JOBS_FILE}")
    with open(JOBS_FILE, "r", encoding="utf-8") as f:
        jobs = json.load(f)
        
    print(f"Enriching {len(jobs)} jobs...")
    for job in jobs:
        generate_rich_content(job)
        
    with open(JOBS_FILE, "w", encoding="utf-8") as f:
        json.dump(jobs, f, indent=2)
        
    print("Successfully updated jobs.json with professional HR-style data!")

if __name__ == "__main__":
    main()
