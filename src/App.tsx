import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import AppShell from './components/layout/AppShell';
import CompanySettingsPage from './pages/Settings/CompanySettingsPage';
import ProfilePage from './pages/Settings/ProfilePage';
import ApiKeysPage from './pages/Settings/ApiKeysPage';
import SubscriptionPage from './pages/Settings/SubscriptionPage';
import IpAllowlistPage from './pages/Settings/IpAllowlistPage';

const qc = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppShell />}>
              <Route index element={<Navigate to="/settings/company" replace />} />
              <Route path="settings/company" element={<CompanySettingsPage />} />
              <Route path="settings/profile" element={<ProfilePage />} />
              <Route path="settings/api-keys" element={<ApiKeysPage />} />
              <Route path="settings/billing" element={<SubscriptionPage />} />
              <Route path="settings/allowlist" element={<IpAllowlistPage />} />
              <Route path="*" element={<Navigate to="/settings/company" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
