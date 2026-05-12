import appConfig from '../config/appConfig';

const readStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const getCurrentUser = () => {
  const raw = readStorage(appConfig.auth.userStorageKey);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getCurrentUserId = (fallback = 1) => {
  const user = getCurrentUser();
  const parsed = Number(user?.id);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const getCurrentUserRole = () => {
  return readStorage(appConfig.auth.roleStorageKey) || getCurrentUser()?.role || '';
};

export const logout = () => {
  localStorage.removeItem(appConfig.auth.tokenStorageKey);
  localStorage.removeItem(appConfig.auth.refreshTokenStorageKey);
  localStorage.removeItem(appConfig.auth.userStorageKey);
  localStorage.removeItem(appConfig.auth.roleStorageKey);
  window.location.href = '/auth/login';
};


