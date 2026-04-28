// Route constants
export const ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  
  // Job seeker routes
  JOB_SEEKER: {
    DASHBOARD: '/platform/jobseeker/dashboard',
    PROFILE: '/platform/jobseeker/profile',
    JOBS: '/platform/jobseeker/jobs',
    APPLICATIONS: '/platform/jobseeker/applications',
    INSIGHTS: '/platform/jobseeker/insights',
    LEARNING: '/platform/jobseeker/learning',
    NOTIFICATIONS: '/platform/jobseeker/notifications',
  },
  
  // Employer routes
  EMPLOYER: {
    DASHBOARD: '/platform/employer/dashboard',
    PROFILE: '/platform/employer/profile',
    POST_JOB: '/platform/employer/post-job',
    CANDIDATES: '/platform/employer/candidates',
    ANALYTICS: '/platform/employer/analytics',
    HIRING_POLICY: '/platform/employer/hiring-policy',
    INTERVIEWS: '/platform/employer/interviews',
  },
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/platform/admin/dashboard',
    USERS: '/platform/admin/users',
    COMPANIES: '/platform/admin/companies',
    JOBS: '/platform/admin/jobs',
    LOGS: '/platform/admin/logs',
    ANALYTICS: '/platform/admin/analytics',
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