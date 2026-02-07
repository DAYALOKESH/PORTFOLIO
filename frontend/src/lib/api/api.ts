import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/stores/auth-store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to delay retry
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retry?: number };

    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
         window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Retry logic for network errors or 5xx errors
    if (
      config &&
      (!error.response || (error.response.status >= 500 && error.response.status < 600))
    ) {
      config._retry = config._retry || 0;

      if (config._retry < MAX_RETRIES) {
        config._retry += 1;
        await delay(RETRY_DELAY * config._retry); // Exponential backoff
        return api.request(config);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
