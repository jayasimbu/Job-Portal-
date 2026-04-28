# Career Auto1

AI-powered job portal with modular React frontend, FastAPI backend, deterministic ATS algorithms, and Ollama-based AI enhancement.

## Environment Reference
Use ENV_README.md as the single guide for backend environment keys.

Sync rule:
1. Whenever backend/.env is updated, update ENV_README.md in the same commit.

## Project Goal
Build a production-style role-based platform where:
1. Jobseekers upload resumes, get ATS scores, and receive recommendations.
2. Employers post jobs, rank candidates, and manage hiring workflows.
3. Admins monitor users, logs, and verification status.
4. FastAPI is the single API layer between frontend, database, and AI.

## High-Priority Runtime Rules
1. Build order is Frontend first, Backend second, DB integration last.
2. FastAPI is the only backend API layer.
3. Ollama is the only active LLM runtime provider.
4. JWT-based authentication and role-based redirects are required.
5. Core business logic runs in Python backend modules.
6. Frontend never calls DB directly.
7. Frontend never calls Ollama directly.

## User Roles and Core Features

### Jobseeker
1. Profile creation and authentication.
2. Resume upload and parsing.
3. ATS scoring with actionable suggestions.
4. Job search and recommendation flows.
5. Application tracking.

### Employer
1. Company profile management.
2. Job posting and lifecycle management.
3. Candidate pipeline and ranking.
4. Resume review and shortlist workflows.

### Admin
1. User and company oversight.
2. System monitoring and logs.
3. Verification queue and governance controls.

## Merged Source Strategy
Career Auto1 consolidates prior work from:
1. FIn1 auth implementation and module patterns.
2. stitch_smart_job_portal_home_page UI/UX patterns and legacy feature logic.

Migration intent:
1. Rebuild legacy HTML/JS/CSS UX into React module pages.
2. Port useful backend logic into FastAPI services.
3. Preserve deterministic scoring logic and improve explanation quality using Ollama.

## System Architecture

### Layer 1: Frontend (React)
Module-first structure:
1. auth
2. jobseeker
3. employer
4. admin
5. platform

### Layer 2: Backend (FastAPI)
Primary domains:
1. core config, security, db session
2. modules for auth, jobseeker, employer, admin
3. ai_engine for LLM wrapper, prompts, matching, scoring support

### Layer 3: Data
1. Auth event stores and role linkage.
2. Domain profile and business data stores.
3. AI scoring and embedding outputs.

## Intelligence Model: Algorithm First, LLM Second

### Deterministic Algorithm Ownership
Algorithm outputs are source-of-truth for numeric decisions.

Primary algorithm files:
1. `backend/modules/jobseeker/ats_algorithm.py`
2. `backend/modules/employer/candidate_ranking.py`
3. `backend/ai_engine/semantic_matching/matcher.py`

Mandatory ATS functions:
1. `score_resume_ats(resume_data: dict) -> dict`
2. `score_job_description_ats(resume_data: dict, jd_data: dict) -> dict`

Expected ATS output:
1. `final_score`
2. `score_breakdown`
3. `missing_keywords`
4. `suggestions`

### LLM Enhancement Ownership
LLM is used for explanation and suggestion quality only.

Primary LLM files:
1. `backend/ai_engine/llm_service.py`
2. `backend/ai_engine/prompts.py`

LLM should:
1. Rewrite ATS suggestions in user-friendly language.
2. Explain JD match and mismatch.
3. Generate recruiter summaries.
4. Suggest profile improvements.

LLM should not:
1. Replace JWT auth.
2. Replace role authorization.
3. Replace DB transaction logic.
4. Replace deterministic ATS numeric scoring.

## Ollama Runtime Policy
Active AI provider is Ollama only.

Supported modes:
1. Local Ollama endpoint.
2. Ollama cloud endpoint with API key.

Environment keys are loaded from `backend/.env`.

Required environment keys:
1. `OLLAMA_BASE_URL`
2. `OLLAMA_API_KEY` (optional for local, recommended/required for remote based on policy)
3. `OLLAMA_MODEL`
4. `OLLAMA_TIMEOUT`
5. `OLLAMA_REQUIRE_API_KEY_FOR_REMOTE`
6. `OLLAMA_AUTOSTART`
7. `OLLAMA_STARTUP_TIMEOUT_SECONDS`

Example local mode (no API key):
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_API_KEY=
OLLAMA_MODEL=qwen2.5:7b-instruct
OLLAMA_TIMEOUT=60
OLLAMA_REQUIRE_API_KEY_FOR_REMOTE=True
OLLAMA_AUTOSTART=True
OLLAMA_STARTUP_TIMEOUT_SECONDS=8
```

Example remote/cloud mode:
```env
OLLAMA_BASE_URL=https://your-ollama-endpoint
OLLAMA_API_KEY=PASTE_YOUR_OLLAMA_KEY_HERE
OLLAMA_MODEL=qwen2.5:7b-instruct
OLLAMA_TIMEOUT=60
OLLAMA_REQUIRE_API_KEY_FOR_REMOTE=True
OLLAMA_AUTOSTART=False
```

Runtime behavior:
1. Local Ollama can run without API key.
2. Remote/cloud Ollama can enforce API key with `OLLAMA_REQUIRE_API_KEY_FOR_REMOTE=True`.
3. Backend auto-starts Ollama only for local host targets when `OLLAMA_AUTOSTART=True`.

## Auth and Session Model
Required flow:
1. Signup with role selection (employer or jobseeker).
2. Login returns JWT access and refresh token.
3. Role-aware redirect to the correct dashboard.
4. Protected routes verify token and role.

Supported auth methods:
1. Email/password.
2. Google OAuth callback login.

## Database State Model

### Auth Event Stores
1. `database/auth/employer/`
2. `database/auth/jobseeker/`

These store signup/login/logout/auth-profile state changes.

### Domain Data Stores
1. `database/employer/`
2. `database/jobseeker/`

These store ongoing profile and feature data used during user sessions.

Required behavior:
1. Auth events are traceable.
2. Domain profile updates are persisted.
3. Auth and domain states remain consistent.

## Runtime Flow
1. React sends API request.
2. FastAPI validates JWT and role.
3. Service executes deterministic logic.
4. Optional Ollama enhancement is called server-side.
5. Data is written to database.
6. API response returns structured output to frontend.

## Project Structure Snapshot
```text
Career Auto1/
	frontend/
		src/
			core/
			modules/
				auth/
				jobseeker/
				employer/
				admin/
				platform/
	backend/
		app.py
		main.py
		core/
		modules/
			auth/
			jobseeker/
			employer/
			admin/
		ai_engine/
	database/
		auth/
			employer/
			jobseeker/
		employer/
		jobseeker/
		admin/
		ai/
```

## Setup

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
venv\Scripts\activate
pip install -r requirements.txt
# configure backend/.env before starting
python app.py
```

### Optional Manual Backend Start
```bash
cd backend
uvicorn app:app --reload
```

## API Blueprint Summary

### Auth
1. `POST /api/auth/signup`
2. `POST /api/auth/login`
3. `POST /api/auth/google`
4. `POST /api/auth/logout`
5. `POST /api/auth/refresh`
6. `GET /api/auth/me`

### Jobseeker
1. `POST /api/jobseeker/resume/upload`
2. `POST /api/jobseeker/resume/parse`
3. `POST /api/jobseeker/ats/resume`
4. `POST /api/jobseeker/ats/jd`
5. `GET /api/jobseeker/profile`
6. `PUT /api/jobseeker/profile`

### Employer
1. `POST /api/employer/jobs`
2. `GET /api/employer/jobs`
3. `GET /api/employer/jobs/{job_id}/candidates`
4. `POST /api/employer/candidates/{id}/shortlist`

### Admin
1. `GET /api/admin/users`
2. `GET /api/admin/logs`
3. `GET /api/admin/system-health`

### AI
1. `POST /api/ai/ats-feedback`
2. `POST /api/ai/match-explain`
3. `GET /api/ai/provider/status`
4. `POST /api/ai/provider/check`

## Reliability Rules
1. If Ollama fails, return algorithm output without blocking response.
2. If DB write fails, rollback and return explicit API error.
3. If JWT invalid, return 401.
4. If role mismatch, return 403.

## Technologies
1. Frontend: React, Vite, React Router, Axios.
2. Backend: FastAPI, Uvicorn, PyMongo, Pydantic.
3. AI/NLP: spaCy, PyMuPDF, pdfminer, sentence-transformers.
4. LLM: Ollama local or cloud.

## Implementation Orchestration
Detailed coding order and migration checklist are maintained in:
1. `CODEX_IMPLEMENTATION_PROMPT.md`

## Runtime Intelligence Quick Guide

### Integration Core
1. React sends API requests to FastAPI.
2. FastAPI validates JWT and role.
3. Module services run deterministic logic.
4. Ollama is called only as backend enhancement.
5. DB persistence happens in backend services.

Rules:
1. Frontend never calls DB directly.
2. Frontend never calls Ollama directly.
3. Numeric scoring remains algorithm-owned.

### Algorithm Ownership
Core deterministic files:
1. `backend/modules/jobseeker/ats_algorithm.py`
2. `backend/modules/employer/candidate_ranking.py`
3. `backend/ai_engine/semantic_matching/matcher.py`

Required ATS functions:
1. `score_resume_ats(resume_data: dict) -> dict`
2. `score_job_description_ats(resume_data: dict, jd_data: dict) -> dict`

### Ollama Runtime Modes
1. Local Ollama endpoint without API key.
2. Remote/cloud endpoint with optional/required key by env policy.

Provider validation APIs:
1. `GET /api/ai/provider/status`
2. `POST /api/ai/provider/check`

### Operational Principle
Use algorithms for correctness.
Use LLM for explanation quality.
Use FastAPI as orchestration layer.

---

## 🧠 Python & AI Ecosystem: The "Judge vs. Coach" Model

This project uses a unique hybrid intelligence system to provide both high-speed accuracy and deep human-like insights.

### 1. The Python Engine (The "Brain")
The backend is powered by **FastAPI** (Python 3.10+). It handles the heavy lifting that the browser cannot do:
*   **main.py**: The entry point/manager for the whole server.
*   **modules/auth/**: The security layer. It manages logins/signups and ensures your **Filesystem Remains the Source of Truth**. If a database record exists but the user's profile file is missing, the system "self-heals" by purging the stale record.
*   **ai_engine/**: The intelligence layer. It connects to **Ollama** to process complex text.

### 2. Judge vs. Coach Architecture
We split intelligence into two distinct roles:

#### The Algorithm (The "Judge")
*   **Files**: `ats_algorithm.py`, `matcher.py`.
*   **Role**: Calculates precise numerical scores (e.g., 75/100) by counting keywords, verifying experience years, and checking formatting.
*   **Benefit**: Instant, unbiased, and mathematically accurate.

#### The LLM/Ollama (The "Coach")
*   **Files**: `llm_service.py`, `prompts.py`.
*   **Role**: Reads the scores from the Judge and provides **actionable advice**. 
*   **Example**: Instead of just saying "75%", it says: *"You scored 75%. To reach 100%, try adding a project about 'Cloud Computing' as it's highly valued for this role."*
*   **Benefit**: Provides context, synonyms, and personalized growth roadmaps.

### 3. Filesystem Sync Logic
To prevent "Account Already Exists" errors when files are manually deleted:
*   The backend performs a **Filesystem-to-DB sync** on every signup/login.
*   If a `.json` profile is missing from `database/jobseeker/`, the system automatically removes the corresponding entry from MongoDB to allow a clean re-registration.

---

## 🔄 State Handling

The platform handles multiple UI states to ensure a smooth user experience:

- Loading State: Skeleton loaders for dashboard and jobs
- Empty State: "No jobs found" / "No applications yet"
- Error State: API failure message with retry option
- Success State: Toast feedback (e.g., "Settings Saved", "Application Submitted")

## 🔁 Data Flow Architecture

Frontend → API → Backend Processing → Response → UI Update

Example:
Resume Upload → ATS Scoring API → Score Calculation → Dashboard Update

## 🔐 Security Architecture

- JWT-based authentication
- Role-based access control (Job Seeker / Employer)
- ProtectedRoute wrapper for all platform routes
- Secure API communication

## 🧭 User Journey

Home → Signup/Login → Dashboard → Resume Analysis → Job Matching → Apply → Track Applications

## ⚡ Performance Optimization

- Lazy loading for routes
- Optimized component rendering
- Efficient state management

## 💡 Problem-Solution Clarity

**Problem:** Existing job portals are cluttered, lack actionable feedback, and have "black-box" ATS algorithms that reject good candidates without explanation.
**Solution:** Career Auto provides transparent, simulated ATS scoring with AI-driven improvement feedback, allowing candidates to refine their resumes directly. For employers, it offers bias-free candidate rankings based purely on verified skills and project proof, ensuring a fair and efficient hiring pipeline.

## ⚠️ Limitations

- The platform relies on LLM API availability for explanation generation. If the API is unreachable, the system falls back to strict algorithmic scoring without detailed AI insights.
- Document parsing accuracy is currently optimized for standard PDF formats; highly unconventional layouts may yield lower extraction rates.

## 📈 Scalability

Future Scope and Expansion:
- **AI Interview Coach:** Real-time mock interviews using voice emotion detection.
- **Resume Builder:** An integrated tool to build AI-optimized resumes on the platform.
- **Recruiter Analytics Dashboard:** Deeper workforce planning insights for companies.
