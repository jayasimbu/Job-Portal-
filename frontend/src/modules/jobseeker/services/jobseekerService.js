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
