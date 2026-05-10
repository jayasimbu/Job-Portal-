from pymongo import MongoClient
from datetime import datetime

def seed_jobs():
    client = MongoClient("mongodb://localhost:27017")
    db = client["career_auto"]
    
    # Clear existing jobs to ensure a clean state for the demo
    db.job_postings.delete_many({})
    
    jobs = [
        {
            "id": 1,
            "title": "Senior Frontend Engineer",
            "company": "TechFlow Systems",
            "skills": ["react", "typescript", "tailwind", "next.js", "redux"],
            "location": "Chennai",
            "salary": 1200000,
            "experienceRequired": 4,
            "description": "Lead our frontend team in building high-performance SaaS dashboards.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 2,
            "title": "Backend Developer (Node.js)",
            "company": "DataNexus",
            "skills": ["node", "express", "mongodb", "redis", "docker"],
            "location": "Bangalore",
            "salary": 1500000,
            "experienceRequired": 3,
            "description": "Design and scale distributed microservices using Node.js and MongoDB.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 3,
            "title": "Full Stack Engineer",
            "company": "CloudNine Solutions",
            "skills": ["react", "node", "postgresql", "aws", "docker"],
            "location": "Hyderabad",
            "salary": 1800000,
            "experienceRequired": 5,
            "description": "End-to-end product development for our cloud-native platforms.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 4,
            "title": "Python Data Scientist",
            "company": "AIVision",
            "skills": ["python", "pandas", "scikit-learn", "tensorflow", "sql"],
            "location": "Chennai",
            "salary": 1400000,
            "experienceRequired": 2,
            "description": "Build predictive models and optimize our data pipelines.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 5,
            "title": "DevOps Engineer",
            "company": "InfaOps",
            "skills": ["kubernetes", "docker", "terraform", "jenkins", "aws"],
            "location": "Pune",
            "salary": 1600000,
            "experienceRequired": 3,
            "description": "Automate infrastructure and manage CI/CD pipelines.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 6,
            "title": "Java Backend Developer",
            "company": "FinTech Corp",
            "skills": ["java", "spring boot", "microservices", "mysql", "kafka"],
            "location": "Bangalore",
            "salary": 1300000,
            "experienceRequired": 3,
            "description": "Develop secure financial transaction processing systems.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 7,
            "title": "React Native Developer",
            "company": "Mobility Hub",
            "skills": ["react native", "javascript", "firebase", "redux", "ios"],
            "location": "Chennai",
            "salary": 900000,
            "experienceRequired": 2,
            "description": "Build cross-platform mobile apps for our logistics platform.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 8,
            "title": "UI/UX Developer",
            "company": "CreativeMind",
            "skills": ["figma", "css", "html", "javascript", "react"],
            "location": "Mumbai",
            "salary": 800000,
            "experienceRequired": 2,
            "description": "Bridge the gap between design and implementation with modern CSS.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 9,
            "title": "Machine Learning Engineer",
            "company": "DeepLogic AI",
            "skills": ["python", "pytorch", "nlp", "aws", "docker"],
            "location": "Bangalore",
            "salary": 2200000,
            "experienceRequired": 4,
            "description": "Research and deploy NLP models for enterprise automation.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 10,
            "title": "Cloud Architect",
            "company": "GlobalScale",
            "skills": ["aws", "azure", "kubernetes", "system design", "python"],
            "location": "Remote",
            "salary": 3500000,
            "experienceRequired": 8,
            "description": "Design global infrastructure strategies for enterprise clients.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 11,
            "title": "Go Developer",
            "company": "StreamLine",
            "skills": ["go", "grpc", "docker", "kubernetes", "postgresql"],
            "location": "Hyderabad",
            "salary": 1700000,
            "experienceRequired": 3,
            "description": "Build high-throughput streaming systems using Golang.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 12,
            "title": "Security Engineer",
            "company": "CyberShield",
            "skills": ["python", "penetration testing", "siem", "aws", "linux"],
            "location": "Chennai",
            "salary": 1500000,
            "experienceRequired": 4,
            "description": "Protect our infrastructure from evolving security threats.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 13,
            "title": "Data Engineer",
            "company": "BigData Hub",
            "skills": ["python", "spark", "hadoop", "airflow", "sql"],
            "location": "Pune",
            "salary": 1450000,
            "experienceRequired": 3,
            "description": "Maintain and scale our massive data lake architectures.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 14,
            "title": "Blockchain Developer",
            "company": "Web3 Labs",
            "skills": ["solidity", "ethereum", "javascript", "rust", "cryptography"],
            "location": "Remote",
            "salary": 2500000,
            "experienceRequired": 2,
            "description": "Build decentralized applications and smart contracts.",
            "created_at": datetime.utcnow()
        },
        {
            "id": 15,
            "title": "Manual QA Engineer",
            "company": "QualityFirst",
            "skills": ["testing", "documentation", "jira", "sql", "api testing"],
            "location": "Chennai",
            "salary": 500000,
            "experienceRequired": 1,
            "description": "Ensure product quality through rigorous manual testing cycles.",
            "created_at": datetime.utcnow()
        }
    ]
    
    db.job_postings.insert_many(jobs)
    print(f"Successfully inserted {len(jobs)} realistic jobs into 'job_postings' collection. [OK]")

if __name__ == "__main__":
    seed_jobs()
