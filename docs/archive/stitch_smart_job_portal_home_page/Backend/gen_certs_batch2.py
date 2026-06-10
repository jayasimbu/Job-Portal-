import json

with open("certificates_list.json", "r") as f:
    certs = json.load(f)

batch2 = {
    # ═══════════════ DATACAMP ═══════════════
    "DataCamp Data Scientist with Python Career Track": {
        "aliases": ["datacamp data scientist cert", "datacamp ds python track", "datacamp python ds"],
        "skills": ["Python", "Pandas", "NumPy", "Machine Learning", "Scikit-learn", "Data Science"]
    },
    "DataCamp Data Analyst with Python Career Track": {
        "aliases": ["datacamp data analyst cert", "datacamp da python track"],
        "skills": ["Python", "Pandas", "Matplotlib", "SQL", "Data Analysis"]
    },
    "DataCamp Data Analyst with SQL Career Track": {
        "aliases": ["datacamp sql cert", "datacamp sql analyst", "datacamp sql track"],
        "skills": ["SQL", "PostgreSQL", "Data Analysis", "Reporting"]
    },
    "DataCamp Data Engineer Career Track": {
        "aliases": ["datacamp data engineer cert", "datacamp de track"],
        "skills": ["Python", "SQL", "Apache Airflow", "ETL", "Data Engineering"]
    },
    "DataCamp Machine Learning Scientist Career Track": {
        "aliases": ["datacamp ml cert", "datacamp machine learning track"],
        "skills": ["Machine Learning", "Python", "Scikit-learn", "NLP", "Deep Learning"]
    },
    "DataCamp Data Scientist with R Career Track": {
        "aliases": ["datacamp r cert", "datacamp r data scientist"],
        "skills": ["R", "ggplot2", "Data Science", "Statistical Analysis", "Machine Learning"]
    },
    "DataCamp Python Programmer Career Track": {
        "aliases": ["datacamp python programmer cert", "datacamp python track"],
        "skills": ["Python", "OOP", "Testing", "Scripting"]
    },
    "DataCamp Statistician with R": {
        "aliases": ["datacamp statistician cert", "datacamp r statistician"],
        "skills": ["R", "Statistics", "Statistical Modeling", "Data Analysis"]
    },
    "DataCamp Tableau Fundamentals": {
        "aliases": ["datacamp tableau cert", "datacamp tableau fundamentals"],
        "skills": ["Tableau", "Data Visualization", "Business Intelligence"]
    },
    "DataCamp Power BI Fundamentals": {
        "aliases": ["datacamp power bi cert", "datacamp powerbi"],
        "skills": ["Power BI", "DAX", "Business Intelligence", "Data Visualization"]
    },
    "DataCamp Spark with Python": {
        "aliases": ["datacamp spark cert", "datacamp pyspark", "datacamp apache spark"],
        "skills": ["Apache Spark", "PySpark", "Big Data", "Python"]
    },
    "DataCamp Deep Learning with Python": {
        "aliases": ["datacamp deep learning cert", "datacamp dl cert"],
        "skills": ["Deep Learning", "PyTorch", "Keras", "Neural Networks", "Python"]
    },
    "DataCamp NLP in Python": {
        "aliases": ["datacamp nlp cert", "datacamp natural language processing"],
        "skills": ["NLP", "Python", "SpaCy", "NLTK", "Text Processing"]
    },
    "DataCamp Time Series Analysis": {
        "aliases": ["datacamp time series cert", "datacamp ts cert"],
        "skills": ["Time Series Analysis", "Python", "Statistics", "Forecasting"]
    },
    "DataCamp Data Visualization with Python": {
        "aliases": ["datacamp viz cert", "datacamp data visualization python"],
        "skills": ["Matplotlib", "Seaborn", "Plotly", "Python", "Data Visualization"]
    },
    "DataCamp Network Analysis with Python": {
        "aliases": ["datacamp network cert", "datacamp networkx cert"],
        "skills": ["Network Analysis", "Python", "NetworkX", "Graph Theory"]
    },
    "DataCamp AWS Cloud Technology Consultant": {
        "aliases": ["datacamp aws cert", "datacamp aws consultant"],
        "skills": ["Amazon Web Services", "Cloud Computing", "AWS Solutions"]
    },
    # ═══════════════ KAGGLE CERTIFICATIONS ═══════════════
    "Kaggle Python Certification": {
        "aliases": ["kaggle python cert", "kaggle learn python"],
        "skills": ["Python", "Data Science", "Pandas", "NumPy"]
    },
    "Kaggle Machine Learning Certification": {
        "aliases": ["kaggle ml cert", "kaggle learn machine learning"],
        "skills": ["Machine Learning", "Python", "Scikit-learn", "Decision Trees"]
    },
    "Kaggle Deep Learning Certification": {
        "aliases": ["kaggle dl cert", "kaggle learn deep learning"],
        "skills": ["Deep Learning", "TensorFlow", "Keras", "Python"]
    },
    "Kaggle Data Visualization Certification": {
        "aliases": ["kaggle data viz cert", "kaggle learn data visualization"],
        "skills": ["Data Visualization", "Python", "Seaborn", "Matplotlib"]
    },
    "Kaggle Pandas Certification": {
        "aliases": ["kaggle pandas cert", "kaggle learn pandas"],
        "skills": ["Pandas", "Data Analysis", "Python", "Data Manipulation"]
    },
    "Kaggle Feature Engineering Certification": {
        "aliases": ["kaggle feature eng cert", "kaggle learn feature engineering"],
        "skills": ["Feature Engineering", "Machine Learning", "Python", "Scikit-learn"]
    },
    "Kaggle SQL Certification": {
        "aliases": ["kaggle sql cert", "kaggle learn sql"],
        "skills": ["SQL", "BigQuery", "Database Management", "Queries"]
    },
    "Kaggle Intro to AI Ethics": {
        "aliases": ["kaggle ai ethics cert", "kaggle learn ethics"],
        "skills": ["AI Ethics", "Responsible AI", "Fairness", "Machine Learning"]
    },
    "Kaggle Geospatial Analysis Certification": {
        "aliases": ["kaggle geospatial cert", "kaggle learn geospatial"],
        "skills": ["Geospatial Analysis", "Python", "GIS", "Folium"]
    },
    "Kaggle Natural Language Processing": {
        "aliases": ["kaggle nlp cert", "kaggle learn nlp"],
        "skills": ["NLP", "Python", "SpaCy", "Text Classification"]
    },
    "Kaggle Computer Vision Certification": {
        "aliases": ["kaggle cv cert", "kaggle learn computer vision"],
        "skills": ["Computer Vision", "Python", "TensorFlow", "Image Recognition"]
    },
    "Kaggle Time Series Certification": {
        "aliases": ["kaggle time series cert", "kaggle learn time series"],
        "skills": ["Time Series Analysis", "Python", "Forecasting"]
    },
    "Kaggle Intro to Game AI and Reinforcement Learning": {
        "aliases": ["kaggle game ai cert", "kaggle rl cert"],
        "skills": ["Reinforcement Learning", "Python", "Game AI"]
    },
    # ═══════════════ HACKERRANK CERTIFICATIONS ═══════════════
    "HackerRank Python Certificate": {
        "aliases": ["hackerrank python cert", "hr python certified", "hackerrank python basic", "hackerrank python advanced"],
        "skills": ["Python", "Algorithms", "Data Structures", "OOP"]
    },
    "HackerRank JavaScript Certificate": {
        "aliases": ["hackerrank js cert", "hr javascript certified", "hackerrank js basic intermediate"],
        "skills": ["JavaScript", "ES6", "DOM", "Algorithms"]
    },
    "HackerRank SQL Certificate": {
        "aliases": ["hackerrank sql cert", "hr sql certified", "hackerrank sql basic advanced"],
        "skills": ["SQL", "Queries", "Joins", "Database Management"]
    },
    "HackerRank React Certificate": {
        "aliases": ["hackerrank react cert", "hr react certified"],
        "skills": ["React", "JavaScript", "Hooks", "Components"]
    },
    "HackerRank Node.js Certificate": {
        "aliases": ["hackerrank node cert", "hr nodejs certified"],
        "skills": ["Node.js", "Express.js", "REST API", "JavaScript"]
    },
    "HackerRank Java Certificate": {
        "aliases": ["hackerrank java cert", "hr java certified", "hackerrank java basic"],
        "skills": ["Java", "OOP", "Algorithms", "Data Structures"]
    },
    "HackerRank C# Certificate": {
        "aliases": ["hackerrank csharp cert", "hr c# certified", "hackerrank dot net cert"],
        "skills": ["C#", ".NET", "OOP", "ASP.NET"]
    },
    "HackerRank Data Structures Certificate": {
        "aliases": ["hackerrank ds cert", "hr data structures cert"],
        "skills": ["Data Structures", "Algorithms", "Coding"]
    },
    "HackerRank Problem Solving Certificate": {
        "aliases": ["hackerrank ps cert", "hr problem solving certified"],
        "skills": ["Algorithms", "Problem Solving", "Data Structures", "Coding"]
    },
    "HackerRank REST API Certificate": {
        "aliases": ["hackerrank rest api cert", "hr rest api certified"],
        "skills": ["REST API", "API Testing", "JSON", "HTTP"]
    },
    "HackerRank Frontend Developer React": {
        "aliases": ["hackerrank frontend cert", "hr frontend developer cert"],
        "skills": ["React", "JavaScript", "HTML5", "CSS3"]
    },
    "HackerRank Software Engineer Intern": {
        "aliases": ["hackerrank swe intern cert", "hr software engineer cert"],
        "skills": ["Algorithms", "OOP", "Data Structures", "System Design"]
    },
    # ═══════════════ PLURALSIGHT ═══════════════
    "Pluralsight IQ Skill Assessment Python": {
        "aliases": ["pluralsight python iq", "pluralsight python assessment", "pluralsight python skill"],
        "skills": ["Python", "OOP", "Data Structures", "Flask"]
    },
    "Pluralsight IQ Skill Assessment JavaScript": {
        "aliases": ["pluralsight js iq", "pluralsight javascript assessment"],
        "skills": ["JavaScript", "ES6", "Frontend Development"]
    },
    "Pluralsight IQ Skill Assessment Java": {
        "aliases": ["pluralsight java iq", "pluralsight java assessment"],
        "skills": ["Java", "Spring Boot", "OOP"]
    },
    "Pluralsight IQ Skill Assessment AWS": {
        "aliases": ["pluralsight aws iq", "pluralsight aws assessment"],
        "skills": ["Amazon Web Services", "Cloud Architecture"]
    },
    "Pluralsight IQ Skill Assessment Azure": {
        "aliases": ["pluralsight azure iq", "pluralsight azure assessment"],
        "skills": ["Microsoft Azure", "Cloud Computing"]
    },
    "Pluralsight IQ Skill Assessment Docker": {
        "aliases": ["pluralsight docker iq", "pluralsight docker assessment"],
        "skills": ["Docker", "Containerization", "DevOps"]
    },
    "Pluralsight IQ Skill Assessment Machine Learning": {
        "aliases": ["pluralsight ml iq", "pluralsight machine learning skill"],
        "skills": ["Machine Learning", "Python", "Scikit-learn"]
    },
    "Pluralsight IQ Skill Assessment SQL": {
        "aliases": ["pluralsight sql iq", "pluralsight sql skill assessment"],
        "skills": ["SQL", "Database Management"]
    },
    "Pluralsight IQ Skill Assessment Kubernetes": {
        "aliases": ["pluralsight k8s iq", "pluralsight kubernetes skill"],
        "skills": ["Kubernetes", "Docker", "DevOps"]
    },
    "Pluralsight IQ Skill Assessment React": {
        "aliases": ["pluralsight react iq", "pluralsight react skill"],
        "skills": ["React", "JavaScript", "Hooks", "State Management"]
    },
    "Pluralsight IQ Skill Assessment Angular": {
        "aliases": ["pluralsight angular iq", "pluralsight angular skill"],
        "skills": ["Angular", "TypeScript", "Frontend Development"]
    },
    "Pluralsight IQ Skill Assessment Cybersecurity": {
        "aliases": ["pluralsight security iq", "pluralsight cybersecurity skill"],
        "skills": ["Cybersecurity", "Network Security"]
    },
    # ═══════════════ SALESFORCE TRAILHEAD ═══════════════
    "Salesforce Trailhead Superbadge Admin": {
        "aliases": ["salesforce admin superbadge", "trailhead admin cert", "salesforce trailhead cert"],
        "skills": ["Salesforce", "CRM", "Salesforce Administration", "Business Automation"]
    },
    "Salesforce Certified Platform Developer I": {
        "aliases": ["pd1 cert", "salesforce platform dev 1", "sfdc pd1"],
        "skills": ["Salesforce", "Apex", "Visualforce", "SOQL", "LWC"]
    },
    "Salesforce Certified Platform Developer II": {
        "aliases": ["pd2 cert", "salesforce platform dev 2"],
        "skills": ["Salesforce", "Advanced Apex", "Integration Patterns", "LWC"]
    },
    "Salesforce Certified Business Analyst": {
        "aliases": ["sfdc ba cert", "salesforce business analyst cert"],
        "skills": ["Salesforce", "Business Analysis", "CRM", "Requirements Gathering"]
    },
    "Salesforce Certified OmniStudio Developer": {
        "aliases": ["omnistudio cert", "salesforce vlocity cert"],
        "skills": ["Salesforce", "OmniStudio", "Vlocity", "Digital Engagement"]
    },
    "Salesforce Certified Service Cloud Consultant": {
        "aliases": ["service cloud cert", "salesforce service cloud"],
        "skills": ["Salesforce", "Service Cloud", "Customer Service", "CRM"]
    },
    "Salesforce Certified Sales Cloud Consultant": {
        "aliases": ["sales cloud cert", "salesforce sales cloud"],
        "skills": ["Salesforce", "Sales Cloud", "CRM", "Sales Operations"]
    },
    "Salesforce Certified Experience Cloud Consultant": {
        "aliases": ["experience cloud cert", "salesforce community cloud cert"],
        "skills": ["Salesforce", "Experience Cloud", "Portal Development"]
    },
    "Salesforce Certified Data Architect": {
        "aliases": ["sfdc data architect cert", "salesforce data architecture"],
        "skills": ["Salesforce", "Data Modeling", "Database Design", "MDM"]
    },
    "Salesforce Certified Integration Architect": {
        "aliases": ["sfdc integration architect cert", "salesforce integration cert"],
        "skills": ["Salesforce", "API Integration", "MuleSoft", "REST API"]
    },
    # ═══════════════ NPTEL (India) ═══════════════
    "NPTEL Programming in Python": {
        "aliases": ["nptel python cert", "nptel python course cert", "swayam python cert"],
        "skills": ["Python", "OOP", "Data Structures", "File Handling"]
    },
    "NPTEL Data Science for Engineers": {
        "aliases": ["nptel data science cert", "swayam data science cert"],
        "skills": ["Data Science", "Python", "Machine Learning", "Statistical Analysis"]
    },
    "NPTEL Machine Learning": {
        "aliases": ["nptel ml cert", "nptel machine learning cert"],
        "skills": ["Machine Learning", "Python", "Algorithms", "Statistical Learning"]
    },
    "NPTEL Deep Learning": {
        "aliases": ["nptel deep learning cert", "swayam dl cert"],
        "skills": ["Deep Learning", "Neural Networks", "TensorFlow", "Python"]
    },
    "NPTEL Database Management System": {
        "aliases": ["nptel dbms cert", "nptel database cert", "swayam database cert"],
        "skills": ["Database Management", "SQL", "ER Diagrams", "Normalization"]
    },
    "NPTEL Cloud Computing": {
        "aliases": ["nptel cloud cert", "swayam cloud computing cert"],
        "skills": ["Cloud Computing", "Virtualization", "Amazon Web Services"]
    },
    "NPTEL Computer Networks": {
        "aliases": ["nptel networks cert", "swayam computer networks cert"],
        "skills": ["Network Engineering", "TCP/IP", "Routing Protocols", "OSI Model"]
    },
    "NPTEL Cybersecurity": {
        "aliases": ["nptel security cert", "swayam cybersecurity cert"],
        "skills": ["Cybersecurity", "Cryptography", "Network Security"]
    },
    "NPTEL Artificial Intelligence": {
        "aliases": ["nptel ai cert", "swayam artificial intelligence cert"],
        "skills": ["Artificial Intelligence", "Algorithms", "Machine Learning", "Python"]
    },
    "NPTEL Digital Marketing": {
        "aliases": ["nptel digital marketing cert", "swayam marketing cert"],
        "skills": ["Digital Marketing", "SEO", "Content Marketing", "Analytics"]
    },
    "NPTEL Project Management": {
        "aliases": ["nptel pm cert", "swayam project management cert"],
        "skills": ["Project Management", "Agile", "Risk Management", "Scheduling"]
    },
    "NPTEL Software Engineering": {
        "aliases": ["nptel software eng cert", "swayam software engineering"],
        "skills": ["Software Engineering", "SDLC", "Agile", "Design Patterns"]
    },
    "NPTEL Operations Research": {
        "aliases": ["nptel or cert", "swayam operations research cert"],
        "skills": ["Operations Research", "Linear Programming", "Optimization", "Supply Chain"]
    },
    "NPTEL Blockchain Technology": {
        "aliases": ["nptel blockchain cert", "swayam blockchain cert"],
        "skills": ["Blockchain", "Distributed Systems", "Cryptography", "Ethereum"]
    },
    "NPTEL Internet of Things": {
        "aliases": ["nptel iot cert", "swayam iot cert"],
        "skills": ["Internet of Things", "Arduino", "Raspberry Pi", "Embedded Systems"]
    },
    # ═══════════════ SIMPLILEARN / GREAT LEARNING / INTELLIPAAT ═══════════════
    "Simplilearn Post Graduate Program Data Science": {
        "aliases": ["simplilearn data science cert", "simplilearn pg data science", "simplilearn ds cert"],
        "skills": ["Data Science", "Python", "Machine Learning", "Deep Learning", "NLP"]
    },
    "Simplilearn Post Graduate Program AI ML": {
        "aliases": ["simplilearn ai ml cert", "simplilearn pg ai ml"],
        "skills": ["Artificial Intelligence", "Machine Learning", "TensorFlow", "Python"]
    },
    "Simplilearn Full Stack Java Developer": {
        "aliases": ["simplilearn java full stack cert", "simplilearn java cert"],
        "skills": ["Java", "Spring Boot", "React", "MySQL", "REST API"]
    },
    "Simplilearn DevOps Engineer Master's Program": {
        "aliases": ["simplilearn devops cert", "simplilearn devops master"],
        "skills": ["DevOps", "Jenkins", "Docker", "Kubernetes", "Ansible"]
    },
    "Simplilearn Cyber Security Expert": {
        "aliases": ["simplilearn security cert", "simplilearn cybersecurity expert"],
        "skills": ["Cybersecurity", "CEH", "CISSP", "Penetration Testing", "SIEM"]
    },
    "Simplilearn Data Engineering": {
        "aliases": ["simplilearn data eng cert", "simplilearn de cert"],
        "skills": ["Data Engineering", "Apache Spark", "Hadoop", "Kafka", "SQL"]
    },
    "Simplilearn Cloud Computing": {
        "aliases": ["simplilearn cloud cert", "simplilearn aws cert"],
        "skills": ["Cloud Computing", "Amazon Web Services", "Azure", "Google Cloud Platform"]
    },
    "Great Learning Data Science": {
        "aliases": ["great learning ds cert", "gl data science cert"],
        "skills": ["Data Science", "Python", "Machine Learning", "Statistics"]
    },
    "Great Learning AI ML": {
        "aliases": ["great learning ai cert", "gl ai ml cert"],
        "skills": ["Artificial Intelligence", "Machine Learning", "Python", "Deep Learning"]
    },
    "Great Learning Full Stack Development": {
        "aliases": ["great learning full stack cert", "gl full stack cert"],
        "skills": ["Full Stack Development", "React", "Node.js", "MongoDB", "REST API"]
    },
    "Intellipaat Data Science Master's Program": {
        "aliases": ["intellipaat ds cert", "intellipaat data science"],
        "skills": ["Data Science", "Python", "Machine Learning", "Power BI", "Tableau"]
    },
    "Intellipaat Python Certification": {
        "aliases": ["intellipaat python cert"],
        "skills": ["Python", "OOP", "Libraries", "Django"]
    },
    "Intellipaat DevOps Certification": {
        "aliases": ["intellipaat devops cert"],
        "skills": ["DevOps", "Docker", "Kubernetes", "Jenkins", "Ansible"]
    },
    # ═══════════════ ALISON ═══════════════
    "Alison Free Diploma in Web Development": {
        "aliases": ["alison web dev cert", "alison web development diploma", "alison html cert"],
        "skills": ["HTML5", "CSS3", "JavaScript", "Web Development"]
    },
    "Alison Free Diploma in Python": {
        "aliases": ["alison python cert", "alison python diploma"],
        "skills": ["Python", "Programming", "Data Structures"]
    },
    "Alison Free Diploma in Project Management": {
        "aliases": ["alison pm cert", "alison project management diploma"],
        "skills": ["Project Management", "Agile", "Scrum", "Risk Management"]
    },
    "Alison Free Diploma in Digital Marketing": {
        "aliases": ["alison digital marketing cert", "alison marketing diploma"],
        "skills": ["Digital Marketing", "SEO", "Social Media Marketing", "Email Marketing"]
    },
    "Alison Free Certificate in HR Management": {
        "aliases": ["alison hr cert", "alison human resources cert"],
        "skills": ["Human Resources", "Recruitment", "Employee Relations"]
    },
    "Alison Free Diploma in Cybersecurity": {
        "aliases": ["alison cybersecurity cert", "alison security diploma"],
        "skills": ["Cybersecurity", "Network Security", "Ethical Hacking"]
    },
    # ═══════════════ MICROSOFT LEARN ═══════════════
    "Microsoft Learn Applied Skills Data Analysis": {
        "aliases": ["microsoft learn data analysis", "ms learn data cert"],
        "skills": ["Data Analysis", "Power BI", "SQL", "Excel"]
    },
    "Microsoft Learn Azure AI Fundamentals Path": {
        "aliases": ["ms learn azure ai path", "microsoft learn ai cert"],
        "skills": ["Artificial Intelligence", "Machine Learning", "Microsoft Azure"]
    },
    "Microsoft Learn GitHub Foundations": {
        "aliases": ["github foundations cert", "microsoft github cert", "github cert"],
        "skills": ["GitHub", "Git", "Version Control", "Collaboration", "CI/CD"]
    },
    "Microsoft Learn GitHub Actions": {
        "aliases": ["github actions cert", "ms github actions cert"],
        "skills": ["GitHub Actions", "CI/CD", "DevOps", "Automation"]
    },
    "Microsoft Learn GitHub Advanced Security": {
        "aliases": ["github advanced security cert", "ghas cert"],
        "skills": ["Cybersecurity", "DevSecOps", "Code Scanning", "GitHub"]
    },
    "Microsoft Learn Power Platform": {
        "aliases": ["ms power platform cert", "microsoft power platform learn"],
        "skills": ["Power Apps", "Power Automate", "Power BI", "Microsoft 365"]
    },
    # ═══════════════ AWS SKILL BUILDER LEARNING BADGES ═══════════════
    "AWS Cloud Quest Cloud Practitioner Badge": {
        "aliases": ["aws cloud quest cert", "aws cloud quest badge"],
        "skills": ["Amazon Web Services", "Cloud Computing", "AWS EC2", "AWS S3"]
    },
    "AWS Cloud Quest Solutions Architect Badge": {
        "aliases": ["aws cloud quest sa badge", "aws cloud quest architect"],
        "skills": ["Amazon Web Services", "Cloud Architecture", "VPC", "IAM"]
    },
    "AWS Cloud Quest Machine Learning Badge": {
        "aliases": ["aws cloud quest ml badge", "aws machine learning quest"],
        "skills": ["Machine Learning", "Amazon Web Services", "SageMaker"]
    },
    "AWS Cloud Quest Data Analytics Badge": {
        "aliases": ["aws cloud quest data badge", "aws data analytics quest"],
        "skills": ["Data Engineering", "AWS Athena", "AWS Glue", "Amazon Redshift"]
    },
    "AWS Cloud Quest Serverless Developer Badge": {
        "aliases": ["aws serverless badge", "aws cloud quest serverless"],
        "skills": ["AWS Lambda", "Serverless Architecture", "API Gateway", "Amazon Web Services"]
    },
    "AWS Cloud Quest Security Badge": {
        "aliases": ["aws cloud quest security badge", "aws security quest"],
        "skills": ["Cybersecurity", "Amazon Web Services", "IAM", "Cloud Security"]
    },
    "AWS Partner Accreditation": {
        "aliases": ["aws partner cert", "aws partner network cert", "aws apn accreditation"],
        "skills": ["Amazon Web Services", "Cloud Computing", "Partner Sales"]
    },
    # ═══════════════ UDACITY NANODEGREES ═══════════════
    "Udacity Data Scientist Nanodegree": {
        "aliases": ["udacity data scientist nd", "udacity data science cert"],
        "skills": ["Data Science", "Python", "Machine Learning", "Statistical Analysis", "SQL"]
    },
    "Udacity Machine Learning Engineer Nanodegree": {
        "aliases": ["udacity ml nanodegree", "udacity ml cert"],
        "skills": ["Machine Learning", "Python", "Deep Learning", "Scikit-learn", "Deployment"]
    },
    "Udacity AI Programming with Python Nanodegree": {
        "aliases": ["udacity ai python nd", "udacity ai programming cert"],
        "skills": ["Python", "NumPy", "Pandas", "Matplotlib", "PyTorch", "Neural Networks"]
    },
    "Udacity Full Stack Web Developer Nanodegree": {
        "aliases": ["udacity full stack nd", "udacity web developer cert"],
        "skills": ["Python", "Flask", "PostgreSQL", "REST API", "Linux"]
    },
    "Udacity Front End Web Developer Nanodegree": {
        "aliases": ["udacity frontend nd", "udacity frontend cert"],
        "skills": ["HTML5", "CSS3", "JavaScript", "Asynchronous Programming", "React"]
    },
    "Udacity React Nanodegree": {
        "aliases": ["udacity react nd", "udacity react cert"],
        "skills": ["React", "Redux", "JavaScript", "React Native"]
    },
    "Udacity Cloud Developer Nanodegree": {
        "aliases": ["udacity cloud developer nd", "udacity cloud dev cert"],
        "skills": ["Amazon Web Services", "Microservices", "Kubernetes", "Serverless", "CI/CD"]
    },
    "Udacity Data Analyst Nanodegree": {
        "aliases": ["udacity data analyst nd", "udacity data analyst cert"],
        "skills": ["Data Analysis", "Python", "R", "Statistics", "SQL", "Visualization"]
    },
    "Udacity Business Analytics Nanodegree": {
        "aliases": ["udacity business analytics nd", "udacity ba cert"],
        "skills": ["Business Analytics", "SQL", "Excel", "Tableau", "Statistics"]
    },
    "Udacity Predictive Analytics Nanodegree": {
        "aliases": ["udacity predictive analytics nd"],
        "skills": ["Predictive Analytics", "Data Science", "Machine Learning", "Python"]
    },
    "Udacity Data Engineering Nanodegree": {
        "aliases": ["udacity data engineering nd", "udacity de cert"],
        "skills": ["Data Engineering", "Python", "Spark", "Airflow", "Data Warehousing"]
    },
    "Udacity AWS Machine Learning Engineer Nanodegree": {
        "aliases": ["udacity aws ml nd", "udacity aws ml engineer cert"],
        "skills": ["Amazon Web Services", "Machine Learning", "SageMaker", "MLOps"]
    },
    "Udacity Cybersecurity Nanodegree": {
        "aliases": ["udacity cybersecurity nd", "udacity security cert"],
        "skills": ["Cybersecurity", "Ethical Hacking", "Network Defense", "Incident Response"]
    },
    "Udacity Self Driving Car Engineer": {
        "aliases": ["udacity sdc nd", "self driving car nanodegree"],
        "skills": ["Autonomous Systems", "Computer Vision", "Deep Learning", "C++", "ROS"]
    },
    "Udacity Android Developer Nanodegree": {
        "aliases": ["udacity android nd", "udacity android cert"],
        "skills": ["Android Development", "Kotlin", "Android Studio", "Firebase"]
    },
    "Udacity iOS Developer Nanodegree": {
        "aliases": ["udacity ios nd", "udacity ios cert"],
        "skills": ["Swift", "iOS Development", "Xcode", "UIKit"]
    },
    "Udacity Product Manager Nanodegree": {
        "aliases": ["udacity product manager nd", "udacity pm cert"],
        "skills": ["Product Management", "User Research", "Roadmapping", "Wireframing"]
    },
    "Udacity Digital Marketing Nanodegree": {
        "aliases": ["udacity digital marketing nd", "udacity marketing cert"],
        "skills": ["Digital Marketing", "SEO", "Social Media Marketing", "Analytics"]
    },
    "Udacity Embedded Systems Engineer Nanodegree": {
        "aliases": ["udacity embedded nd", "udacity embedded systems cert"],
        "skills": ["Embedded Systems", "C", "C++", "Microcontrollers", "RTOS"]
    },
    "Udacity Robotics Software Engineer Nanodegree": {
        "aliases": ["udacity robotics nd", "udacity robotics cert"],
        "skills": ["Robotics", "ROS", "C++", "Computer Vision", "Autonomous Navigation"]
    },
    # ═══════════════ GOOGLE DEVELOPER CERTIFICATIONS ═══════════════
    "Associate Android Developer Certification": {
        "aliases": ["AAD google cert", "google android developer cert", "google aad cert"],
        "skills": ["Android Development", "Kotlin", "Android Studio", "Material Design"]
    },
    "Google Cloud Certified Professional Collaboration Engineer": {
        "aliases": ["google collab engineer cert", "gcp collaboration cert"],
        "skills": ["Google Workspace", "G Suite", "Collaboration Tools", "Google Meet"]
    },
    "TensorFlow Developer Certificate": {
        "aliases": ["tensorflow cert google", "tensorflow developer google cert"],
        "skills": ["TensorFlow", "Deep Learning", "Computer Vision", "NLP", "Python"]
    },
    "Google Mobile Web Specialist": {
        "aliases": ["google mws cert", "mobile web specialist cert"],
        "skills": ["Progressive Web Apps", "JavaScript", "Performance Optimization", "Web APIs"]
    },
    # ═══════════════ FAST.AI / HUGGING FACE / OPEN SOURCE ═══════════════
    "Fast.AI Practical Deep Learning": {
        "aliases": ["fastai cert", "fast ai deep learning cert", "practical deep learning fastai"],
        "skills": ["Deep Learning", "PyTorch", "Computer Vision", "NLP", "Python"]
    },
    "Hugging Face NLP Course Certificate": {
        "aliases": ["hugging face cert", "hf nlp cert", "transformers certificate"],
        "skills": ["NLP", "Transformers", "Hugging Face", "BERT", "Python"]
    },
    "Hugging Face Deep Reinforcement Learning Certificate": {
        "aliases": ["hugging face rl cert", "deep rl hugging face cert"],
        "skills": ["Reinforcement Learning", "Deep Learning", "Python"]
    },
    "LangChain Developer Certificate": {
        "aliases": ["langchain cert", "llm developer cert", "langchain ai cert"],
        "skills": ["LangChain", "Large Language Models", "Python", "Generative AI"]
    },
    # ═══════════════ CLOUD VENDOR SPECIFIC BADGES ═══════════════
    "Credly Digital Badge Verification": {
        "aliases": ["credly badge", "digital badge verified"],
        "skills": ["Certification", "Professional Development"]
    },
    "Oracle University Learning Subscription": {
        "aliases": ["oracle learning cert", "oracle university cert"],
        "skills": ["Oracle Database", "Java", "Oracle Cloud"]
    },
    "VMware Certified Professional": {
        "aliases": ["VCP cert", "vmware vcp", "vmware certified professional"],
        "skills": ["VMware", "Virtualization", "vSphere", "vCenter", "System Administration"]
    },
    "VMware Certified Advanced Professional": {
        "aliases": ["VCAP cert", "vmware vcap", "vcap cert"],
        "skills": ["VMware", "vSphere", "NSX", "vSAN", "Cloud Infrastructure"]
    },
    "VMware Certified Design Expert": {
        "aliases": ["VCDX cert", "vmware vcdx"],
        "skills": ["VMware", "Cloud Architecture", "vSphere Design"]
    },
    "Nutanix Certified Associate": {
        "aliases": ["NCA cert", "nutanix cert", "nutanix certified"],
        "skills": ["Nutanix", "Hyper-Converged Infrastructure", "Virtualization", "Cloud"]
    },
    "Pure Storage FlashArray Certified": {
        "aliases": ["pure storage cert", "flasharray cert"],
        "skills": ["Storage Administration", "SAN", "FlashArray", "System Administration"]
    },
    "NetApp Certified Data Administrator": {
        "aliases": ["NCDA cert", "netapp certified", "netapp data admin"],
        "skills": ["Storage Administration", "NetApp", "SAN", "NAS"]
    },
    "Palo Alto Networks Certified Network Security Engineer": {
        "aliases": ["PCNSE cert", "palo alto cert", "pan cert"],
        "skills": ["Network Security", "Firewall Management", "Palo Alto Networks", "NGFW"]
    },
    "Palo Alto Networks Certified Cybersecurity Associate": {
        "aliases": ["PCCSA cert", "palo alto associate cert"],
        "skills": ["Cybersecurity", "Network Security", "Palo Alto Networks"]
    },
    "Fortinet Network Security Expert": {
        "aliases": ["NSE cert", "fortinet NSE 1 2 3 4 5 6 7 8", "fortinet cert"],
        "skills": ["Network Security", "Fortinet", "FortiGate", "Firewall Management"]
    },
    "Juniper Networks Certified Associate": {
        "aliases": ["JNCIA cert", "juniper cert", "juniper associate cert", "jncia-junos"],
        "skills": ["Juniper Networks", "Routing Protocols", "Network Engineering"]
    },
    "F5 Certified BIG-IP Administrator": {
        "aliases": ["F5 cert", "bigip cert", "f5 administrator cert"],
        "skills": ["Load Balancing", "Network Engineering", "F5 BIG-IP", "Application Delivery"]
    },
    "Checkpoint Certified Security Administrator": {
        "aliases": ["CCSA cert", "checkpoint cert", "check point admin cert"],
        "skills": ["Network Security", "Checkpoint Firewall", "VPN", "Cybersecurity"]
    },
    # ═══════════════ ATLASSIAN ═══════════════
    "Atlassian Certified Jira Administrator": {
        "aliases": ["jira admin cert", "atlassian jira cert", "atlassian certified"],
        "skills": ["Jira", "Project Management", "Agile", "Scrum"]
    },
    "Atlassian Certified Confluence Administrator": {
        "aliases": ["confluence cert", "atlassian confluence cert"],
        "skills": ["Confluence", "Documentation", "Project Management", "Collaboration"]
    },
    "Atlassian Certified in Managing Jira Projects": {
        "aliases": ["jira project cert", "atlassian project management cert"],
        "skills": ["Jira", "Agile", "Scrum", "Project Management"]
    },

}

# Merge
for cert_name, data in batch2.items():
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
print(f"BATCH 2 DONE — Total certs: {t} | Aliases: {ta} | Skills: {ts} | Grand total: {t+ta+ts}")
