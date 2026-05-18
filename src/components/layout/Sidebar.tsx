import { Box, Typography, Stack, Avatar, Chip, Divider } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as InvoicesIcon,
  AccountTree as WorkflowIcon,
  BarChart as ReportsIcon,
  Settings as SettingsIcon,
  Business as CompanyIcon,
  Person as PersonIcon,
  VpnKey as ApiKeyIcon,
  CreditCard as BillingIcon,
  Security as SecurityIcon,
  UnfoldMore as ChevronIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/dashboard' },
  { label: 'Invoices', icon: <InvoicesIcon fontSize="small" />, path: '/invoices' },
  { label: 'Workflows', icon: <WorkflowIcon fontSize="small" />, path: '/workflows' },
  { label: 'Reports', icon: <ReportsIcon fontSize="small" />, path: '/reports' },
];

const SETTINGS_ITEMS = [
  { label: 'Company', icon: <CompanyIcon sx={{ fontSize: 14 }} />, path: '/settings/company' },
  { label: 'My profile', icon: <PersonIcon sx={{ fontSize: 14 }} />, path: '/settings/profile' },
  { label: 'API keys', icon: <ApiKeyIcon sx={{ fontSize: 14 }} />, path: '/settings/api-keys' },
  { label: 'Subscription', icon: <BillingIcon sx={{ fontSize: 14 }} />, path: '/settings/billing' },
  { label: 'IP allowlist', icon: <SecurityIcon sx={{ fontSize: 14 }} />, path: '/settings/allowlist' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSettings = location.pathname.startsWith('/settings');

  return (
    <Box sx={{
      width: 240, flexShrink: 0, bgcolor: '#fff',
      borderRight: '1px solid #E1E4EB', display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0, overflowY: 'auto',
    }}>
      {/* Brand */}
      <Box sx={{ px: 2, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: '8px',
          background: 'linear-gradient(135deg, #1A56DB 0%, #1745B0 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 16, lineHeight: 1 }}>O</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#131722', lineHeight: 1.2 }}>OcrInvoice</Typography>
          <Typography sx={{ fontSize: 10, fontWeight: 600, color: '#6B7384', letterSpacing: '0.08em', textTransform: 'uppercase' }}>SAAS</Typography>
        </Box>
      </Box>

      {/* Company switcher */}
      <Box sx={{ mx: 1.5, mb: 2 }}>
        <Box sx={{
          border: '1px solid #E1E4EB', borderRadius: '8px', px: 1.5, py: 1,
          display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
          '&:hover': { bgcolor: '#F7F8FA' },
        }}>
          <Avatar sx={{ width: 26, height: 26, bgcolor: '#1D9E75', fontSize: 11, fontWeight: 700 }}>A</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#131722', lineHeight: 1.3 }} noWrap>Acme Corp</Typography>
            <Typography sx={{ fontSize: 10, color: '#6B7384' }}>Growth plan</Typography>
          </Box>
          <ChevronIcon sx={{ fontSize: 16, color: '#9CA4B2' }} />
        </Box>
      </Box>

      {/* Main nav */}
      <Box sx={{ px: 1.5, flex: 1 }}>
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#9CA4B2', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1, px: 0.5 }}>
          MAIN
        </Typography>
        <Stack spacing={0.25}>
          {NAV_ITEMS.map(item => (
            <Box key={item.path} onClick={() => navigate(item.path)} sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              px: 1.5, py: 1, borderRadius: '6px', cursor: 'pointer',
              color: '#6B7384',
              '&:hover': { bgcolor: '#F7F8FA', color: '#131722' },
            }}>
              {item.icon}
              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{item.label}</Typography>
            </Box>
          ))}

          {/* Settings with expand */}
          <Box onClick={() => !isSettings && navigate('/settings/company')} sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            px: 1.5, py: 1, borderRadius: '6px', cursor: 'pointer',
            color: isSettings ? '#1A56DB' : '#6B7384',
            bgcolor: isSettings ? '#EFF4FE' : 'transparent',
            '&:hover': { bgcolor: isSettings ? '#EFF4FE' : '#F7F8FA', color: isSettings ? '#1A56DB' : '#131722' },
          }}>
            <SettingsIcon fontSize="small" />
            <Typography sx={{ fontSize: 13, fontWeight: isSettings ? 600 : 500 }}>Settings</Typography>
          </Box>

          {isSettings && (
            <Box sx={{ pl: 1 }}>
              {SETTINGS_ITEMS.map(item => {
                const active = location.pathname === item.path;
                return (
                  <Box key={item.path} onClick={() => navigate(item.path)} sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    px: 1.5, py: 0.875, borderRadius: '6px', cursor: 'pointer',
                    color: active ? '#1A56DB' : '#6B7384',
                    bgcolor: active ? '#EFF4FE' : 'transparent',
                    '&:hover': { bgcolor: active ? '#EFF4FE' : '#F7F8FA', color: active ? '#1A56DB' : '#131722' },
                  }}>
                    {item.icon}
                    <Typography sx={{ fontSize: 12.5, fontWeight: active ? 600 : 500 }}>{item.label}</Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Stack>
      </Box>

      <Divider />

      {/* User card */}
      <Box sx={{ px: 1.5, py: 1.5 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          px: 1.5, py: 1, borderRadius: '8px',
          '&:hover': { bgcolor: '#F7F8FA' }, cursor: 'pointer',
        }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: '#1A56DB', fontSize: 12, fontWeight: 700 }}>JD</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#131722', lineHeight: 1.3 }} noWrap>Jane Doe</Typography>
            <Typography sx={{ fontSize: 10, color: '#6B7384' }}>Owner</Typography>
          </Box>
          <Chip label="Growth" size="small" sx={{
            height: 18, fontSize: 9, fontWeight: 700,
            bgcolor: '#C9F4E2', color: '#11644B',
            '& .MuiChip-label': { px: 1 },
          }} />
        </Box>
      </Box>
    </Box>
  );
}
