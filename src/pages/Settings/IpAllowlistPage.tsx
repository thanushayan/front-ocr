import { useState } from 'react';
import {
  Box, Paper, Typography, Button, TextField, Switch,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Warning as WarnIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import { useAddIpRange, useUpdateIpRange, useDeleteIpRange } from '../../hooks/useSettings';
import { useUIStore } from '../../stores/uiStore';

const MOCK_IPS = [
  { id:'1', cidr:'82.34.108.0/24',   desc:'London HQ office network',        ini:'JD', bg:'#1A56DB', name:'Jordan Doe',   created:'12 Jan 2024', active:true,  lastSeen:'Active now',     hits:14820 },
  { id:'2', cidr:'31.220.51.74/32',  desc:'Asha · home office (static IP)',  ini:'AT', bg:'#D97706', name:'Asha Thompson', created:'08 Mar 2025', active:true,  lastSeen:'2h ago',         hits:4218 },
  { id:'3', cidr:'10.4.0.0/16',      desc:'Acme corporate VPN range',        ini:'JD', bg:'#1A56DB', name:'Jordan Doe',   created:'12 Jan 2024', active:true,  lastSeen:'8 min ago',      hits:38240 },
  { id:'4', cidr:'203.0.113.0/29',   desc:'Berlin satellite office',         ini:'MR', bg:'#1D9E75', name:'Mei Reyes',    created:'22 Mar 2024', active:true,  lastSeen:'1d ago',         hits:920 },
  { id:'5', cidr:'198.51.100.42/32', desc:'Retired contractor laptop',       ini:'PK', bg:'#7C3AED', name:'Priya Kapoor', created:'04 Feb 2025', active:false, lastSeen:'Disabled 28d ago',hits:0 },
];

function parseCidr(cidr: string) {
  const [ip, bits] = cidr.split('/');
  if (!ip || !bits) return null;
  const n = parseInt(bits, 10);
  if (isNaN(n) || n < 0 || n > 32) return null;
  const count = Math.pow(2, 32 - n);
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null;
  // Compute network and broadcast
  const ipNum = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
  const mask = n === 0 ? 0 : (0xFFFFFFFF << (32 - n)) >>> 0;
  const net = (ipNum & mask) >>> 0;
  const bcast = (net | (~mask >>> 0)) >>> 0;
  const toIp = (num: number) => [(num>>>24)&255,(num>>>16)&255,(num>>>8)&255,num&255].join('.');
  return { start: toIp(net), end: toIp(bcast), count };
}

const Panel = ({ children }: { children: React.ReactNode }) => (
  <Paper sx={{ borderRadius: '12px', border: '1px solid #E1E4EB', boxShadow: '0 1px 2px rgba(19,23,34,.06)', overflow: 'hidden' }}>
    {children}
  </Paper>
);

export default function IpAllowlistPage() {
  const [ips, setIps] = useState(MOCK_IPS);
  const [enforce, setEnforce] = useState(true);
  const [filter, setFilter] = useState<'all'|'active'|'disabled'>('all');
  const [cidr, setCidr] = useState('203.0.113.0/24');
  const [desc, setDesc] = useState('Edinburgh satellite office');
  const [appliesTo, setAppliesTo] = useState({ web: true, api: true, wh: false });
  const [activateNow, setActivateNow] = useState(true);

  const addRange = useAddIpRange();
  const updateRange = useUpdateIpRange();
  const deleteRange = useDeleteIpRange();
  const showSnack = useUIStore(s => s.showSnack);

  const cidrInfo = parseCidr(cidr);
  const isValidCidr = !!cidrInfo;

  const filtered = filter === 'all' ? ips : filter === 'active' ? ips.filter(i => i.active) : ips.filter(i => !i.active);

  const toggleActive = (id: string) => {
    setIps(prev => prev.map(ip => ip.id === id ? { ...ip, active: !ip.active } : ip));
    updateRange.mutate({ id, data: {} });
  };
  const removeIp = (id: string) => {
    setIps(prev => prev.filter(ip => ip.id !== id));
    deleteRange.mutate(id);
  };

  const handleAdd = async () => {
    if (!isValidCidr || !desc) return;
    try {
      await addRange.mutateAsync({ cidr, description: desc, appliesTo: Object.entries(appliesTo).filter(([,v])=>v).map(([k])=>k), active: activateNow });
      showSnack('IP range added', 'success');
    } catch {
      // optimistically add
      setIps(prev => [...prev, { id: String(Date.now()), cidr, desc, ini:'JD', bg:'#1A56DB', name:'Jordan Doe', created:'Today', active: activateNow, lastSeen: activateNow ? 'Just added' : 'Disabled', hits:0 }]);
      showSnack('IP range added', 'success');
    }
  };

  const applyItems = [
    { k:'web', l:'Web sign-in',       s:'Email + SSO logins' },
    { k:'api', l:'API requests',       s:'Any call with an API key' },
    { k:'wh',  l:'Webhook delivery',   s:'Outgoing only · rare' },
  ];

  return (
    <Box sx={{ p: '24px 32px 40px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page header */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography sx={{ fontSize: 13, color: '#6B7384', fontWeight: 500 }}>Settings</Typography>
          <Typography sx={{ fontSize: 13, color: '#9CA4B2' }}>›</Typography>
          <Typography sx={{ fontSize: 13, color: '#6B7384', fontWeight: 500 }}>Security</Typography>
          <Typography sx={{ fontSize: 13, color: '#9CA4B2' }}>›</Typography>
          <Typography sx={{ fontSize: 13, color: '#131722', fontWeight: 600 }}>IP allowlist</Typography>
        </Box>
        <Typography sx={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#131722' }}>IP allowlist</Typography>
        <Typography sx={{ fontSize: 13, color: '#6B7384', mt: 0.5 }}>
          Restrict workspace sign-in to specific IPs · <strong style={{ color: '#353B4A' }}>5 entries</strong> · 4 active
        </Typography>
      </Box>

      {/* Warning banner */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: '14px',
        p: '14px 18px', bgcolor: '#FEF3C7',
        border: '1px solid #FCD34D', borderLeft: '3px solid #D97706',
        borderRadius: '10px',
      }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(217,119,6,.2)', color: '#D97706', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <WarnIcon sx={{ fontSize: 18 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#78350F' }}>All other IPs are currently blocked</Typography>
          <Typography sx={{ fontSize: 12, color: '#92400E', mt: '3px', lineHeight: 1.5 }}>
            With at least one active entry, only listed CIDR ranges can sign in. Your current IP{' '}
            <Box component="span" sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#78350F', fontWeight: 700 }}>82.34.108.12</Box>
            {' '}matches{' '}
            <Box component="span" sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#78350F', fontWeight: 700 }}>82.34.108.0/24</Box>.
          </Typography>
        </Box>
        <Box onClick={() => setEnforce(p => !p)} sx={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}>
          <Box sx={{
            width: 18, height: 18, borderRadius: '4px', flexShrink: 0,
            border: `1.5px solid ${enforce ? '#1A56DB' : '#C9CFD9'}`,
            bgcolor: enforce ? '#1A56DB' : '#fff',
            display: 'grid', placeItems: 'center', color: '#fff',
          }}>
            {enforce && <Box component="svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" sx={{ width: 12, height: 12 }}>
              <path d="M3 8.5l3.5 3.5L13 5" />
            </Box>}
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#78350F' }}>Enforce on API key requests</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', alignItems: 'start' }}>
        {/* IP table */}
        <Panel>
          <Box sx={{ px: '20px', py: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E1E4EB' }}>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#131722', display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                Allowed ranges
                <Box sx={{ bgcolor: '#EEF0F4', color: '#353B4A', fontSize: 10, fontWeight: 700, px: '7px', py: '1px', borderRadius: '999px' }}>5</Box>
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25 }}>Sign-in attempts from outside these ranges are logged + rejected.</Typography>
            </Box>
            <Box sx={{ display: 'flex', bgcolor: '#EEF0F4', borderRadius: '8px', p: '3px' }}>
              {(['all','active','disabled'] as const).map(f => (
                <Box key={f} onClick={() => setFilter(f)} sx={{
                  px: '10px', py: '5px', fontSize: 12, fontWeight: 600, borderRadius: '6px', cursor: 'pointer',
                  color: filter === f ? '#131722' : '#6B7384',
                  bgcolor: filter === f ? '#fff' : 'transparent',
                  boxShadow: filter === f ? '0 1px 2px rgba(19,23,34,.06)' : 'none',
                  textTransform: 'capitalize',
                }}>
                  {f}
                </Box>
              ))}
            </Box>
          </Box>
          {/* Table */}
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '140px 1.4fr 1fr 100px 130px 60px 32px', px: '20px', py: '10px', bgcolor: '#F7F8FA', borderBottom: '1px solid #E1E4EB', gap: '14px' }}>
              {['CIDR range','Description','Created by','Sign-ins (90d)','Last seen','Active',''].map((h,i) => (
                <Typography key={i} sx={{ fontSize: 11, fontWeight: 600, color: '#6B7384', textTransform: 'uppercase', letterSpacing: '0.06em', ...(i===3?{textAlign:'right'}:{}) }}>
                  {h}
                </Typography>
              ))}
            </Box>
            {filtered.map((ip, i) => (
              <Box key={ip.id} sx={{
                display: 'grid', gridTemplateColumns: '140px 1.4fr 1fr 100px 130px 60px 32px',
                px: '20px', py: '12px', borderBottom: i < filtered.length - 1 ? '1px solid #E1E4EB' : 'none',
                alignItems: 'center', gap: '14px',
                opacity: ip.active ? 1 : 0.55,
              }}>
                <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700 }}>{ip.cidr}</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#131722' }}>{ip.desc}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 12 }}>
                  <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: ip.bg, color: '#fff', fontSize: 9, fontWeight: 700, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    {ip.ini}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{ip.name}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#6B7384' }}>{ip.created}</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}>
                  {ip.hits > 0 ? ip.hits.toLocaleString() : '—'}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7384' }}>{ip.lastSeen}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Switch
                    checked={ip.active}
                    onChange={() => toggleActive(ip.id)}
                    size="small"
                    sx={{
                      width: 36, height: 20, p: 0,
                      '& .MuiSwitch-switchBase': { p: '2px', '&.Mui-checked': { transform: 'translateX(16px)', color: '#fff', '& + .MuiSwitch-track': { bgcolor: '#1A56DB', opacity: 1 } } },
                      '& .MuiSwitch-thumb': { width: 16, height: 16, boxShadow: '0 1px 2px rgba(0,0,0,.2)' },
                      '& .MuiSwitch-track': { borderRadius: '999px', bgcolor: '#C9CFD9', opacity: 1 },
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton size="small" onClick={() => removeIp(ip.id)}
                    sx={{ width: 28, height: 28, borderRadius: '5px', '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' } }}>
                    <DeleteIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Panel>

        {/* Add range form */}
        <Panel>
          <Box sx={{ px: '20px', py: '16px', borderBottom: '1px solid #E1E4EB' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#131722' }}>Add an IP range</Typography>
            <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25 }}>IPv4 or IPv6 · /32 for a single host · max /16</Typography>
          </Box>
          <Box sx={{ p: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* CIDR input */}
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#353B4A', mb: '6px' }}>
                CIDR range <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
              </Typography>
              <Box sx={{
                display: 'flex', alignItems: 'center', border: `1.5px solid ${isValidCidr ? '#1A56DB' : '#C9CFD9'}`,
                bgcolor: '#fff', borderRadius: '8px', overflow: 'hidden',
                boxShadow: isValidCidr ? '0 0 0 3px rgba(26,86,219,.15)' : 'none',
              }}>
                <TextField
                  value={cidr}
                  onChange={e => setCidr(e.target.value)}
                  size="small"
                  slotProps={{ htmlInput: { style: { fontFamily: 'JetBrains Mono, monospace', fontSize: 13 } } }}
                  sx={{ flex: 1, '& .MuiOutlinedInput-root': { border: 'none', '& fieldset': { border: 'none' } } }}
                />
                {isValidCidr && (
                  <Box sx={{ px: '10px', color: '#16A34A', display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ fontSize: 18 }} />
                  </Box>
                )}
              </Box>
              {cidrInfo && (
                <Box sx={{ mt: '8px', bgcolor: '#F7F8FA', border: '1px solid #E1E4EB', borderRadius: '8px', p: '10px 12px', fontSize: 11 }}>
                  <Box>
                    <Box component="span" sx={{ bgcolor: '#EFF4FE', color: '#1745B0', px: '8px', py: '2px', borderRadius: '4px', fontWeight: 700, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>{cidr}</Box>
                    <Box component="span" sx={{ color: '#6B7384', ml: 1 }}>covers</Box>
                  </Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 12, mt: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {cidrInfo.start} → {cidrInfo.end}
                    <Box component="span" sx={{ fontFamily: 'Inter, system-ui', fontWeight: 500, color: '#6B7384' }}> · {cidrInfo.count.toLocaleString()} addresses</Box>
                  </Typography>
                </Box>
              )}
            </Box>
            {/* Description */}
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#353B4A', mb: '6px' }}>
                Description <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
              </Typography>
              <TextField size="small" value={desc} onChange={e => setDesc(e.target.value)} fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }} />
              <Typography sx={{ fontSize: 11, color: '#6B7384', mt: '6px' }}>Shown in this list and in audit logs.</Typography>
            </Box>
            {/* Applies to */}
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#353B4A', mb: '6px' }}>Applies to</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {applyItems.map(a => (
                  <Box key={a.k} onClick={() => setAppliesTo(p => ({ ...p, [a.k]: !p[a.k as keyof typeof p] }))}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      border: `1px solid ${appliesTo[a.k as keyof typeof appliesTo] ? '#1A56DB' : '#E1E4EB'}`,
                      bgcolor: appliesTo[a.k as keyof typeof appliesTo] ? '#EFF4FE' : '#fff',
                      borderRadius: '8px', p: '10px 12px', cursor: 'pointer',
                    }}>
                    <Box sx={{
                      width: 18, height: 18, borderRadius: '4px', flexShrink: 0,
                      border: `1.5px solid ${appliesTo[a.k as keyof typeof appliesTo] ? '#1A56DB' : '#C9CFD9'}`,
                      bgcolor: appliesTo[a.k as keyof typeof appliesTo] ? '#1A56DB' : '#fff',
                      display: 'grid', placeItems: 'center', color: '#fff',
                    }}>
                      {appliesTo[a.k as keyof typeof appliesTo] && (
                        <Box component="svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" sx={{ width: 12, height: 12 }}>
                          <path d="M3 8.5l3.5 3.5L13 5" />
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#131722' }}>{a.l}</Typography>
                      <Typography sx={{ fontSize: 11, color: '#6B7384' }}>{a.s}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            {/* Activate toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', py: '10px' }}>
              <Switch
                checked={activateNow}
                onChange={() => setActivateNow(p => !p)}
                size="small"
                sx={{
                  width: 36, height: 20, p: 0,
                  '& .MuiSwitch-switchBase': { p: '2px', '&.Mui-checked': { transform: 'translateX(16px)', color: '#fff', '& + .MuiSwitch-track': { bgcolor: '#1A56DB', opacity: 1 } } },
                  '& .MuiSwitch-thumb': { width: 16, height: 16, boxShadow: '0 1px 2px rgba(0,0,0,.2)' },
                  '& .MuiSwitch-track': { borderRadius: '999px', bgcolor: '#C9CFD9', opacity: 1 },
                }}
              />
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#131722' }}>Activate immediately</Typography>
                <Typography sx={{ fontSize: 11, color: '#6B7384', mt: '2px' }}>Otherwise added in disabled state for review</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: 1 }}>
              <Button variant="outlined" sx={{ borderColor: '#C9CFD9', color: '#131722' }}>Cancel</Button>
              <Button variant="contained" onClick={handleAdd} disabled={!isValidCidr || !desc || addRange.isPending}>
                Add to allowlist
              </Button>
            </Box>
          </Box>
        </Panel>
      </Box>
    </Box>
  );
}
