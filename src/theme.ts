import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
  palette: {
    primary: { main: '#1A56DB', dark: '#1745B0', light: '#DBE6FD' },
    secondary: { main: '#1D9E75', dark: '#11644B', light: '#C9F4E2' },
    error: { main: '#DC2626' },
    warning: { main: '#D97706' },
    success: { main: '#16A34A' },
  },
  typography: { fontFamily: "'Inter', system-ui, sans-serif" },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, fontSize: 13, height: 36 } } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { border: '1px solid #E1E4EB', borderRadius: 12 } } },
  },
});
