import apiClient from '../../../core/api/apiClient';

export const fetchAdminDashboard = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};

export const fetchSystemLogs = async () => {
  const response = await apiClient.get('/admin/logs');
  return response.data;
};

export const fetchSystemHealth = async () => {
  const response = await apiClient.get('/admin/monitoring/health');
  return response.data;
};

export const fetchAdminUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

export const fetchAdminCompanies = async () => {
  const response = await apiClient.get('/admin/companies');
  return response.data;
};

export const fetchAdminJobs = async () => {
  const response = await apiClient.get('/admin/jobs');
  return response.data;
};

export const fetchCertificateQueue = async () => {
  const response = await apiClient.get('/certificates/queue');
  return response.data;
};

export const verifyCertificate = async (certId, status) => {
  const response = await apiClient.put(`/certificates/verify/${certId}`, { status });
  return response.data;
};



