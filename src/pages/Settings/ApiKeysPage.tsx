import { useState } from 'react';
import {
  Box, Paper, Typography, Button, TextField, IconButton,
} from '@mui/material';
import {
  Add as AddIcon, Delete as DeleteIcon,
  ContentCopy as CopyIcon, CheckCircle as CheckCircleIcon,
  Warning as WarningIcon, MoreHoriz as MoreIcon,
} from '@mui/icons-material';
import { useCreateApiKey, useRevokeApiKey } from '../../hooks/useSettings';

const MOCK_KEYS = [
  { id:'1', name:'Production ERP push',  prefix:'ocri_live_a4f2…', scopes:['invoices:read','invoices:write','webhooks:manage'], by:'Jordan Doe',  lastUsed:'2 min ago',  created:'12 Jan 2026', live:true },
  { id:'2', name:'Retool dashboard',      prefix:'ocri_live_c91b…', scopes:['invoices:read','reports:read'],                   by:'Mei Reyes',   lastUsed:'1h ago',     created:'04 Feb 2026', live:true },
  { id:'3', name:'OCR retry worker',      prefix:'ocri_live_d72f…', scopes:['ocr:run','invoices:write'],                       by:'Priya Kapoor',lastUsed:'18 min ago', created:'22 Mar 2026', live:true },
  { id:'4', name:'Staging sandbox',       prefix:'ocri_test_5b8e…', scopes:['invoices:read'],                                  by:'Jordan Doe',  lastUsed:'5 days ago', created:'08 Apr 2026', live:false },
];

const SCOPES = [
  { key:'invoices:read',    desc:'List, get, search invoices' },
  { key:'invoices:write',   desc:'Create, update, delete invoices' },
  { key:'ocr:run',          desc:'Trigger OCR · upload documents' },
  { key:'reports:read',     desc:'Spend analytics, VAT, export endpoints' },
  { key:'webhooks:manage',  desc:'Create, list, delete webhook endpoints' },
];

const Panel = ({ children }: { children: React.ReactNode }) => (
  <Paper sx={{ borderRadius: '12px', border: '1px solid #E1E4EB', boxShadow: '0 1px 2px rgba(19,23,34,.06)', overflow: 'hidden' }}>
    {children}
  </Paper>
);

export default function ApiKeysPage() {
  const [filter, setFilter] = useState<'all'|'live'|'test'>('all');
  const [showSecret, setShowSecret] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [env, setEnv] = useState<'live'|'test'>('live');
  const [selectedScopes, setSelectedScopes] = useState<Record<string,boolean>>({
    'invoices:read': true, 'invoices:write': true, 'ocr:run': false, 'reports:read': false, 'webhooks:manage': true,
  });
  const [keyName, setKeyName] = useState('Production ERP push');
  const [copied, setCopied] = useState(false);

  const createKey = useCreateApiKey();
  const revokeKey = useRevokeApiKey();

  const keys = MOCK_KEYS;
  const filtered = filter === 'all' ? keys : filter === 'live' ? keys.filter(k => k.live) : keys.filter(k => !k.live);

  const handleCreate = async () => {
    try {
      await createKey.mutateAsync({ name: keyName, env, scopes: Object.entries(selectedScopes).filter(([,v])=>v).map(([k])=>k) });
    } catch { /* show mock result */ }
    setCreatedKey(`ocri_${env}_a4f2_7Q2k_aB9xN3eL5fH4pT8vR1jM6sC0dY9zU2iE7oW`);
    setShowSecret(true);
  };

  const SAMPLE_CURL = `curl https://api.ocri.app/v1/invoices \\
  -H "Authorization: Bearer ocri_live_a4f2…" \\
  -H "Accept: application/json"`;

  return (
    <Box sx={{ p: '24px 32px 40px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: 13, color: '#6B7384', fontWeight: 500 }}>Settings</Typography>
            <Typography sx={{ fontSize: 13, color: '#9CA4B2' }}>›</Typography>
            <Typography sx={{ fontSize: 13, color: '#131722', fontWeight: 600 }}>API keys</Typography>
          </Box>
          <Typography sx={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#131722' }}>API keys</Typography>
          <Typography sx={{ fontSize: 13, color: '#6B7384', mt: 0.5 }}>
            <strong style={{ color: '#353B4A' }}>4 keys</strong> · scoped tokens for the public REST API · keys are hashed at rest.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" sx={{ borderColor: '#C9CFD9', color: '#131722' }}>API docs →</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setShowSecret(false); setCreatedKey(null); }}>
            Create API key
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', alignItems: 'start' }}>
        {/* Keys table */}
        <Panel>
          <Box sx={{ px: '20px', py: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E1E4EB' }}>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#131722' }}>Active keys</Typography>
              <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25 }}>Anyone with a key can call the API · revoke immediately if leaked.</Typography>
            </Box>
            <Box sx={{ display: 'flex', bgcolor: '#EEF0F4', borderRadius: '8px', p: '3px' }}>
              {(['all','live','test'] as const).map(f => (
                <Box key={f} onClick={() => setFilter(f)} sx={{
                  px: '12px', py: '6px', fontSize: 12, fontWeight: 600, borderRadius: '6px', cursor: 'pointer',
                  color: filter === f ? '#131722' : '#6B7384',
                  bgcolor: filter === f ? '#fff' : 'transparent',
                  boxShadow: filter === f ? '0 1px 2px rgba(19,23,34,.06)' : 'none',
                }}>
                  {f === 'all' ? 'All (4)' : f === 'live' ? 'Live (3)' : 'Test (1)'}
                </Box>
              ))}
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1.4fr 160px 1.6fr 110px 110px 60px', px: '20px', py: '10px', bgcolor: '#F7F8FA', borderBottom: '1px solid #E1E4EB' }}>
              {['Name','Key','Scopes','Last used','Created',''].map((h,i) => (
                <Typography key={i} sx={{ fontSize: 11, fontWeight: 600, color: '#6B7384', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</Typography>
              ))}
            </Box>
            {filtered.map((k, i) => (
              <Box key={k.id} sx={{
                display: 'grid', gridTemplateColumns: '1.4fr 160px 1.6fr 110px 110px 60px',
                px: '20px', py: '12px', borderBottom: i < filtered.length - 1 ? '1px solid #E1E4EB' : 'none',
                alignItems: 'center', gap: '14px',
              }}>
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#131722' }}>{k.name}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#6B7384' }}>by {k.by}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{k.prefix}</Typography>
                  <Box sx={{ display: 'inline-block', fontSize: 9, fontWeight: 800, px: '6px', py: '1px', borderRadius: '3px', letterSpacing: '0.06em', textTransform: 'uppercase', mt: '3px', bgcolor: k.live ? '#FEE2E2' : '#EEF0F4', color: k.live ? '#991B1B' : '#6B7384' }}>
                    {k.live ? 'Live' : 'Test'}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {k.scopes.map(s => (
                    <Box key={s} sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600, color: '#1745B0', bgcolor: '#EFF4FE', px: '6px', py: '2px', borderRadius: '4px' }}>{s}</Box>
                  ))}
                </Box>
                <Typography sx={{ fontSize: 12, color: '#6B7384' }}>{k.lastUsed}</Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7384' }}>{k.created}</Typography>
                <Box sx={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                  <IconButton size="small" sx={{ width: 28, height: 28, borderRadius: '5px' }}><MoreIcon sx={{ fontSize: 16 }} /></IconButton>
                  <IconButton size="small" onClick={() => revokeKey.mutate(k.id)}
                    sx={{ width: 28, height: 28, borderRadius: '5px', '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' } }}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Panel>

        {/* Right panel */}
        <Panel>
          {showSecret && createdKey ? (
            <>
              <Box sx={{ px: '20px', py: '16px', borderBottom: '1px solid #E1E4EB' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#131722', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 18, color: '#16A34A' }} /> Key created
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25 }}>Copy it now — you won't be able to see the secret again.</Typography>
              </Box>
              <Box sx={{ p: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Box sx={{ display: 'flex', gap: '10px', bgcolor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', p: '12px' }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '6px', bgcolor: 'rgba(217,119,6,.2)', color: '#D97706', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <WarningIcon sx={{ fontSize: 16 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#78350F' }}>Store the secret in a secrets manager</Typography>
                    <Typography sx={{ fontSize: 11, color: '#92400E', mt: '2px' }}>We hash the key on disk — there's no recovery if you lose it.</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#353B4A', mb: '6px' }}>API key</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1.5px solid #1A56DB', bgcolor: '#fff', borderRadius: '8px', p: '8px 10px', boxShadow: '0 0 0 3px rgba(26,86,219,.15)', gap: 1 }}>
                    <Typography component="code" sx={{ flex: 1, fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace' }}>
                      {createdKey}
                    </Typography>
                    <IconButton size="small" onClick={() => { navigator.clipboard.writeText(createdKey); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                      sx={{ width: 30, height: 30, borderRadius: '6px', bgcolor: '#EEF0F4' }}>
                      {copied ? <CheckCircleIcon sx={{ fontSize: 14, color: '#16A34A' }} /> : <CopyIcon sx={{ fontSize: 14 }} />}
                    </IconButton>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: '#6B7384', mt: '6px' }}>
                    Pass as <Box component="span" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>Authorization: Bearer ocri_…</Box>
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#353B4A', mb: '6px' }}>Sample request</Typography>
                  <Box component="pre" sx={{ p: '14px 16px', bgcolor: '#131722', color: '#C9CFD9', borderRadius: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, lineHeight: 1.6, overflow: 'auto', maxHeight: 140, whiteSpace: 'pre', border: 'none', m: 0 }}>
                    {SAMPLE_CURL}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: '8px' }}>
                  <Button variant="outlined" sx={{ borderColor: '#C9CFD9', color: '#131722', fontSize: 12 }}>Test in console →</Button>
                  <Button variant="contained" onClick={() => { setShowSecret(false); setCreatedKey(null); }}>I've saved it</Button>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ px: '20px', py: '16px', borderBottom: '1px solid #E1E4EB' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#131722' }}>Create API key</Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25 }}>Pick the least set of scopes the integration needs.</Typography>
              </Box>
              <Box sx={{ p: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#353B4A', mb: '6px' }}>
                    Name <Box component="span" sx={{ color: '#DC2626' }}>*</Box>
                  </Typography>
                  <TextField size="small" value={keyName} onChange={e => setKeyName(e.target.value)} fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#353B4A', mb: '6px' }}>Environment</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {(['live','test'] as const).map(e => (
                      <Box key={e} onClick={() => setEnv(e)} sx={{ display: 'flex', alignItems: 'center', gap: '10px', border: `1.5px solid ${env === e ? '#1A56DB' : '#C9CFD9'}`, bgcolor: env === e ? '#EFF4FE' : '#fff', borderRadius: '8px', p: '10px 12px', cursor: 'pointer' }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: e === 'live' ? '#DC2626' : '#9CA4B2' }} />
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{e === 'live' ? 'Live' : 'Test'}</Typography>
                          <Typography sx={{ fontSize: 11, color: '#6B7384' }}>{e === 'live' ? 'Real data · counts against limits' : 'Sandbox · fake invoices'}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9CA4B2', textTransform: 'uppercase', letterSpacing: '0.08em', mb: '6px' }}>Scopes</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {SCOPES.map(s => (
                      <Box key={s.key} onClick={() => setSelectedScopes(p => ({ ...p, [s.key]: !p[s.key] }))}
                        sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', p: '8px 10px', borderRadius: '6px', cursor: 'pointer', '&:hover': { bgcolor: '#F7F8FA' } }}>
                        <Box sx={{ width: 18, height: 18, borderRadius: '4px', flexShrink: 0, mt: '2px', border: `1.5px solid ${selectedScopes[s.key] ? '#1A56DB' : '#C9CFD9'}`, bgcolor: selectedScopes[s.key] ? '#1A56DB' : '#fff', display: 'grid', placeItems: 'center', color: '#fff' }}>
                          {selectedScopes[s.key] && (
                            <Box component="svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" sx={{ width: 12, height: 12 }}>
                              <path d="M3 8.5l3.5 3.5L13 5" />
                            </Box>
                          )}
                        </Box>
                        <Box>
                          <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, display: 'block' }}>{s.key}</Typography>
                          <Typography sx={{ fontSize: 11, color: '#6B7384' }}>{s.desc}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#353B4A', mb: '6px' }}>Expires</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 38, px: '12px', border: '1px solid #C9CFD9', borderRadius: '8px', bgcolor: '#fff', cursor: 'pointer' }}>
                    <Typography sx={{ fontSize: 13 }}>Never · revoke manually</Typography>
                    <Typography sx={{ fontSize: 12, color: '#6B7384' }}>▾</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button variant="outlined" sx={{ borderColor: '#C9CFD9', color: '#131722' }}>Cancel</Button>
                  <Button variant="contained" onClick={handleCreate} disabled={!keyName || createKey.isPending}>Create key</Button>
                </Box>
              </Box>
            </>
          )}
        </Panel>
      </Box>
    </Box>
  );
}
