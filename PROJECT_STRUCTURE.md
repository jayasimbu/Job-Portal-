# Project Structure - Career Auto 1 (LINKUP)

This document provides a comprehensive overview of the project structure for the AI-powered Job Portal (LINKUP).

## High-Level Architecture

The project is split into two main components:
1. **Backend**: A FastAPI-based server providing RESTful APIs, AI services, and database management.
2. **Frontend**: A React-based single-page application built with Vite and Tailwind CSS.

---

## 📂 Root Directory
- `backend/` - Core FastAPI application source code.
- `frontend/` - React SPA source code.
- `database/` - Local file-based storage for JSON snapshots and uploaded files.
- `docs/` - Documentation and blueprints.
- `docker-compose.yml` - Docker orchestration for the full stack.

---

## 🛠️ Backend Structure (`/backend`)

### Core Layers
- `app.py` - Main entry point with lifespan management (Ollama & DB initialization).
- `main.py` - FastAPI app configuration, middleware, and router aggregation.
- `core/`
    - `config.py` - Pydantic-based configuration management.
    - `database.py` - MongoDB connection and indexing logic.
    - `security.py` - Auth logic (JWT, password hashing).
    - `api_response.py` - Standardized JSON response utilities.

### Business Logic (Modules)
- `modules/` - Feature-based vertical slicing.
    - `auth/` - Signup, login, Google OAuth, and session management.
    - `jobseeker/` - Profile, resume upload, job applications, and learning.
    - `employer/` - Job posting, applicant management, and candidate ranking.
    - `admin/` - Platform analytics and management.
    - `ai_engine/` - AI specific routes (ATS, Matching).
    - `mcp/` - Model Context Protocol (Job aggregation and notifications).

### Shared Services
- `services/` - Cross-cutting logic used by multiple modules.
    - `atsService.py` - Unified ATS scoring engine.
    - `llmService.py` - Cloud LLM integration (OpenRouter).
    - `resumeParserService.py` - PDF/Docx text extraction and parsing.
    - `recommendationService.py` - Job and learning recommendation logic.

### AI Engine internals (`/backend/ai_engine`)
- `ats_scoring/` - Logic for hybrid ATS formula.
- `recommendation/` - Job recommendation algorithms.
- `semantic_matching/` - Vector/Text similarity logic.
- `prompts.py` - Centralized LLM prompt templates.

---

## 💻 Frontend Structure (`/frontend`)

### Source Code (`/frontend/src`)
- `main.jsx` & `App.jsx` - Root application setup and routing.
- `core/` - Global components (Navbar, Sidebar), hooks, and API utilities.
- `modules/` - Feature-specific components and pages.
    - `auth/` - Login/Signup UI.
    - `jobseeker/` - Dashboard, Job Search, JD Match, Learning.
    - `employer/` - Post Job, Manage Applicants.
    - `admin/` - Analytics and Management dashboards.
    - `platform/` - Shared home page and generic views.
- `pages/` - Top-level page entry points.
- `layouts/` - Wrapper layouts (Public, Auth, Dashboard).
- `index.css` - Global styles and Tailwind configuration.

---

## 🗄️ Database & Storage (`/database`)
- `jobseeker/` - Profiles and application snapshots.
- `employer/` - Job postings and candidate lists.
- `auth/` - Event logs for security auditing.
- `reference/` - Static skill and certificate lists for the ATS engine.
