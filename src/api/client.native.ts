import axios from 'axios';
import { storage } from './storage';
import { router } from 'expo-router';

const apiClient = axios.create({
    baseURL: 'https://sandbox-api.mizrmo.com/api/v1', 
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await storage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await storage.removeItem('token');
            router.replace('/(auth)/signin');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
