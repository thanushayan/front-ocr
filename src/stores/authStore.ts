import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User { id: string; name: string; email: string; role: string; }
interface Company { id: string; name: string; plan: string; }
interface AuthState {
  token: string | null; user: User | null; companyId: string | null; companies: Company[];
  setAuth: (token: string, user: User, companies: Company[]) => void;
  setCompany: (id: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null, user: null, companyId: null, companies: [],
      setAuth: (token, user, companies) => set({ token, user, companies, companyId: companies[0]?.id ?? null }),
      setCompany: id => set({ companyId: id }),
      logout: () => set({ token: null, user: null, companyId: null }),
    }),
    { name: 'ocri-auth', partialize: s => ({ token: s.token, companyId: s.companyId }) }
  )
);
