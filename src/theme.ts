import { createTheme } from '@mui/material/styles';

const shadowSm = '0 1px 2px rgba(19,23,34,.06), 0 1px 1px rgba(19,23,34,.04)';
const shadowMd = '0 4px 12px rgba(19,23,34,.08), 0 1px 2px rgba(19,23,34,.04)';
const shadowLg = '0 18px 48px rgba(19,23,34,.14), 0 4px 12px rgba(19,23,34,.06)';

// MUI shadows array requires exactly 25 entries (index 0–24)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shadows: any = [
  'none',       // 0
  shadowSm,     // 1
  shadowMd,     // 2
  shadowLg,     // 3
  'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none',
  'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none',
  'none', 'none', 'none', 'none', 'none',
];

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1A56DB',
      light: '#DBE6FD',
      dark: '#1745B0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1D9E75',
      light: '#C9F4E2',
      dark: '#11644B',
      contrastText: '#fff',
    },
    error:   { main: '#DC2626' },
    warning: { main: '#D97706' },
    success: { main: '#16A34A' },
    info:    { main: '#1A56DB' },
    background: {
      default: '#F7F8FA',
      paper:   '#FFFFFF',
    },
    text: {
      primary:   '#131722',
      secondary: '#353B4A',
      disabled:  '#9CA4B2',
    },
    divider: '#E1E4EB',
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontSize: 13,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em' },
    h4: { fontSize: 17, fontWeight: 700 },
    h5: { fontSize: 15, fontWeight: 600 },
    h6: { fontSize: 13, fontWeight: 600 },
    body1: { fontSize: 13 },
    body2: { fontSize: 12 },
    caption: { fontSize: 11, color: '#6B7384' },
    overline: { fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' },
    button: { fontSize: 13, fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 8 },
  shadows,
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 13,
          height: 36,
          borderRadius: 8,
          lineHeight: 1,
        },
        sizeSmall: {
          height: 30,
          fontSize: 12,
          padding: '0 12px',
        },
        outlined: {
          borderColor: '#C9CFD9',
          color: '#131722',
          '&:hover': {
            borderColor: '#9CA4B2',
            backgroundColor: '#F7F8FA',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: 13,
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C9CFD9',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9CA4B2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2F63E8',
            borderWidth: 1,
            boxShadow: '0 0 0 3px rgba(26,86,219,.15)',
          },
        },
        input: {
          height: 38,
          padding: '0 12px',
          boxSizing: 'border-box',
          fontSize: 13,
        },
        sizeSmall: {
          '& .MuiOutlinedInput-input': {
            height: 38,
            padding: '0 12px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 12,
          fontWeight: 600,
          color: '#353B4A',
          '&.Mui-focused': { color: '#1A56DB' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #E1E4EB',
          borderRadius: 12,
          boxShadow: shadowSm,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 20,
          fontSize: 10,
          fontWeight: 700,
          borderRadius: 4,
        },
        label: {
          padding: '0 8px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#E1E4EB' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { fontSize: 13 },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: { fontSize: 13 },
      },
    },
  },
});
