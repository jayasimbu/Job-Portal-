import os, logging
from flask import Blueprint, request, jsonify  # type: ignore
import sys

# Add the parent directory to sys.path to import from DB
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from DB.mongo_setup import get_job_collection, get_user_collection, get_interviews_collection  # type: ignore

log = logging.getLogger(__name__)
employer_bp = Blueprint('employer', __name__)

@employer_bp.route('/api/employer/dashboard', methods=['GET'])
def get_dashboard_data():
    """
    GET /api/employer/dashboard?company=TechFlow%20Inc.
    Returns stats, recent jobs, and top candidates for the employer.
    """
    company = request.args.get('company', '').strip()
    if not company:
        return jsonify({'success': False, 'error': 'company query param required'}), 400

    job_coll = get_job_collection()
    user_coll = get_user_collection()
    
    # 1. Fetch Employer's Jobs
    employer_jobs: list[dict] = []
    if job_coll is not None:
        # DB.json might use slightly different casing or partial match, 
        # so we do a regex match for robustness
        employer_jobs = list(job_coll.find({'company': {'$regex': company, '$options': 'i'}}, {'_id': 0}))
    
    active_jobs_count = len(employer_jobs)
    job_ids = [str(j.get('id')) for j in employer_jobs]

    # 2. Calculate Total Applicants and get Top Candidates
    total_applicants = 0
    top_candidates: list[dict] = []
    
    if user_coll is not None and job_ids:
        # Find all users who applied to any of these jobs
        # In a real scenario, we'd aggregate. Here we fetch users with applications.
        users_with_apps = list(user_coll.find({
            'appliedJobs.jobId': {'$in': job_ids}
        }))
        
        for u in users_with_apps:
            # Count how many of this employer's jobs this user applied to
            apps = [a for a in u.get('appliedJobs', []) if str(a.get('jobId')) in job_ids]
            total_applicants += len(apps)
            
            # Simple mock for "AI Match" or top candidate logic
            # In a real app we'd score them against the job description using AI
            top_candidates.append({
                'name': u.get('name', 'Applicant'),
                'email': u.get('email', ''),
                'title': u.get('headline', u.get('candidateType', 'Professional')),
                'matchScore': 85 + (len(u.get('name', '')) % 15) # Mock score 85-99
            })

    # Sort and take top 5 candidates
    top_candidates.sort(key=lambda x: x['matchScore'], reverse=True)
    top_candidates = top_candidates[:5]  # type: ignore
    
    # Take top 5 recent jobs
    recent_jobs = employer_jobs[:5]  # type: ignore

    # 3. Fetch Interviews count
    interviews_count = 0
    try:
        interview_coll = get_interviews_collection()
        if interview_coll is not None:
            interviews_count = interview_coll.count_documents({'company': {'$regex': company, '$options': 'i'}})
    except Exception:
        # Fallback: check users' application status
        interviews_count = sum(1 for u in users_with_apps if any(a.get('status') == 'Interview' and str(a.get('jobId')) in job_ids for a in u.get('appliedJobs', [])))

    # 4. Average Time to Hire (Mock logic based on closing date if available)
    # Since we might not have 'hired' date, we'll return a data-driven mock or calc
    avg_time = "14d"
    if active_jobs_count > 0:
        # If we have jobs, maybe randomize based on something real?
        # Let's say it's 10 + (total_applicants % 10) days
        avg_time = f"{10 + (total_applicants % 10)}d"

    return jsonify({
        'success': True,
        'stats': {
            'activeJobs': active_jobs_count,
            'totalApplicants': total_applicants,
            'interviewsScheduled': interviews_count, 
            'avgTimeToHire': avg_time
        },
        'recentJobs': recent_jobs,
        'topCandidates': top_candidates
    }), 200

@employer_bp.route('/api/employer/jobs', methods=['GET'])
def get_employer_jobs():
    """
    GET /api/employer/jobs?company=TechFlow%20Inc.
    Returns all jobs posted by the employer, including mock applicant counts.
    """
    company = request.args.get('company', '').strip()
    if not company:
        return jsonify({'success': False, 'error': 'company query param required'}), 400

    job_coll = get_job_collection()
    
    employer_jobs: list[dict] = []
    if job_coll is not None:
        employer_jobs = list(job_coll.find({'company': {'$regex': company, '$options': 'i'}}, {'_id': 0}))

    # Add mock applicant counts and status to each job
    import random
    for job in employer_jobs:
        job['applicantsCount'] = random.randint(5, 50)
        job['newApplicantsCount'] = random.randint(0, 5)
        job['status'] = 'Active' # or 'Closed', 'Paused' based on logic if available

    return jsonify({
        'success': True,
        'jobs': employer_jobs
    }), 200
