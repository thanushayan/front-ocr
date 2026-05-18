import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCompanySettings, updateCompanySettings, uploadCompanyLogo, removeCompanyLogo,
  getProfile, updateProfile, updatePassword,
  getApiKeys, createApiKey, revokeApiKey,
  getSubscription, createBillingPortal,
  getIpAllowlist, addIpRange, updateIpRange, deleteIpRange,
} from '../api/settings';

export const useCompanySettings = () => useQuery({ queryKey: ['settings', 'company'], queryFn: getCompanySettings });

export const useUpdateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateCompanySettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'company'] }),
  });
};

export const useUploadLogo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadCompanyLogo,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'company'] }),
  });
};

export const useRemoveLogo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeCompanyLogo,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'company'] }),
  });
};

export const useProfile = () => useQuery({ queryKey: ['settings', 'profile'], queryFn: getProfile });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'profile'] }),
  });
};

export const useUpdatePassword = () => useMutation({ mutationFn: updatePassword });

export const useApiKeys = () => useQuery({ queryKey: ['settings', 'api-keys'], queryFn: getApiKeys });

export const useCreateApiKey = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createApiKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'api-keys'] }),
  });
};

export const useRevokeApiKey = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'api-keys'] }),
  });
};

export const useSubscription = () => useQuery({ queryKey: ['settings', 'subscription'], queryFn: getSubscription });

export const useBillingPortal = () => useMutation({ mutationFn: createBillingPortal });

export const useIpAllowlist = () => useQuery({ queryKey: ['settings', 'ip-allowlist'], queryFn: getIpAllowlist });

export const useAddIpRange = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addIpRange,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'ip-allowlist'] }),
  });
};

export const useUpdateIpRange = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateIpRange(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ['settings', 'ip-allowlist'] });
      const prev = qc.getQueryData(['settings', 'ip-allowlist']);
      qc.setQueryData(['settings', 'ip-allowlist'], (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((item: Record<string, unknown>) => item.id === id ? { ...item, ...data } : item);
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['settings', 'ip-allowlist'], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['settings', 'ip-allowlist'] }),
  });
};

export const useDeleteIpRange = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteIpRange,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'ip-allowlist'] }),
  });
};
