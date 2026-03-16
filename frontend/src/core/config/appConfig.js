// Application configuration
const appConfig = {
  // API configuration
  api: {
    baseUrl: 'http://localhost:8000/api',
    timeout: 10000,
  },
  
  // Authentication settings
  auth: {
    tokenStorageKey: 'authToken',
    refreshTokenStorageKey: 'refreshToken',
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