import os, datetime, logging, sys
from flask import Blueprint, request, jsonify

# Add the parent directory to sys.path to import from DB
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from DB.mongo_setup import get_user_collection

log = logging.getLogger(__name__)
user_bp = Blueprint('user', __name__)


# ── Shared helpers (same pattern as auth_routes.py) ─────────────────────────

def _find_user_by_email(email: str):
    """Find user in MongoDB by email."""
    coll = get_user_collection()
    if coll is None: return None
    return coll.find_one({'email': email.lower()})

def _save_user(user_data: dict):
    """Update user data in MongoDB."""
    coll = get_user_collection()
    if coll is None: return False
    # Ensure we don't save the _id back if it's there
    data = user_data.copy()
    if '_id' in data: del data['_id']
    coll.update_one({'email': data['email'].lower()}, {'$set': data}, upsert=True)
    return True


# Helper removed


def _now_iso() -> str:
    return datetime.datetime.utcnow().isoformat()


def _require_email(data: dict):
    email = (data.get('email') or '').strip()
    if not email:
        return None, jsonify({'success': False, 'error': 'email is required'}), 400
    return email, None, None


# ── Bookmarks ─────────────────────────────────────────────────────────────────

@user_bp.route('/api/user/bookmarks', methods=['POST'])
def toggle_bookmark():
    """
    POST /api/user/bookmarks
    Body: {
      "email": "user@email.com",
      "job": { "jobId": "42", "jobTitle": "...", "company": "...", ... }
    }
    Toggles bookmark — adds if not present, removes if already saved.
    """
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No JSON body'}), 400

    email = (data.get('email') or '').strip()
    job   = data.get('job')

    if not email:
        return jsonify({'success': False, 'error': 'email is required'}), 400
    if not job or not job.get('jobId'):
        return jsonify({'success': False, 'error': 'job.jobId is required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    saved_jobs = user_data.get('savedJobs', [])
    job_id = str(job['jobId'])

    # Check if already bookmarked
    existing_idx = next((i for i, j in enumerate(saved_jobs) if str(j.get('jobId')) == job_id), None)

    if existing_idx is not None:
        # Remove bookmark
        saved_jobs.pop(existing_idx)
        action = 'removed'
    else:
        # Add bookmark
        saved_jobs.append({
            'jobId':    job_id,
            'jobTitle': job.get('jobTitle', ''),
            'company':  job.get('company', ''),
            'location': job.get('location', ''),
            'salary':   job.get('salary', ''),
            'type':     job.get('type', ''),
            'tags':     job.get('tags', []),
            'savedAt':  _now_iso()
        })
        action = 'saved'

    user_data['savedJobs'] = saved_jobs
    _save_user(user_data)

    return jsonify({
        'success': True,
        'action':     action,
        'savedJobs':  saved_jobs,
        'totalSaved': len(saved_jobs)
    }), 200


@user_bp.route('/api/user/bookmarks', methods=['GET'])
def get_bookmarks():
    """GET /api/user/bookmarks?email=user@email.com"""
    email = (request.args.get('email') or '').strip()
    if not email:
        return jsonify({'success': False, 'error': 'email query param required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    return jsonify({
        'success':   True,
        'savedJobs': user_data.get('savedJobs', [])
    }), 200


# ── Applied Jobs ──────────────────────────────────────────────────────────────

@user_bp.route('/api/user/applied', methods=['POST'])
def record_application():
    """
    POST /api/user/applied
    Body: {
      "email": "user@email.com",
      "job": { "jobId": "42", "jobTitle": "...", "company": "..." }
    }
    Records a job application (idempotent — won't duplicate).
    """
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No JSON body'}), 400

    email = (data.get('email') or '').strip()
    job   = data.get('job')

    if not email:
        return jsonify({'success': False, 'error': 'email is required'}), 400
    if not job or not job.get('jobId'):
        return jsonify({'success': False, 'error': 'job.jobId is required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    applied_jobs = user_data.get('appliedJobs', [])
    job_id = str(job['jobId'])

    # Check if already applied (no duplicates)
    already_applied = any(str(j.get('jobId')) == job_id for j in applied_jobs)
    if not already_applied:
        applied_jobs.append({
            'jobId':     job_id,
            'jobTitle':  job.get('jobTitle', ''),
            'company':   job.get('company', ''),
            'location':  job.get('location', ''),
            'salary':    job.get('salary', ''),
            'type':      job.get('type', ''),
            'tags':      job.get('tags', []),
            'status':    'applied',
            'appliedAt': _now_iso()
        })
        user_data['appliedJobs'] = applied_jobs
        _save_user(user_data)
        return jsonify({
            'success':    True,
            'status':     'recorded',
            'appliedJobs': applied_jobs,
            'total':      len(applied_jobs)
        }), 200
    else:
        return jsonify({
            'success': True,
            'status':  'already_applied',
            'appliedJobs': applied_jobs
        }), 200


@user_bp.route('/api/user/applied', methods=['GET'])
def get_applied_jobs():
    """GET /api/user/applied?email=user@email.com"""
    email = (request.args.get('email') or '').strip()
    if not email:
        return jsonify({'success': False, 'error': 'email query param required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    return jsonify({
        'success':    True,
        'appliedJobs': user_data.get('appliedJobs', [])
    }), 200


# ── Search History ────────────────────────────────────────────────────────────

@user_bp.route('/api/user/search-history', methods=['POST'])
def record_search():
    """
    POST /api/user/search-history
    Body: { "email": "...", "query": "react developer", "location": "remote" }
    Appends to search history (keeps last 50 searches).
    """
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No JSON body'}), 400

    email = (data.get('email') or '').strip()
    query = (data.get('query') or '').strip()

    if not email:
        return jsonify({'success': False, 'error': 'email is required'}), 400
    if not query:
        return jsonify({'success': False, 'error': 'query is required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    history = user_data.get('searchHistory', [])

    history.insert(0, {
        'query':     query,
        'location':  (data.get('location') or '').strip(),
        'timestamp': _now_iso()
    })

    # Keep last 50 searches
    user_data['searchHistory'] = history[:50]
    _save_user(user_data)

    return jsonify({
        'success': True,
        'searchHistory': user_data['searchHistory']
    }), 200


@user_bp.route('/api/user/search-history', methods=['GET'])
def get_search_history():
    """GET /api/user/search-history?email=user@email.com"""
    email = (request.args.get('email') or '').strip()
    if not email:
        return jsonify({'success': False, 'error': 'email query param required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    return jsonify({
        'success':       True,
        'searchHistory': user_data.get('searchHistory', [])
    }), 200

@user_bp.route('/api/user/search-history', methods=['DELETE'])
def delete_search_history():
    """
    DELETE /api/user/search-history
    Body: { "email": "...", "timestamp": "...", "clear_all": true/false }
    Deletes a specific search history item or clears all.
    """
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No JSON body'}), 400

    email = (data.get('email') or '').strip()
    if not email:
        return jsonify({'success': False, 'error': 'email is required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    history = user_data.get('searchHistory', [])

    if data.get('clear_all'):
        user_data['searchHistory'] = []
    else:
        timestamp = data.get('timestamp')
        if not timestamp:
            return jsonify({'success': False, 'error': 'timestamp or clear_all is required'}), 400
        
        user_data['searchHistory'] = [h for h in history if h.get('timestamp') != timestamp]

    _save_user(user_data)
    return jsonify({'success': True, 'searchHistory': user_data['searchHistory']}), 200

# ── All Activity (combined) ───────────────────────────────────────────────────

@user_bp.route('/api/user/activity', methods=['GET'])
def get_all_activity():
    """
    GET /api/user/activity?email=user@email.com
    Returns all user activity: savedJobs, appliedJobs, searchHistory
    """
    email = (request.args.get('email') or '').strip()
    if not email:
        return jsonify({'success': False, 'error': 'email query param required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    return jsonify({
        'success':       True,
        'savedJobs':     user_data.get('savedJobs', []),
        'appliedJobs':   user_data.get('appliedJobs', []),
        'searchHistory': user_data.get('searchHistory', []),
        'candidateType': user_data.get('candidateType', 'fresher')
    }), 200

@user_bp.route('/api/user/active-resume', methods=['GET'])
def get_active_resume():
    """GET /api/user/active-resume?email=user@email.com"""
    email = (request.args.get('email') or '').strip()
    if not email:
        return jsonify({'success': False, 'error': 'email query param required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    resumes = user_data.get('uploadedResumes', [])
    if not resumes:
        return jsonify({'success': False, 'error': 'No resumes uploaded'}), 404

    active_id = user_data.get('activeResumeId')
    active_resume = next((r for r in resumes if r.get('id') == active_id), None)
    
    if not active_resume:
        active_resume = resumes[0] # Fallback to first

    return jsonify({
        'success': True,
        'activeResume': active_resume
    }), 200
