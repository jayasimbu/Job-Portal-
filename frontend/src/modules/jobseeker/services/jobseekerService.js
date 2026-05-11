import apiClient from '../../../core/api/apiClient';

export const fetchJobSeekerProfile = async (userId) => {
  const response = await apiClient.get(`/jobseeker/profile/${userId}`);
  return response.data;
};

export const upsertJobSeekerProfile = async (userId, payload) => {
  const response = await apiClient.put(`/jobseeker/profile/${userId}`, payload);
  return response.data;
};

export const saveResumeAnalysis = async (userId, analysisData) => {
  const response = await apiClient.post(`/jobseeker/resume/save-analysis/${userId}`, analysisData);
  return response.data;
};

export const uploadResume = async (payload) => {
  const response = await apiClient.post('/jobseeker/resume/upload', payload);
  return response.data;
};

export const fetchRecommendations = async (userId) => {
  const response = await apiClient.get(`/jobseeker/recommendations/${userId}`);
  return response.data;
};

export const fetchApplications = async (userId) => {
  const response = await apiClient.get(`/jobseeker/applications/${userId}`);
  return response.data;
};

export const applyForJob = async (userId, jobId) => {
  const response = await apiClient.post('/jobseeker/applications', { job_id: jobId });
  return response.data;
};

export const fetchInsights = async (userId) => {
  const response = await apiClient.get(`/jobseeker/insights/${userId}`);
  return response.data;
};

export const fetchLearningRecommendations = async (userId) => {
  const response = await apiClient.get(`/jobseeker/learning/${userId}`);
  return response.data;
};

export const fetchResumeInsights = async () => {
  const response = await apiClient.get('/jobseeker/resume-insights');
  return response.data;
};

export const matchJd = async (payload) => {
  const response = await apiClient.post('/jobseeker/ats/jd', payload);
  return response.data;
};

export const fetchNotifications = async (userId) => {
  const response = await apiClient.get(`/jobseeker/notifications/${userId}`);
  return response.data;
};

export const fetchAiQueueStatus = async (userId) => {
  const response = await apiClient.get(`/ai/queue/status/${userId}`);
  return response.data;
};

export const fetchBookmarks = async (userId) => {
  const response = await apiClient.get(`/jobseeker/bookmarks/${userId}`);
  return response.data;
};

export const toggleBookmarkApi = async (userId, jobId) => {
  const response = await apiClient.post('/jobseeker/bookmarks/toggle', { user_id: userId, job_id: jobId });
  return response.data;
};

export const fetchSearchHistory = async (userId) => {
  const response = await apiClient.get(`/jobseeker/search-history/${userId}`);
  return response.data;
};

export const addSearchHistory = async (userId, query) => {
  const response = await apiClient.post('/jobseeker/search-history', { user_id: userId, query });
  return response.data;
};

export const uploadCertificate = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/certificates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const fetchJobSeekerCertificates = async () => {
  const response = await apiClient.get('/certificates/user');
  return response.data;
};
