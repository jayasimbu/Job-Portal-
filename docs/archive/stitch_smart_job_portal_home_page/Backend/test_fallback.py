import sys, os, traceback
sys.path.append(r'e:\Desktop\Antigravity\Final Sem Project Anti\stitch_smart_job_portal_home_page\backend')
from routes.ats_routes import _call_provider
try:
    res = _call_provider('groq', os.getenv('GROQ_API_KEY'), 'Respond with JSON: {"status": "ok"}', 'llama3-8b-8192')
    print('GROQ SUCCESS:', res)
except Exception:
    print('GROQ ERROR:')
    traceback.print_exc()

try:
    res = _call_provider('openrouter', os.getenv('OPENROUTER_API_KEY'), 'Respond with JSON: {"status": "ok"}', 'google/gemini-2.0-flash-lite-preview-02-05:free')
    print('OR SUCCESS:', res)
except Exception:
    print('OR ERROR:')
    traceback.print_exc()
