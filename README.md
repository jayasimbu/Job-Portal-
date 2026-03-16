# AI-Powered Job Portal

A modern job portal system with AI capabilities for resume parsing, ATS scoring, candidate ranking, and job recommendations.

## Features

### For Job Seekers
- Create profile and upload resume
- AI resume analysis and ATS scoring
- Personalized job recommendations
- Application tracking

### For Employers
- Company profile management
- Job posting system
- AI-powered candidate ranking
- Resume analysis tools

### For Admins
- User and company management
- System monitoring
- Verification system oversight

## System Architecture

The system follows a modular architecture with three main layers:

1. **Frontend** - React application with modular structure
2. **Backend** - FastAPI application with corresponding modules
3. **AI Engine** - Intelligent modules for resume parsing, scoring, matching, and verification

## Modules

### Frontend Structure
```
frontend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── jobseeker/
│   │   ├── employer/
│   │   └── admin/
│   └── core/
```

### Backend Structure
```
backend/
├── modules/
│   ├── auth/
│   ├── jobseeker/
│   ├── employer/
│   └── admin/
├── ai_engine/
└── core/
```

## AI Engine Components

1. **Resume Parser** - Extracts information from resumes
2. **ATS Scoring Engine** - Calculates ATS scores based on keywords, skills, experience, and education
3. **Semantic Matching** - Matches candidates with job descriptions using embeddings
4. **Recommendation System** - Provides personalized job recommendations
5. **Verification Engine** - Verifies candidate authenticity through GitHub and portfolio checks

## Setup Instructions

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Technologies Used

- **Frontend**: React, Vite, React Router
- **Backend**: FastAPI, Python
- **AI Libraries**: spaCy, pdfminer, PyMuPDF, sentence-transformers
- **Database**: JSON files (can be extended to MongoDB or PostgreSQL)