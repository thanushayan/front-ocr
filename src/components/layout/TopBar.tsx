import { Box, Typography, IconButton, Badge } from '@mui/material';
import { Search as SearchIcon, NotificationsOutlined as BellIcon, UnfoldMore as ChevronIcon } from '@mui/icons-material';

export default function TopBar() {
  return (
    <Box sx={{
      height: 64,
      bgcolor: '#fff',
      borderBottom: '1px solid #E1E4EB',
      display: 'flex',
      alignItems: 'center',
      px: 3,
      gap: 2,
      flexShrink: 0,
    }}>
      {/* Search bar */}
      <Box sx={{
        height: 36,
        bgcolor: '#EEF0F4',
        border: '1px solid transparent',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        px: 1.5,
        gap: '10px',
        width: 480,
        maxWidth: '100%',
        '&:focus-within': {
          border: '1px solid #C9CFD9',
          bgcolor: '#fff',
        },
      }}>
        <SearchIcon sx={{ fontSize: 18, color: '#9CA4B2', flexShrink: 0 }} />
        <Box
          component="input"
          placeholder="Search…"
          sx={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: 13,
            color: '#131722',
            fontFamily: 'inherit',
            '&::placeholder': { color: '#9CA4B2' },
          }}
        />
        {/* ⌘K badge */}
        <Box sx={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11,
          fontWeight: 600,
          color: '#9CA4B2',
          bgcolor: '#fff',
          border: '1px solid #E1E4EB',
          borderRadius: '4px',
          px: '6px',
          py: '2px',
          lineHeight: 1.4,
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
          ⌘K
        </Box>
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* Bell */}
      <IconButton size="small" sx={{ position: 'relative' }}>
        <Badge
          badgeContent={3}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: 10,
              minWidth: 16,
              height: 16,
              top: 6,
              right: 6,
            },
          }}
        >
          <BellIcon sx={{ fontSize: 22, color: '#6B7384' }} />
        </Badge>
      </IconButton>

      {/* User button */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        cursor: 'pointer', px: 1, py: 0.5, borderRadius: '8px',
        '&:hover': { bgcolor: '#F7F8FA' },
      }}>
        {/* Avatar */}
        <Box sx={{
          width: 32, height: 32, borderRadius: '50%',
          bgcolor: '#1A56DB', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, flexShrink: 0,
        }}>
          JD
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#131722', lineHeight: 1.3 }}>Jordan Doe</Typography>
          <Typography sx={{ fontSize: 11, color: '#6B7384', lineHeight: 1.2 }}>Acme Corp.</Typography>
        </Box>
        <ChevronIcon sx={{ fontSize: 16, color: '#9CA4B2', flexShrink: 0 }} />
      </Box>
    </Box>
  );
}
