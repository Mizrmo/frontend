import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { env } from '../config/env';
import {
  clearAuthSession,
  getAccessToken,
} from './tokens';

const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

function isAuthEndpoint(url?: string): boolean {
  if (!url) {
    return false;
  }
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/verify-otp') ||
    url.includes('/auth/resend-otp') ||
    url.includes('/auth/set-password') ||
    url.includes('/auth/forgot-password') ||
    url.includes('/auth/reset-password')
  );
}

async function handleUnauthorized(
  error: AxiosError,
  originalRequest: InternalAxiosRequestConfig
) {
  // Backend does not expose POST /auth/refresh yet — surface the original 401 instead.
  await clearAuthSession();

  if (isAuthEndpoint(originalRequest.url)) {
    router.replace('/(auth)/signin');
  }

  return Promise.reject(error);
}

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      if (originalRequest) {
        return handleUnauthorized(error, originalRequest);
      }
      await clearAuthSession();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
