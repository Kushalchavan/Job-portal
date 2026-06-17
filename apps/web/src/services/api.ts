import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export const API_STORAGE_KEYS = {
  ACCESS_TOKEN: 'recruitment_access_token',
  REFRESH_TOKEN: 'recruitment_refresh_token',
  API_URL: 'recruitment_api_url',
};

// Retrieve configured API URL or fall back to /api or env variable
export const getApiUrl = (): string => {
  return localStorage.getItem(API_STORAGE_KEYS.API_URL) || 
         (import.meta as any).env?.VITE_API_URL || 
         'https://ais-dev-gtylpwn636ysgdybbcev4z-1018900589628.asia-southeast1.run.app/api'; 
         // Fallback to current development app's server-supported API endpoint or '/api'
};

export const setApiUrl = (url: string) => {
  localStorage.setItem(API_STORAGE_KEYS.API_URL, url);
  window.location.reload(); // Refresh to apply new URL
};

export const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth tokens
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(API_STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Dynamic baseUrl update check
    config.baseURL = getApiUrl();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Refresh Token Handler
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only intercept 401s that haven't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(API_STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        // No refresh token available, must login again
        isRefreshing = false;
        handleSessionExpired();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${getApiUrl()}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, newRefreshToken } = response.data;
        
        localStorage.setItem(API_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        if (newRefreshToken) {
          localStorage.setItem(API_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        processQueue(null, accessToken);
        isRefreshing = false;
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        handleSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const handleSessionExpired = () => {
  localStorage.removeItem(API_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(API_STORAGE_KEYS.REFRESH_TOKEN);
  // Use custom event to notify stores to update user state to null
  window.dispatchEvent(new Event('auth:unauthorized'));
};
