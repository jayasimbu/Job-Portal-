# Smoke Test Checklist (Demo Safety)

Run this checklist before every internal/external demo.

## Preconditions
- Backend is running
- MongoDB is reachable
- Frontend is running (if demo includes UI)
- Demo seed data has been created with `backend/scripts/seed_demo_data.py`

## API Checklist
- Signup
  - POST `/api/auth/register`
  - Expect: `success=true`, token payload present
- Login
  - POST `/api/auth/login-json` or `/api/auth/login`
  - Expect: `success=true`, access token present
- Upload Resume
  - POST `/api/jobseeker/resume/upload` or `/api/jobseeker/resume/upload-file`
  - Expect: `success=true`, resume object returned
- ATS Generate
  - POST `/api/jobseeker/ats/resume`
  - POST `/api/jobseeker/ats/jd`
  - Expect: `success=true`, `final_score` present in payload
- Employer Post Job
  - POST `/api/employer/jobs`
  - Expect: `success=true`, job id returned
- Employer View Candidates
  - GET `/api/employer/jobs/{job_id}/candidates`
  - Expect: `success=true`, ranked candidates list returned
- AI Engine Works
  - GET `/api/ai/provider/status`
  - POST `/api/ai/provider/check`
  - Expect: `success=true`, provider metadata and connectivity signal

## Optional UI Validation
- Jobseeker dashboard loads after login
- Employer dashboard loads after login
- Admin dashboard loads for admin token

## Suggested Command
- Run existing script: `python backend/smoke_test.py`
- If needed, run test module: `pytest backend/tests/test_api_smoke.py -q`

## Exit Criteria
- All mandatory checks pass
- No unhandled exceptions in backend logs
- No 5xx responses on critical flows
