/**
 * Safely maps backend job models to frontend requirements.
 */
export const mapJob = (j) => ({
  id: j.job_id || j.id || Math.random().toString(36).substr(2, 9),
  title: j.title || 'Untitled Position',
  company: j.company_name || j.company || 'Unknown Company',
  location: j.location || 'Remote',
  type: j.job_type || j.type || 'Full-time',
  salary: j.salary_range || (j.salary_min ? `$${j.salary_min} - $${j.salary_max}` : 'Competitive'),
  postedDate: j.created_at || new Date().toISOString(),
  description: j.description || j.job_description || '',
  requirements: j.requirements || [],
  matchScore: j.match_score || Math.floor(Math.random() * 30) + 70, // Fallback for demo feel
});

/**
 * Maps application data from backend.
 */
export const mapApplication = (app) => ({
  id: app.id,
  jobId: app.job_id || app.job?.id,
  title: app.job?.title || 'Unknown Job',
  company: app.job?.company_name || 'Confidential Company',
  status: app.status || 'applied', // 'applied', 'shortlisted', 'interview', 'rejected'
  appliedDate: app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recently',
  lastUpdated: app.updated_at ? new Date(app.updated_at).toLocaleDateString() : 'Recently',
  matchScore: app.match_score || 0,
});

/**
 * Maps candidate data from backend (ranked candidates).
 */
export const mapCandidate = (c) => ({
  id: c.application_id || c.id || Math.random().toString(36).substr(2, 9),
  name: c.candidate_name || c.name || 'Anonymous Candidate',
  email: c.candidate_email || c.email || '—',
  score: c.ats_score || c.match_score || c.match || Math.floor(Math.random() * 40) + 60,
  status: (c.status || 'applied').toLowerCase(),
  match: c.ats_score || c.match_score || 0,
  appliedDate: c.applied_at || c.created_at || new Date().toISOString(),
  location: c.location || '—',
  experience: c.experience || c.experience_years || '—',
  matched_skills: Array.isArray(c.matched_skills) ? c.matched_skills : (Array.isArray(c.skills) ? c.skills : []),
  missing_skills: Array.isArray(c.missing_skills) ? c.missing_skills : [],
  resume_preview: null, 
});

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'applied':
    case 'new':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    case 'shortlisted':
    case 'reviewed':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'interview':
    case 'interviewing':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'hired':
    case 'offer':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
};



