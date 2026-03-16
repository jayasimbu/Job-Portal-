import apiClient from '../../../core/api/apiClient';

export const upsertCompanyProfile = async (userId, payload) => {
  const response = await apiClient.put(`/employer/company/${userId}`, payload);
  return response.data;
};

export const createJobPosting = async (payload) => {
  const response = await apiClient.post('/employer/jobs', payload);
  return response.data;
};

export const fetchRankedCandidates = async (jobId) => {
  const response = await apiClient.get(`/employer/jobs/${jobId}/ranked-candidates`);
  return response.data;
};
