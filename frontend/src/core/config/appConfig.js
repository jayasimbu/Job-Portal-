// Application configuration
const runtimeApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const appConfig = {
  // API configuration
  api: {
    baseUrl: runtimeApiBaseUrl || 'http://127.0.0.1:8000/api',
    timeout: 120000,
  },
  
  // Authentication settings
  auth: {
    tokenStorageKey: 'accessToken',
    refreshTokenStorageKey: 'refreshToken',
    userStorageKey: 'currentUser',
    roleStorageKey: 'userRole',
    roleRedirectMap: {
      jobseeker: '/platform/jobseeker/dashboard',
      employer: '/platform/employer/dashboard',
      admin: '/platform/admin/dashboard',
    },
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  },
  
  // Pagination settings
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  },
  
  // File upload settings
  fileUpload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  
  // AI settings
  ai: {
    resumeParsingTimeout: 30000, // 30 seconds
    matchingThreshold: 70, // Minimum match percentage
    ollama: {
      model: 'qwen2.5:7b-instruct',
      timeout: 60000,
    },
  },
  
  // Feature flags
  features: {
    enableAIResumeParsing: true,
    enableAIJobMatching: true,
    enableAIRecommendations: true,
    enableVerification: true,
  },
};

export default appConfig;
