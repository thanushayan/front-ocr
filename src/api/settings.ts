import { api } from './client';

// Company
export const getCompanySettings = () => api.get('/settings/company').then(r => r.data);
export const updateCompanySettings = (data: Record<string, unknown>) => api.put('/settings/company', data).then(r => r.data);
export const uploadCompanyLogo = (file: File) => {
  const fd = new FormData();
  fd.append('logo', file);
  return api.post('/settings/company/logo', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};
export const removeCompanyLogo = () => api.delete('/settings/company/logo').then(r => r.data);

// Profile
export const getProfile = () => api.get('/settings/profile').then(r => r.data);
export const updateProfile = (data: Record<string, unknown>) => api.put('/settings/profile', data).then(r => r.data);
export const updatePassword = (data: { current: string; newPassword: string }) => api.put('/settings/profile/password', data).then(r => r.data);

// API Keys
export const getApiKeys = () => api.get('/settings/api-keys').then(r => r.data);
export const createApiKey = (data: { name: string; env: string; scopes: string[]; expiresAt?: string }) => api.post('/settings/api-keys', data).then(r => r.data);
export const revokeApiKey = (id: string) => api.delete(`/settings/api-keys/${id}`).then(r => r.data);

// Subscription
export const getSubscription = () => api.get('/settings/subscription').then(r => r.data);
export const createBillingPortal = () => api.post('/settings/subscription/portal').then(r => r.data);

// IP Allowlist
export const getIpAllowlist = () => api.get('/settings/ip-allowlist').then(r => r.data);
export const addIpRange = (data: { cidr: string; description: string; appliesTo: string[]; active: boolean }) => api.post('/settings/ip-allowlist', data).then(r => r.data);
export const updateIpRange = (id: string, data: Record<string, unknown>) => api.put(`/settings/ip-allowlist/${id}`, data).then(r => r.data);
export const deleteIpRange = (id: string) => api.delete(`/settings/ip-allowlist/${id}`).then(r => r.data);
