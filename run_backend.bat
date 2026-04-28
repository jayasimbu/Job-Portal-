@echo off
set "BACKEND_DIR=%~dp0backend"

echo --- Starting Career Auto1 Backend ---
echo Using Python from Virtual Environment: %BACKEND_DIR%\venv
echo Directory: %BACKEND_DIR%

if not exist "%BACKEND_DIR%\venv\Scripts\python.exe" (
    echo ERROR: Virtual environment not found at %BACKEND_DIR%\venv
    echo Please run 'python -m venv venv' in the backend directory first.
    pause
    exit /b 1
)

cd /d "%BACKEND_DIR%"
set PYTHONPATH=%BACKEND_DIR%
"%BACKEND_DIR%\venv\Scripts\python.exe" app.py

pause
