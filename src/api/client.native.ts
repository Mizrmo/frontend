import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { env } from '../config/env';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  saveAuthSession,
} from './tokens';

type RetriableRequest = InternalAxiosRequestConfig & { _retried?: boolean };

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
    url.includes('/auth/reset-password') ||
    url.includes('/auth/refresh')
  );
}

// Concurrent 401s should trigger a single refresh call, not one per request.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const storedRefreshToken = await getRefreshToken();
      if (!storedRefreshToken) {
        return null;
      }
      try {
        const response = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${env.apiUrl}/auth/refresh`,
          { refreshToken: storedRefreshToken }
        );
        await saveAuthSession(response.data);
        return response.data.accessToken;
      } catch {
        return null;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function handleUnauthorized(
  error: AxiosError,
  originalRequest: RetriableRequest
) {
  if (isAuthEndpoint(originalRequest.url) || originalRequest._retried) {
    await clearAuthSession();
    if (isAuthEndpoint(originalRequest.url)) {
      router.replace('/(auth)/signin');
    }
    return Promise.reject(error);
  }

  const newAccessToken = await refreshAccessToken();
  if (!newAccessToken) {
    await clearAuthSession();
    router.replace('/(auth)/signin');
    return Promise.reject(error);
  }

  originalRequest._retried = true;
  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
  return apiClient(originalRequest);
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
      const originalRequest = error.config as RetriableRequest | undefined;
      if (originalRequest) {
        return handleUnauthorized(error, originalRequest);
      }
      await clearAuthSession();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
