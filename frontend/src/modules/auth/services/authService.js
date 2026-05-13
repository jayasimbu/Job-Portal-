import apiClient from '../../../core/api/apiClient';
import appConfig from '../../../core/config/appConfig';

const unwrapApiPayload = (response) => {
  const payload = response?.data;
  if (!payload || typeof payload !== 'object') return payload;

  if (Object.prototype.hasOwnProperty.call(payload, 'success')) {
    if (payload.success === false) {
      const err = new Error(payload.message || 'Request failed');
      err.apiError = payload;
      throw err;
    }
    return payload.data ?? {};
  }

  return payload;
};

const persistSession = (payload) => {
  if (!payload) return;
  if (payload.access_token) {
    localStorage.setItem(appConfig.auth.tokenStorageKey, payload.access_token);
  }
  if (payload.refresh_token) {
    localStorage.setItem(appConfig.auth.refreshTokenStorageKey, payload.refresh_token);
  }
  if (payload.role) {
    localStorage.setItem(appConfig.auth.roleStorageKey, payload.role);
  }
  if (payload.user) {
    localStorage.setItem(appConfig.auth.userStorageKey, JSON.stringify(payload.user));
  }
};

export const registerUser = async (payload) => {
  const response = await apiClient.post('/auth/signup', payload);
  const data = unwrapApiPayload(response);
  persistSession(data);
  return data;
};

export const loginUser = async (payload) => {
  const formData = new URLSearchParams();
  formData.append('username', payload.email);
  formData.append('password', payload.password);

  const response = await apiClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const data = unwrapApiPayload(response);
  persistSession(data);
  return data;
};

export const loginWithGoogle = async ({ id_token, role = 'jobseeker', intent = 'login' }) => {
  const response = await apiClient.post('/auth/google', { id_token, role, intent });
  const data = unwrapApiPayload(response);
  persistSession(data);
  return data;
};

export const refreshSession = async () => {
  const refreshToken = localStorage.getItem(appConfig.auth.refreshTokenStorageKey);
  if (!refreshToken) return null;
  const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
  const data = unwrapApiPayload(response);
  persistSession(data);
  return data;
};

export const logoutUser = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (_) {
    // Ignore logout API errors and clear local session anyway.
  }
  localStorage.removeItem(appConfig.auth.tokenStorageKey);
  localStorage.removeItem(appConfig.auth.refreshTokenStorageKey);
  localStorage.removeItem(appConfig.auth.userStorageKey);
  localStorage.removeItem(appConfig.auth.roleStorageKey);
};

export const getRoleRedirectPath = (role) => {
  return appConfig.auth.roleRedirectMap[role] || '/';
};

export const forgotPassword = async (email) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return unwrapApiPayload(response);
};

export const resetPassword = async (token, newPassword) => {
  const response = await apiClient.post('/auth/reset-password', { token, new_password: newPassword });
  return unwrapApiPayload(response);
};

export const verifyEmail = async (token) => {
  const response = await apiClient.get(`/auth/verify-email?token=${token}`);
  return unwrapApiPayload(response);
};



