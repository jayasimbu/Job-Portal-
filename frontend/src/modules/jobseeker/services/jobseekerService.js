import apiClient from '../../../core/api/apiClient';

export const fetchJobSeekerProfile = async (userId) => {
  const response = await apiClient.get(`/jobseeker/profile/${userId}`);
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

export const fetchInsights = async (userId) => {
  const response = await apiClient.get(`/jobseeker/insights/${userId}`);
  return response.data;
};

export const fetchLearningRecommendations = async (userId) => {
  const response = await apiClient.get(`/jobseeker/learning/${userId}`);
  return response.data;
};

export const fetchNotifications = async (userId) => {
  const response = await apiClient.get(`/jobseeker/notifications/${userId}`);
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
