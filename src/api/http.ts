import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const http: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const auth = useAuthStore();
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const auth = useAuthStore();
    const status = error.response?.status;
    const originalRequest = error.config as RetriableRequest | undefined;

    if (status === 401 && auth.canRefresh && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await auth.refresh();
        return http(originalRequest);
      } catch {
        auth.logout();
      }
    }

    return Promise.reject(error);
  }
);

export { http };
