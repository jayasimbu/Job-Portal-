import json

with open("certificates_list.json", "r") as f:
    certs = json.load(f)

more_certs = {

    # ══════════════════════════════════════════════════════════════════════
    # AWS — SPECIALTY & ADVANCED
    # ══════════════════════════════════════════════════════════════════════
    "AWS Certified Advanced Networking Specialty": {
        "aliases": ["ANS-C01", "aws networking specialty", "aws advanced networking cert"],
        "skills": ["Amazon Web Services", "Network Engineering", "AWS VPC", "SD-WAN", "BGP"]
    },
    "AWS Certified Database Specialty": {
        "aliases": ["DBS-C01", "aws database specialty", "aws db cert"],
        "skills": ["Amazon Web Services", "AWS RDS", "DynamoDB", "AWS Redshift", "Database Administration"]
    },
    "AWS Certified SAP on AWS Specialty": {
        "aliases": ["PAS-C01", "aws sap specialty"],
        "skills": ["Amazon Web Services", "SAP", "Cloud Migration", "SAP HANA"]
    },
    "AWS Certified Cloud Practitioner Foundational": {
        "aliases": ["clf-c01", "aws clf", "aws entry cert"],
        "skills": ["Amazon Web Services", "Cloud Computing"]
    },
    "AWS re/Start Graduate": {
        "aliases": ["aws restart", "aws restart graduate", "aws cloud skills"],
        "skills": ["Amazon Web Services", "Linux", "Python", "Networking", "Cloud Computing"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # GOOGLE CLOUD — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Google Cloud Professional Cloud Network Engineer": {
        "aliases": ["GCP Network Eng", "google cloud network cert"],
        "skills": ["Google Cloud Platform", "Network Engineering", "VPC", "Cloud DNS"]
    },
    "Google Cloud Professional Cloud Security Engineer": {
        "aliases": ["GCP Security Eng", "google cloud security cert"],
        "skills": ["Google Cloud Platform", "Cybersecurity", "IAM", "Cloud Security"]
    },
    "Google Cloud Professional Cloud Database Engineer": {
        "aliases": ["GCP DB Eng", "google cloud database cert"],
        "skills": ["Google Cloud Platform", "Cloud SQL", "BigQuery", "Spanner", "Database Engineering"]
    },
    "Google Cloud Digital Leader": {
        "aliases": ["google cloud digital", "gcp digital leader cert", "google cloud foundation"],
        "skills": ["Google Cloud Platform", "Cloud Computing", "Digital Transformation"]
    },
    "Google Workspace Administrator": {
        "aliases": ["gsuite admin cert", "google workspace admin cert"],
        "skills": ["Google Workspace", "G Suite", "Email Administration", "IT Support"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # MICROSOFT AZURE — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Microsoft Azure IoT Developer": {
        "aliases": ["AZ-220", "azure iot cert", "azure iot developer"],
        "skills": ["Internet of Things", "Microsoft Azure", "Azure IoT Hub", "Edge Computing"]
    },
    "Microsoft Azure Database Administrator": {
        "aliases": ["DP-300", "azure dba cert", "azure database admin"],
        "skills": ["Microsoft Azure", "SQL Server", "Azure SQL", "Database Administration"]
    },
    "Microsoft Azure Stack Hub Operator": {
        "aliases": ["AZ-600", "azure stack cert"],
        "skills": ["Microsoft Azure", "Hybrid Cloud", "Infrastructure Management"]
    },
    "Microsoft 365 Fundamentals": {
        "aliases": ["MS-900", "microsoft 365 fundamentals cert", "m365 basics cert"],
        "skills": ["Microsoft Office", "Microsoft Azure", "Cloud Computing", "Collaboration Tools"]
    },
    "Microsoft 365 Administrator Expert": {
        "aliases": ["MS-102", "microsoft 365 admin", "m365 enterprise admin"],
        "skills": ["Microsoft Office", "Active Directory", "Microsoft Azure", "Identity Management"]
    },
    "Microsoft Power Platform Fundamentals": {
        "aliases": ["PL-900", "power platform fundamentals", "microsoft power platform cert"],
        "skills": ["Microsoft Power BI", "Power Apps", "Power Automate", "Low-Code Development"]
    },
    "Microsoft Power Platform Developer": {
        "aliases": ["PL-400", "power platform developer cert"],
        "skills": ["Power Apps", "Power Automate", "Microsoft Power BI", "Dataverse"]
    },
    "Microsoft Dynamics 365 Fundamentals": {
        "aliases": ["MB-910", "MB-920", "dynamics 365 fundamentals cert"],
        "skills": ["Microsoft Dynamics 365", "CRM", "ERP", "Business Applications"]
    },
    "Microsoft Azure Fundamentals": {
        "aliases": ["AZ-900 cert", "azure az900"],
        "skills": ["Microsoft Azure", "Cloud Computing", "Azure Services"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # ORACLE CERTIFICATIONS
    # ══════════════════════════════════════════════════════════════════════
    "Oracle Certified Professional Java Developer": {
        "aliases": ["OCP Java", "oracle java certified professional", "java 17 ocp", "ocajp ocpjp"],
        "skills": ["Java", "Object Oriented Programming", "Spring Boot", "JVM"]
    },
    "Oracle Certified Associate Java Developer": {
        "aliases": ["OCA Java", "oracle java associate", "java oca cert"],
        "skills": ["Java", "Programming", "Object Oriented Programming"]
    },
    "Oracle Database Administrator Certified Professional": {
        "aliases": ["Oracle DBA", "oracle certified dba", "ocp dba"],
        "skills": ["Oracle Database", "SQL", "Database Administration", "PL/SQL"]
    },
    "Oracle Cloud Infrastructure Foundations Certified Associate": {
        "aliases": ["OCI foundations cert", "oracle cloud foundations"],
        "skills": ["Oracle Cloud", "Cloud Computing", "Infrastructure Management"]
    },
    "Oracle Cloud Infrastructure Architect Associate": {
        "aliases": ["OCI architect cert", "oracle cloud architect"],
        "skills": ["Oracle Cloud", "Cloud Architecture", "Infrastructure as Code"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # SAP CERTIFICATIONS
    # ══════════════════════════════════════════════════════════════════════
    "SAP Certified Application Associate": {
        "aliases": ["SAP C_TERP10", "sap application cert", "sap associate cert", "sap certification"],
        "skills": ["SAP", "SAP FICO", "SAP MM", "SAP SD", "ERP"]
    },
    "SAP Certified Development Associate ABAP": {
        "aliases": ["SAP ABAP cert", "sap developer abap", "abap sap certified"],
        "skills": ["SAP", "ABAP Programming", "SAP Development"]
    },
    "SAP Certified Technology Associate SAP HANA": {
        "aliases": ["sap hana cert", "c_hanaimp", "sap hana certified"],
        "skills": ["SAP HANA", "SAP", "Database Administration", "In-Memory DB"]
    },
    "SAP SuccessFactors HCM Associate": {
        "aliases": ["sap successfactors cert", "hcm sap cert"],
        "skills": ["SAP SuccessFactors", "Human Resources", "HCM", "Talent Management"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # CYBERSECURITY — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "GIAC Security Essentials": {
        "aliases": ["GSEC", "giac gsec", "security essentials sans"],
        "skills": ["Cybersecurity", "Network Security", "Security Operations"]
    },
    "GIAC Certified Incident Handler": {
        "aliases": ["GCIH", "incident response cert", "giac incident handler"],
        "skills": ["Incident Response", "Threat Detection", "Cybersecurity", "SIEM"]
    },
    "GIAC Certified Enterprise Defender": {
        "aliases": ["GCED", "enterprise defender cert"],
        "skills": ["Network Defense", "Cybersecurity", "Firewall Management"]
    },
    "Certified Cloud Security Professional": {
        "aliases": ["CCSP", "isc2 ccsp", "cloud security professional cert"],
        "skills": ["Cloud Security", "Cybersecurity", "DevSecOps", "Compliance"]
    },
    "Certified in Risk and Information Systems Control": {
        "aliases": ["CRISC", "isaca crisc", "risk systems cert"],
        "skills": ["Risk Management", "Information Systems", "IT Risk", "Compliance"]
    },
    "Certified Data Privacy Solutions Engineer": {
        "aliases": ["CDPSE", "isaca cdpse", "data privacy engineer cert"],
        "skills": ["Data Protection Law", "GDPR", "Privacy Engineering", "Cybersecurity"]
    },
    "EC-Council Certified Network Defender": {
        "aliases": ["CND", "network defender cert", "ec council cnd"],
        "skills": ["Network Security", "Firewall Management", "Network Engineering", "Cybersecurity"]
    },
    "EC-Council Certified Application Security Engineer": {
        "aliases": ["CASE", "application security cert", "ec council case"],
        "skills": ["Application Security", "SAST", "DAST", "Secure Coding", "DevSecOps"]
    },
    "Offensive Security Experienced Penetration Tester": {
        "aliases": ["OSEP", "offensive security cert advanced", "advanced pentest cert"],
        "skills": ["Penetration Testing", "Ethical Hacking", "Advanced Exploitation"]
    },
    "CompTIA Cloud+": {
        "aliases": ["Cloud Plus", "CV0-004", "comptia cloud plus"],
        "skills": ["Cloud Computing", "Amazon Web Services", "Microsoft Azure", "Virtualization"]
    },
    "CompTIA Linux+": {
        "aliases": ["Linux Plus", "XK0-005", "comptia linux plus"],
        "skills": ["Linux Administration", "Bash", "System Administration"]
    },
    "CompTIA Data+": {
        "aliases": ["Data Plus", "DA0-001", "comptia data plus"],
        "skills": ["Data Analysis", "SQL", "Data Visualization", "Business Intelligence"]
    },
    "CompTIA Server+": {
        "aliases": ["Server Plus", "SK0-005", "comptia server plus"],
        "skills": ["System Administration", "Server Management", "Hardware Troubleshooting"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # DEVOPS AND PLATFORM EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Puppet Professional": {
        "aliases": ["puppet certified", "puppet practitioner"],
        "skills": ["Puppet", "Configuration Management", "DevOps", "Infrastructure as Code"]
    },
    "Chef Certified Developer": {
        "aliases": ["chef cert", "chef developer certified"],
        "skills": ["Chef", "Configuration Management", "DevOps", "Ruby"]
    },
    "Istio Certification": {
        "aliases": ["IASCA", "istio service mesh cert"],
        "skills": ["Kubernetes", "Service Mesh", "Microservices", "DevOps"]
    },
    "Prometheus Certified Associate": {
        "aliases": ["PCA cert", "prometheus cert", "cncf prometheus cert"],
        "skills": ["Prometheus", "Monitoring", "Grafana", "Observability"]
    },
    "Argo CD Certified": {
        "aliases": ["argo cd cert", "argocd gitops cert"],
        "skills": ["ArgoCD", "GitOps", "Kubernetes", "CI/CD"]
    },
    "Linux Foundation Certified System Administrator": {
        "aliases": ["LFCS", "linux foundation cert", "lfcs cert"],
        "skills": ["Linux Administration", "System Administration", "Bash", "Networking"]
    },
    "Linux Foundation Certified IT Associate": {
        "aliases": ["LFCA", "linux foundation it associate"],
        "skills": ["Linux", "Cloud Computing", "IT Support", "Networking"]
    },
    "OpenShift Certified Developer": {
        "aliases": ["EX288", "openshift developer cert", "red hat openshift dev"],
        "skills": ["OpenShift", "Kubernetes", "Docker", "CI/CD"]
    },
    "Red Hat Certified OpenShift Administrator": {
        "aliases": ["EX280", "openshift admin cert", "red hat openshift admin"],
        "skills": ["OpenShift", "Kubernetes", "Linux Administration"]
    },
    "Splunk Core Certified User": {
        "aliases": ["splunk user cert", "splunk certified"],
        "skills": ["Splunk", "Log Management", "SIEM", "Security Operations"]
    },
    "Elastic Certified Engineer": {
        "aliases": ["elasticsearch cert", "elastic engineer cert"],
        "skills": ["Elasticsearch", "ELK Stack", "Log Analysis", "Search Engineering"]
    },
    "Datadog Certified Professional": {
        "aliases": ["datadog cert", "datadog professional"],
        "skills": ["Datadog", "Monitoring", "Observability", "APM"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # PROGRAMMING LANGUAGE CERTIFICATIONS
    # ══════════════════════════════════════════════════════════════════════
    "Python Institute PCEP": {
        "aliases": ["PCEP cert", "python entry cert", "pcep python"],
        "skills": ["Python", "Programming", "Scripting"]
    },
    "Python Institute PCAP": {
        "aliases": ["PCAP cert", "python associate cert", "pcap python"],
        "skills": ["Python", "OOP", "Libraries", "Data Structures"]
    },
    "Python Institute PCPP": {
        "aliases": ["PCPP cert", "python professional cert"],
        "skills": ["Python", "Advanced Python", "Frameworks", "APIs"]
    },
    "Microsoft Certified Python Developer": {
        "aliases": ["microsoft python cert", "python 98-381"],
        "skills": ["Python", "Programming", "Scripting"]
    },
    "Go Developer Certification": {
        "aliases": ["golang cert", "go certified developer"],
        "skills": ["Golang", "Microservices", "Backend Development"]
    },
    "Rust Certification": {
        "aliases": ["rust developer cert"],
        "skills": ["Rust", "Systems Programming", "Memory Management"]
    },
    "Scala Developer Certification": {
        "aliases": ["scala cert", "lightbend scala"],
        "skills": ["Scala", "Apache Spark", "Functional Programming"]
    },
    "Kotlin Developer Certification": {
        "aliases": ["kotlin cert", "jetbrains kotlin cert"],
        "skills": ["Kotlin", "Android Development", "JVM"]
    },
    "Swift Developer Certification": {
        "aliases": ["apple swift cert", "ios swift cert"],
        "skills": ["Swift", "iOS Development", "Xcode"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # MOBILE DEVELOPMENT CERTIFICATIONS
    # ══════════════════════════════════════════════════════════════════════
    "Google Associate Android Developer": {
        "aliases": ["AAD cert", "android developer cert", "google android cert"],
        "skills": ["Android Development", "Kotlin", "Java", "Android Studio"]
    },
    "Apple Certified iOS Developer": {
        "aliases": ["apple dev cert", "ios developer cert", "apple certified"],
        "skills": ["iOS Development", "Swift", "Xcode", "UIKit", "SwiftUI"]
    },
    "React Native Certification": {
        "aliases": ["react native cert", "cross platform mobile cert"],
        "skills": ["React Native", "Mobile Development", "JavaScript", "React"]
    },
    "Flutter Certification": {
        "aliases": ["flutter cert", "dart flutter certified"],
        "skills": ["Flutter", "Dart", "Mobile Development", "Cross-Platform"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # DATA / ANALYTICS CERTIFICATIONS — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Microsoft Certified Data Analyst Associate": {
        "aliases": ["DA-100", "PL-300", "power bi analyst", "microsoft data analyst"],
        "skills": ["Power BI", "DAX", "Data Analysis", "Business Intelligence"]
    },
    "Certified Analytics Professional": {
        "aliases": ["CAP cert", "informs cap", "analytics professional cert"],
        "skills": ["Data Science", "Statistical Analysis", "Machine Learning", "Business Analytics"]
    },
    "SAS Certified Base Programmer": {
        "aliases": ["sas base programmer cert", "sas programmer cert"],
        "skills": ["SAS", "Data Analysis", "Statistical Analysis"]
    },
    "SAS Certified Advanced Programmer": {
        "aliases": ["sas advanced programmer", "sas adv cert"],
        "skills": ["SAS", "Advanced Analytics", "Macros", "Statistical Modeling"]
    },
    "IBM Data Analyst Professional Certificate": {
        "aliases": ["ibm data analyst cert", "ibm analytics cert"],
        "skills": ["Data Analysis", "Python", "SQL", "IBM Cognos"]
    },
    "Cloudera CDP Administrator": {
        "aliases": ["cdp admin cert", "cloudera admin cert"],
        "skills": ["Hadoop", "Apache Spark", "Data Engineering", "Cloudera"]
    },
    "Qlik Sense Business Analyst": {
        "aliases": ["qlik sense cert", "qlik certified"],
        "skills": ["Qlik Sense", "Data Visualization", "Business Intelligence"]
    },
    "DAMA Certified Data Management Professional": {
        "aliases": ["CDMP", "data management cert", "dama cdmp"],
        "skills": ["Data Governance", "Data Management", "Data Quality", "Master Data"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # AI / ML CERTIFICATIONS — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "NVIDIA Deep Learning Institute Certificate": {
        "aliases": ["nvidia dli cert", "nvidia deep learning cert", "dli certified"],
        "skills": ["Deep Learning", "GPU Computing", "CUDA", "TensorFlow", "PyTorch"]
    },
    "Certified Artificial Intelligence Practitioner": {
        "aliases": ["CAIP cert", "certifAIed", "ai practitioner cert"],
        "skills": ["Artificial Intelligence", "Machine Learning", "AI Ethics"]
    },
    "Professional Machine Learning Engineer Google": {
        "aliases": ["gcp ml cert", "google ml professional", "pmle cert"],
        "skills": ["Machine Learning", "Google Cloud Platform", "Vertex AI", "MLOps"]
    },
    "Azure AI Fundamentals": {
        "aliases": ["AI-900", "azure ai basics", "microsoft ai fundamentals cert"],
        "skills": ["Artificial Intelligence", "Machine Learning", "Microsoft Azure"]
    },
    "IBM AI Engineering Professional Certificate": {
        "aliases": ["ibm ai engineering cert", "ibm ai cert"],
        "skills": ["Machine Learning", "Deep Learning", "TensorFlow", "Keras", "Scikit-learn"]
    },
    "OpenAI API Developer Certification": {
        "aliases": ["openai cert", "chatgpt api cert", "openai developer"],
        "skills": ["Large Language Models", "OpenAI API", "Generative AI", "Python"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # AGILE AND PRODUCT MANAGEMENT — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Certified Agile Leadership": {
        "aliases": ["CAL cert", "scrumalliance cal", "agile leadership cert"],
        "skills": ["Agile", "Leadership", "Organizational Change", "Coaching"]
    },
    "ICAgile Certified Professional": {
        "aliases": ["ICP cert", "icagile icp"],
        "skills": ["Agile", "Coaching", "Facilitation", "Team Dynamics"]
    },
    "DSDM Practitioner": {
        "aliases": ["dsdm cert", "dynamic systems development practitioner"],
        "skills": ["Agile", "Project Management", "Agile Delivery"]
    },
    "Nexus Scaled Scrum Practitioner": {
        "aliases": ["nexus cert", "scaled scrum cert"],
        "skills": ["Scaled Agile", "Scrum", "Multi-Team Coordination"]
    },
    "Certified LeSS Practitioner": {
        "aliases": ["CLP cert", "less practitioner", "large scale scrum cert"],
        "skills": ["Agile", "Scrum", "Scaled Delivery", "LeSS"]
    },
    "Product Management Professional": {
        "aliases": ["PMP product", "pdma certified", "aipmm pm cert"],
        "skills": ["Product Management", "Roadmapping", "User Stories", "Market Research"]
    },
    "Certified OKR Practitioner": {
        "aliases": ["OKR cert", "okr practitioner cert"],
        "skills": ["OKRs", "Goal Setting", "Performance Management", "Agile"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # ITIL AND IT SERVICE MANAGEMENT
    # ══════════════════════════════════════════════════════════════════════
    "ITIL 4 Leader Digital and IT Strategy": {
        "aliases": ["ITIL DITS cert", "itil 4 leader cert", "itil digital strategy"],
        "skills": ["IT Service Management", "Digital Strategy", "IT Leadership"]
    },
    "ITIL 4 Specialist Create Deliver Support": {
        "aliases": ["ITIL CDS cert", "itil create deliver cert"],
        "skills": ["IT Service Management", "Service Delivery", "Service Desk"]
    },
    "ISO 20000 Lead Auditor": {
        "aliases": ["ISO 20000 cert", "it service management audit"],
        "skills": ["IT Service Management", "Audit", "ITSM", "Process Improvement"]
    },
    "Certified IT Infrastructure Library Expert": {
        "aliases": ["ITIL Expert", "itil expert cert"],
        "skills": ["IT Service Management", "ITSM", "ITIL Lifecycle"]
    },
    "ServiceNow Certified System Administrator": {
        "aliases": ["servicenow admin", "snow cert", "servicenow csa"],
        "skills": ["ServiceNow", "IT Service Management", "ITSM", "Workflow Automation"]
    },
    "ServiceNow Certified Application Developer": {
        "aliases": ["servicenow developer cert", "snow developer cert"],
        "skills": ["ServiceNow", "JavaScript", "ITSM", "Application Development"]
    },
    "BMC Certified Associate": {
        "aliases": ["bmc remedy cert", "bmc itsm cert"],
        "skills": ["ITSM", "BMC Remedy", "IT Service Management"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # CLOUD ARCHITECTURE AND MULTI-CLOUD
    # ══════════════════════════════════════════════════════════════════════
    "Multi-Cloud Architect Certification": {
        "aliases": ["multi cloud cert", "hybrid cloud architect", "cloud agnostic cert"],
        "skills": ["Amazon Web Services", "Microsoft Azure", "Google Cloud Platform", "Cloud Architecture"]
    },
    "FinOps Certified Practitioner": {
        "aliases": ["FOCP cert", "finops cert", "cloud cost optimization cert"],
        "skills": ["Cloud Computing", "Cost Management", "FinOps", "Cloud Governance"]
    },
    "TOGAF 9 Certified": {
        "aliases": ["TOGAF cert", "togaf 9.2", "enterprise architecture cert", "open group togaf"],
        "skills": ["Enterprise Architecture", "IT Architecture", "System Design", "Cloud Architecture"]
    },
    "Zachman Framework Certification": {
        "aliases": ["zachman cert", "enterprise framework cert"],
        "skills": ["Enterprise Architecture", "System Design", "IT Architecture"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # HR AND TALENT MANAGEMENT — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Workday HCM Functional Consultant": {
        "aliases": ["workday cert", "workday hcm cert", "workday functional"],
        "skills": ["Workday", "Human Resources", "HCM", "Payroll Management"]
    },
    "SAP HCM Certified": {
        "aliases": ["sap hr cert", "sap human capital cert"],
        "skills": ["SAP", "HR Management", "Payroll", "Talent Management"]
    },
    "ATD Master Trainer": {
        "aliases": ["atd trainer cert", "master trainer cert"],
        "skills": ["Learning and Development", "Training Delivery", "Instructional Design"]
    },
    "Certified Compensation Professional": {
        "aliases": ["CCP worldatwork", "compensation cert", "total rewards cert"],
        "skills": ["Compensation and Benefits", "Job Analysis", "Salary Benchmarking"]
    },
    "Certified Benefits Professional": {
        "aliases": ["CBP worldatwork", "benefits professional cert"],
        "skills": ["Compensation and Benefits", "Employee Benefits", "HR Management"]
    },
    "Lean HR Practitioner": {
        "aliases": ["lean hr cert"],
        "skills": ["Lean Manufacturing", "Process Improvement", "HR Operations"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # FINANCE — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Chartered Financial Planner": {
        "aliases": ["CFP cert", "certified financial planner cert", "cfp board"],
        "skills": ["Financial Planning", "Investment Management", "Retirement Planning", "Tax Planning"]
    },
    "Chartered Accountant India ICAI": {
        "aliases": ["CA ICAI", "ca india", "ipcc ca", "ca foundation inter final"],
        "skills": ["Accounting", "GAAP", "Indian Accounting Standards", "Taxation", "Audit"]
    },
    "CFA Institute Investment Foundations": {
        "aliases": ["CFA foundations cert", "investment foundations cert"],
        "skills": ["Finance", "Investment Analysis", "Financial Markets"]
    },
    "Certified Treasury Professional": {
        "aliases": ["CTP cert", "treasury professional cert", "afp ctp"],
        "skills": ["Corporate Finance", "Cash Management", "Treasury Operations"]
    },
    "Certified Internal Auditor": {
        "aliases": ["CIA cert", "iia cia", "internal auditor cert"],
        "skills": ["Audit", "Internal Audit", "Risk Management", "Compliance"]
    },
    "ACCA Diploma in IFRS": {
        "aliases": ["DipIFR", "ifrs diploma", "acca ifrs cert"],
        "skills": ["IFRS", "Financial Reporting", "Accounting"]
    },
    "Bloomberg Market Concepts": {
        "aliases": ["BMC cert", "bloomberg cert", "bloomberg market cert"],
        "skills": ["Financial Markets", "Bloomberg Terminal", "Economics", "Financial Analysis"]
    },
    "Certified Credit Analyst": {
        "aliases": ["CCA cert", "moody's credit cert", "credit analysis cert"],
        "skills": ["Credit Analysis", "Financial Analysis", "Risk Management", "Banking"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # MARKETING — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "HubSpot Marketing Hub Certification": {
        "aliases": ["hubspot marketing cert", "hubspot certified marketer"],
        "skills": ["Content Marketing", "Email Marketing", "HubSpot CRM", "Inbound Marketing"]
    },
    "Digital Marketing Institute Certification": {
        "aliases": ["DMI cert", "dmi professional diploma", "digital marketing diploma"],
        "skills": ["Digital Marketing", "Social Media Marketing", "SEO", "Email Marketing"]
    },
    "Facebook Blueprint Certification": {
        "aliases": ["facebook blueprint", "meta blueprint cert", "facebook ads cert"],
        "skills": ["Social Media Marketing", "Facebook Advertising", "Digital Marketing"]
    },
    "Google Digital Marketing and E-commerce Certificate": {
        "aliases": ["google digital marketing cert", "coursera google marketing"],
        "skills": ["Digital Marketing", "Google Analytics", "E-Commerce", "SEO"]
    },
    "LinkedIn Marketing Labs Certification": {
        "aliases": ["linkedin marketing cert", "linkedin ads cert"],
        "skills": ["LinkedIn Advertising", "B2B Marketing", "Social Media Marketing"]
    },
    "Content Marketing Certification": {
        "aliases": ["content marketing cert", "copyblogger cert"],
        "skills": ["Content Marketing", "Blogging", "SEO", "Content Strategy"]
    },
    "Email Marketing Certification": {
        "aliases": ["mailchimp cert", "klaviyo certification", "email cert"],
        "skills": ["Email Marketing", "Marketing Automation", "A/B Testing"]
    },
    "Salesforce Marketing Cloud Email Specialist": {
        "aliases": ["sfmc email cert", "marketing cloud email cert"],
        "skills": ["Salesforce", "Email Marketing", "Marketing Automation", "CRM"]
    },
    "Salesforce Certified Pardot Specialist": {
        "aliases": ["pardot cert", "salesforce pardot marketing"],
        "skills": ["Marketing Automation", "Salesforce", "Lead Generation", "B2B Marketing"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # SUPPLY CHAIN — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Certified Planning and Inventory Management": {
        "aliases": ["CPIM cert", "apics cpim cert"],
        "skills": ["Inventory Management", "Production Planning", "Supply Chain Management"]
    },
    "Six Sigma for Supply Chain": {
        "aliases": ["supply chain six sigma", "lean sigma supply chain"],
        "skills": ["Six Sigma", "Supply Chain Management", "Process Improvement"]
    },
    "Chartered Institute of Procurement and Supply": {
        "aliases": ["CIPS cert", "cips level 4 5 6", "procurement cips"],
        "skills": ["Procurement", "Supply Chain Management", "Contract Management"]
    },
    "IATA Dangerous Goods Regulation": {
        "aliases": ["iata dgr cert", "dangerous goods cert", "dg regulations cert"],
        "skills": ["Logistics", "Aviation", "Supply Chain Management", "Compliance"]
    },
    "Certified Purchasing Manager": {
        "aliases": ["CPM cert", "iism purchasing cert", "purchasing manager cert"],
        "skills": ["Procurement", "Vendor Management", "Supply Chain Management"]
    },
    "Supply Chain Management Professional": {
        "aliases": ["SCMP cert", "supply chain pro cert"],
        "skills": ["Supply Chain Management", "Logistics", "Demand Forecasting"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # HEALTHCARE — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Certified Healthcare Financial Professional": {
        "aliases": ["CHFP cert", "hfma cert", "healthcare finance cert"],
        "skills": ["Healthcare", "Finance", "Medical Billing", "Revenue Cycle"]
    },
    "Certified Medical Coder": {
        "aliases": ["CPC-A", "aapc coder", "medical coding cert"],
        "skills": ["Medical Coding", "ICD-10", "CPT Codes", "Healthcare"]
    },
    "Certified Nurse Assistant": {
        "aliases": ["CNA cert", "nursing assistant cert"],
        "skills": ["Nursing", "Patient Care", "Healthcare", "Healthcare Assistance"]
    },
    "Certified Pharmacy Technician": {
        "aliases": ["CPhT", "ptcb cert", "pharmacy tech cert"],
        "skills": ["Pharmacy", "Drug Dispensing", "Healthcare"]
    },
    "HIPAA Compliance Certification": {
        "aliases": ["hipaa certified", "healthcare privacy cert", "hipaa training cert"],
        "skills": ["HIPAA", "Healthcare", "Data Protection Law", "Compliance"]
    },
    "Health IT Certification": {
        "aliases": ["ANCC health it", "health informatics cert"],
        "skills": ["Healthcare IT", "EHR", "HIPAA", "Health Information Systems"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # LEGAL — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "LLM": {
        "aliases": ["Master of Laws", "llm degree", "legal postgraduate", "llm law"],
        "skills": ["Contract Drafting", "Legal Research", "Employment Law", "Corporate Law"]
    },
    "Bar Council Enrollment": {
        "aliases": ["bar exam qualified", "bar council member", "barrister qualification"],
        "skills": ["Litigation", "Legal Drafting", "Contract Law", "Advocacy"]
    },
    "CIPP/E Privacy Certification": {
        "aliases": ["iapp cippe", "eu privacy cert", "european privacy cert"],
        "skills": ["GDPR", "Data Protection Law", "Privacy Law", "Compliance"]
    },
    "CIPP/US Privacy Certification": {
        "aliases": ["iapp cipp us", "us privacy cert"],
        "skills": ["Data Protection Law", "CCPA", "Privacy Law", "Compliance"]
    },
    "GDPR Practitioner Certificate": {
        "aliases": ["bcs gdpr cert", "gdpr practitioner cert"],
        "skills": ["GDPR", "Data Protection", "Privacy Compliance"]
    },
    "Compliance and Ethics Professional": {
        "aliases": ["CCEP cert", "scce compliance cert"],
        "skills": ["Compliance", "Ethics", "Regulatory Compliance"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # ENGINEERING — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Certified Systems Engineering Professional": {
        "aliases": ["CSEP cert", "incose csep", "systems engineering cert"],
        "skills": ["System Design", "Systems Engineering", "Requirements Engineering"]
    },
    "Project Management Institute Risk Management": {
        "aliases": ["PMI-RMP cert", "risk management cert", "pmi rmp"],
        "skills": ["Risk Management", "Project Management", "Risk Assessment"]
    },
    "Certified Energy Auditor": {
        "aliases": ["CEA cert", "energy audit cert", "aee cea"],
        "skills": ["Energy Management", "Electrical Engineering", "Sustainability"]
    },
    "ASHRAE Certification": {
        "aliases": ["ashrae energy cert", "be engineer cert"],
        "skills": ["HVAC", "Building Engineering", "Energy Efficiency"]
    },
    "Autodesk Certified Professional": {
        "aliases": ["ACP autocad", "revit autodesk cert", "autocad professional cert"],
        "skills": ["AutoCAD", "Revit", "BIM", "3D Modeling"]
    },
    "Autodesk Certified Instructor": {
        "aliases": ["ACI cert", "autocad instructor cert"],
        "skills": ["AutoCAD", "Teaching", "CAD Design"]
    },
    "ANSYS Certified Professional": {
        "aliases": ["ansys cert", "fea cert"],
        "skills": ["ANSYS", "FEA", "CFD", "Simulation"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # EDUCATION — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Certified Professional in Talent Development": {
        "aliases": ["CPTD cert", "atd talent cert"],
        "skills": ["Learning and Development", "Training Delivery", "Instructional Design"]
    },
    "Associate Professional in Talent Development": {
        "aliases": ["APTD cert", "atd aptd"],
        "skills": ["Learning and Development", "Training", "E-Learning Design"]
    },
    "Certified Online Learning Facilitator": {
        "aliases": ["online facilitator cert", "virtual trainer cert"],
        "skills": ["E-Learning Design", "Online Teaching", "Moodle", "Google Classroom"]
    },
    "Google Certified Educator": {
        "aliases": ["google educator cert", "google trainer cert", "GCE level 1 2"],
        "skills": ["Google Workspace", "Educational Technology", "Google Classroom"]
    },
    "Microsoft Certified Educator": {
        "aliases": ["MCE cert", "microsoft educator cert"],
        "skills": ["Microsoft Office", "Educational Technology", "Teams for Education"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # DESIGN — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Interaction Design Foundation Certificate": {
        "aliases": ["IDF cert", "ux ixdf cert", "interaction design cert"],
        "skills": ["User Experience", "Interaction Design", "User Research", "Wireframing"]
    },
    "Nielsen Norman Group UX Certification": {
        "aliases": ["NN/g UX cert", "nngroup cert", "ux specialist cert"],
        "skills": ["User Experience", "Usability Testing", "User Research", "Interaction Design"]
    },
    "Figma Professional Designer Certification": {
        "aliases": ["figma cert", "figma professional", "figma certified designer"],
        "skills": ["Figma", "User Interface", "Prototyping", "Wireframing"]
    },
    "Certified in Art Direction": {
        "aliases": ["art director cert", "creative director cert"],
        "skills": ["Graphic Design", "Art Direction", "Brand Management", "Adobe Illustrator"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # REAL ESTATE — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Certified Residential Specialist": {
        "aliases": ["CRS cert", "residential specialist cert"],
        "skills": ["Real Estate Sales", "Property Management", "Real Estate Law"]
    },
    "Accredited Buyer's Representative": {
        "aliases": ["ABR cert", "buyer rep cert", "nar abr"],
        "skills": ["Real Estate Sales", "Client Management", "Negotiation"]
    },
    "Chartered Surveyor": {
        "aliases": ["MRICS cert", "rics surveyor", "chartered surveyor cert"],
        "skills": ["Property Valuation", "Real Estate Appraisal", "Structural Surveying"]
    },
    "RERA Real Estate Agent Certification": {
        "aliases": ["rera cert india", "rera registered agent", "rera dealer cert"],
        "skills": ["Real Estate Sales", "RERA Compliance", "Property Management"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # HOSPITALITY — EXPANDED
    # ══════════════════════════════════════════════════════════════════════
    "Certified Hotel Administrator": {
        "aliases": ["CHA cert", "ahla cha", "hotel admin cert"],
        "skills": ["Hotel Management", "Revenue Management", "Operations Management"]
    },
    "Certified Food and Beverage Executive": {
        "aliases": ["CFBE cert", "fb manager cert"],
        "skills": ["Food and Beverage Management", "Hotel Management", "Cost Control"]
    },
    "WSET Wine and Spirit Education": {
        "aliases": ["WSET cert", "wine cert", "wset level 1 2 3 4"],
        "skills": ["Food and Beverage Management", "Wine Knowledge", "Hospitality"]
    },
    "ServSafe Food Handler": {
        "aliases": ["servsafe cert", "food handler cert", "food safety cert"],
        "skills": ["HACCP", "Food Safety", "Culinary Arts", "Kitchen Management"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # ENVIRONMENT AND SUSTAINABILITY
    # ══════════════════════════════════════════════════════════════════════
    "ISO 14001 Environmental Management": {
        "aliases": ["iso 14001 cert", "ems certified", "environmental management cert"],
        "skills": ["ISO 14001", "Environmental Management", "EHS", "Sustainability"]
    },
    "GRI Sustainability Reporting Standards": {
        "aliases": ["GRI cert", "sustainability reporting cert", "esg reporting cert"],
        "skills": ["Sustainability Reporting", "ESG", "Environmental Management"]
    },
    "Sustainability and ESG Analyst": {
        "aliases": ["ESG analyst cert", "sfaf esg cert", "sustainability analyst cert"],
        "skills": ["ESG", "Sustainability", "Environmental Management", "Financial Analysis"]
    },
    "Carbon Footprint Management Certification": {
        "aliases": ["carbon cert", "carbon footprint cert"],
        "skills": ["Carbon Footprint Analysis", "Environmental Science", "Sustainability"]
    },
    "NEBOSH Environmental Diploma": {
        "aliases": ["nebosh env cert", "environmental health safety cert"],
        "skills": ["EHS", "Environmental Management", "ISO 14001", "Compliance"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # RAILWAYS, LOGISTICS, TRANSPORT
    # ══════════════════════════════════════════════════════════════════════
    "Certified in Transportation and Logistics": {
        "aliases": ["CTL cert", "transportation cert", "logistics certified"],
        "skills": ["Logistics", "Transportation Management", "Supply Chain Management"]
    },
    "IATA Foundation Diploma": {
        "aliases": ["iata diploma", "iata cert", "aviation logistics cert"],
        "skills": ["Aviation", "Freight Forwarding", "Logistics", "IATA Regulations"]
    },
    "Certified Logistics Professional": {
        "aliases": ["CLP logistics", "logistics pro cert"],
        "skills": ["Logistics", "Warehouse Management System", "Supply Chain Management"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # SOCIAL WORK AND NGO
    # ══════════════════════════════════════════════════════════════════════
    "Certified Social Worker": {
        "aliases": ["CSW cert", "licensed social worker lsw", "clinical social worker lcsw"],
        "skills": ["Social Work", "Community Development", "Case Management"]
    },
    "Project Management for NGOs": {
        "aliases": ["pm4ngos cert", "ngo project management"],
        "skills": ["Non-Profit Management", "Project Management", "Community Development"]
    },
    "Certified Fund Raising Executive": {
        "aliases": ["CFRE cert", "fundraising cert", "cfre international"],
        "skills": ["Grant Writing", "Non-Profit Management", "Community Development"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # AUTOMOTIVE
    # ══════════════════════════════════════════════════════════════════════
    "ASE Automotive Service Excellence": {
        "aliases": ["ASE certified", "ase mechanic cert", "automotive service cert"],
        "skills": ["Automotive Engineering", "Vehicle Diagnostics", "Workshop Management"]
    },
    "ISO 26262 Functional Safety": {
        "aliases": ["iso 26262 cert", "automotive safety cert", "fusa cert"],
        "skills": ["Automotive Engineering", "AUTOSAR", "Safety Engineering"]
    },
    "Automotive SPICE": {
        "aliases": ["ASPICE cert", "a-spice process cert"],
        "skills": ["Automotive Engineering", "Software Development", "Quality Management"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # BLOCKCHAIN AND WEB3
    # ══════════════════════════════════════════════════════════════════════
    "Certified Blockchain Developer": {
        "aliases": ["CBD cert", "ec council blockchain cert", "blockchain dev cert"],
        "skills": ["Blockchain", "Solidity", "Ethereum", "Smart Contracts"]
    },
    "Certified Bitcoin Professional": {
        "aliases": ["CBP cert", "crypto currency institute cert"],
        "skills": ["Blockchain", "Bitcoin", "Cryptocurrency", "Decentralized Finance"]
    },
    "Ethereum Developer Certification": {
        "aliases": ["ethereum cert", "solidity developer cert"],
        "skills": ["Ethereum", "Solidity", "Web3.js", "Smart Contracts", "DeFi"]
    },
    "ConsenSys Academy Developer Bootcamp": {
        "aliases": ["consensys cert", "ethereum bootcamp cert"],
        "skills": ["Ethereum", "Solidity", "Web3.js", "DeFi", "IPFS"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # JOURNALISM AND MEDIA
    # ══════════════════════════════════════════════════════════════════════
    "Journalism Certificate": {
        "aliases": ["print journalism cert", "broadcast journalism cert", "media cert"],
        "skills": ["Journalism", "Content Writing", "Public Relations", "Media Planning"]
    },
    "Social Media Management Certification": {
        "aliases": ["hootsuite social cert", "social media manager cert"],
        "skills": ["Social Media Marketing", "Content Creation", "Brand Communications"]
    },
    "Adobe Certified Video Professional": {
        "aliases": ["adobe premiere cert", "after effects cert", "adobe video cert"],
        "skills": ["Video Editing", "Motion Design", "Adobe Premiere", "Adobe After Effects"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # SPORTS AND FITNESS
    # ══════════════════════════════════════════════════════════════════════
    "NASM Certified Personal Trainer": {
        "aliases": ["NASM CPT", "personal trainer cert nasm", "nasm cert"],
        "skills": ["Personal Training", "Sports Science", "Fitness", "Strength Training"]
    },
    "ACE Fitness Certification": {
        "aliases": ["ACE CPT", "ace certified", "american council exercise cert"],
        "skills": ["Personal Training", "Fitness", "Exercise Physiology"]
    },
    "Certified Strength and Conditioning Specialist": {
        "aliases": ["CSCS cert", "nsca cscs", "strength conditioning cert"],
        "skills": ["Strength Training", "Sports Science", "Athletic Training", "Sports Medicine"]
    },
    "Yoga Alliance Certification": {
        "aliases": ["RYT 200 500", "yoga teacher cert", "ryt certified"],
        "skills": ["Yoga Instructor", "Wellness Coaching", "Mindfulness"]
    },
    "Certified Athletic Trainer": {
        "aliases": ["ATC cert", "nata certified", "athletic trainer cert"],
        "skills": ["Sports Medicine", "Rehabilitation", "Injury Prevention"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # FORENSICS
    # ══════════════════════════════════════════════════════════════════════
    "Certified Digital Forensics Examiner": {
        "aliases": ["CDFE cert", "digital forensics cert", "miiis cdfe"],
        "skills": ["Digital Forensics", "Cybersecurity", "Evidence Recovery"]
    },
    "SANS GIAC Forensics Certification": {
        "aliases": ["GCFE cert", "GCFA cert", "sans forensics cert"],
        "skills": ["Digital Forensics", "Incident Response", "Cybersecurity"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # LANGUAGE CERTIFICATIONS
    # ══════════════════════════════════════════════════════════════════════
    "IELTS": {
        "aliases": ["ielts academic", "ielts general", "ielts score 7 8 9", "british council ielts"],
        "skills": ["Communication", "English Language", "Writing", "Presentation Skills"]
    },
    "TOEFL iBT": {
        "aliases": ["toefl cert", "ets toefl", "toefl score"],
        "skills": ["Communication", "English Language", "Academic Writing"]
    },
    "TOEIC": {
        "aliases": ["toeic business english", "toeic cert"],
        "skills": ["Communication", "English Language", "Business Communication"]
    },
    "DELF/DALF French": {
        "aliases": ["delf cert", "dalf cert", "french proficiency cert"],
        "skills": ["French Language", "Communication"]
    },
    "Goethe Institute German": {
        "aliases": ["goethe cert", "german proficiency cert", "a1 a2 b1 b2 c1 c2 german"],
        "skills": ["German Language", "Communication"]
    },

    # ══════════════════════════════════════════════════════════════════════
    # ACTUARIAL
    # ══════════════════════════════════════════════════════════════════════
    "SOA Actuarial Exams": {
        "aliases": ["SOA P FM IFM", "society of actuaries exam", "actuarial exam passed"],
        "skills": ["Actuarial Science", "Probability", "Statistics", "Financial Modeling"]
    },
    "CAS Casualty Actuarial Society": {
        "aliases": ["CAS exams", "casualty actuarial cert", "p&c actuarial"],
        "skills": ["Actuarial Science", "General Insurance Actuarial", "Risk Management"]
    },

}

# Merge into existing, deduplicating aliases
for cert_name, data in more_certs.items():
    if cert_name in certs:
        existing = certs[cert_name]
        existing_aliases = {a.lower() for a in existing.get("aliases", [])}
        for alias in data.get("aliases", []):
            if alias.lower() not in existing_aliases:
                existing["aliases"].append(alias)
                existing_aliases.add(alias.lower())
        existing_skills = set(existing.get("skills", []))
        for skill in data.get("skills", []):
            existing_skills.add(skill)
        existing["skills"] = list(existing_skills)
    else:
        certs[cert_name] = data

with open("certificates_list.json", "w") as f:
    json.dump(certs, f, indent=2)

total = len(certs)
total_aliases = sum(len(v.get("aliases", [])) for v in certs.values())
total_skills  = sum(len(v.get("skills", []))  for v in certs.values())
print(f"Total certificates: {total}")
print(f"Total alias variants: {total_aliases}")
print(f"Total skill links: {total_skills}")
print(f"Grand total data points: {total + total_aliases + total_skills}")
