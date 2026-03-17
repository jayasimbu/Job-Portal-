import sys, os
sys.path.append(r'e:\Desktop\Antigravity\Final Sem Project Anti\stitch_smart_job_portal_home_page\backend')
from routes.ats_routes import _call_provider

print("--- GROQ TEST ---")
try:
    res = _call_provider('groq', os.getenv('GROQ_API_KEY'), 'Respond with JSON: {"status": "ok"}', 'llama3-8b-8192')
    print('GROQ SUCCESS:', res)
except Exception as e:
    print('GROQ ERROR CLASS:', type(e).__name__)
    print('GROQ ERROR MSG:', str(e))

print("--- OPENROUTER TEST ---")
try:
    res = _call_provider('openrouter', os.getenv('OPENROUTER_API_KEY'), 'Respond with JSON: {"status": "ok"}', 'google/gemini-2.0-flash-lite-preview-02-05:free')
    print('OR SUCCESS:', res)
except Exception as e:
    print('OR ERROR CLASS:', type(e).__name__)
    print('OR ERROR MSG:', str(e))
