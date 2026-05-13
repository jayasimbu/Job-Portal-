# LINKUP: Enterprise AI Recruitment Intelligence Ecosystem
## Platform Architecture & System Design Documentation

> [!IMPORTANT]
> This document outlines the FAANG-level modular architecture for LINKUP. It prioritizes scalability, AI system separation, and feature-based organization.

---

## 🏗️ 1. Global Project Tree

```text
LINKUP/
├── frontend/                # [CORE] React.js Enterprise SPA
├── backend/                 # [CORE] FastAPI Industry-Level API
├── database/                # [IMPORTANT] Persistence Layer (JSON/Local Store)
├── docs/                    # Architecture Blueprints & API Docs
├── uploads/                 # Storage for Raw User Content (Resumes/Images)
├── docker-compose.yml       # [CORE] Container Orchestration
└── .gitignore               # Environment Safety
```

---

## 🎨 2. Frontend Architecture (`/frontend`)

Scalable React architecture using a **Feature-Based (Modules) Design**.

### Source Organization (`src/`)
| Folder | Status | Purpose |
| :--- | :--- | :--- |
| `app/` | [CORE] | Global providers, store setup, and core styles. |
| `modules/` | [CORE] | **Enterprise Feature Isolation** (Landing, Auth, Jobseeker, etc.). |
| `components/` | [IMPORTANT] | Global Reusable UI Atomic System (Shadcn/Custom). |
| `hooks/` | [IMPORTANT] | Cross-feature logic (e.g., useAuth, useMedia). |
| `services/` | [CORE] | API Communication Layer (Axios Abstractions). |
| `layouts/` | [IMPORTANT] | Strategic UI shells (Public, Dashboard, Admin). |
| `lib/` | [OPTIONAL] | Third-party library configurations (Lucide, Framer). |
| `store/` | [CORE] | Global State Management (Zustand/Redux). |

### Feature Modules (`src/modules/`)
Each module is a self-contained unit following the **Modular Enterprise Pattern**:
- `jobseeker/`: Dashboard, JD Match, ATS Analysis, Learning Engine.
- `employer/`: Applicant Management, AI Ranking, Hiring Pipeline.
- `admin/`: System Health, Recommendation Monitoring, Moderation.
- `shared/`: Logic/UI shared only between modules.

---

## ⚡ 3. Backend Architecture (`/backend`)

Industry-level **Modular FastAPI** structure with clear Separation of Concerns.

### Core Structure (`app/`)
| Folder | Status | Purpose |
| :--- | :--- | :--- |
| `api/` | [CORE] | Versioned Route Definitions (v1/v2). |
| `ai/` | [CORE] | **AI Orchestration Layer** (Ollama, OpenRouter, Embeddings). |
| `core/` | [CORE] | Global Config, Security (JWT), Database Connection. |
| `services/` | [CORE] | Business Logic Layer (ATS Engine, Matching, Ranking). |
| `schemas/` | [IMPORTANT] | Pydantic Models for Data Validation. |
| `repositories/` | [OPTIONAL] | Direct Data Access Layer (Abstraction over DB). |
| `parsers/` | [CORE] | Specialized Resume & JD Extraction Logic. |

### Specialized AI Sub-Systems
- `ats_scoring/`: Hybrid scoring formula (Skills 35%, Exp 25%, Projects 20%, etc.).
- `semantic_match/`: Vector similarity logic for Resume-JD mapping.
- `recommendations/`: Learning Path & Job matching logic.

---

## 🤖 4. AI System Orchestration

### The Hybrid ATS + AI Matching Engine
**Location**: `backend/services/atsService.py`

#### 🧠 Layer 1: Structured ATS Scoring
Adaptive weighting based on candidate profile:
- **Fresher Formula**: `(Skills 40%) + (Exp 10%) + (Projects 35%) + (Edu 10%) + (Certs 5%)`
- **Experienced Formula**: `(Skills 35%) + (Exp 25%) + (Projects 25%) + (Edu 10%) + (Certs 5%)`

#### 🤖 Layer 2: Semantic AI Matching
- Uses NLP embeddings to detect contextual relevance.
- **Final Hybrid Formula**: `Final Score = (ATS_Score * 0.60) + (Semantic_Similarity * 0.40)`

#### ⚡ Key Logic
- **Project Proof**: GitHub/Portfolio links add significant weight (+50 base).
- **Fresher Adaptive Exp**: Internships get a base score of 70 even with 0 years.
- **Education Tiering**: PhD (100) > Masters (85) > Bachelors (70) > Diploma (50).

---

## 💾 5. Database Architecture (MongoDB)

| Collection | Purpose |
| :--- | :--- |
| `users` | Role-based credentials & status. |
| `resumes` | Binary/Path storage and parsing history. |
| `resume_insights` | AI-extracted data for quick matching. |
| `jobs` | Rich metadata for smart marketplace. |
| `applications` | Pipeline state tracking (Applied, Shortlisted, etc.). |
| `learning_paths` | Personalized AI recommendations. |

---

## 🔄 6. System Flows

### Resume Upload & ATS Flow
1. **Frontend**: Jobseeker uploads via `modules/jobseeker/components/ResumeUpload`.
2. **Backend**: `parsers/resume_parser` extracts text.
3. **AI Layer**: `services/atsService` calculates score.
4. **Storage**: Data persisted in `database/resume_insights`.
5. **Dashboard**: Results pushed via `api/v1/jobseeker/resume-insights`.

---

## 🚀 7. Scaling & Maintenance Strategy
- **Modular Design**: Adding a new feature (e.g., Video Interviews) only requires a new module in `frontend/modules` and `backend/modules`.
- **Atomic UI**: All components (Buttons, Inputs) are in `frontend/components/ui`, ensuring visual consistency.
- **AI Decoupling**: AI logic is separated from business routes, allowing easy upgrades from GPT-4 to newer models without touching UI code.
