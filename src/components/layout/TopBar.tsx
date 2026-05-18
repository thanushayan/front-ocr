import { Box, InputAdornment, TextField, IconButton, Badge, Avatar } from '@mui/material';
import { Search as SearchIcon, NotificationsOutlined as BellIcon } from '@mui/icons-material';

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
      <TextField
        placeholder="Search…"
        size="small"
        sx={{ width: 280 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: '#9CA4B2' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{
                  border: '1px solid #E1E4EB', borderRadius: '4px',
                  px: 0.75, py: 0.25,
                  fontSize: 10, fontWeight: 600, color: '#9CA4B2',
                  lineHeight: 1.4,
                }}>
                  ⌘K
                </Box>
              </InputAdornment>
            ),
          },
        }}
      />

      <Box sx={{ flex: 1 }} />

      <IconButton size="small">
        <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16 } }}>
          <BellIcon sx={{ fontSize: 20, color: '#6B7384' }} />
        </Badge>
      </IconButton>

      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1A56DB', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
        JD
      </Avatar>
    </Box>
  );
}
