import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface CompanyState { companyId: string | null; setCompanyId: (id: string) => void; }
export const useCompanyStore = create<CompanyState>()(
  persist(set => ({ companyId: null, setCompanyId: id => set({ companyId: id }) }), { name: 'ocri-company' })
);
