import sys
import os
from datetime import datetime, timedelta

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from core.database import get_database, get_next_sequence

db = get_database()

dummy_jobs = [
    {
        "title": "Senior Java Developer",
        "company": "TechNova Solutions",
        "location": "Chennai, Tamil Nadu (Hybrid)",
        "job_type": "Full-time",
        "salary_range": "₹15L - ₹25L",
        "description": "We are looking for an experienced Java developer to build scalable enterprise applications.",
        "requirements": "5+ years experience with Java, Spring Boot, Microservices, and PostgreSQL. AWS experience is a plus.",
        "skills": ["java", "spring boot", "microservices", "postgresql", "aws", "rest api"],
        "experience_level": "Senior",
        "status": "open"
    },
    {
        "title": "Full Stack Developer (MERN)",
        "company": "Innovate Software",
        "location": "Bangalore, Karnataka (Remote)",
        "job_type": "Full-time",
        "salary_range": "₹12L - ₹20L",
        "description": "Join our product team to build responsive and interactive web applications from scratch.",
        "requirements": "Strong proficiency in React.js, Node.js, Express, and MongoDB. Familiarity with Tailwind CSS.",
        "skills": ["react", "node.js", "express.js", "mongodb", "javascript", "tailwind css", "html", "css"],
        "experience_level": "Mid",
        "status": "open"
    },
    {
        "title": "Frontend Engineer (React)",
        "company": "Creative AI Labs",
        "location": "Remote",
        "job_type": "Full-time",
        "salary_range": "₹10L - ₹18L",
        "description": "Design and implement user interfaces for our AI-powered platforms.",
        "requirements": "Deep understanding of React, Redux, and modern CSS. Experience with UI/UX principles.",
        "skills": ["react", "javascript", "redux", "css", "html", "ui/ux", "frontend"],
        "experience_level": "Mid",
        "status": "open"
    },
    {
        "title": "Backend Python/Django Developer",
        "company": "DataSync Corp",
        "location": "Pune, Maharashtra",
        "job_type": "Full-time",
        "salary_range": "₹8L - ₹15L",
        "description": "Develop and maintain backend APIs for data processing applications.",
        "requirements": "Experience with Python, Django, REST frameworks, and SQL databases.",
        "skills": ["python", "django", "rest api", "sql", "backend", "git"],
        "experience_level": "Junior to Mid",
        "status": "open"
    },
    {
        "title": "Junior Web Developer",
        "company": "StartUp Hub",
        "location": "Chennai, Tamil Nadu",
        "job_type": "Full-time",
        "salary_range": "₹4L - ₹8L",
        "description": "Great opportunity for freshers/junior devs to learn and build real-world web apps.",
        "requirements": "Basic knowledge of HTML, CSS, JavaScript, and at least one backend language (Python/Node/Java).",
        "skills": ["html", "css", "javascript", "react", "git", "web development"],
        "experience_level": "Junior",
        "status": "open"
    },
    {
        "title": "Cloud Solutions Architect",
        "company": "Global Tech Services",
        "location": "Hyderabad, Telangana",
        "job_type": "Full-time",
        "salary_range": "₹30L - ₹45L",
        "description": "Design robust and secure cloud architectures for enterprise clients.",
        "requirements": "Expert level knowledge of AWS/Azure, Kubernetes, Docker, and CI/CD pipelines.",
        "skills": ["aws", "azure", "kubernetes", "docker", "ci/cd", "cloud computing", "architecture"],
        "experience_level": "Lead",
        "status": "open"
    },
    {
        "title": "React Native Mobile Developer",
        "company": "Appify",
        "location": "Remote",
        "job_type": "Contract",
        "salary_range": "₹80K - ₹120K / month",
        "description": "Build high-performance cross-platform mobile apps.",
        "requirements": "Proven experience shipping React Native apps to iOS and Android stores.",
        "skills": ["react native", "javascript", "ios", "android", "mobile development"],
        "experience_level": "Mid",
        "status": "open"
    },
    {
        "title": "Full Stack Java Developer",
        "company": "FinTech Pioneers",
        "location": "Mumbai, Maharashtra",
        "job_type": "Full-time",
        "salary_range": "₹18L - ₹28L",
        "description": "Work on core financial systems combining robust Java backends with modern React frontends.",
        "requirements": "Java, Spring Boot, React, SQL, and Agile methodology experience.",
        "skills": ["java", "spring boot", "react", "sql", "agile", "full stack", "javascript"],
        "experience_level": "Senior",
        "status": "open"
    }
]

print(f"Current jobs count: {db['jobs'].count_documents({})}")

added = 0
for job in dummy_jobs:
    # Check if exists to avoid duplicates
    if not db["jobs"].find_one({"title": job["title"], "company": job["company"]}):
        job["id"] = get_next_sequence(db, "jobs")
        job["employer_id"] = 1 # Dummy employer
        job["created_at"] = datetime.utcnow()
        job["updated_at"] = datetime.utcnow()
        job["deadline"] = datetime.utcnow() + timedelta(days=30)
        db["jobs"].insert_one(job)
        added += 1

print(f"Successfully seeded {added} new jobs matching Java/FSD profiles!")
print(f"New total jobs count: {db['jobs'].count_documents({})}")
