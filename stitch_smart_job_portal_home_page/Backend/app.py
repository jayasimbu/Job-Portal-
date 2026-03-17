from flask import Flask, jsonify, send_from_directory # type: ignore
from flask_cors import CORS # type: ignore
import sys, os, time, platform, shutil, subprocess, threading

# Add the parent directory to sys.path to import from DB
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


from routes.auth_routes import auth_bp  # type: ignore
from routes.ats_routes import ats_bp  # type: ignore
from routes.job_routes import job_bp      # type: ignore
from routes.user_routes import user_bp    # type: ignore
from routes.external_routes import external_bp  # type: ignore
from routes.employer_routes import employer_bp # type: ignore

# Serve frontend static files from the project root (one level up from backend/)
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


# ── Auto-start Ollama (local dev only) ─────────────────────────────────────
def _start_ollama_if_available():
    """
    Attempt to start the local Ollama daemon if:
      - Ollama binary is installed (found on PATH)
      - We're on Windows (most common dev machine OS)
    
    On Linux/Mac servers or if Ollama isn't installed, this simply does nothing.
    All failures are silently ignored — Ollama is optional.
    """
    if shutil.which("ollama") is None:
        print("[Ollama] Not installed — skipping local Ollama startup.")
        return

    # Check if Ollama is already serving
    try:
        import urllib.request
        urllib.request.urlopen("http://localhost:11434", timeout=1)
        print("[Ollama] ✓ Already running on port 11434.")
        return
    except Exception:
        pass  # Not yet running — start it

    print("[Ollama] Starting local Ollama daemon (background)...")
    try:
        if platform.system() == "Windows":
            # Windows: CREATE_NO_WINDOW hides the console window
            subprocess.Popen(
                ["ollama", "serve"],
                creationflags=subprocess.CREATE_NO_WINDOW, # type: ignore
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
        else:
            # Linux / macOS
            subprocess.Popen(
                ["ollama", "serve"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                start_new_session=True,
            )
        # Give it a moment to start
        time.sleep(2)
        print("[Ollama] ✓ Ollama daemon launched.")
    except Exception as e:
        print(f"[Ollama] Could not auto-start Ollama: {e} — continuing without it.")


# Run Ollama startup in a background thread so app starts immediately
threading.Thread(target=_start_ollama_if_available, daemon=True).start()

# ── Flask app setup ──────────────────────────────────────────────────────────
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app)  # Enable CORS for all routes

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(ats_bp)   # ATS resume analysis routes
app.register_blueprint(job_bp)   # Semantic job match & search routes
app.register_blueprint(user_bp)  # User bookmarks / applied / history routes
app.register_blueprint(external_bp)  # External job crawl & Admin cache routes
app.register_blueprint(employer_bp) # Employer dashboard routes

@app.route('/', methods=['GET'])
def home():
    """Serve the main home page."""
    return send_from_directory(
        os.path.join(FRONTEND_DIR, 'smart_job_portal_home_page'),
        'smart_job_portal_home_page.html'
    )

@app.errorhandler(404)
def not_found(e):
    # Try serving as a static file path (for folders with index HTML)
    return jsonify({'error': 'Not found', 'message': str(e)}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)

