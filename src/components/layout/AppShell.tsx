import { Box, Snackbar, Alert } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useUIStore } from '../../stores/uiStore';

export default function AppShell() {
  const { snack, hideSnack } = useUIStore();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F0EEE9' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={hideSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={hideSnack} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
