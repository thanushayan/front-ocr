import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://api.ocri.app/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const { token, companyId } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (companyId) config.headers['X-Company-Id'] = companyId;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) useAuthStore.getState().logout();
    return Promise.reject(err);
  }
);
