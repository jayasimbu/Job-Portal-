# Legacy Python/JS Porting Map

This file tracks how legacy script logic should be moved into the modular FastAPI backend.

## Legacy Source Folder
- `stitch_smart_job_portal_home_page/Backend`

## Port Targets

### Authentication
- Legacy: auth-related script flows in platform JS + backend helpers.
- Target: `backend/modules/auth/service.py`, `backend/modules/auth/routes.py`.
- Action: centralize login/register/reset validation and token flow.

### Job Seeker Logic
- Legacy: search filter tests and recommendation scripts under platform/jobseeker pages.
- Target: `backend/modules/jobseeker/service.py`, `backend/ai_engine/recommendation`.
- Action: convert search filters, recommendation traceability, history retrieval.

### Employer Logic
- Legacy: candidate ranking and status control scripts.
- Target: `backend/modules/employer/candidate_ranking.py`, `backend/modules/employer/service.py`.
- Action: move scoring, ranking, and status update policies into service layer.

### Admin Logic
- Legacy: monitoring/system checks and moderation flows.
- Target: `backend/modules/admin/monitoring.py`, `backend/modules/admin/service.py`.
- Action: migrate health metrics, moderation actions, and log aggregation endpoints.

## Engineering Rules
- Keep router thin, service thick.
- Add pydantic schemas before exposing new endpoints.
- Add tests per migrated capability before merge.
- Avoid direct dependency on old folder runtime code.
