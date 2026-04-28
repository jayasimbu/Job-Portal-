@echo off
echo ==========================================
echo Starting Career Auto Backend Server...
echo ==========================================

cd /d "%~dp0"

IF NOT EXIST "venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found. Please run 'python -m venv venv' and install requirements.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Checking for requirements changes...
pip install -r requirements.txt > nul 2>&1

echo Starting FastAPI with Uvicorn...
"venv\Scripts\python.exe" app.py
pause
