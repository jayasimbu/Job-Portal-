# React Migration Execution Plan

## Objective
Convert all legacy HTML/CSS/JS and backend utility logic from `stitch_smart_job_portal_home_page` into the production React + FastAPI architecture in this repository.

## Completed In This Iteration
- Imported legacy shared assets into `frontend/public/legacy-assets`.
- Added missing React routes/pages for major legacy feature groups:
  - Jobseeker: Insights, Learning, Notifications.
  - Employer: Analytics, Hiring Policy, Interview Schedule.
  - Admin: Analytics.
- Added tabbed feature presentation component: `frontend/src/core/components/LegacyFeatureTabs.jsx`.
- Expanded shell navigation and route constants for the above modules.

## Feature Mapping (Legacy -> React module)

### Platform
- `Platform/Auth/*` -> `frontend/src/modules/auth/pages/*` + `frontend/src/modules/auth/services/*`.
- `Platform/Home/*` -> New shared landing module (planned): `frontend/src/modules/platform/pages/Home.jsx`.
- `Platform/Intelligence/*` -> New shared intelligence module (planned): `frontend/src/modules/platform/pages/Intelligence.jsx`.
- `Platform/Legal/*` -> New shared legal module (planned).
- `Platform/Search/*` -> Shared search service + jobseeker jobs enhancements.
- `Platform/Settings/*` -> Profile/settings tabs across auth + jobseeker + employer.
- `Platform/System/*` -> Admin monitoring widgets and status panel.

### JobSeeker
- `JobSeeker/Dashboard/*` -> `jobseeker/pages/Dashboard.jsx`.
- `JobSeeker/Jobs/*` -> `jobseeker/pages/JobSearch.jsx` plus Saved/History tabs.
- `JobSeeker/Applications/*` -> `jobseeker/pages/Applications.jsx` with status timeline tabs.
- `JobSeeker/Insights/*` -> `jobseeker/pages/Insights.jsx`.
- `JobSeeker/Learning/*` -> `jobseeker/pages/Learning.jsx`.
- `JobSeeker/Notifications/*` -> `jobseeker/pages/Notifications.jsx`.
- `JobSeeker/Profile/*` -> `jobseeker/pages/Profile.jsx` with resume tab groups.

### Employer
- `Employer/Dashboard/*` -> `employer/pages/Dashboard.jsx`.
- `Employer/JobManagement/*` -> `employer/pages/PostJob.jsx` with multi-step sections.
- `Employer/Candidates/*` -> `employer/pages/Candidates.jsx` with ranking/status tabs.
- `Employer/Analytics/*` -> `employer/pages/Analytics.jsx`.
- `Employer/HiringPolicy/*` -> `employer/pages/HiringPolicy.jsx`.
- `Employer/Interview/*` -> `employer/pages/InterviewSchedule.jsx`.
- `Employer/Profile/*` -> `employer/pages/CompanyProfile.jsx`.

### Admin
- `Admin/*` datasets + governance screens -> `admin/pages/*` and service layer in `admin/services/adminService.js`.

## Backend Migration Strategy
1. Keep FastAPI as source of truth in `backend/`.
2. Port legacy scripts by concern:
   - Auth/login scripts -> `modules/auth/service.py` and API contracts.
   - Candidate ranking/evaluation scripts -> `modules/employer/candidate_ranking.py`.
   - Search/filter scripts -> `modules/jobseeker/service.py` and AI matching.
   - Monitoring/system scripts -> `modules/admin/monitoring.py`.
3. Extract reusable business logic into pure Python service functions, then expose via existing routers.
4. Do not copy legacy backend app verbatim; normalize into current modular API.

## Execution Phases
1. Navigation and route parity.
2. UI parity by module with reusable section tabs.
3. Service/API parity by feature group.
4. Data contract alignment + JSON schema normalization.
5. QA: route smoke, integration tests, and conflict-safe merge by module owners.

## Team Branch Ownership
- SriganthVaratharaj: integration + jobseeker + cross-module merge.
- Aadhiseshan: auth/login.
- Remo: admin.
- Jayasimbu: employer.

## Conflict Minimization Rules
- Each owner works in dedicated branch and PR per feature group.
- Avoid touching another owner's module unless coordinated.
- Rebase on latest `main` before opening PR.
- Keep PR scope to a single module or shared utility change.
