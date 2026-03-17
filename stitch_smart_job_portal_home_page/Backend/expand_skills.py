import json
from typing import Dict, List

with open("skills_list.json", "r") as f:
    skills: Dict[str, List[str]] = json.load(f)

new_domains = {

    # ══════════════════════════════════════════════════════════════════════
    # REAL ESTATE
    # ══════════════════════════════════════════════════════════════════════
    "Real Estate Appraisal": ["property valuation", "appraisal report", "market value estimation", "appraisal analyst"],
    "Real Estate Sales": ["property agent", "real estate broker", "realtor", "property dealer", "commercial sales agent"],
    "Property Management": ["rental management", "tenant management", "facility management", "property manager"],
    "Real Estate Development": ["land development", "real estate developer", "site acquisition", "project development"],
    "Mortgage Finance": ["home loan", "mortgage processing", "loan underwriting", "mortgage advisor"],
    "Lease Management": ["lease agreement", "lease negotiation", "commercial lease"],
    "MLS": ["multiple listing service", "mls listings", "real estate mls"],
    "AutoCAD for Real Estate": ["floor plan cad", "space planning"],
    "Real Estate Law": ["property law", "conveyancing", "title search"],
    "Real Estate CRM": ["property crm", "agent crm software"],
    "RERA Compliance": ["rera agent", "rera registration", "real estate regulation"],

    # ══════════════════════════════════════════════════════════════════════
    # HOSPITALITY & HOTEL MANAGEMENT
    # ══════════════════════════════════════════════════════════════════════
    "Hotel Management": ["hotel operations", "property management hospitality", "hotel manager", "gm hotel"],
    "Front Office Management": ["front desk", "guest relations", "reception management", "check-in checkout"],
    "Food and Beverage Management": ["fb manager", "restaurant management", "banquet management"],
    "Housekeeping Management": ["housekeeping supervisor", "room cleanliness standards"],
    "Revenue Management": ["hotel revenue", "yield management", "occupancy optimization", "adr revpar"],
    "Property Management System": ["pms software", "opera pms", "cloudbed pms"],
    "OTA Management": ["booking.com management", "expedia management", "online travel agent"],
    "Guest Experience": ["hospitality service", "guest satisfaction", "csat hospitality"],
    "Event Banquet Management": ["banquet coordinator", "event catering", "banquet hall management"],
    "HACCP": ["food safety haccp", "hazard analysis critical control points", "food hygiene"],
    "ISO 22000": ["food safety management system"],

    # ══════════════════════════════════════════════════════════════════════
    # TOURISM AND TRAVEL
    # ══════════════════════════════════════════════════════════════════════
    "Travel Management": ["travel coordinator", "corporate travel", "business travel planning"],
    "Tour Operations": ["tour operator", "itinerary planning", "tour guide", "group travel"],
    "Travel Agency Management": ["travel agency", "gds booking", "travel desk"],
    "GDS Systems": ["amadeus gds", "sabre gds", "galileo gds", "travel booking systems"],
    "Ecotourism": ["sustainable tourism", "eco travel", "responsible tourism"],
    "Destination Management": ["dmc", "destination management company"],

    # ══════════════════════════════════════════════════════════════════════
    # EVENT MANAGEMENT
    # ══════════════════════════════════════════════════════════════════════
    "Event Planning": ["event coordinator", "event organizer", "corporate events", "event execution"],
    "Wedding Planning": ["wedding coordinator", "bridal planning", "wedding event manager"],
    "Conference Management": ["conference organizer", "seminar planning", "meeting planner", "pcm"],
    "Exhibition Management": ["trade show management", "expo coordinator", "exhibition planning"],
    "Venue Management": ["venue selector", "venue booking", "venue operations"],
    "Event Marketing": ["event promotion", "event publicity", "experiential marketing"],
    "Audio Visual Events": ["av setup events", "sound lighting events"],
    "Budgeting Events": ["event budgeting", "cost management events"],

    # ══════════════════════════════════════════════════════════════════════
    # AGRICULTURE AND AGRITECH
    # ══════════════════════════════════════════════════════════════════════
    "Precision Agriculture": ["precision farming", "gps guided farming", "smart farming"],
    "Agricultural Engineering": ["farm machinery", "irrigation engineering", "agri machinery"],
    "Soil Science": ["soil testing", "soil health analysis", "soil fertility"],
    "Crop Science": ["crop management", "agronomy", "crop yield", "horticulture crops"],
    "Livestock Management": ["animal husbandry", "dairy farm management", "poultry management"],
    "Remote Sensing Agriculture": ["satellite agriculture", "ndvi analysis", "agri drone"],
    "Farm Management Software": ["farmforce", "agrivi", "farm management tool"],
    "Irrigation Design": ["drip irrigation", "sprinkler system", "water management farm"],
    "Post-Harvest Technology": ["cold storage agri", "grading sorting", "food processing post harvest"],
    "Hydroponics": ["indoor farming", "vertical farming", "hydroponic system"],
    "AgriTech": ["agricultural technology", "smart agriculture", "digital farming"],
    "Plant Pathology": ["disease management crops", "fungicide application"],
    "Pest Management": ["integrated pest management", "ipm", "pesticide application"],
    "Fertilizer Management": ["nutrient management", "crop nutrition", "fertilizer schedule"],

    # ══════════════════════════════════════════════════════════════════════
    # AUTOMOTIVE AND VEHICLE ENGINEERING
    # ══════════════════════════════════════════════════════════════════════
    "Automotive Engineering": ["vehicle design", "automobile engineering", "car engineer"],
    "Vehicle Diagnostics": ["obd2 diagnostics", "ecu programming", "vehicle scan tool"],
    "Engine Design": ["internal combustion engine", "ic engine", "engine analysis"],
    "Transmission Design": ["gearbox design", "drivetrain"],
    "Chassis Design": ["suspension design", "chassis engineering", "vehicle dynamics"],
    "Automotive CAD": ["catia automotive", "nx automotive cad"],
    "AUTOSAR": ["autosar standard", "automotive software"],
    "CAN Bus Automotive": ["can protocol automotive", "automotive networking", "lin bus"],
    "Electric Vehicle Design": ["ev powertrain", "ev battery systems", "ev architecture"],
    "Vehicle Safety": ["ncap", "crash simulation", "passive safety"],
    "Automotive Testing": ["rig testing", "vehicle validation", "eol testing"],
    "Workshop Management": ["auto repair shop", "service center management"],

    # ══════════════════════════════════════════════════════════════════════
    # PETROLEUM AND OIL GAS
    # ══════════════════════════════════════════════════════════════════════
    "Petroleum Engineering": ["oil and gas engineer", "reservoir engineer", "drilling engineer"],
    "Reservoir Simulation": ["eclipse simulator", "petrel software", "reservoir modeling"],
    "Drilling Engineering": ["drill bit design", "well planning", "directional drilling"],
    "Well Completion": ["well casing", "cementing", "perforating"],
    "Production Engineering": ["artificial lift", "gas lift", "esp pump"],
    "Pipeline Engineering": ["pipeline design", "pipeline integrity", "flow assurance"],
    "HAZOP Oil Gas": ["process safety review", "pha oil gas"],
    "Refinery Operations": ["refinery engineer", "crude oil processing"],
    "Offshore Engineering": ["offshore platform", "subsea engineering", "fpso"],
    "PVT Analysis": ["pressure volume temperature", "fluid properties"],
    "HSE Oil Gas": ["health safety environment", "hse officer", "safety management oilfield"],

    # ══════════════════════════════════════════════════════════════════════
    # MINING AND MINERALS
    # ══════════════════════════════════════════════════════════════════════
    "Mining Engineering": ["mine engineer", "mineral extraction", "open pit mining"],
    "Mine Planning": ["mine design", "pit optimization", "mine plan software"],
    "Blasting Engineering": ["drill blast", "explosive design", "blast vibration"],
    "Ventilation Engineering": ["mine ventilation", "airflow underground"],
    "Geotechnical Mining": ["slope stability", "rock mechanics"],
    "Ore Processing": ["mineral processing", "flotation", "leaching"],
    "Surpac": ["surpac mine planning", "surpac software"],
    "Datamine": ["datamine studio", "mining software"],

    # ══════════════════════════════════════════════════════════════════════
    # NAVAL AND MARINE ENGINEERING
    # ══════════════════════════════════════════════════════════════════════
    "Naval Architecture": ["ship design", "hull design", "ship stability"],
    "Marine Engineering": ["marine propulsion", "ship machinery", "offshore marine"],
    "Ship Systems": ["ballast systems", "bilge systems", "marpol compliance"],
    "Hydrodynamics": ["hull resistance", "ship hydrodynamics"],
    "Ocean Engineering": ["offshore structures", "wave analysis"],
    "Port Management": ["port operations", "harbor management", "maritime logistics"],
    "Maritime Safety": ["solas compliance", "imo regulations"],

    # ══════════════════════════════════════════════════════════════════════
    # NUCLEAR ENGINEERING
    # ══════════════════════════════════════════════════════════════════════
    "Nuclear Engineering": ["nuclear power plant", "reactor design", "nuclear safety"],
    "Reactor Physics": ["neutron transport", "criticality calculations"],
    "Radiation Safety": ["radiation protection", "dosimetry"],
    "Nuclear Fuel Cycle": ["fuel fabrication", "enrichment", "reprocessing"],
    "Thermal Hydraulics": ["reactor cooling", "heat transfer nuclear"],

    # ══════════════════════════════════════════════════════════════════════
    # GEOLOGY AND EARTH SCIENCES
    # ══════════════════════════════════════════════════════════════════════
    "Geology": ["geological survey", "rock analysis", "geologist"],
    "Geophysics": ["seismic surveys", "ground penetrating radar", "gravity survey"],
    "Remote Sensing": ["satellite imagery analysis", "raster data", "land cover mapping"],
    "Geospatial Analysis": ["gis analysis", "spatial data analysis", "geospatial data"],
    "Cartography": ["map design", "thematic maps", "digital cartography"],
    "Oceanography": ["ocean surveys", "marine data", "physical oceanography"],
    "Meteorology": ["weather forecasting", "climate data", "atmospheric science", "weather modeling"],
    "Hydrology": ["watershed analysis", "flood modeling", "groundwater study"],
    "Volcanology": ["volcanic studies", "eruption modeling"],
    "Seismology": ["earthquake data", "seismic analysis"],

    # ══════════════════════════════════════════════════════════════════════
    # HEALTHCARE — SPECIALIZED ROLES
    # ══════════════════════════════════════════════════════════════════════
    "Nursing": ["registered nurse rn", "patient care nurse", "icu nurse", "er nurse", "bedside nursing"],
    "Pharmacy": ["pharmacist", "drug dispensing", "pharmaceutical care", "compounding pharmacy"],
    "Physical Therapy": ["physiotherapy", "physiotherapist", "musculoskeletal therapy", "rehabilitation"],
    "Occupational Therapy": ["ot therapist", "occupational rehabilitation", "functional therapy"],
    "Mental Health Counseling": ["counselor", "psychotherapy", "cbt therapy", "clinical counseling"],
    "Dentistry": ["dental practice", "oral care", "dental surgery", "orthodontics"],
    "Radiology": ["radiologist", "mri interpretation", "ct scan radiology", "diagnostic imaging"],
    "Pathology": ["pathology lab", "histopathology", "clinical pathology"],
    "Optometry": ["eye care", "optical prescription", "ophthalmic"],
    "Anesthesiology": ["anesthesia care", "anesthesiologist"],
    "Public Health": ["community health", "epidemiology", "health promotion", "sanitation"],
    "Health Administration": ["hospital administration", "healthcare management"],

    # ══════════════════════════════════════════════════════════════════════
    # MENTAL HEALTH AND PSYCHOLOGY
    # ══════════════════════════════════════════════════════════════════════
    "Clinical Psychology": ["therapist", "psychological assessment", "clinical psychologist"],
    "Cognitive Behavioral Therapy": ["cbt practitioner", "cbt techniques"],
    "School Counseling": ["academic counselor", "student counseling"],
    "Neuropsychology": ["brain function testing", "cognitive assessment"],
    "Psychometrics": ["psychological testing", "test standardization"],
    "Addiction Counseling": ["substance abuse counseling", "recovery program"],

    # ══════════════════════════════════════════════════════════════════════
    # MUSIC AND AUDIO PRODUCTION
    # ══════════════════════════════════════════════════════════════════════
    "Music Production": ["music producer", "beat making", "music mixing"],
    "Audio Engineering": ["sound engineer", "studio recording", "audio mixing mastering"],
    "DAW": ["digital audio workstation", "ableton live", "fl studio", "logic pro", "pro tools"],
    "Sound Design": ["foley artist", "sfx design", "sound effects production"],
    "Music Composition": ["composer", "film scoring", "orchestration"],
    "MIDI Programming": ["midi sequencing", "virtual instruments"],
    "Podcast Production": ["podcast editing", "podcast recording", "podcast host"],
    "Voice Over": ["voice acting", "voiceover recording"],
    "Acoustics": ["room acoustics", "acoustic treatment"],
    "DJ": ["dj sets", "turntablism", "live mixing"],
    "Live Sound": ["foh engineer", "live audio mixing", "pa systems"],

    # ══════════════════════════════════════════════════════════════════════
    # FASHION AND TEXTILE
    # ══════════════════════════════════════════════════════════════════════
    "Fashion Design": ["garment design", "apparel design", "clothing designer"],
    "Textile Engineering": ["fabric testing", "yarn production", "textile machinery"],
    "Pattern Making": ["garment pattern", "grading patterns", "pattern drafting"],
    "Fashion Merchandising": ["retail buying", "fashion buying", "apparel merchandise"],
    "Textile Testing": ["fabric quality tests", "tensile strength fabric"],
    "Fashion Illustration": ["clo 3d", "garment rendering", "fashion sketching"],
    "Embroidery and Printing": ["screen printing fabric", "embroidery digitizing"],
    "Supply Chain Fashion": ["garment supply chain", "sourcing apparel"],

    # ══════════════════════════════════════════════════════════════════════
    # CULINARY AND FOOD SCIENCE
    # ══════════════════════════════════════════════════════════════════════
    "Food Science": ["food technology", "food formulation", "food safety science"],
    "Culinary Arts": ["chef", "cooking", "culinary skills", "professional cooking"],
    "Baking and Pastry": ["pastry chef", "bakery operations", "cake design"],
    "Food Product Development": ["new product development food", "npd food"],
    "Food Quality Control": ["food qc", "food inspection", "sensory evaluation"],
    "Nutrition and Dietetics": ["dietitian", "clinical nutrition", "sports nutrition", "meal planning"],
    "Barista": ["coffee preparation", "espresso", "latte art", "coffee brewing"],
    "FSSAI": ["food safety india", "fssai license", "fpo certification"],

    # ══════════════════════════════════════════════════════════════════════
    # SPORTS AND FITNESS
    # ══════════════════════════════════════════════════════════════════════
    "Sports Coaching": ["football coach", "cricket coach", "athletic coach", "fitness trainer"],
    "Personal Training": ["personal fitness trainer", "gym trainer", "strength and conditioning"],
    "Sports Science": ["exercise physiology", "biomechanics sports", "sports analytics"],
    "Sports Medicine": ["sports physiotherapy", "athlete recovery", "injury rehab sports"],
    "Yoga Instructor": ["yoga teacher", "yoga trainer", "hatha yoga", "yoga certification"],
    "Wellness Coaching": ["health coach", "wellbeing coach", "lifestyle coach"],
    "Sports Management": ["sports event management", "sports club management", "sports administration"],
    "Fitness App Development": ["workout app", "health monitoring app"],

    # ══════════════════════════════════════════════════════════════════════
    # SOCIAL WORK AND COMMUNITY
    # ══════════════════════════════════════════════════════════════════════
    "Social Work": ["community worker", "social worker", "case management social"],
    "Community Development": ["community programs", "grassroots initiatives", "community outreach"],
    "Non-Profit Management": ["ngo management", "nonprofit operations", "charity management"],
    "Grant Writing": ["grant proposals", "fundraising proposals", "funding applications"],
    "Child Welfare": ["child protection", "foster care", "case worker children"],
    "Elderly Care": ["senior care", "aged care", "geriatric services"],
    "Disability Services": ["disability support worker", "ndis", "inclusive programs"],
    "Crisis Intervention": ["crisis counseling", "emergency social work"],
    "Volunteer Management": ["volunteer coordinator", "volunteer program"],

    # ══════════════════════════════════════════════════════════════════════
    # PUBLIC POLICY AND GOVERNANCE
    # ══════════════════════════════════════════════════════════════════════
    "Public Policy Analysis": ["policy analysis", "policy researcher", "public affairs"],
    "Government Relations": ["government liaison", "government affairs", "regulatory affairs"],
    "Political Science": ["political analyst", "policy development", "political research"],
    "International Relations": ["diplomacy", "foreign policy", "international development"],
    "Economics": ["economic analysis", "econometrics", "macroeconomics", "microeconomics"],
    "Public Administration": ["civil services", "public sector", "government admin"],
    "Urban Policy": ["city planning policy", "municipal governance"],
    "Election Management": ["electoral officer", "election commission", "voter management"],
    "Development Economics": ["poverty reduction", "sustainable development goals", "sdgs"],

    # ══════════════════════════════════════════════════════════════════════
    # FORENSIC SCIENCE
    # ══════════════════════════════════════════════════════════════════════
    "Forensic Science": ["forensic analyst", "crime lab", "forensic investigation"],
    "Digital Forensics": ["computer forensics", "evidence recovery", "cybercrime investigation"],
    "Forensic Accounting": ["financial crime investigation", "fraud forensic"],
    "Ballistics": ["firearms examination", "ballistic analysis"],
    "DNA Analysis": ["forensic dna", "dna profiling"],
    "Fingerprint Analysis": ["fingerprint expert", "dactyloscopy"],
    "Crime Scene Investigation": ["csi", "evidence collection"],

    # ══════════════════════════════════════════════════════════════════════
    # ACTUARIAL SCIENCE
    # ══════════════════════════════════════════════════════════════════════
    "Actuarial Science": ["actuarial analyst", "actuarial modeling", "risk actuary"],
    "Life Insurance Actuarial": ["mortality tables", "life premium calculation"],
    "General Insurance Actuarial": ["p&c actuarial", "non-life pricing"],
    "Pension Actuarial": ["pension valuation", "retirement actuarial"],
    "Catastrophe Modeling": ["cat model", "reinsurance pricing"],

    # ══════════════════════════════════════════════════════════════════════
    # INSURANCE
    # ══════════════════════════════════════════════════════════════════════
    "Insurance Underwriting": ["policy underwriting", "risk underwriting", "insurance risk"],
    "Insurance Claims": ["claims adjuster", "claims processing", "loss assessment"],
    "Insurance Sales": ["insurance advisor", "life insurance agent", "general insurance agent"],
    "Reinsurance": ["treaty reinsurance", "facultative reinsurance"],
    "Health Insurance": ["medical insurance", "group health plan"],

    # ══════════════════════════════════════════════════════════════════════
    # AVIATION
    # ══════════════════════════════════════════════════════════════════════
    "Airline Operations": ["airline management", "ground operations", "flight operations"],
    "Air Traffic Control": ["atc", "air traffic management", "tower control"],
    "Aviation Maintenance": ["aircraft maintenance", "ame", "aircraft mechanic"],
    "Pilot": ["commercial pilot cpl", "private pilot ppl", "flight instructor", "atpl"],
    "Airport Management": ["airport operations", "terminal management"],
    "Aviation Safety": ["safety management system sms", "aviation sms"],
    "Flight Dispatch": ["flight dispatcher", "flight planning", "ops officer"],

    # ══════════════════════════════════════════════════════════════════════
    # VETERINARY MEDICINE
    # ══════════════════════════════════════════════════════════════════════
    "Veterinary Medicine": ["veterinarian", "vet doctor", "animal doctor", "clinical vet"],
    "Animal Surgery": ["veterinary surgeon", "surgical vet"],
    "Livestock Veterinary": ["farm animal vet", "large animal vet"],
    "Pet Care": ["small animal vet", "companion animal", "exotic animal"],
    "Veterinary Pathology": ["animal pathology lab", "veterinary diagnostics"],
    "Equine Veterinary": ["horse vet", "equine medicine"],

    # ══════════════════════════════════════════════════════════════════════
    # PHOTOGRAPHY AND VIDEOGRAPHY
    # ══════════════════════════════════════════════════════════════════════
    "Photography": ["professional photographer", "portrait photography", "product photography", "wedding photography"],
    "Videography": ["video production", "cinematographer", "videographer"],
    "Drone Photography": ["aerial photography", "uav photography"],
    "Photo Editing": ["lightroom editing", "photoshop retouch"],
    "Video Editing": ["premiere editing", "davinci color grade", "final cut editing"],
    "Studio Photography": ["studio lighting", "photo shoot"],
    "Photojournalism": ["news photography", "documentary photography"],

    # ══════════════════════════════════════════════════════════════════════
    # LIBRARY AND INFORMATION SCIENCE
    # ══════════════════════════════════════════════════════════════════════
    "Library Science": ["librarian", "cataloging", "library management"],
    "Information Management": ["knowledge management", "records management", "document management"],
    "Cataloging": ["marc records", "dewey decimal", "library cataloging"],
    "Digital Library": ["digital archiving", "institutional repository"],
    "Reference Services": ["research assistance", "reference librarian"],

    # ══════════════════════════════════════════════════════════════════════
    # TRADE AND SKILLED PROFESSIONS
    # ══════════════════════════════════════════════════════════════════════
    "Plumbing": ["plumber", "pipe fitting", "sanitation work"],
    "Electrical Work": ["electrician", "electrical wiring", "electrical installation"],
    "HVAC Technician": ["hvac installer", "ac maintenance", "hvac troubleshooting"],
    "Carpentry": ["carpenter", "woodworking", "furniture making"],
    "Welding Trade": ["certified welder", "metal fabrication"],
    "Masonry": ["bricklaying", "concrete work", "masonry construction"],
    "Painting": ["house painter", "industrial painting", "painting contractor"],
    "Roofing": ["roofer", "roof installation", "waterproofing"],
    "HVAC Refrigeration": ["refrigeration technician", "hvac/r", "chiller maintenance"],

    # ══════════════════════════════════════════════════════════════════════
    # E-COMMERCE AND DIGITAL BUSINESS
    # ══════════════════════════════════════════════════════════════════════
    "Shopify Development": ["shopify store", "shopify liquid", "shopify apps"],
    "WooCommerce": ["woocommerce store", "wordpress ecommerce"],
    "Amazon Seller Central": ["amazon fba", "amazon marketplace", "amazon seller"],
    "Dropshipping": ["drop ship business", "ecommerce sourcing"],
    "Product Listing Optimization": ["seo amazon", "listing quality"],
    "Digital Commerce": ["ecommerce manager", "online store management"],
    "Marketplace Management": ["flipkart seller", "meesho seller", "ebay seller"],
    "Inventory Management E-Commerce": ["warehouse ecom", "order fulfillment"],
    "Customer Service E-Commerce": ["chat support ecom", "ticket resolution"],

    # ══════════════════════════════════════════════════════════════════════
    # NETWORK ENGINEERING
    # ══════════════════════════════════════════════════════════════════════
    "Network Engineering": ["network engineer", "network admin", "network infrastructure"],
    "Cisco Networking": ["ccna", "ccnp", "cisco ios", "cisco switches routers"],
    "SD-WAN": ["software defined wan", "sdwan", "wan optimization"],
    "Network Monitoring": ["network noc", "snmp monitoring", "network observability"],
    "VPN Configuration": ["ipsec vpn", "ssl vpn", "vpn setup"],
    "Wireless Networking": ["wifi design", "wlan", "wifi controller"],
    "Routing Protocols": ["ospf", "bgp", "eigrp", "routing tables"],
    "Switching": ["vlan", "spanning tree", "layer 2 switching"],
    "Firewall Management": ["fortinet firewall", "palo alto firewall", "asa firewall"],
    "DNS and DHCP": ["dns server", "dhcp server", "active directory dns"],
    "Active Directory": ["ad ds", "ldap directory", "windows server ad"],
    "Network Automation": ["network as code", "netconf yang", "python network"],

    # ══════════════════════════════════════════════════════════════════════
    # SYSTEM ADMINISTRATION
    # ══════════════════════════════════════════════════════════════════════
    "System Administration": ["sysadmin", "system admin", "it operations"],
    "Windows Server": ["windows server 2022", "server 2019", "windows admin"],
    "Linux Administration": ["linux sysadmin", "centos admin", "ubuntu server admin"],
    "Active Directory Administration": ["ad administration", "group policy gpo"],
    "Virtualization": ["vmware vsphere", "hyper-v", "esxi", "virtual machines"],
    "Storage Management": ["san storage", "nas storage", "storage admin"],
    "Backup and Recovery": ["veeam backup", "disaster recovery", "business continuity"],
    "Patch Management": ["os patching", "wsus patching", "vulnerability patching"],
    "IT Support": ["helpdesk support", "tier 1 2 support", "desktop support", "it technician"],

    # ══════════════════════════════════════════════════════════════════════
    # ECONOMICS AND BUSINESS STRATEGY
    # ══════════════════════════════════════════════════════════════════════
    "Business Strategy": ["strategic planning", "business development", "corporate strategy"],
    "Competitive Analysis": ["competitor benchmarking", "market intelligence"],
    "Business Model Development": ["business model canvas", "lean canvas"],
    "Management Consulting": ["consulting engagements", "mckinsey framework", "strategy consultant"],
    "Corporate Finance": ["corporate treasury", "capital allocation"],
    "Economics Research": ["economic modeling", "regression economics"],
    "Econometrics": ["stata econometrics", "eviews", "panel data analysis"],
    "Behavioral Economics": ["nudge theory", "decision making research"],

    # ══════════════════════════════════════════════════════════════════════
    # PRINTING AND PUBLISHING
    # ══════════════════════════════════════════════════════════════════════
    "Print Design": ["offset printing", "brochure design", "flyer design"],
    "Digital Publishing": ["epub", "kindle publishing", "digital ebook"],
    "Editorial Design": ["magazine layout", "newspaper layout", "book design"],
    "Prepress": ["prepress artwork", "color separation", "platemaking"],
    "Publishing Software": ["quarkxpress", "indesign publishing", "scribus"],

    # ══════════════════════════════════════════════════════════════════════
    # INTERNATIONAL TRADE
    # ══════════════════════════════════════════════════════════════════════
    "Import Export": ["export manager", "import operations", "trade compliance"],
    "Customs Clearance": ["customs broker", "hs codes", "customs documentation"],
    "Trade Finance": ["letter of credit", "lc trade", "trade banking"],
    "Freight Forwarding": ["freight broker", "logistics forwarding", "incoterms"],
    "Export Documentation": ["shipping bills", "certificate of origin"],
    "WTO Compliance": ["trade regulation compliance"],

}

# Merge deduplicating
for key, aliases in new_domains.items():
    if key in skills:
        existing_lower = {e.lower() for e in skills[key]}
        for alias in aliases:
            if alias.lower() not in existing_lower:
                skills[key].append(alias) # type: ignore
                existing_lower.add(alias.lower())
    else:
        skills[key] = aliases

with open("skills_list.json", "w") as f:
    json.dump(skills, f, indent=2)

total_aliases = sum(len(v) for v in skills.values())
print(f"Total skill groups: {len(skills)}")
print(f"Total aliases/variants: {total_aliases}")
print(f"Grand total entries: {len(skills) + total_aliases}")
