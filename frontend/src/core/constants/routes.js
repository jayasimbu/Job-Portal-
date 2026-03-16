// Route constants
export const ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  
  // Job seeker routes
  JOB_SEEKER: {
    DASHBOARD: '/jobseeker/dashboard',
    PROFILE: '/jobseeker/profile',
    JOBS: '/jobseeker/jobs',
    APPLICATIONS: '/jobseeker/applications',
  },
  
  // Employer routes
  EMPLOYER: {
    DASHBOARD: '/employer/dashboard',
    PROFILE: '/employer/profile',
    POST_JOB: '/employer/post-job',
    CANDIDATES: '/employer/candidates',
  },
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    COMPANIES: '/admin/companies',
    JOBS: '/admin/jobs',
    LOGS: '/admin/logs',
  },
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // Job seeker endpoints
  JOB_SEEKER: {
    PROFILE: '/jobseeker/profile',
    RESUME: '/jobseeker/resume',
    APPLICATIONS: '/jobseeker/applications',
    RECOMMENDATIONS: '/jobseeker/recommendations',
  },
  
  // Employer endpoints
  EMPLOYER: {
    PROFILE: '/employer/profile',
    JOBS: '/employer/jobs',
    CANDIDATES: '/employer/candidates',
  },
  
  // Admin endpoints
  ADMIN: {
    USERS: '/admin/users',
    COMPANIES: '/admin/companies',
    JOBS: '/admin/jobs',
    LOGS: '/admin/logs',
    STATS: '/admin/stats',
  },
  
  // AI endpoints
  AI: {
    RESUME_PARSE: '/ai/resume-parse',
    ATS_SCORE: '/ai/ats-score',
    MATCHING: '/ai/matching',
    RECOMMENDATIONS: '/ai/recommendations',
    VERIFICATION: '/ai/verification',
  },
};