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
