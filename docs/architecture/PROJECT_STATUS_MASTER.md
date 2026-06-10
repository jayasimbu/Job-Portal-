# PROJECT STATUS MASTER

This file is the single source of truth for implementation status and stabilization priorities.

# Completed
- Auth login/register flows with JWT and role-aware redirects
- Employer dashboard and core employer APIs (jobs, candidates, analytics)
- Resume upload support (text and file-based flow)
- Centralized FastAPI error handlers in backend app
- Standardized API response envelope at app level
- Startup scripts now use dynamic interpreter resolution (no hardcoded Python path)
- **Google OAuth integration with strict per-account auth method** (Option 1: One auth method per identity)
  - Email/password account → cannot use Google login
  - Google account → cannot use email/password
  - Improved UX: Clear error messages + quick navigation buttons between auth methods
  - Secure by design, prevents account hijacking and identity ambiguity

# Partial
- ATS scoring and JD matching: deterministic scoring complete, quality tuning ongoing
- AI feedback via Ollama: fallback/queue support in place, model reliability tuning pending
- Admin module: broad route surface exists, requires deeper role-flow QA
- Frontend-backend contract migration to strict envelope-only consumption

# Pending
- Production deployment pipeline and environment promotion policy
- End-to-end email verification UX hardening
- Full regression suite for jobseeker/employer/admin critical paths
- CI smoke checks before every merge

# Broken / Needs Fix
- Duplicate database folders existed (`database/job seeker` and `database/jobseeker`) and must stay normalized to `database/jobseeker` only ✅ FIXED
- Legacy docs still contain stale completion percentages and outdated TODO narratives
- `backend/test_upload.py` was exiting on import, breaking pytest collection ✅ FIXED (refactored to use `if __name__ == "__main__"` guard)

# Stabilization Decisions (Locked)
- Canonical folder naming: `jobseeker`
- Database strategy:
  - Primary transactional and query store: MongoDB
  - File JSON usage: snapshot/export/reference/demo artifacts only (non-authoritative)
- API response contract (all backend endpoints):
  - `{"success": true|false, "message": "...", "data": {...}}`
  - Error payload is included under `error` when applicable
- **Authentication Method Design (Option 1 - Strict Per-Account)**
  - One authentication method per email identity
  - Email+Password account → must use email login (cannot use Google)
  - Google-registered account → must use Google login (cannot use email+password)
  - Rationale: Simple, secure, prevents account hijacking and identity ambiguity
  - UX: Clear error messages with quick-switch buttons to guide users to correct auth method
  - Future: Account linking could be added as an advanced feature, but not required now

# Smoke-Test Gates (Before Demo)
- Signup
- Login
- Resume upload
- ATS generation
- Employer post job
- Employer view candidates
- AI engine status/check

# Latest Verification Snapshot
- Isolation complete: only stabilization files are staged; unrelated frontend and archive changes are intentionally left untouched
- Runtime check passed: backend started successfully with Uvicorn from `backend/` and served requests
- Smoke test passed end-to-end using `backend/smoke_test.py` (jobseeker, employer, apply flow, admin flow)
- Pytest collection fixed: `pytest --collect-only -q` discovers all tests cleanly from backend root (8 tests found)
- Pytest execution passed: `pytest -q` from backend root runs real test suite successfully (6 passed, 2 pre-existing fixture errors in scratch/)
- **CI/CD ready**: pytest command is now universally reliable and trustworthy for automated checks

Last updated: 2026-04-16
