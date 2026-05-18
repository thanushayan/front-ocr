import { useState } from 'react';
import {
  Box, Paper, Typography, Button, TextField, Avatar, Chip,
  InputAdornment, IconButton, LinearProgress, Tabs, Tab,
} from '@mui/material';
import {
  Upload as UploadIcon, Visibility, VisibilityOff, Email as EmailIcon,
  Smartphone as SmartphoneIcon, Download as DownloadIcon, ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile, useUpdateProfile, useUpdatePassword } from '../../hooks/useSettings';
import { useUIStore } from '../../stores/uiStore';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Required'),
  preferredName: z.string().optional(),
});
const passwordSchema = z.object({
  current: z.string().min(1, 'Required'),
  newPassword: z.string().min(12, 'Min 12 characters'),
  confirm: z.string(),
}).refine(d => d.newPassword === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

const Panel = ({ children }: { children: React.ReactNode }) => (
  <Paper sx={{ borderRadius: '12px', border: '1px solid #E1E4EB', boxShadow: '0 1px 2px rgba(19,23,34,.06)', overflow: 'hidden' }}>
    {children}
  </Paper>
);
const PanelFoot = ({ left, right }: { left: React.ReactNode; right: React.ReactNode }) => (
  <Box sx={{ px: '20px', py: '14px', borderTop: '1px solid #E1E4EB', bgcolor: '#F7F8FA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    {left}{right}
  </Box>
);
const Grid2 = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>{children}</Box>
);
const Field = ({ label, hint, children, readOnlyPill }: { label: string; hint?: string; children: React.ReactNode; readOnlyPill?: boolean }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#353B4A' }}>{label}</Typography>
      {readOnlyPill && (
        <Box sx={{ bgcolor: '#DBE6FD', color: '#1745B0', fontSize: 9, fontWeight: 800, px: '7px', py: '2px', borderRadius: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          SSO · read-only
        </Box>
      )}
    </Box>
    {children}
    {hint && <Typography sx={{ fontSize: 11, color: '#6B7384' }}>{hint}</Typography>}
  </Box>
);

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', pct: 20, color: '#DC2626' };
  if (score === 2) return { label: 'Fair', pct: 45, color: '#D97706' };
  if (score === 3) return { label: 'Good', pct: 65, color: '#D97706' };
  if (score === 4) return { label: 'Strong', pct: 88, color: '#16A34A' };
  return { label: 'Very strong', pct: 100, color: '#16A34A' };
}

function QrCodePlaceholder() {
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      const cInner = (x>=1&&x<=5&&y>=1&&y<=5)||(x>=15&&x<=19&&y>=1&&y<=5)||(x>=1&&x<=5&&y>=15&&y<=19);
      const cDot = (x>=2&&x<=4&&y>=2&&y<=4)||(x>=16&&x<=18&&y>=2&&y<=4)||(x>=2&&x<=4&&y>=16&&y<=18);
      const on = corner ? (!cInner || cDot) : ((x*7+y*13+x*y)%5)<2;
      if (on) cells.push(<rect key={`${x}-${y}`} x={x*8} y={y*8} width="8" height="8" fill="#131722"/>);
    }
  }
  return (
    <Box sx={{ width: 168, height: 168, bgcolor: '#fff', p: 1, borderRadius: '8px', border: '1px solid #E1E4EB', flexShrink: 0 }}>
      <svg viewBox="0 0 168 168" width="152" height="152">{cells}</svg>
    </Box>
  );
}

export default function ProfilePage() {
  const [tfaTab, setTfaTab] = useState(1);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [copied, setCopied] = useState(false);

  useProfile();
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const showSnack = useUIStore(s => s.showSnack);

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: 'Jordan Doe', preferredName: 'Jordan' },
  });
  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const onSaveProfile = async (vals: ProfileData) => {
    try { await updateProfile.mutateAsync(vals); showSnack('Profile saved', 'success'); }
    catch { showSnack('Failed to save profile', 'error'); }
  };
  const onSavePassword = async (vals: PasswordData) => {
    try {
      await updatePassword.mutateAsync({ current: vals.current, newPassword: vals.newPassword });
      showSnack('Password updated', 'success');
      passwordForm.reset();
    } catch { showSnack('Failed to update password', 'error'); }
  };

  const strength = getPasswordStrength(newPw);
  const RECOVERY_CODES = ['4f3a-9b2c','8e1d-7c5a','2k9p-1m4t','6r8q-3v7w','•••• - ••••','•••• - ••••'];

  return (
    <Box sx={{ p: '24px 32px 40px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page header */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography sx={{ fontSize: 13, color: '#6B7384', fontWeight: 500 }}>Settings</Typography>
          <Typography sx={{ fontSize: 13, color: '#9CA4B2' }}>›</Typography>
          <Typography sx={{ fontSize: 13, color: '#131722', fontWeight: 600 }}>My profile</Typography>
        </Box>
        <Typography sx={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#131722' }}>My profile</Typography>
        <Typography sx={{ fontSize: 13, color: '#6B7384', mt: 0.5 }}>
          jordan.doe@acmecorp.com · Acme Corp. · <strong style={{ color: '#353B4A' }}>Owner</strong>
        </Typography>
      </Box>

      {/* Identity */}
      <Panel>
        <Box sx={{ px: '20px', py: '16px', borderBottom: '1px solid #E1E4EB' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#131722' }}>Identity</Typography>
          <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25 }}>Your name and email · visible across the workspace.</Typography>
        </Box>
        <Box component="form" onSubmit={profileForm.handleSubmit(onSaveProfile)}>
          <Box sx={{ p: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Avatar row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px', pb: '14px', borderBottom: '1px solid #E1E4EB' }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: '#1A56DB', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>JD</Avatar>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#353B4A' }}>Profile photo</Typography>
                <Typography sx={{ fontSize: 11, color: '#6B7384', mt: 0.25 }}>PNG, JPG · max 2 MB · auto-cropped to a circle</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button variant="outlined" size="small" startIcon={<UploadIcon sx={{ fontSize: 14 }} />}
                    sx={{ height: 30, fontSize: 12, borderColor: '#C9CFD9', color: '#131722' }}>
                    Upload
                  </Button>
                  <Button sx={{ fontSize: 12, color: '#6B7384' }}>Use initials</Button>
                </Box>
              </Box>
            </Box>
            <Grid2>
              <Field label="Full name">
                <Controller name="fullName" control={profileForm.control} render={({ field }) => (
                  <TextField {...field} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }} />
                )} />
              </Field>
              <Field label="Preferred name">
                <Controller name="preferredName" control={profileForm.control} render={({ field }) => (
                  <TextField {...field} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }} />
                )} />
              </Field>
              <Field label="Email" readOnlyPill hint="Managed by your identity provider (Okta).">
                <TextField size="small" defaultValue="jordan.doe@acmecorp.com"
                  slotProps={{ input: {
                    readOnly: true,
                    startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 16, color: '#6B7384' }} /></InputAdornment>,
                    sx: { bgcolor: '#F7F8FA' },
                  }}}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }} />
              </Field>
              <Field label="Role">
                <Box sx={{ display: 'flex', alignItems: 'center', height: 38, px: 1.5, border: '1px solid #C9CFD9', borderRadius: '8px', bgcolor: '#F7F8FA', fontSize: 13 }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 700, px: '9px', py: '3px', borderRadius: '999px', background: 'linear-gradient(135deg, #1A56DB, #15326E)', color: '#fff', mr: 1 }}>Owner</Box>
                  <Typography sx={{ fontSize: 12, color: '#6B7384' }}>· all permissions</Typography>
                </Box>
              </Field>
            </Grid2>
          </Box>
          <PanelFoot
            left={<Typography sx={{ fontSize: 11, color: '#6B7384' }}>Last sign-in: 14 May 09:08 UTC · IP 82.34.108.12 · Chrome 134 / macOS</Typography>}
            right={<Button type="submit" variant="contained" size="small" disabled={updateProfile.isPending}>Save changes</Button>}
          />
        </Box>
      </Panel>

      {/* Password */}
      <Panel>
        <Box sx={{ px: '20px', py: '16px', borderBottom: '1px solid #E1E4EB' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#131722' }}>Password</Typography>
          <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25 }}>12 chars · 1 number · 1 symbol · not reused</Typography>
        </Box>
        <Box component="form" onSubmit={passwordForm.handleSubmit(onSavePassword)}>
          <Box sx={{ p: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Grid2>
              <Field label="Current password">
                <Controller name="current" control={passwordForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} type={showCurrent ? 'text' : 'password'} size="small" error={!!fieldState.error}
                    slotProps={{ input: {
                      endAdornment: <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowCurrent(p => !p)} edge="end">
                          {showCurrent ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                        </IconButton>
                      </InputAdornment>,
                    }}}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }} />
                )} />
              </Field>
              <Box />
              <Field label="New password">
                <Controller name="newPassword" control={passwordForm.control} render={({ field, fieldState }) => (
                  <Box>
                    <TextField {...field} type={showNew ? 'text' : 'password'} size="small" error={!!fieldState.error}
                      onChange={e => { field.onChange(e); setNewPw(e.target.value); }}
                      slotProps={{ input: {
                        endAdornment: <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowNew(p => !p)} edge="end">
                            {showNew ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                          </IconButton>
                        </InputAdornment>,
                      }}}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }} fullWidth />
                    {newPw && (
                      <Box>
                        <LinearProgress variant="determinate" value={strength.pct}
                          sx={{ mt: 1, height: 5, borderRadius: '999px', bgcolor: '#EEF0F4', '& .MuiLinearProgress-bar': { bgcolor: strength.color } }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: strength.color }}>{strength.label}</Typography>
                          <Typography sx={{ fontSize: 11, color: '#6B7384' }}>
                            {newPw.length} chars{/[^A-Za-z0-9]/.test(newPw) ? ' · symbol ✓' : ''}{(/[A-Z]/.test(newPw) && /[a-z]/.test(newPw)) ? ' · mixed case ✓' : ''}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                )} />
              </Field>
              <Field label="Confirm new password">
                <Controller name="confirm" control={passwordForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} type={showConfirm ? 'text' : 'password'} size="small"
                    error={!!fieldState.error} helperText={fieldState.error?.message}
                    slotProps={{ input: {
                      endAdornment: <InputAdornment position="end">
                        {field.value && field.value === passwordForm.watch('newPassword')
                          ? <CheckIcon sx={{ fontSize: 18, color: '#16A34A' }} />
                          : <IconButton size="small" onClick={() => setShowConfirm(p => !p)} edge="end">
                            {showConfirm ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                          </IconButton>}
                      </InputAdornment>,
                    }}}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }} />
                )} />
              </Field>
            </Grid2>
          </Box>
          <PanelFoot
            left={<Typography sx={{ fontSize: 11, color: '#6B7384' }}>Last changed 42 days ago</Typography>}
            right={<Button type="submit" variant="contained" size="small" disabled={updatePassword.isPending}>Update password</Button>}
          />
        </Box>
      </Panel>

      {/* Two-factor authentication */}
      <Panel>
        <Box sx={{ px: '20px', py: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E1E4EB' }}>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#131722', display: 'flex', alignItems: 'center', gap: 1 }}>
              🛡 Two-factor authentication
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '5px', ml: 1, fontSize: 10, fontWeight: 700, px: '9px', py: '3px', borderRadius: '999px', bgcolor: '#DCFCE7', color: '#166534', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#16A34A' }} />
                Enabled
              </Box>
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25 }}>Adds a second step at sign-in · required by your workspace's security policy.</Typography>
          </Box>
          <Button sx={{ fontSize: 12, fontWeight: 600, color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}>Disable 2FA</Button>
        </Box>
        <Box sx={{ p: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Tabs value={tfaTab} onChange={(_, v) => setTfaTab(v)}
            sx={{ mt: '-4px', mx: '-20px', mb: '14px', minHeight: 40, borderBottom: '1px solid #E1E4EB', '& .MuiTab-root': { textTransform: 'none', fontSize: 13, fontWeight: 600, minHeight: 40, py: 1 } }}>
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 15 }} />Email OTP
                <Chip label="Backup" size="small" sx={{ height: 18, fontSize: 10, fontWeight: 700, bgcolor: '#EEF0F4', color: '#353B4A', '& .MuiChip-label': { px: 0.75 } }} />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartphoneIcon sx={{ fontSize: 15 }} />Authenticator app
                <Chip label="Primary" size="small" sx={{ height: 18, fontSize: 10, fontWeight: 700, bgcolor: tfaTab === 1 ? '#DBE6FD' : '#EEF0F4', color: tfaTab === 1 ? '#1745B0' : '#353B4A', '& .MuiChip-label': { px: 0.75 } }} />
              </Box>
            } />
          </Tabs>

          {tfaTab === 1 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <Box>
                <Box sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#1A56DB', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0, fontFamily: 'JetBrains Mono, monospace' }}>1</Box>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Scan with your authenticator app</Typography>
                    <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25, lineHeight: 1.5 }}>Open 1Password, Authy, or Google Authenticator and scan this code.</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: '18px', bgcolor: '#F7F8FA', border: '1px solid #E1E4EB', borderRadius: '10px', p: '18px', mt: '12px' }}>
                  <QrCodePlaceholder />
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#353B4A' }}>Or enter this key manually</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', bgcolor: '#fff', border: '1px solid #C9CFD9', borderRadius: '8px', p: '6px 8px' }}>
                      <Typography component="code" sx={{ flex: 1, fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '0.04em', fontFamily: 'JetBrains Mono, monospace' }}>
                        JBSWY3DPEHPK3PXP
                      </Typography>
                      <IconButton size="small" onClick={() => { navigator.clipboard.writeText('JBSWY3DPEHPK3PXP'); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                        sx={{ width: 28, height: 28, borderRadius: '6px', bgcolor: '#EEF0F4', '&:hover': { bgcolor: '#DBE6FD', color: '#1745B0' } }}>
                        {copied ? <CheckIcon sx={{ fontSize: 14, color: '#16A34A' }} /> : <CopyIcon sx={{ fontSize: 14 }} />}
                      </IconButton>
                    </Box>
                    <Typography sx={{ fontSize: 11, color: '#6B7384' }}>Issuer: OcrInvoiceSaaS · Account: jordan.doe@acmecorp.com</Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#1A56DB', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0, fontFamily: 'JetBrains Mono, monospace' }}>2</Box>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Enter the 6-digit code</Typography>
                    <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25 }}>Your app updates every 30 seconds.</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', mt: '12px' }}>
                  {['4','8','2','1','',''].map((v,i) => (
                    <Box key={i} sx={{
                      height: 54, border: `1.5px solid ${v || i===4 ? '#1A56DB' : '#C9CFD9'}`,
                      borderRadius: '8px', bgcolor: '#fff', display: 'grid', placeItems: 'center',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 500,
                      boxShadow: i===4 ? '0 0 0 3px rgba(26,86,219,.15)' : 'none',
                    }}>
                      {v}{i===4 && <Box component="span" sx={{ width: 2, height: 22, bgcolor: '#1A56DB', display: 'inline-block', animation: 'caret 1s infinite', '@keyframes caret': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } } }} />}
                    </Box>
                  ))}
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: '12px' }} disabled>Verify &amp; enable</Button>
                <Box sx={{ mt: '18px', p: '14px', bgcolor: '#F7F8FA', border: '1px solid #E1E4EB', borderRadius: '10px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Recovery codes</Typography>
                      <Typography sx={{ fontSize: 11, color: '#6B7384' }}>10 single-use codes if you lose your device</Typography>
                    </Box>
                    <Button startIcon={<DownloadIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: 12, fontWeight: 600, color: '#1A56DB' }}>Download</Button>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', mt: '10px' }}>
                    {RECOVERY_CODES.map((c,i) => (
                      <Box key={i} sx={{ p: '4px 8px', bgcolor: '#fff', border: '1px solid #E1E4EB', borderRadius: '4px', letterSpacing: '0.04em', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                        {c}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {tfaTab === 0 && (
            <Typography sx={{ py: 2, color: '#6B7384', fontSize: 13 }}>
              Email OTP sends a 6-digit code to <strong style={{ color: '#131722' }}>jordan.doe@acmecorp.com</strong> at each sign-in. This is your backup method.
            </Typography>
          )}
        </Box>
      </Panel>
    </Box>
  );
}
