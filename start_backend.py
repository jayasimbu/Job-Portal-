import subprocess
import os
import sys
from pathlib import Path

# Path to the backend directory
BACKEND_DIR = Path(__file__).resolve().parent / "backend"

def start_backend():
    python_exe = sys.executable or "python"

    print(f"--- Starting Career Auto1 Backend ---")
    print(f"Using Python: {python_exe}")
    print(f"Directory: {BACKEND_DIR}")

    # Set PYTHONPATH to the backend directory
    env = os.environ.copy()
    env["PYTHONPATH"] = str(BACKEND_DIR)
    
    try:
        # Run app.py from the backend directory
        subprocess.run([python_exe, "app.py"], cwd=str(BACKEND_DIR), env=env, check=False)
    except KeyboardInterrupt:
        print("\nBackend stopped.")
    except Exception as e:
        print(f"Error starting backend: {e}")

if __name__ == "__main__":
    start_backend()
