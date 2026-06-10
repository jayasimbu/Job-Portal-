# Environment Configuration Guide

This project now uses local/server profiles in both backend and frontend.

## Profile Files (4)

Backend profiles:
1. backend/local.env
2. backend/server.env

Frontend profiles:
3. frontend/local.env
4. frontend/server.env

## Runtime Files (active)

The app actually reads these active files at runtime:
1. backend/.env
2. frontend/.env

Profile activation copies into runtime files:
1. local profile:
   backend/local.env -> backend/.env
   frontend/local.env -> frontend/.env
2. server profile:
   backend/server.env -> backend/.env
   frontend/server.env -> frontend/.env

## Automatic Switching

Switcher location:
1. backend/env_switcher.py

Commands:
1. Activate local profile:
   python backend/env_switcher.py local
2. Activate server profile:
   python backend/env_switcher.py server
3. Validate active env files:
   python backend/env_switcher.py validate

Automatic behavior:
1. Running backend/app.py auto-runs env switcher.
2. APP_ENV_PROFILE chooses local or server.
3. Default profile is local.

PowerShell:
1. Local:
   $env:APP_ENV_PROFILE="local"
   python backend/app.py
2. Server:
   $env:APP_ENV_PROFILE="server"
   python backend/app.py

## Where to Add OLLAMA_API_KEY

Add OLLAMA_API_KEY only in backend profile files:
1. backend/local.env
2. backend/server.env

Do not add OLLAMA_API_KEY in frontend env files.

## Backend keys

Core:
1. PROJECT_NAME
2. DEBUG
3. HOST
4. PORT
5. FRONTEND_URL

Security:
1. SECRET_KEY
2. ALGORITHM
3. ACCESS_TOKEN_EXPIRE_MINUTES
4. REFRESH_TOKEN_EXPIRE_MINUTES
5. GOOGLE_CLIENT_ID

Database:
1. DATABASE_URL (MongoDB URI)

Ollama:
1. OLLAMA_BASE_URL
2. OLLAMA_MODEL
3. OLLAMA_TIMEOUT
4. OLLAMA_API_KEY
5. OLLAMA_REQUIRE_API_KEY_FOR_REMOTE
6. OLLAMA_AUTOSTART
7. OLLAMA_STARTUP_TIMEOUT_SECONDS

AI toggles:
1. AI_ENGINE_ENABLED
2. RESUME_PARSER_TIMEOUT

## Frontend keys

1. VITE_API_BASE_URL
2. VITE_GOOGLE_CLIENT_ID

## Sync rule

Whenever env keys change, update these files together:
1. backend/local.env
2. backend/server.env
3. frontend/local.env
4. frontend/server.env
5. backend/.env
6. frontend/.env
7. ENV_README.md
