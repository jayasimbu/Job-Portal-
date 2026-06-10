import json

with open("certificates_list.json", "r") as f:
    certs = json.load(f)

batch3 = {
    # ═══════════════ COURSERA — UNIVERSITY SPECIALIZATIONS ═══════════════
    "Applied Data Science Specialization University of Michigan": {
        "aliases": ["umich applied ds cert", "applied data science michigan coursera"],
        "skills": ["Python", "pandas", "NumPy", "Data Science", "Machine Learning", "Matplotlib"]
    },
    "IBM Applied DevOps Engineering Specialization": {
        "aliases": ["ibm applied devops cert", "ibm devops engineering coursera"],
        "skills": ["DevOps", "CI/CD", "Docker", "Kubernetes", "Test-Driven Development"]
    },
    "Google Cloud Fundamentals Core Infrastructure": {
        "aliases": ["gcp core infrastructure cert", "google cloud fundamentals coursera"],
        "skills": ["Google Cloud Platform", "Cloud Computing", "Kubernetes", "GCP Storage"]
    },
    "DevOps on AWS Specialization": {
        "aliases": ["aws devops specialization coursera", "devops aws cert"],
        "skills": ["Amazon Web Services", "DevOps", "CI/CD", "Infrastructure as Code"]
    },
    "Blockchain Specialization University at Buffalo": {
        "aliases": ["ub blockchain cert", "blockchain specialization coursera"],
        "skills": ["Blockchain", "Solidity", "Ethereum", "Smart Contracts", "Decentralized Applications"]
    },
    "Cybersecurity Specialization University of Maryland": {
        "aliases": ["umd cybersecurity cert", "cybersecurity specialization coursera umd"],
        "skills": ["Cybersecurity", "Cryptography", "Software Security", "Network Security"]
    },
    "Cloud Computing Specialization University of Illinois": {
        "aliases": ["uiuc cloud cert", "cloud computing specialization coursera"],
        "skills": ["Cloud Computing", "Distributed Systems", "MapReduce", "Kubernetes"]
    },
    "Algorithms Specialization Stanford": {
        "aliases": ["stanford algorithms cert", "algorithms stanford coursera"],
        "skills": ["Algorithms", "Data Structures", "Divide and Conquer", "Graph Algorithms"]
    },
    "Introduction to Mathematical Thinking Stanford": {
        "aliases": ["mathematical thinking cert stanford", "math thinking coursera"],
        "skills": ["Mathematical Reasoning", "Discrete Mathematics", "Logic"]
    },
    "Full Stack Web Development Hong Kong University": {
        "aliases": ["hkust full stack cert", "hong kong full stack coursera"],
        "skills": ["React", "Node.js", "MongoDB", "Bootstrap", "Angular"]
    },
    "Data Structures and Algorithms Specialization UC San Diego": {
        "aliases": ["ucsd dsa cert", "dsa specialization coursera ucsd"],
        "skills": ["Data Structures", "Algorithms", "Python", "Dynamic Programming", "Graph Algorithms"]
    },
    "Advanced Machine Learning Specialization HSE": {
        "aliases": ["hse ml cert", "advanced ml russia coursera", "yandex ml cert"],
        "skills": ["Machine Learning", "Deep Learning", "Python", "NLP", "Computer Vision"]
    },
    "Robotics Specialization University of Pennsylvania": {
        "aliases": ["upenn robotics cert", "robotics specialization coursera"],
        "skills": ["Robotics", "Computer Vision", "MATLAB", "Aerial Robotics", "Motion Planning"]
    },
    "Executive Data Science Johns Hopkins": {
        "aliases": ["jhu executive data science", "executive data science coursera"],
        "skills": ["Data Science", "Leadership", "Statistical Analysis", "Machine Learning"]
    },
    "Accounting Data Analytics Specialization": {
        "aliases": ["accounting analytics cert", "corporate finance analytics coursera"],
        "skills": ["Accounting", "Data Analysis", "Excel", "SQL", "Financial Analysis"]
    },
    # ═══════════════ ADOBE CERTIFICATIONS ═══════════════
    "Adobe Certified Expert Photoshop": {
        "aliases": ["ACE Photoshop", "adobe photoshop cert", "adobe certified photoshop expert"],
        "skills": ["Adobe Photoshop", "Photo Editing", "Graphic Design", "Retouching"]
    },
    "Adobe Certified Expert Illustrator": {
        "aliases": ["ACE Illustrator", "adobe illustrator cert", "adobe certified illustrator"],
        "skills": ["Adobe Illustrator", "Vector Graphics", "Graphic Design", "Logo Design"]
    },
    "Adobe Certified Expert InDesign": {
        "aliases": ["ACE InDesign", "adobe indesign cert"],
        "skills": ["Adobe InDesign", "Graphic Design", "Print Design", "Publishing"]
    },
    "Adobe Certified Expert Premiere Pro": {
        "aliases": ["ACE Premiere Pro", "adobe premiere cert", "adobe certified video editor"],
        "skills": ["Adobe Premiere Pro", "Video Editing", "Post Production", "Color Grading"]
    },
    "Adobe Certified Expert After Effects": {
        "aliases": ["ACE After Effects", "adobe after effects cert", "motion graphics cert"],
        "skills": ["Adobe After Effects", "Motion Design", "Visual Effects", "Animation"]
    },
    "Adobe XD Certified": {
        "aliases": ["adobe xd cert", "adobe certified xd"],
        "skills": ["Adobe XD", "User Experience", "Prototyping", "Wireframing"]
    },
    "Adobe Certified Expert Lightroom": {
        "aliases": ["ACE Lightroom", "adobe lightroom cert"],
        "skills": ["Adobe Lightroom", "Photography", "Photo Editing", "Color Correction"]
    },
    "Adobe Certified Instructor": {
        "aliases": ["ACI cert", "adobe certified instructor"],
        "skills": ["Graphic Design", "Teaching", "Adobe Creative Suite"]
    },
    "Adobe Substance 3D Certified": {
        "aliases": ["adobe substance cert", "substance 3d cert"],
        "skills": ["3D Design", "Texturing", "Adobe Substance 3D", "Game Design"]
    },
    # ═══════════════ APPLE DEVELOPER CERTIFICATIONS ═══════════════
    "Apple iOS App Development Certification": {
        "aliases": ["apple swift cert", "apple ios developer cert", "apple developer cert"],
        "skills": ["Swift", "iOS Development", "Xcode", "SwiftUI", "UIKit"]
    },
    "Apple macOS Developer Certification": {
        "aliases": ["apple macos cert", "macOS developer cert"],
        "skills": ["Swift", "macOS Development", "AppKit", "Xcode"]
    },
    "Apple Core ML Certification": {
        "aliases": ["apple coreml cert", "core ml developer cert"],
        "skills": ["Machine Learning", "Swift", "iOS Development", "On-Device AI"]
    },
    "Apple Teacher Certification": {
        "aliases": ["apple teacher cert", "apple teacher program"],
        "skills": ["Teaching", "Educational Technology", "iPad Education"]
    },
    # ═══════════════ CISCO DEVNET ═══════════════
    "Cisco DevNet Associate": {
        "aliases": ["devnet associate cert", "cisco devnet assoc", "200-901 cert"],
        "skills": ["Python", "REST API", "Network Automation", "Cisco Networking", "DevOps"]
    },
    "Cisco DevNet Professional": {
        "aliases": ["devnet professional cert", "cisco devnet pro cert"],
        "skills": ["Network Automation", "Python", "Ansible", "Git", "REST API", "Kubernetes"]
    },
    "Cisco DevNet Expert": {
        "aliases": ["devnet expert cert", "cisco devnet exp"],
        "skills": ["Network Automation", "Advanced Python", "Architecture Design", "CI/CD"]
    },
    "Cisco CyberOps Associate": {
        "aliases": ["cyberops associate cert", "cisco security ops cert", "200-201 cert"],
        "skills": ["Cybersecurity", "SIEM", "Threat Analysis", "Network Security"]
    },
    "Cisco CyberOps Professional": {
        "aliases": ["cyberops professional cert", "cisco security ops professional"],
        "skills": ["Cybersecurity", "Threat Hunting", "Incident Response", "SOAR"]
    },
    "Cisco CCNA 200-301": {
        "aliases": ["200-301 cert", "ccna 200-301 cert"],
        "skills": ["Cisco Networking", "Routing Protocols", "Switching", "Network Security", "Automation"]
    },
    # ═══════════════ MICROSOFT TECHNOLOGY ASSOCIATE ═══════════════
    "Microsoft Technology Associate Security": {
        "aliases": ["MTA security cert", "microsoft security fundamentals cert"],
        "skills": ["Cybersecurity", "Network Security", "Security Operations"]
    },
    "Microsoft Technology Associate Database": {
        "aliases": ["MTA database cert", "microsoft database fundamentals cert"],
        "skills": ["SQL Server", "Database Management", "SQL", "T-SQL"]
    },
    "Microsoft Technology Associate Networking": {
        "aliases": ["MTA networking cert", "microsoft networking fundamentals cert"],
        "skills": ["Network Engineering", "TCP/IP", "Subnetting"]
    },
    "Microsoft Technology Associate Software Development": {
        "aliases": ["MTA software cert", "microsoft software dev cert"],
        "skills": ["Programming", "C#", "JavaScript", "OOP"]
    },
    # ═══════════════ MONGO DB ═══════════════
    "MongoDB Certified Developer Associate": {
        "aliases": ["mongodb dev cert", "mongodb associate developer cert", "mdb dev cert"],
        "skills": ["MongoDB", "NoSQL", "CRUD Operations", "Aggregation Framework", "Python"]
    },
    "MongoDB Certified Database Administrator": {
        "aliases": ["mongodb dba cert", "mongodb admin cert", "mdb dba cert"],
        "skills": ["MongoDB", "Database Administration", "Replication", "Sharding"]
    },
    # ═══════════════ ELASTIC CERTIFICATIONS ═══════════════
    "Elastic Certified Analyst": {
        "aliases": ["elastic analyst cert", "elasticsearch analyst cert"],
        "skills": ["Elasticsearch", "Kibana", "Log Analysis", "Security Analytics"]
    },
    "Elastic Certified Observability Enginer": {
        "aliases": ["elastic observability cert", "elasticsearch observability"],
        "skills": ["Elasticsearch", "Kibana", "Monitoring", "APM", "Observability"]
    },
    # ═══════════════ DATABRICKS ═══════════════
    "Databricks Certified Machine Learning Professional": {
        "aliases": ["databricks ml professional cert", "databricks ml cert"],
        "skills": ["Machine Learning", "MLflow", "Apache Spark", "Databricks", "Python"]
    },
    "Databricks Certified Data Engineer Professional": {
        "aliases": ["databricks data engineer cert", "databricks de professional"],
        "skills": ["Data Engineering", "Apache Spark", "Delta Lake", "ETL", "Python"]
    },
    "Databricks Certified Generative AI Engineer": {
        "aliases": ["databricks genai cert", "databricks llm cert"],
        "skills": ["Generative AI", "Large Language Models", "LangChain", "Python"]
    },
    # ═══════════════ CONFLUENT / KAFKA ═══════════════
    "Confluent Certified Developer for Apache Kafka": {
        "aliases": ["confluent kafka dev cert", "kafka developer cert"],
        "skills": ["Apache Kafka", "Event Streaming", "Microservices", "Java", "Python"]
    },
    "Confluent Certified Administrator for Apache Kafka": {
        "aliases": ["confluent kafka admin cert", "kafka admin cert"],
        "skills": ["Apache Kafka", "Data Engineering", "Streaming Architecture"]
    },
    # ═══════════════ dbt (DATA BUILD TOOL) ═══════════════
    "dbt Analytics Engineering Certification": {
        "aliases": ["dbt cert", "analytics engineering cert", "dbt cloud cert"],
        "skills": ["dbt", "SQL", "Data Modeling", "Data Engineering", "Analytics Engineering"]
    },
    # ═══════════════ AWS SPECIALTY EXTRAS ═══════════════
    "AWS Certified IoT Specialty": {
        "aliases": ["aws iot cert", "aws iot specialty cert"],
        "skills": ["Internet of Things", "Amazon Web Services", "AWS IoT Core", "Edge Computing"]
    },
    "AWS Partner Sales Accreditation": {
        "aliases": ["aws partner sales cert", "aws sales cert"],
        "skills": ["Amazon Web Services", "Cloud Sales", "Cloud Computing"]
    },
    "AWS Well-Architected Framework": {
        "aliases": ["aws well architected cert", "aws waf certification"],
        "skills": ["Amazon Web Services", "Cloud Architecture", "Best Practices"]
    },
    # ═══════════════ MICROSOFT — DYNAMICS / POWER PLATFORM ═══════════════
    "Microsoft Certified Power Apps Developer": {
        "aliases": ["power apps cert", "ms power apps developer cert"],
        "skills": ["Power Apps", "Low-Code Development", "Microsoft 365", "Dataverse"]
    },
    "Microsoft Certified Power Automate RPA": {
        "aliases": ["power automate cert", "rpa power automate cert"],
        "skills": ["Power Automate", "Robotic Process Automation", "Automation", "Microsoft 365"]
    },
    "Dynamics 365 Field Service Functional Consultant": {
        "aliases": ["MB-240", "dynamics field service cert"],
        "skills": ["Microsoft Dynamics 365", "Field Service", "CRM", "IoT"]
    },
    "Dynamics 365 Customer Insights Data Specialist": {
        "aliases": ["MB-260", "dynamics customer insights cert"],
        "skills": ["Microsoft Dynamics 365", "Customer Data Platform", "Data Analysis"]
    },
    # ═══════════════ GENERATIVE AI & LLM CERTS ═══════════════
    "Google Generative AI Learning Path": {
        "aliases": ["google genai cert", "google ai learning badge", "generative ai google cert"],
        "skills": ["Generative AI", "Large Language Models", "Vertex AI", "Google Cloud Platform"]
    },
    "Coursera Generative AI for Everyone": {
        "aliases": ["genai for everyone cert", "andrew ng genai coursera"],
        "skills": ["Generative AI", "Prompt Engineering", "AI Ethics", "Large Language Models"]
    },
    "AWS Generative AI": {
        "aliases": ["aws gen ai cert", "aws generative ai learning badge"],
        "skills": ["Generative AI", "Amazon Bedrock", "Amazon Web Services", "Large Language Models"]
    },
    "Microsoft Generative AI Fundamentals": {
        "aliases": ["microsoft gen ai cert", "azure generative ai cert"],
        "skills": ["Generative AI", "Microsoft Azure", "Azure OpenAI", "Prompt Engineering"]
    },
    "Prompt Engineering for Developers": {
        "aliases": ["deeplearning prompt cert", "prompt eng developer cert"],
        "skills": ["Prompt Engineering", "OpenAI API", "Large Language Models", "Python"]
    },
    "Building LLM Applications with LangChain": {
        "aliases": ["langchain applications cert", "llm apps langchain cert"],
        "skills": ["LangChain", "Large Language Models", "Python", "Vector Databases"]
    },
    # ═══════════════ SCRUM.ORG EXTRA CERTS ═══════════════
    "Professional Agile Leadership": {
        "aliases": ["PAL cert", "scrum.org pal cert", "agile leadership scrum org"],
        "skills": ["Agile", "Leadership", "Scrum", "Organizational Change"]
    },
    "Professional Scrum with Kanban": {
        "aliases": ["PSK cert", "scrum kanban cert", "scrum.org psk"],
        "skills": ["Scrum", "Kanban", "Agile", "Flow Management"]
    },
    "Professional Scrum Developer": {
        "aliases": ["PSD cert", "scrum developer cert", "scrum.org psd"],
        "skills": ["Scrum", "Test-Driven Development", "Agile", "Software Engineering"]
    },
    # ═══════════════ DATA GOVERNANCE / CLOUD COMPLIANCE ═══════════════
    "Certified Data Governance Professional": {
        "aliases": ["CDGP cert", "data governance cert", "dataversity cert"],
        "skills": ["Data Governance", "Data Quality", "Metadata Management", "MDM"]
    },
    "Certified Information Privacy Manager": {
        "aliases": ["CIPM cert", "iapp cipm", "privacy manager cert"],
        "skills": ["Privacy Management", "GDPR", "Data Protection Program", "Compliance"]
    },
    "FedRAMP Certification": {
        "aliases": ["fedramp cert", "federal risk authorization cert"],
        "skills": ["Cloud Security", "Compliance", "Risk Management", "Government Cloud"]
    },
    "SOC 2 Auditor Certification": {
        "aliases": ["soc 2 cert", "soc auditor cert", "aicpa soc2"],
        "skills": ["Audit", "Compliance", "SaaS Security", "Risk Management"]
    },
    # ═══════════════ ERP / SAP EXTENDED ═══════════════
    "SAP Certified Solution Architect": {
        "aliases": ["sap solution architect cert", "sap technical architect cert"],
        "skills": ["SAP", "Enterprise Architecture", "SAP S/4HANA", "Integration Design"]
    },
    "Oracle Financial Cloud Certified Implementation Specialist": {
        "aliases": ["oracle financials cloud cert", "oracle erp cloud cert"],
        "skills": ["Oracle ERP", "Financial Management", "Oracle Cloud", "Accounting"]
    },
    "Microsoft Dynamics 365 Finance Functional Consultant": {
        "aliases": ["MB-310", "dynamics finance cert"],
        "skills": ["Microsoft Dynamics 365", "Finance", "ERP", "Accounting"]
    },
    "Epicor ERP Certified": {
        "aliases": ["epicor cert", "epicor erp cert"],
        "skills": ["Epicor ERP", "Manufacturing", "Supply Chain Management", "ERP"]
    },
    "Infor ERP Certified": {
        "aliases": ["infor cert", "infor erp cert"],
        "skills": ["Infor ERP", "Manufacturing", "Supply Chain Management"]
    },
    # ═══════════════ TESTING / QA ═══════════════
    "ISTQB Foundation Level": {
        "aliases": ["ISTQB FL", "istqb certified tester", "ctfl cert", "software testing cert istqb"],
        "skills": ["Software Testing", "Test Planning", "Bug Tracking", "QA Engineering"]
    },
    "ISTQB Advanced Level Test Manager": {
        "aliases": ["ISTQB TM", "istqb advanced cert", "ctal-tm cert"],
        "skills": ["Test Management", "QA Engineering", "Testing Strategy"]
    },
    "Agile Testing Certification": {
        "aliases": ["agile tester cert", "agile testing cert", "iist agile testing"],
        "skills": ["Agile Testing", "Test-Driven Development", "BDD", "Selenium"]
    },
    "Selenium WebDriver Certification": {
        "aliases": ["selenium cert", "selenium webdriver cert", "selenium testing cert"],
        "skills": ["Selenium", "Test Automation", "Java", "Python", "QA Engineering"]
    },
    "Postman API Fundamentals Expert": {
        "aliases": ["postman cert", "postman api cert", "api testing postman cert"],
        "skills": ["API Testing", "REST API", "Postman", "Software Testing"]
    },
    "Cypress Test Automation": {
        "aliases": ["cypress cert", "cypress automation cert"],
        "skills": ["Cypress", "Test Automation", "JavaScript", "End-to-End Testing"]
    },
    "Appium Mobile Testing": {
        "aliases": ["appium cert", "mobile testing appium cert"],
        "skills": ["Appium", "Mobile Testing", "Test Automation", "Java", "Python"]
    },
    "LoadRunner Performance Testing": {
        "aliases": ["loadrunner cert", "performance testing cert"],
        "skills": ["Performance Testing", "LoadRunner", "Load Testing", "QA Engineering"]
    },
    "JMeter Performance Testing": {
        "aliases": ["jmeter cert", "apache jmeter cert"],
        "skills": ["JMeter", "Performance Testing", "Load Testing"]
    },
    "CSTE Certified Software Test Engineer": {
        "aliases": ["CSTE cert", "software test engineer cert", "qai cste"],
        "skills": ["Software Testing", "QA Engineering", "Test Management"]
    },
    # ═══════════════ EXTRA TECH ONLINE PLATFORMS ═══════════════
    "Scrimba Frontend Developer Career Path": {
        "aliases": ["scrimba frontend cert", "scrimba career path cert"],
        "skills": ["React", "JavaScript", "HTML5", "CSS3", "TypeScript"]
    },
    "The Odin Project Full Stack": {
        "aliases": ["odin project cert", "odin project full stack"],
        "skills": ["HTML5", "CSS3", "JavaScript", "Ruby on Rails", "Node.js", "Git"]
    },
    "TestDome Programming Test": {
        "aliases": ["testdome cert", "testdome developer test"],
        "skills": ["Programming", "Algorithms", "SQL", "Data Structures"]
    },
    "Codility Developer Certificate": {
        "aliases": ["codility cert", "codility gold cert"],
        "skills": ["Algorithms", "Data Structures", "Coding", "Problem Solving"]
    },
    "LeetCode Certificate of Completion": {
        "aliases": ["leetcode cert", "leetcode study plan cert"],
        "skills": ["Algorithms", "Data Structures", "Coding Interviews", "Dynamic Programming"]
    },
    "AlgoExpert Certificate": {
        "aliases": ["algoexpert cert", "algo expert cert"],
        "skills": ["Algorithms", "Data Structures", "Coding Interviews", "System Design"]
    },
    "Exercism Proficiency": {
        "aliases": ["exercism cert", "exercism track completion"],
        "skills": ["Programming", "Python", "JavaScript", "Go", "Rust", "Functional Programming"]
    },
    "CodeSignal General Coding Score": {
        "aliases": ["codesignal skill cert", "codesignal assessment cert"],
        "skills": ["Programming", "Algorithms", "Data Structures"]
    },
    "Qualified.io Developer Assessment": {
        "aliases": ["qualified io cert", "developer assessment qualify"],
        "skills": ["Programming", "JavaScript", "Python", "Algorithms"]
    },
    # ═══════════════ SOFT SKILLS AND LEADERSHIP ═══════════════
    "Emotional Intelligence Certification": {
        "aliases": ["EQ cert", "emotional intelligence cert", "eq practitioner cert"],
        "skills": ["Emotional Intelligence", "Leadership", "Communication", "Team Management"]
    },
    "Certified Business Coach": {
        "aliases": ["CBC cert", "business coach cert", "ICF coaching cert"],
        "skills": ["Coaching", "Leadership", "Business Strategy", "Communication"]
    },
    "Executive Coaching Certification": {
        "aliases": ["executive coach cert", "icf pcc cert", "coaching cert icf"],
        "skills": ["Executive Coaching", "Leadership", "Organizational Development"]
    },
    "Design Thinking Certificate": {
        "aliases": ["IDEO design thinking cert", "stanford d.school cert", "design thinking online cert"],
        "skills": ["Design Thinking", "Innovation", "User Research", "Prototyping"]
    },
    "Certified NLP Practitioner": {
        "aliases": ["NLP practitioner cert", "neuro linguistic programming cert"],
        "skills": ["Communication", "Coaching", "Behavioral Psychology", "Leadership"]
    },
    "Diversity Equity Inclusion Certification": {
        "aliases": ["DEI cert", "diversity equity inclusion cert", "dei professional cert"],
        "skills": ["Diversity Management", "HR Management", "Organizational Behavior"]
    },
    # ═══════════════ BOOKKEEPING / ACCOUNTING ONLINE ═══════════════
    "QuickBooks ProAdvisor Certification": {
        "aliases": ["quickbooks cert", "intuit quickbooks cert", "qbo proadvisor"],
        "skills": ["QuickBooks", "Accounting", "Bookkeeping", "Financial Reporting"]
    },
    "Xero Advisor Certification": {
        "aliases": ["xero cert", "xero partner cert", "xero advisor cert"],
        "skills": ["Xero", "Accounting", "Bookkeeping", "Cloud Accounting"]
    },
    "Tally Certification": {
        "aliases": ["tally erp cert", "tally prime cert", "tally certified", "tally gst cert"],
        "skills": ["Tally ERP", "Accounting", "GST", "Financial Reporting", "Bookkeeping"]
    },
    "BUSY Accounting Software Certification": {
        "aliases": ["busy software cert", "busy accounting cert"],
        "skills": ["Accounting", "GST", "Financial Reporting", "Bookkeeping"]
    },
    # ═══════════════ INDIAN COMPETITIVE EXAM / GOVT CERT ═══════════════
    "NIELIT A Level Certification": {
        "aliases": ["nielit a level cert", "doeacc a level cert", "a level nielit"],
        "skills": ["Programming", "System Analysis", "Database Management", "Networking"]
    },
    "NIELIT B Level Certification": {
        "aliases": ["nielit b level cert", "doeacc b level cert"],
        "skills": ["Software Engineering", "Data Structures", "Advanced Programming"]
    },
    "NIELIT O Level Certification": {
        "aliases": ["nielit o level cert", "doeacc o level", "o level computer cert"],
        "skills": ["IT Fundamentals", "Programming", "Web Design", "Word Processing"]
    },
    "NASSCOM FutureSkills Certification": {
        "aliases": ["nasscom cert", "nasscom ai ml cert", "futureskills cert india"],
        "skills": ["Artificial Intelligence", "Machine Learning", "Data Science", "Cybersecurity"]
    },
    "Digital India Programme Certificate": {
        "aliases": ["digital india cert", "pmgdisha cert"],
        "skills": ["Digital Literacy", "MS Office", "Internet Basics"]
    },
    "Railway RITES Certification": {
        "aliases": ["rites cert", "railway technical cert"],
        "skills": ["Civil Engineering", "Project Management", "Infrastructure Development"]
    },
    # ═══════════════ MECHANICAL / MANUFACTURING EXTRA ═══════════════
    "GD&T Certification": {
        "aliases": ["gdt cert", "geometric dimensioning tolerancing cert", "asme y14.5 cert"],
        "skills": ["GD&T", "Mechanical Drawing", "Manufacturing Engineering", "Quality Control"]
    },
    "Lean Six Sigma Black Belt": {
        "aliases": ["LSSBB cert", "lean six sigma bb cert", "lean bb cert"],
        "skills": ["Lean Manufacturing", "Six Sigma", "Process Improvement", "Statistical Analysis"]
    },
    "Certified Maintenance & Reliability Professional": {
        "aliases": ["CMRP cert", "smrp cmrp", "maintenance reliability cert"],
        "skills": ["Maintenance Engineering", "Reliability Engineering", "TPM", "CMMS"]
    },
    "Certified Welding Inspector": {
        "aliases": ["CWI cert", "aws cwi", "welding inspector cert"],
        "skills": ["Welding", "Quality Control", "Non-Destructive Testing", "Manufacturing"]
    },
    "NDT Level 1 2 Certification": {
        "aliases": ["ndt cert", "non destructive testing cert", "asnt ndt cert"],
        "skills": ["Non-Destructive Testing", "NDT", "Quality Control", "Manufacturing"]
    },
    # ═══════════════ ENVIRONMENTAL / SAFETY EXTRA ═══════════════
    "Certified Safety Professional": {
        "aliases": ["CSP cert", "bcsp csp", "safety professional cert"],
        "skills": ["OSHA", "EHS", "Safety Management", "Risk Assessment"]
    },
    "Associate Safety Professional": {
        "aliases": ["ASP cert", "bcsp asp", "associate safety cert"],
        "skills": ["Workplace Safety", "EHS", "Risk Management"]
    },
    "OSHA Hazwoper Certification": {
        "aliases": ["hazwoper cert", "osha 29 cfr cert", "hazardous waste cert"],
        "skills": ["Hazardous Materials", "EHS", "Emergency Response"]
    },
    "Environmental Health Safety Manager": {
        "aliases": ["EHS manager cert", "environmental manager cert"],
        "skills": ["EHS", "Environmental Management", "Safety Management", "Compliance"]
    },
    # ═══════════════ PROJECT MANAGEMENT EXTRA ═══════════════
    "IPMA Level C D Certification": {
        "aliases": ["IPMA cert", "international pm cert", "ipma level c d"],
        "skills": ["Project Management", "Stakeholder Management", "Risk Management"]
    },
    "AIPM Certified Practicing Project Manager": {
        "aliases": ["CPPM cert", "aipm cert", "australian pm cert"],
        "skills": ["Project Management", "Agile", "Risk Management"]
    },
    "Earned Value Management Certification": {
        "aliases": ["EVM cert", "aacei evm cert"],
        "skills": ["Project Management", "Cost Management", "Schedule Management", "Earned Value"]
    },
    "Certified Associate in Project Management CAPM": {
        "aliases": ["capm pmi cert", "pmi entry cert", "project management entry cert"],
        "skills": ["Project Management", "Scheduling", "Risk Management", "Stakeholder Management"]
    },
    # ═══════════════ WEB3 / BLOCKCHAIN EXTRA ═══════════════
    "Certified Web3 Developer": {
        "aliases": ["web3 developer cert", "w3d cert"],
        "skills": ["Blockchain", "Ethereum", "Solidity", "Web3.js", "DeFi"]
    },
    "CoinMarketCap Crypto Fundamentals": {
        "aliases": ["cmc learn cert", "crypto fundamentals cert", "coinmarketcap cert"],
        "skills": ["Cryptocurrency", "Blockchain", "DeFi", "NFT"]
    },
    "Binance Academy Certificate": {
        "aliases": ["binance cert", "binance academy cert", "crypto trading cert"],
        "skills": ["Cryptocurrency", "Trading", "Blockchain", "DeFi"]
    },
    # ═══════════════ MICROSOFT GITHUB ═══════════════
    "GitHub Certified Engineer": {
        "aliases": ["github cert", "github professional cert", "github skills cert"],
        "skills": ["Git", "GitHub", "Version Control", "Collaboration", "CI/CD"]
    },

}

# Merge
for cert_name, data in batch3.items():
    if cert_name in certs:
        ea = {a.lower() for a in certs[cert_name].get("aliases", [])}
        for a in data.get("aliases", []):
            if a.lower() not in ea:
                certs[cert_name]["aliases"].append(a)
                ea.add(a.lower())
        es = set(certs[cert_name].get("skills", []))
        for s in data.get("skills", []):
            es.add(s)
        certs[cert_name]["skills"] = list(es)
    else:
        certs[cert_name] = data

with open("certificates_list.json", "w") as f:
    json.dump(certs, f, indent=2)

t = len(certs)
ta = sum(len(v.get("aliases", [])) for v in certs.values())
ts = sum(len(v.get("skills", [])) for v in certs.values())
print(f"BATCH 3 DONE — Total certs: {t} | Aliases: {ta} | Skills: {ts} | Grand total: {t+ta+ts}")
