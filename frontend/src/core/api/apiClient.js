import axios from 'axios';
import appConfig from '../config/appConfig';

let isRefreshing = false;
let pendingRequests = [];

const processQueue = (token) => {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
};

const queueRequest = (cb) => {
  pendingRequests.push(cb);
};

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(appConfig.auth.tokenStorageKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      const refreshToken = localStorage.getItem(appConfig.auth.refreshTokenStorageKey);
      if (!refreshToken) {
        localStorage.removeItem(appConfig.auth.tokenStorageKey);
        localStorage.removeItem(appConfig.auth.refreshTokenStorageKey);
        localStorage.removeItem(appConfig.auth.userStorageKey);
        localStorage.removeItem(appConfig.auth.roleStorageKey);
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queueRequest((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshResponse = await axios.post(`${appConfig.api.baseUrl}/auth/refresh-token`, {
          refresh_token: refreshToken,
        });
        const newToken = refreshResponse?.data?.access_token;
        const newRefreshToken = refreshResponse?.data?.refresh_token;
        const role = refreshResponse?.data?.role;
        const user = refreshResponse?.data?.user;

        if (newToken) {
          localStorage.setItem(appConfig.auth.tokenStorageKey, newToken);
          if (newRefreshToken) {
            localStorage.setItem(appConfig.auth.refreshTokenStorageKey, newRefreshToken);
          }
          if (role) {
            localStorage.setItem(appConfig.auth.roleStorageKey, role);
          }
          if (user) {
            localStorage.setItem(appConfig.auth.userStorageKey, JSON.stringify(user));
          }
          processQueue(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (_) {
        localStorage.removeItem(appConfig.auth.tokenStorageKey);
        localStorage.removeItem(appConfig.auth.refreshTokenStorageKey);
        localStorage.removeItem(appConfig.auth.userStorageKey);
        localStorage.removeItem(appConfig.auth.roleStorageKey);
        window.location.href = '/auth/login';
      } finally {
        isRefreshing = false;
      }
    }

    if (!error.response) {
      // Distinguish timeout from backend-unreachable
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      return Promise.reject({
        message: isTimeout
          ? 'Request timed out. The server is busy — please try again.'
          : 'Cannot reach server. Make sure the backend is running on port 8000.',
        networkError: true,
        isTimeout,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;


