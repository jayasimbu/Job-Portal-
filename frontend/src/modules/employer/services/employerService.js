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

export const fetchEmployerJobs = async (employerId) => {
  const response = await apiClient.get(`/employer/jobs/${employerId}`);
  return response.data;
};

export const fetchEmployerAnalytics = async (employerId) => {
  const response = await apiClient.get(`/employer/analytics/${employerId}`);
  return response.data;
};

export const updateCandidateStatus = async (applicationId, status) => {
  const response = await apiClient.post('/employer/candidates/status', { application_id: applicationId, status });
  return response.data;
};

export const fetchInterviews = async (employerId) => {
  const response = await apiClient.get(`/employer/interviews/${employerId}`);
  return response.data;
};

export const scheduleInterview = async (payload) => {
  const response = await apiClient.post('/employer/interviews', payload);
  return response.data;
};

export const fetchHiringPolicy = async (employerId) => {
  const response = await apiClient.get(`/employer/hiring-policy/${employerId}`);
  return response.data;
};

export const saveHiringPolicy = async (payload) => {
  const response = await apiClient.put('/employer/hiring-policy', payload);
  return response.data;
};
