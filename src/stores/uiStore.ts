import { create } from 'zustand';
interface UIState {
  sidebarOpen: boolean; snack: { open: boolean; msg: string; severity: 'success'|'error'|'info' };
  toggleSidebar: () => void;
  showSnack: (msg: string, severity?: 'success'|'error'|'info') => void;
  hideSnack: () => void;
}
export const useUIStore = create<UIState>(set => ({
  sidebarOpen: true,
  snack: { open: false, msg: '', severity: 'success' },
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  showSnack: (msg, severity = 'success') => set({ snack: { open: true, msg, severity } }),
  hideSnack: () => set(s => ({ snack: { ...s.snack, open: false } })),
}));
