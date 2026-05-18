import { Box, Typography, Stack, Chip, Divider } from '@mui/material';
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
  { label: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 18 }} />, path: '/dashboard' },
  { label: 'Invoices',  icon: <InvoicesIcon  sx={{ fontSize: 18 }} />, path: '/invoices' },
  { label: 'Workflows', icon: <WorkflowIcon  sx={{ fontSize: 18 }} />, path: '/workflows' },
  { label: 'Reports',   icon: <ReportsIcon   sx={{ fontSize: 18 }} />, path: '/reports' },
];

const SETTINGS_ITEMS = [
  { label: 'Company',      icon: <CompanyIcon  sx={{ fontSize: 14 }} />, path: '/settings/company' },
  { label: 'My profile',   icon: <PersonIcon   sx={{ fontSize: 14 }} />, path: '/settings/profile' },
  { label: 'API keys',     icon: <ApiKeyIcon   sx={{ fontSize: 14 }} />, path: '/settings/api-keys' },
  { label: 'Subscription', icon: <BillingIcon  sx={{ fontSize: 14 }} />, path: '/settings/billing' },
  { label: 'IP allowlist', icon: <SecurityIcon sx={{ fontSize: 14 }} />, path: '/settings/allowlist' },
];

function NavItem({
  icon, label, active, onClick, small = false,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 1.5,
        px: 1.5, py: small ? 0.875 : 1,
        borderRadius: '6px', cursor: 'pointer',
        color: active ? '#1745B0' : '#353B4A',
        bgcolor: active ? '#EFF4FE' : 'transparent',
        fontWeight: active ? 600 : 500,
        '&:hover': {
          bgcolor: active ? '#EFF4FE' : '#F7F8FA',
          color: active ? '#1745B0' : '#131722',
        },
      }}
    >
      {/* Left active indicator */}
      {active && (
        <Box sx={{
          position: 'absolute',
          left: -12,
          top: 6,
          bottom: 6,
          width: 3,
          borderRadius: '0 2px 2px 0',
          bgcolor: '#1A56DB',
        }} />
      )}
      {icon}
      <Typography sx={{ fontSize: small ? 12.5 : 14, fontWeight: active ? 600 : 500, color: 'inherit' }}>
        {label}
      </Typography>
    </Box>
  );
}

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
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.15), 0 1px 3px rgba(19,23,34,.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
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
          {/* Square avatar with teal gradient */}
          <Box sx={{
            width: 28, height: 28, borderRadius: '6px', flexShrink: 0,
            background: 'linear-gradient(135deg, #1D9E75 0%, #11644B 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>
            A
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#131722', lineHeight: 1.3 }} noWrap>Acme Corp.</Typography>
            <Typography sx={{ fontSize: 10, color: '#6B7384' }}>Growth plan</Typography>
          </Box>
          <ChevronIcon sx={{ fontSize: 16, color: '#9CA4B2', flexShrink: 0 }} />
        </Box>
      </Box>

      {/* Main nav */}
      <Box sx={{ px: 1.5, flex: 1 }}>
        {/* Section label */}
        <Typography sx={{
          fontSize: 10, fontWeight: 600, color: '#9CA4B2',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          mb: 1, px: 0.5,
        }}>
          MAIN
        </Typography>

        {/* Outer wrapper with position:relative so the indicator's left:-12 works */}
        <Box sx={{ position: 'relative' }}>
          <Stack spacing={0.25}>
            {NAV_ITEMS.map(item => (
              <NavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}

            {/* Settings parent item */}
            <NavItem
              icon={<SettingsIcon sx={{ fontSize: 18 }} />}
              label="Settings"
              active={isSettings}
              onClick={() => { if (!isSettings) navigate('/settings/company'); }}
            />

            {/* Settings sub-items */}
            {isSettings && (
              <Box sx={{ pl: 1, position: 'relative' }}>
                {SETTINGS_ITEMS.map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <NavItem
                      key={item.path}
                      icon={item.icon}
                      label={item.label}
                      active={active}
                      onClick={() => navigate(item.path)}
                      small
                    />
                  );
                })}
              </Box>
            )}
          </Stack>
        </Box>
      </Box>

      <Divider />

      {/* User card */}
      <Box sx={{ px: 1.5, py: 1.5 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          px: 1.5, py: 1, borderRadius: '8px',
          '&:hover': { bgcolor: '#F7F8FA' }, cursor: 'pointer',
        }}>
          {/* Avatar */}
          <Box sx={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            bgcolor: '#1A56DB', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, letterSpacing: '-0.01em',
          }}>
            JD
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#131722', lineHeight: 1.3 }} noWrap>Jane Doe</Typography>
            <Typography sx={{ fontSize: 11, color: '#6B7384' }}>Owner</Typography>
          </Box>
          <Chip label="Growth" size="small" sx={{
            height: 18, fontSize: 10, fontWeight: 700,
            bgcolor: '#C9F4E2', color: '#11644B',
            '& .MuiChip-label': { px: 1 },
          }} />
        </Box>
      </Box>
    </Box>
  );
}
