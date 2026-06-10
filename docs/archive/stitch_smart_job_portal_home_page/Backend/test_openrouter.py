import sys
sys.path.append(r'e:\Desktop\Antigravity\Final Sem Project Anti\stitch_smart_job_portal_home_page\backend')
from routes.ats_routes import _call_provider

print("--- OPENROUTER TEST ---")
try:
    res = _call_provider('openrouter', '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', 'Respond with JSON: {"status": "ok"}', 'openai/gpt-4o-mini')
    print('OR SUCCESS:', res)
except Exception as e:
    print('OR ERROR CLASS:', type(e).__name__)
    print('OR ERROR MSG:', str(e))
