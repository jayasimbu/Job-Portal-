import os
import json
import re
import datetime
import sys
from flask import Blueprint, request, jsonify  # type: ignore

# Add the parent directory to sys.path to import from DB
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from DB.mongo_setup import get_user_collection  # type: ignore

auth_bp = Blueprint('auth', __name__)


# ── Constants ─────────────────────────────────────────────────────────────
_BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
_DB_ROOT  = os.path.abspath(os.path.join(_BASE_DIR, '..', 'DB'))
JOBSEEKER_DIR = os.path.join(_DB_ROOT, 'Job Seeker')
EMPLOYER_DIR  = os.path.join(_DB_ROOT, 'Employer')

def _safe_filename(name: str) -> str:
    """Convert a display name to a safe filename (keep alphanum + spaces)."""
    safe = re.sub(r'[^\w\s-]', '', name).strip()
    safe = re.sub(r'\s+', '_', safe)
    return safe or 'user'


def _folder_for_role(role: str) -> str:
    return EMPLOYER_DIR if role == 'employer' else JOBSEEKER_DIR


def _find_user_file(email: str):
    """Find user JSON file by email across all role folders."""
    email_lower = email.lower()
    for folder in [JOBSEEKER_DIR, EMPLOYER_DIR]:
        if not os.path.isdir(folder):
            continue
        for fname in os.listdir(folder):
            if not fname.endswith('.json'):
                continue
            fpath = os.path.join(folder, fname)
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    u_data = json.load(f)
                if u_data.get('email', '').lower() == email_lower:
                    return fpath, u_data
            except Exception:
                continue
    return None, None


def _save_user_file(user_data: dict):
    """Save user data to a JSON file in the appropriate role folder."""
    role = user_data.get('role', 'jobseeker')
    email = user_data.get('email', '').lower()
    folder = _folder_for_role(role)
    os.makedirs(folder, exist_ok=True)
    
    # 1. Try to find existing file by email to prevent duplicates
    fpath, _ = _find_user_file(email)
    
    # 2. If not found by email, check if a file with the expected 'SAFE_NAME.json' exists
    if not fpath:
        safe_name = _safe_filename(user_data.get('name', 'user'))
        expected_fpath = os.path.join(folder, f"{safe_name.upper()}.json")
        
        if os.path.exists(expected_fpath):
            # If the file exists but _find_user_file didn't return it, 
            # it might be corrupted or belong to another user with the same name.
            # We'll check if it's corrupted first.
            try:
                with open(expected_fpath, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
                if existing_data.get('email', '').lower() == email:
                    fpath = expected_fpath
            except Exception:
                # File is likely corrupted. Since it's the expected name for THIS user, 
                # we'll overwrite it instead of creating a duplicate if the user is the same.
                # In this demo context, we assume the name-to-file mapping is strong.
                fpath = expected_fpath

    # 3. If still no path, create a new one with collision handling
    if not fpath:
        safe_name = _safe_filename(user_data.get('name', 'user'))
        fpath = os.path.join(folder, f"{safe_name.upper()}.json")
        counter = 1
        base_fpath = fpath
        while os.path.exists(fpath):
            fpath = base_fpath.replace('.json', f'_{counter}.json')
            counter += 1

    try:
        with open(fpath, 'w', encoding='utf-8') as f:
            json.dump(user_data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"[auth_routes] Failed to save user file: {e}")
        return False


def _find_user_by_email(email: str):
    """Find user in MongoDB by email."""
    coll = get_user_collection()
    if coll is None: return None
    return coll.find_one({'email': email.lower()})  # type: ignore

def _save_user(user_data: dict):
    """Upsert user data in MongoDB and Local File."""
    # 1. Save to MongoDB
    coll = get_user_collection()
    if coll is not None:
        coll.update_one({'email': user_data['email'].lower()}, {'$set': user_data}, upsert=True)  # type: ignore
    
    # 2. Save to JSON file as requested
    _save_user_file(user_data)
    return True


# ── Routes ───────────────────────────────────────────────────────────────────

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = (data.get('email') or '').strip()
    password = data.get('password', '')
    name = (data.get('name') or '').strip()
    role = data.get('role', 'jobseeker')  # 'jobseeker' | 'employer'

    if not email or not password or not name:
        return jsonify({'message': 'Missing required fields'}), 400

    existing_user = _find_user_by_email(email)
    if existing_user:
        existing_role = existing_user.get('role', 'jobseeker')
        if existing_role != role:
            return jsonify({'message': 'Single email in both roles is not allowed by our portal'}), 409
        return jsonify({'message': 'Account already exists. Please log in.'}), 409

    # ── Create user record ───────────────────────────────────────────────────
    user_record = {
        'name': name,
        'email': email,
        'password': password,   # Store as-is for this demo; hash in production
        'role': role,
        'auth_method': 'email',
        'created_at': datetime.datetime.utcnow().isoformat()
    }

    _save_user(user_record)

    return jsonify({'message': 'User registered successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # type: ignore
    email = (data.get('email') or '').strip()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400

    fpath, user_data = _find_user_file(email)
    if not user_data:
        # Fallback to MongoDB if file not found (though they should be in sync now)
        user_data = _find_user_by_email(email)
        
    if not user_data:
        return jsonify({'message': 'Account does not exist'}), 404

    if user_data.get('password') != password:
        return jsonify({'message': 'Invalid credentials'}), 401

    return jsonify({
        'message': 'Login successful',
        'user': {
            'name': user_data.get('name'),
            'email': user_data.get('email'),
            'role': user_data.get('role', 'jobseeker'),
            'uploadedResumes': user_data.get('uploadedResumes', []),
            'activeResumeId': user_data.get('activeResumeId', None),
            'headline': user_data.get('headline', ''),
            'skills': user_data.get('skills', []),
            'certificates': user_data.get('certificates', []),
            'autoFillDetails': user_data.get('autoFillDetails', False),
            'about': user_data.get('about', ''),
            'phone': user_data.get('phone', ''),
            'notification_preferences': user_data.get('notification_preferences', {}),
            'privacy_settings': user_data.get('privacy_settings', {}),
            'picture': user_data.get('picture', ''),
            # Employer fields
            'website': user_data.get('website', ''),
            'industry': user_data.get('industry', ''),
            'company_size': user_data.get('company_size', ''),
            'headquarters': user_data.get('headquarters', ''),
            'culture_benefits': user_data.get('culture_benefits', [])
        }
    }), 200

@auth_bp.route('/update_user_data', methods=['POST'])
def update_user_data():
    data = request.get_json()  # type: ignore
    email = (data.get('email') or '').strip()
    
    if not email:
        return jsonify({'message': 'Missing email'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'message': 'Account does not exist'}), 404

    # Allowed fields to be updated
    allowed_fields = [
        'uploadedResumes', 'activeResumeId', 'headline', 'skills', 'certificates',
        'name', 'about', 'phone', 'notification_preferences', 'privacy_settings', 
        'picture', 'autoFillDetails',
        # Employer fields:
        'website', 'industry', 'company_size', 'headquarters', 'culture_benefits'
    ]
    for field in allowed_fields:
        if field in data:
            user_data[field] = data[field]

    # Handle password change
    if 'current_password' in data and 'new_password' in data:
        if data['new_password']:
            if user_data.get('auth_method') == 'google':
                return jsonify({'message': 'Google accounts cannot change password here'}), 400
            if user_data.get('password') != data['current_password']:
                return jsonify({'message': 'Current password is incorrect'}), 401
            user_data['password'] = data['new_password']

    _save_user(user_data)

    return jsonify({
        'message': 'User data updated successfully',
        'user': {
            'name': user_data.get('name'),
            'email': user_data.get('email'),
            'role': user_data.get('role', 'jobseeker'),
            'uploadedResumes': user_data.get('uploadedResumes', []),
            'activeResumeId': user_data.get('activeResumeId', None),
            'headline': user_data.get('headline', ''),
            'skills': user_data.get('skills', []),
            'certificates': user_data.get('certificates', []),
            'autoFillDetails': user_data.get('autoFillDetails', False),
            'about': user_data.get('about', ''),
            'phone': user_data.get('phone', ''),
            'notification_preferences': user_data.get('notification_preferences', {}),
            'privacy_settings': user_data.get('privacy_settings', {}),
            'picture': user_data.get('picture', ''),
            # Employer fields
            'website': user_data.get('website', ''),
            'industry': user_data.get('industry', ''),
            'company_size': user_data.get('company_size', ''),
            'headquarters': user_data.get('headquarters', ''),
            'culture_benefits': user_data.get('culture_benefits', [])
        }
    }), 200


@auth_bp.route('/delete-account', methods=['POST'])
def delete_account():
    data = request.get_json()
    email = (data.get('email') or '').strip()

    if not email:
        return jsonify({'message': 'Email required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'message': 'Account not found'}), 404

    try:
        coll = get_user_collection()
        coll.delete_one({'email': email.lower()})  # type: ignore
        
        # --- Feature 1: Admin Panel Cleanup ---
        # Also remove their anonymized skill profile from Admin/user_skill_profiles.json
        user_skills = set()
        user_skills.update([s.lower().strip() for s in user_data.get('skills', []) if s.strip()])
        active_id = user_data.get('activeResumeId')
        
        if active_id:
            for r in user_data.get('uploadedResumes', []):
                if r.get('id') == active_id:
                    if r.get('normalATS') and r.get('atsAnalysis', {}).get('matched_keywords'):
                        user_skills.update([s.lower().strip() for s in r['atsAnalysis']['matched_keywords'] if s.strip()])
                    elif r.get('extractedSkills'):
                        user_skills.update([s.lower().strip() for s in r['extractedSkills'] if s.strip()])
                    break
                    
        if user_skills:
            import hashlib
            skills_list = sorted(list(user_skills))
            skill_str = ','.join(skills_list)
            skill_hash = hashlib.sha256(skill_str.encode()).hexdigest()[:16]  # type: ignore
            
            # Correct path for Admin folder in MongoDB context
            profiles_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'Admin', 'user_skill_profiles.json'))
            if os.path.exists(profiles_path):
                try:
                    with open(profiles_path, 'r', encoding='utf-8') as f:
                        profiles = json.load(f)
                    # Filter out the deleted user's profile
                    new_profiles = [p for p in profiles if p.get('skill_hash') != skill_hash]
                    if len(new_profiles) < len(profiles):
                        with open(profiles_path, 'w', encoding='utf-8') as f:
                            json.dump(new_profiles, f, indent=2, ensure_ascii=False)
                except Exception as e:
                    print(f"[Cleanup] Failed to clean skill profile: {e}")

    except Exception as e:
        return jsonify({'message': f'Failed to delete account: {str(e)}'}), 500

    return jsonify({'message': 'Account deleted successfully'}), 200


@auth_bp.route('/google_login', methods=['POST'])
def google_login():
    data = request.get_json()
    email = (data.get('email') or '').strip()
    name = (data.get('name') or '').strip()
    google_id = data.get('sub', '')
    role = data.get('role', 'jobseeker')
    action = data.get('action', 'login')

    if not email:
        return jsonify({'message': 'Invalid Google data'}), 400

    user_data = _find_user_by_email(email)

    if action == 'signup':
        if user_data:
            existing_role = user_data.get('role', 'jobseeker')
            if existing_role != role:
                return jsonify({'message': 'Single email in both roles is not allowed by our portal'}), 409
            return jsonify({'message': 'Account already exists. Please log in.'}), 409
        user_record = {
            'name': name,
            'email': email,
            'google_id': google_id,
            'role': role,
            'auth_method': 'google',
            'created_at': datetime.datetime.utcnow().isoformat()
        }
        _save_user(user_record)
        return jsonify({'message': 'User registered successfully'}), 201

    elif action == 'login':
        if not user_data:
            return jsonify({'message': 'Account does not exist'}), 404
        return jsonify({
            'message': 'Login successful',
            'user': {
                'name': user_data.get('name'),
                'email': user_data.get('email'),
                'role': user_data.get('role', 'jobseeker'),
                'uploadedResumes': user_data.get('uploadedResumes', []),
                'activeResumeId': user_data.get('activeResumeId', None),
                'headline': user_data.get('headline', ''),
                'skills': user_data.get('skills', []),
                'certificates': user_data.get('certificates', []),
                'autoFillDetails': user_data.get('autoFillDetails', False),
                'about': user_data.get('about', ''),
                'phone': user_data.get('phone', ''),
                'notification_preferences': user_data.get('notification_preferences', {}),
                'privacy_settings': user_data.get('privacy_settings', {}),
                'picture': user_data.get('picture', ''),
                # Employer fields
                'website': user_data.get('website', ''),
                'industry': user_data.get('industry', ''),
                'company_size': user_data.get('company_size', ''),
                'headquarters': user_data.get('headquarters', ''),
                'culture_benefits': user_data.get('culture_benefits', [])
            }
        }), 200

    return jsonify({'message': 'Invalid action'}), 400


@auth_bp.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = (data.get('email') or '').strip()

    if not email:
        return jsonify({'message': 'Email required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        # Don't reveal account existence for security, but for this demo returning 404 is fine 
        # as requested "Reset password only happen for logged or signed up with email..."
        return jsonify({'message': 'Account does not exist'}), 404

    if user_data.get('auth_method') == 'google':
        return jsonify({'message': 'Reset password not available for Google accounts'}), 400

    return jsonify({'message': 'Reset link sent'}), 200


@auth_bp.route('/get_user_data', methods=['GET'])
def get_user_data():
    email = (request.args.get('email') or '').strip()
    if not email:
        return jsonify({'success': False, 'message': 'Email required'}), 400

    user_data = _find_user_by_email(email)
    if not user_data:
        return jsonify({'success': False, 'message': 'Account does not exist'}), 404

    # Remove sensitive data
    if '_id' in user_data:
        user_data['_id'] = str(user_data['_id'])
    if 'password' in user_data:
        del user_data['password']

    return jsonify({
        'success': True,
        'user': user_data
    }), 200
