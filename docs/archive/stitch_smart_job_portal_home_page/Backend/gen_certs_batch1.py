import json

with open("certificates_list.json", "r") as f:
    certs = json.load(f)

batch1 = {
    # ═══════════════ COURSERA — GOOGLE CERTIFICATES ═══════════════
    "Google IT Support Professional Certificate": {
        "aliases": ["google it support cert", "coursera google it support", "google it professional coursera", "it support google cert"],
        "skills": ["IT Support", "Networking", "Linux", "System Administration", "Cybersecurity"]
    },
    "Google IT Automation with Python Certificate": {
        "aliases": ["google python automation cert", "coursera google python", "it automation python google"],
        "skills": ["Python", "Scripting", "Automation", "Linux", "Cloud Computing"]
    },
    "Google Project Management Certificate": {
        "aliases": ["google pm cert", "coursera google project management", "google project manager cert"],
        "skills": ["Project Management", "Agile", "Scrum", "Stakeholder Management", "Risk Management"]
    },
    "Google Data Analytics Professional Certificate": {
        "aliases": ["google data analytics cert", "coursera google data analytics", "google data cert"],
        "skills": ["Data Analysis", "SQL", "R", "Tableau", "Data Visualization", "Google Analytics"]
    },
    "Google Business Intelligence Certificate": {
        "aliases": ["google bi cert", "coursera google bi", "google business intelligence"],
        "skills": ["Business Intelligence", "Looker", "SQL", "Data Warehousing", "Dashboards"]
    },
    "Google Advanced Data Analytics Certificate": {
        "aliases": ["google advanced data cert", "coursera google advanced analytics"],
        "skills": ["Python", "Machine Learning", "Statistical Analysis", "Data Science", "Regression"]
    },
    "Google Cybersecurity Certificate": {
        "aliases": ["google cybersecurity cert", "coursera google cybersecurity", "google security cert"],
        "skills": ["Cybersecurity", "SIEM", "Network Security", "Linux", "Python", "SQL"]
    },
    "Google UX Design Professional Certificate": {
        "aliases": ["google ux cert", "coursera google ux design", "google ux design professional"],
        "skills": ["User Experience", "Wireframing", "Figma", "Prototyping", "User Research"]
    },
    "Google Digital Marketing & E-commerce Certificate": {
        "aliases": ["google digital marketing cert coursera", "google ecommerce cert", "google marketing cert"],
        "skills": ["Digital Marketing", "SEO", "E-Commerce", "Google Analytics", "Email Marketing"]
    },
    # ═══════════════ COURSERA — META CERTIFICATES ═══════════════
    "Meta Front-End Developer Professional Certificate": {
        "aliases": ["meta frontend cert coursera", "meta frontend developer cert", "facebook frontend cert"],
        "skills": ["React", "HTML5", "CSS3", "JavaScript", "Git", "UI Design"]
    },
    "Meta Back-End Developer Professional Certificate": {
        "aliases": ["meta backend cert coursera", "meta backend developer cert"],
        "skills": ["Python", "Django", "REST API", "MySQL", "APIs", "Version Control"]
    },
    "Meta Database Engineer Professional Certificate": {
        "aliases": ["meta database cert", "meta db engineer cert coursera"],
        "skills": ["MySQL", "SQL", "Database Design", "Python", "Django"]
    },
    "Meta iOS Developer Professional Certificate": {
        "aliases": ["meta ios cert", "ios developer coursera meta"],
        "skills": ["Swift", "iOS Development", "Xcode", "UIKit", "SwiftUI"]
    },
    "Meta Android Developer Professional Certificate": {
        "aliases": ["meta android cert", "android developer coursera meta"],
        "skills": ["Android Development", "Kotlin", "Android Studio", "REST APIs"]
    },
    "Meta Social Media Marketing Certificate": {
        "aliases": ["meta social media cert", "meta social marketing coursera"],
        "skills": ["Social Media Marketing", "Facebook Advertising", "Instagram Marketing", "Content Creation"]
    },
    "Meta Marketing Analytics Certificate": {
        "aliases": ["meta analytics cert", "meta marketing analytics coursera"],
        "skills": ["Marketing Analytics", "Data Analysis", "Facebook Ads", "A/B Testing"]
    },
    # ═══════════════ COURSERA — IBM CERTIFICATES ═══════════════
    "IBM Data Science Professional Certificate": {
        "aliases": ["ibm data science cert", "ibm data science coursera", "ibm ds cert"],
        "skills": ["Data Science", "Python", "Machine Learning", "SQL", "Jupyter Notebook", "Pandas"]
    },
    "IBM AI Engineering Professional Certificate": {
        "aliases": ["ibm ai engineering cert coursera", "ibm ai cert"],
        "skills": ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras"]
    },
    "IBM Full Stack Software Developer Certificate": {
        "aliases": ["ibm full stack cert coursera", "ibm full stack developer cert"],
        "skills": ["React", "Node.js", "Python", "Docker", "Kubernetes", "Cloud Computing"]
    },
    "IBM DevOps and Software Engineering Certificate": {
        "aliases": ["ibm devops cert", "ibm devops coursera"],
        "skills": ["DevOps", "CI/CD", "Docker", "Kubernetes", "Agile", "TDD"]
    },
    "IBM Data Analyst Professional Certificate": {
        "aliases": ["ibm data analyst cert", "ibm data analyst coursera"],
        "skills": ["Data Analysis", "Python", "SQL", "Excel", "IBM Cognos", "Visualization"]
    },
    "IBM Data Engineering Professional Certificate": {
        "aliases": ["ibm data engineer cert", "ibm de cert coursera"],
        "skills": ["Data Engineering", "SQL", "NoSQL", "Apache Spark", "Kafka", "ETL"]
    },
    "IBM Machine Learning Professional Certificate": {
        "aliases": ["ibm ml cert", "ibm machine learning coursera"],
        "skills": ["Machine Learning", "Scikit-learn", "Python", "Regression", "Clustering"]
    },
    "IBM Applied AI Professional Certificate": {
        "aliases": ["ibm applied ai cert", "ibm ai coursera"],
        "skills": ["Artificial Intelligence", "Machine Learning", "Watson AI", "Python"]
    },
    "IBM Cybersecurity Analyst Professional Certificate": {
        "aliases": ["ibm cybersecurity cert", "ibm security analyst coursera"],
        "skills": ["Cybersecurity", "SIEM", "Threat Detection", "Penetration Testing", "Compliance"]
    },
    "IBM Project Manager Professional Certificate": {
        "aliases": ["ibm pm cert", "ibm project manager coursera"],
        "skills": ["Project Management", "Agile", "Scrum", "Stakeholder Management"]
    },
    # ═══════════════ COURSERA — DEEPLEARNING.AI ═══════════════
    "Deep Learning Specialization": {
        "aliases": ["deeplearning.ai specialization", "andrew ng deep learning", "dl specialization coursera"],
        "skills": ["Deep Learning", "Neural Networks", "TensorFlow", "Python", "Convolutional Neural Networks"]
    },
    "DeepLearning.AI TensorFlow Developer Certificate": {
        "aliases": ["tensorflow developer cert", "deeplearning tensorflow cert", "andrew ng tensorflow"],
        "skills": ["TensorFlow", "Deep Learning", "Computer Vision", "NLP", "Python"]
    },
    "Machine Learning Specialization Andrew Ng": {
        "aliases": ["andrew ng ml coursera", "machine learning coursera stanford", "ml specialization coursera"],
        "skills": ["Machine Learning", "Python", "Supervised Learning", "Unsupervised Learning", "Neural Networks"]
    },
    "Natural Language Processing Specialization": {
        "aliases": ["deeplearning nlp cert", "nlp specialization coursera"],
        "skills": ["Natural Language Processing", "Deep Learning", "Transformers", "BERT", "Python"]
    },
    "MLOps Specialization": {
        "aliases": ["deeplearning mlops cert", "mlops coursera", "machine learning operations cert"],
        "skills": ["MLOps", "Machine Learning", "Docker", "Kubernetes", "Model Deployment"]
    },
    "AI for Everyone Andrew Ng": {
        "aliases": ["ai for everyone cert", "andrew ng ai course", "ai everyone coursera"],
        "skills": ["Artificial Intelligence", "AI Strategy", "AI Ethics", "Business Applications of AI"]
    },
    "Generative AI with Large Language Models": {
        "aliases": ["llm coursera cert", "generative ai coursera", "deeplearning llm cert"],
        "skills": ["Large Language Models", "Generative AI", "Transformer Models", "Fine-Tuning LLMs"]
    },
    "Prompt Engineering for ChatGPT": {
        "aliases": ["prompt engineering cert", "chatgpt prompt cert", "vanderbilt prompt eng"],
        "skills": ["Prompt Engineering", "OpenAI API", "Large Language Models", "Generative AI"]
    },
    # ═══════════════ COURSERA — JOHNS HOPKINS ═══════════════
    "Data Science Specialization Johns Hopkins": {
        "aliases": ["jhu data science cert", "johns hopkins data science coursera", "jhu ds specialization"],
        "skills": ["Data Science", "R", "Statistical Analysis", "Machine Learning", "Shiny"]
    },
    "Genomic Data Science Specialization": {
        "aliases": ["genomics coursera cert", "jhu genomics cert", "bioinformatics cert"],
        "skills": ["Bioinformatics", "Genomics", "R", "Python", "Statistical Analysis"]
    },
    "Epidemiology Specialization Johns Hopkins": {
        "aliases": ["epidemiology cert coursera", "jhu epidemiology cert"],
        "skills": ["Epidemiology", "Public Health", "Statistics", "Research Methods"]
    },
    # ═══════════════ COURSERA — STANFORD / DUKE / MICHIGAN ═══════════════
    "Stanford Machine Learning Specialization": {
        "aliases": ["stanford ml cert", "stanford coursera ml", "andrew ng stanford cert"],
        "skills": ["Machine Learning", "Python", "Neural Networks", "Supervised Learning"]
    },
    "Python for Everybody Specialization Michigan": {
        "aliases": ["python for everybody cert", "umich python coursera", "dr chuck python cert"],
        "skills": ["Python", "Web Scraping", "SQL", "Data Structures"]
    },
    "Django for Everybody Specialization": {
        "aliases": ["django for everybody cert", "umich django coursera"],
        "skills": ["Django", "Python", "Web Development", "REST API", "SQL"]
    },
    "Web Design for Everybody Michigan": {
        "aliases": ["web design cert coursera", "umich web cert", "web design everybody"],
        "skills": ["HTML5", "CSS3", "JavaScript", "Bootstrap", "Web Design"]
    },
    "Duke Data Science for Business": {
        "aliases": ["duke data science cert", "data science business coursera duke"],
        "skills": ["Data Science", "R", "Business Analytics", "Statistical Analysis"]
    },
    "Biostatistics Specialization Johns Hopkins": {
        "aliases": ["biostatistics cert coursera", "jhu biostatistics"],
        "skills": ["Statistics", "R", "Public Health", "Research Methods"]
    },
    # ═══════════════ COURSERA — CLOUD / TECH SPECIALIZATIONS ═══════════════
    "Cloud Engineering with Google Cloud Specialization": {
        "aliases": ["gcp cloud engineer coursera", "google cloud engineering cert"],
        "skills": ["Google Cloud Platform", "Kubernetes", "Cloud Architecture", "DevOps"]
    },
    "Preparing for Google Cloud Architect Exam": {
        "aliases": ["gcp architect prep cert", "google cloud architect coursera"],
        "skills": ["Google Cloud Platform", "Cloud Architecture", "BigQuery"]
    },
    "IBM Cloud Computing Fundamentals": {
        "aliases": ["ibm cloud cert", "cloud computing ibm coursera"],
        "skills": ["Cloud Computing", "IBM Cloud", "DevOps", "Microservices"]
    },
    "AWS Fundamentals Specialization": {
        "aliases": ["aws fundamentals coursera", "aws specialization coursera", "amazon aws cert coursera"],
        "skills": ["Amazon Web Services", "Cloud Computing", "AWS EC2", "AWS S3"]
    },
    "Building Cloud Services with Java Spring": {
        "aliases": ["spring cloud cert", "spring coursera cert"],
        "skills": ["Java", "Spring Boot", "Cloud Computing", "Microservices", "REST API"]
    },
    # ═══════════════ edX CERTIFICATIONS ═══════════════
    "MicroMasters in Data Science": {
        "aliases": ["edx data science micromasters", "columbia data science edx", "micromasters ds cert"],
        "skills": ["Data Science", "Python", "Machine Learning", "Statistical Analysis"]
    },
    "MicroMasters in Artificial Intelligence": {
        "aliases": ["edx ai micromasters", "columbia ai edx"],
        "skills": ["Artificial Intelligence", "Machine Learning", "Python", "Deep Learning"]
    },
    "MicroMasters in Cybersecurity": {
        "aliases": ["edx cybersecurity micromasters", "rit cybersecurity edx"],
        "skills": ["Cybersecurity", "Network Security", "Penetration Testing", "Cryptography"]
    },
    "MicroMasters in Cloud Computing": {
        "aliases": ["edx cloud computing micromasters", "usmx cloud cert ed"],
        "skills": ["Cloud Computing", "Amazon Web Services", "Cloud Architecture"]
    },
    "MicroMasters in Business Analytics": {
        "aliases": ["edx business analytics micromasters", "columbia business analytics edx"],
        "skills": ["Business Analytics", "Data Science", "SQL", "Statistical Analysis"]
    },
    "MicroMasters in Supply Chain Management": {
        "aliases": ["edx supply chain micromasters", "mit supply chain edx"],
        "skills": ["Supply Chain Management", "Logistics", "Operations Management"]
    },
    "Professional Certificate in Data Science HarvardX": {
        "aliases": ["harvard data science cert", "harvardx ds cert", "edx harvard data science"],
        "skills": ["R", "Data Science", "Machine Learning", "Visualization", "Statistics"]
    },
    "MIT MicroMasters in Statistics and Data Science": {
        "aliases": ["mit data science micromasters", "mit statistics edx"],
        "skills": ["Statistics", "Data Science", "Machine Learning", "R", "Python"]
    },
    "Professional Certificate in Computer Science for Artificial Intelligence": {
        "aliases": ["harvardx cs50 ai cert", "cs50 artificial intelligence edx"],
        "skills": ["Artificial Intelligence", "Machine Learning", "Python", "Algorithms"]
    },
    "CS50 Introduction to Computer Science Harvard": {
        "aliases": ["cs50 cert", "cs50x cert", "harvard cs50 certificate", "cs50 harvard edx"],
        "skills": ["C Programming", "Python", "Web Development", "Algorithms", "Data Structures"]
    },
    "CS50 Python Harvard": {
        "aliases": ["cs50p cert", "cs50 python cert", "harvard python cert"],
        "skills": ["Python", "Object Oriented Programming", "File I/O", "Libraries"]
    },
    "CS50 Web Programming Harvard": {
        "aliases": ["cs50w cert", "cs50 web cert", "harvard web programming cert"],
        "skills": ["Django", "JavaScript", "HTML5", "CSS3", "SQL", "Git"]
    },
    "Microsoft Professional Program Data Science": {
        "aliases": ["microsoft edx data science", "mpp data science cert"],
        "skills": ["Data Science", "Python", "R", "Machine Learning", "Azure"]
    },
    # ═══════════════ AWS TRAINING & CERTIFICATIONS ═══════════════
    "AWS Academy Cloud Foundations": {
        "aliases": ["aws academy foundations", "aws academy cert", "aws school cert"],
        "skills": ["Amazon Web Services", "Cloud Computing", "AWS Services"]
    },
    "AWS Academy Machine Learning Foundations": {
        "aliases": ["aws academy ml cert", "aws ml foundations"],
        "skills": ["Machine Learning", "Amazon Web Services", "SageMaker"]
    },
    "AWS Academy Cloud Developing": {
        "aliases": ["aws academy dev cert", "aws cloud developer training"],
        "skills": ["Amazon Web Services", "Python", "AWS SDK", "Lambda", "DynamoDB"]
    },
    "AWS Academy Cloud Architecting": {
        "aliases": ["aws academy architect", "aws cloud architect training"],
        "skills": ["Amazon Web Services", "Cloud Architecture", "AWS VPC", "AWS EC2"]
    },
    "AWS Academy Data Engineering": {
        "aliases": ["aws academy data eng", "aws data engineering training"],
        "skills": ["Data Engineering", "Amazon Web Services", "AWS Glue", "S3", "Redshift"]
    },
    "AWS Skillbuilder Cloud Practitioner": {
        "aliases": ["aws skill builder cert", "aws online training cert"],
        "skills": ["Amazon Web Services", "Cloud Computing"]
    },
    # ═══════════════ LINKEDIN LEARNING ═══════════════
    "LinkedIn Learning Web Development Cert": {
        "aliases": ["linkedin web dev cert", "lynda web development cert"],
        "skills": ["HTML5", "CSS3", "JavaScript", "React", "Web Development"]
    },
    "LinkedIn Learning Python Essential Training": {
        "aliases": ["linkedin python cert", "lynda python cert"],
        "skills": ["Python", "Programming", "Scripting"]
    },
    "LinkedIn Learning Data Science": {
        "aliases": ["linkedin data science cert", "lynda data science cert"],
        "skills": ["Data Science", "Python", "SQL", "Machine Learning"]
    },
    "LinkedIn Learning Project Management": {
        "aliases": ["linkedin pm cert", "lynda project management cert"],
        "skills": ["Project Management", "Agile", "Scrum", "Leadership"]
    },
    "LinkedIn Learning Machine Learning": {
        "aliases": ["linkedin ml cert", "linkedin machine learning cert"],
        "skills": ["Machine Learning", "Python", "Scikit-learn", "Neural Networks"]
    },
    "LinkedIn Learning Cybersecurity": {
        "aliases": ["linkedin cybersecurity cert", "linkedin security cert"],
        "skills": ["Cybersecurity", "Network Security", "Ethical Hacking"]
    },
    "LinkedIn Learning Java": {
        "aliases": ["linkedin java cert", "lynda java cert"],
        "skills": ["Java", "OOP", "Spring Boot", "Maven"]
    },
    "LinkedIn Learning Excel": {
        "aliases": ["linkedin excel cert", "lynda excel cert", "linkedin excel training"],
        "skills": ["Microsoft Excel", "Data Analysis", "Formulas", "Pivot Tables"]
    },
    "LinkedIn Learning SQL": {
        "aliases": ["linkedin sql cert", "lynda sql cert"],
        "skills": ["SQL", "Database Management", "Queries"]
    },
    "LinkedIn Learning Digital Marketing": {
        "aliases": ["linkedin digital marketing cert", "lynda digital marketing cert"],
        "skills": ["Digital Marketing", "SEO", "Content Marketing", "Social Media Marketing"]
    },
    "LinkedIn Learning Leadership and Management": {
        "aliases": ["linkedin management cert", "linkedin leadership cert"],
        "skills": ["Leadership", "Team Management", "Organizational Behavior", "Communication"]
    },
    "LinkedIn Learning Graphic Design": {
        "aliases": ["linkedin graphic design cert", "linkedin design cert"],
        "skills": ["Graphic Design", "Adobe Photoshop", "Adobe Illustrator", "Typography"]
    },
    "LinkedIn Learning DevOps Foundations": {
        "aliases": ["linkedin devops cert", "linkedin devops foundations"],
        "skills": ["DevOps", "CI/CD", "Docker", "Jenkins"]
    },
    "LinkedIn Learning Cloud Computing": {
        "aliases": ["linkedin cloud cert", "linkedin cloud computing cert"],
        "skills": ["Cloud Computing", "Amazon Web Services", "Microsoft Azure", "Google Cloud Platform"]
    },
    # ═══════════════ UDEMY CERTIFICATIONS ═══════════════
    "The Complete Web Developer Bootcamp Udemy": {
        "aliases": ["udemy web developer bootcamp", "udemy web dev cert", "angela yu web dev", "complete web dev udemy"],
        "skills": ["HTML5", "CSS3", "JavaScript", "Node.js", "React", "MongoDB", "REST API"]
    },
    "The Complete JavaScript Course Udemy": {
        "aliases": ["udemy javascript cert", "jonas schmedtmann js", "complete javascript udemy"],
        "skills": ["JavaScript", "ES6", "OOP", "DOM Manipulation", "Async JavaScript"]
    },
    "The Complete Python Bootcamp Udemy": {
        "aliases": ["udemy python bootcamp", "python zero to hero udemy", "jose portilla python cert"],
        "skills": ["Python", "OOP", "Libraries", "Web Scraping", "Automation"]
    },
    "100 Days of Code Python Bootcamp Udemy": {
        "aliases": ["100 days python udemy", "angela yu python", "100 days of code cert"],
        "skills": ["Python", "Web Development", "Flask", "APIs", "Data Science", "Automation"]
    },
    "Machine Learning AZ Udemy": {
        "aliases": ["udemy ml az", "machine learning a to z udemy", "kirill eremenko ml cert"],
        "skills": ["Machine Learning", "Python", "R", "Scikit-learn", "Neural Networks"]
    },
    "Deep Learning AZ Udemy": {
        "aliases": ["udemy deep learning az", "deep learning a to z udemy", "kirill eremenko dl"],
        "skills": ["Deep Learning", "TensorFlow", "Keras", "Python", "Neural Networks"]
    },
    "The Complete React Developer Udemy": {
        "aliases": ["udemy react cert", "complete react developer udemy", "andrei neagoie react"],
        "skills": ["React", "JavaScript", "Redux", "Hooks", "REST APIs"]
    },
    "NodeJS The Complete Guide Udemy": {
        "aliases": ["udemy nodejs cert", "node complete guide udemy", "maximilian schwarzmuller node"],
        "skills": ["Node.js", "Express.js", "MongoDB", "REST API", "GraphQL"]
    },
    "React and Redux Udemy": {
        "aliases": ["udemy react redux cert", "stephen grider react redux cert"],
        "skills": ["React", "Redux", "JavaScript", "APIs"]
    },
    "The Complete SQL Bootcamp Udemy": {
        "aliases": ["udemy sql cert", "sql bootcamp udemy", "jose portilla sql cert"],
        "skills": ["SQL", "PostgreSQL", "Database Management", "Queries"]
    },
    "Django Rest Framework Udemy": {
        "aliases": ["udemy drf cert", "django rest udemy", "django api cert"],
        "skills": ["Django", "REST API", "Python", "Backend Development"]
    },
    "Docker and Kubernetes Udemy": {
        "aliases": ["udemy docker cert", "bret fisher docker udemy", "docker k8s udemy cert"],
        "skills": ["Docker", "Kubernetes", "DevOps", "Containerization"]
    },
    "AWS Certified Solutions Architect Udemy": {
        "aliases": ["udemy aws saa cert", "stephane maarek aws cert", "ryan kroonenburg aws udemy"],
        "skills": ["Amazon Web Services", "Cloud Architecture", "AWS EC2", "AWS S3"]
    },
    "Terraform on AWS Udemy": {
        "aliases": ["udemy terraform cert", "terraform aws udemy"],
        "skills": ["Terraform", "Infrastructure as Code", "Amazon Web Services"]
    },
    "The Git and GitHub Bootcamp Udemy": {
        "aliases": ["udemy git cert", "git bootcamp udemy", "colt steele git cert"],
        "skills": ["Git", "GitHub", "Version Control", "Collaboration"]
    },
    "Data Science and Machine Learning Bootcamp Udemy": {
        "aliases": ["udemy data science bootcamp", "data science udemy jose portilla"],
        "skills": ["Data Science", "Python", "Machine Learning", "Pandas", "NumPy"]
    },
    "Tableau Desktop Udemy": {
        "aliases": ["udemy tableau cert", "tableau udemy kirill"],
        "skills": ["Tableau", "Data Visualization", "Business Intelligence"]
    },
    "Power BI Desktop Udemy": {
        "aliases": ["udemy power bi cert", "power bi udemy"],
        "skills": ["Power BI", "DAX", "Business Intelligence", "Data Visualization"]
    },
    "The Complete Ethical Hacking Course Udemy": {
        "aliases": ["udemy hacking cert", "ethical hacking udemy", "complete ethical hacking udemy"],
        "skills": ["Penetration Testing", "Ethical Hacking", "Kali Linux", "Network Security"]
    },
    "Cybersecurity Bootcamp Udemy": {
        "aliases": ["udemy cybersecurity cert", "cybersecurity udemy bootcamp"],
        "skills": ["Cybersecurity", "Network Security", "Ethical Hacking", "SIEM"]
    },
    "iOS and Swift Bootcamp Udemy": {
        "aliases": ["udemy ios cert", "ios swift udemy", "angela yu ios cert"],
        "skills": ["iOS Development", "Swift", "Xcode", "UIKit", "SwiftUI"]
    },
    "Android Development Masterclass Udemy": {
        "aliases": ["udemy android cert", "android masterclass udemy", "tim buchalka android cert"],
        "skills": ["Android Development", "Kotlin", "Java", "Android Studio"]
    },
    "Flutter and Dart Udemy": {
        "aliases": ["udemy flutter cert", "flutter dart udemy", "angela yu flutter cert"],
        "skills": ["Flutter", "Dart", "Mobile Development", "Cross-Platform"]
    },
    "PHP Laravel Udemy": {
        "aliases": ["udemy laravel cert", "php laravel udemy cert"],
        "skills": ["PHP", "Laravel", "MySQL", "REST API", "Backend Development"]
    },
    "Spring Boot Microservices Udemy": {
        "aliases": ["udemy spring boot cert", "spring microservices udemy", "java spring udemy cert"],
        "skills": ["Spring Boot", "Java", "Microservices", "REST API", "Docker"]
    },
    "Rust Programming Udemy": {
        "aliases": ["udemy rust cert", "rust programming udemy"],
        "skills": ["Rust", "Systems Programming", "Memory Management"]
    },
    "Golang Udemy": {
        "aliases": ["udemy golang cert", "go programming udemy cert", "go lang udemy"],
        "skills": ["Golang", "Backend Development", "Microservices"]
    },
    "C++ Programming Udemy": {
        "aliases": ["udemy cpp cert", "c++ udemy cert", "beginning c++ programming udemy"],
        "skills": ["C++", "OOP", "Data Structures", "Systems Programming"]
    },
    "Unity Game Development Udemy": {
        "aliases": ["udemy unity cert", "unity 3d udemy cert", "game dev udemy"],
        "skills": ["Unity", "C#", "Game Development", "3D Modeling"]
    },
    "Unreal Engine Udemy": {
        "aliases": ["udemy unreal cert", "unreal engine ue udemy"],
        "skills": ["Unreal Engine", "C++", "Game Development", "3D Design"]
    },
    "Excel PowerPivot Udemy": {
        "aliases": ["udemy excel cert", "excel mastery udemy", "excel powerpivot udemy"],
        "skills": ["Microsoft Excel", "Power Pivot", "VBA", "Data Analysis"]
    },
    "SAP S4 HANA Udemy": {
        "aliases": ["udemy sap cert", "sap s4 udemy cert", "sap hana udemy"],
        "skills": ["SAP", "SAP HANA", "ERP", "SAP FICO"]
    },
    "Digital Marketing Masterclass Udemy": {
        "aliases": ["udemy digital marketing cert", "digital marketing masterclass udemy"],
        "skills": ["Digital Marketing", "SEO", "Google Ads", "Social Media Marketing", "Email Marketing"]
    },
    "Graphic Design Masterclass Udemy": {
        "aliases": ["udemy graphic design cert", "graphic design masterclass udemy"],
        "skills": ["Graphic Design", "Adobe Photoshop", "Adobe Illustrator", "Canva"]
    },
    # ═══════════════ CODECADEMY ═══════════════
    "Codecademy Full Stack Engineer Career Path": {
        "aliases": ["codecademy full stack cert", "codecademy full stack path", "cc full stack"],
        "skills": ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "SQL", "Git"]
    },
    "Codecademy Front End Engineer Career Path": {
        "aliases": ["codecademy frontend cert", "codecademy frontend path"],
        "skills": ["HTML5", "CSS3", "JavaScript", "React", "Responsive Design"]
    },
    "Codecademy Back End Engineer Career Path": {
        "aliases": ["codecademy backend cert", "codecademy backend path"],
        "skills": ["Node.js", "Express.js", "PostgreSQL", "REST API", "Authentication"]
    },
    "Codecademy Data Science Career Path": {
        "aliases": ["codecademy data science cert", "codecademy ds path"],
        "skills": ["Python", "Pandas", "NumPy", "Matplotlib", "SQL", "Machine Learning"]
    },
    "Codecademy Machine Learning AI Path": {
        "aliases": ["codecademy ml cert", "codecademy ai ml path"],
        "skills": ["Machine Learning", "Python", "Scikit-learn", "Deep Learning"]
    },
    "Codecademy Python 3 Course": {
        "aliases": ["codecademy python cert", "cc python cert", "codecademy learn python"],
        "skills": ["Python", "OOP", "Data Structures", "Scripting"]
    },
    "Codecademy Java Course": {
        "aliases": ["codecademy java cert", "cc java cert"],
        "skills": ["Java", "OOP", "Data Structures"]
    },
    "Codecademy JavaScript Course": {
        "aliases": ["codecademy js cert", "cc javascript cert"],
        "skills": ["JavaScript", "ES6", "DOM", "Async JavaScript"]
    },
    "Codecademy SQL Course": {
        "aliases": ["codecademy sql cert", "cc sql cert"],
        "skills": ["SQL", "Database Management", "Queries"]
    },
    "Codecademy Data Analysis with Python": {
        "aliases": ["codecademy data analysis cert", "cc data analysis python"],
        "skills": ["Python", "Pandas", "NumPy", "Data Analysis"]
    },
    "Codecademy Cybersecurity Path": {
        "aliases": ["codecademy cybersecurity cert", "cc cybersecurity path"],
        "skills": ["Cybersecurity", "Network Security", "Linux", "Python"]
    },
    "Codecademy DevOps Engineer Path": {
        "aliases": ["codecademy devops cert", "cc devops path"],
        "skills": ["DevOps", "Linux", "Docker", "CI/CD", "Bash"]
    },
    "Codecademy Kotlin Course": {
        "aliases": ["codecademy kotlin cert", "cc kotlin cert"],
        "skills": ["Kotlin", "Android Development", "OOP"]
    },
    "Codecademy Swift Course": {
        "aliases": ["codecademy swift cert", "cc swift cert"],
        "skills": ["Swift", "iOS Development", "OOP"]
    },
    "Codecademy Data Visualization with Python": {
        "aliases": ["codecademy data viz cert", "cc data visualization cert"],
        "skills": ["Python", "Matplotlib", "Seaborn", "Data Visualization"]
    },
    "Codecademy Web Scraping with Python": {
        "aliases": ["codecademy web scraping cert"],
        "skills": ["Python", "BeautifulSoup", "Selenium", "Web Scraping"]
    },
    # ═══════════════ FREECODECAMP ═══════════════
    "freeCodeCamp Responsive Web Design Certification": {
        "aliases": ["freecodecamp rwd cert", "fcc responsive web design", "freecodecamp html css cert"],
        "skills": ["HTML5", "CSS3", "Responsive Design", "Flexbox", "CSS Grid"]
    },
    "freeCodeCamp JavaScript Algorithms and Data Structures": {
        "aliases": ["freecodecamp js cert", "fcc js algorithms", "freecodecamp javascript cert"],
        "skills": ["JavaScript", "Algorithms", "Data Structures", "ES6"]
    },
    "freeCodeCamp Front End Development Libraries": {
        "aliases": ["freecodecamp frontend libraries cert", "fcc frontend cert"],
        "skills": ["React", "Redux", "Bootstrap", "jQuery", "SASS"]
    },
    "freeCodeCamp Data Visualization Certification": {
        "aliases": ["freecodecamp data viz cert", "fcc data visualization"],
        "skills": ["D3.js", "Data Visualization", "JavaScript", "SVG"]
    },
    "freeCodeCamp Back End Development and APIs": {
        "aliases": ["freecodecamp backend cert", "fcc backend cert", "freecodecamp apis cert"],
        "skills": ["Node.js", "Express.js", "MongoDB", "REST API", "JSON"]
    },
    "freeCodeCamp Quality Assurance Certification": {
        "aliases": ["freecodecamp qa cert", "fcc quality assurance"],
        "skills": ["Testing", "Chai", "Mocha", "Node.js", "Test-Driven Development"]
    },
    "freeCodeCamp Scientific Computing with Python": {
        "aliases": ["freecodecamp python cert", "fcc python cert", "fcc scientific computing"],
        "skills": ["Python", "Data Structures", "Algorithms", "OOP"]
    },
    "freeCodeCamp Data Analysis with Python": {
        "aliases": ["freecodecamp data analysis cert", "fcc data analysis python"],
        "skills": ["Python", "Pandas", "NumPy", "Matplotlib", "Data Analysis"]
    },
    "freeCodeCamp Machine Learning with Python": {
        "aliases": ["freecodecamp ml cert", "fcc machine learning python"],
        "skills": ["Machine Learning", "TensorFlow", "Python", "Neural Networks"]
    },
    "freeCodeCamp Relational Database Certification": {
        "aliases": ["freecodecamp sql cert", "fcc relational database", "freecodecamp postgresql cert"],
        "skills": ["SQL", "PostgreSQL", "Bash", "Linux"]
    },
    "freeCodeCamp Information Security Certification": {
        "aliases": ["freecodecamp security cert", "fcc information security"],
        "skills": ["Cybersecurity", "Cryptography", "Penetration Testing", "HelmetJS"]
    },
}

# Merge
for cert_name, data in batch1.items():
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
ta = sum(len(v.get("aliases",[])) for v in certs.values())
ts = sum(len(v.get("skills",[])) for v in certs.values())
print(f"BATCH 1 DONE — Total certs: {t} | Aliases: {ta} | Skills: {ts} | Grand total: {t+ta+ts}")
