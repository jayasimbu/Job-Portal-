import apiClient from '../../../core/api/apiClient';

// ── Public (jobseeker-accessible) ──────────────────────────────────────────
export const fetchCompanyProfile = (employerId) =>
  apiClient.get(`/company/${employerId}`).then(r => r.data);

export const fetchCompanyJobs = (employerId) =>
  apiClient.get(`/company/${employerId}/jobs`).then(r => r.data);

// ── Private (employer-only) ──────────────────────────────────────────────
export const fetchMyCompany = () =>
  apiClient.get('/employer/company/me/profile').then(r => r.data);

export const updateMyCompany = (data) =>
  apiClient.put('/employer/company/me/update', data).then(r => r.data);

export const uploadCompanyLogo = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return apiClient.post('/employer/company/me/upload-logo', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};
