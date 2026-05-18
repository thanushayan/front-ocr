import { useState } from 'react';
import {
  Box, Paper, Typography, Button, LinearProgress,
} from '@mui/material';
import {
  Download as DownloadIcon, CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useSubscription, useBillingPortal } from '../../hooks/useSettings';
import { useUIStore } from '../../stores/uiStore';

const Panel = ({ children }: { children: React.ReactNode }) => (
  <Paper sx={{ borderRadius: '12px', border: '1px solid #E1E4EB', boxShadow: '0 1px 2px rgba(19,23,34,.06)', overflow: 'hidden' }}>
    {children}
  </Paper>
);

const PLANS = [
  {
    tier: 'Starter', price: 49, badge: { bg: '#EEF0F4', color: '#353B4A' },
    desc: 'For small teams getting started',
    features: ['Up to 500 invoices/mo','5 team members','2 workflow templates','Standard support','Xero + QuickBooks','Email + in-app notifications'],
    cta: 'Downgrade', ctaVariant: 'outlined' as const,
  },
  {
    tier: 'Growth', price: 249, badge: { bg: '#C9F4E2', color: '#11644B' }, cur: true,
    desc: 'Scale automation across the org',
    features: ['Up to 5,000 invoices/mo','25 team members','5 workflow templates','Priority support','All integrations','Webhooks · API access','SOC 2 audit logs'],
    cta: 'Current plan', ctaVariant: 'current' as const,
  },
  {
    tier: 'Enterprise', price: null, badge: { bg: 'linear-gradient(135deg,#1A56DB,#15326E)', color: '#fff' }, hi: true,
    desc: 'For large finance teams',
    features: ['Unlimited invoices','Unlimited members','Unlimited workflows','Dedicated CSM','SSO / SAML','Custom data residency','99.9% SLA','Custom contracts + DPA'],
    cta: 'Talk to sales', ctaVariant: 'primary' as const,
  },
];

const BILLING_HISTORY = [
  { n:'OCS-2026-005', date:'1 May 2026', desc:'Growth plan · May 2026',          amt:249, paid:true },
  { n:'OCS-2026-004', date:'1 Apr 2026', desc:'Growth plan · Apr 2026',          amt:249, paid:true },
  { n:'OCS-2026-003', date:'1 Mar 2026', desc:'Growth plan · Mar 2026',          amt:249, paid:true },
  { n:'OCS-2026-002', date:'1 Feb 2026', desc:'Growth plan · Feb 2026',          amt:249, paid:true },
  { n:'OCS-2026-001', date:'1 Jan 2026', desc:'Growth plan · Jan 2026',          amt:249, paid:true },
  { n:'OCS-2025-091', date:'1 Dec 2025', desc:'Starter → Growth proration',      amt:32,  paid:false },
];

const MINI_STATS = [
  { k: 'Team members',       v: '12 / 25',       pct: 48,  cls: '' },
  { k: 'Workflow templates', v: '5 / 5',          pct: 100, cls: 'warn' },
  { k: 'API calls · today',  v: '12.4k / unlim',  pct: 24,  cls: 'ok' },
  { k: 'Storage',            v: '28 / 100 GB',    pct: 28,  cls: '' },
];

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly'|'annual'>('monthly');
  useSubscription();
  const billingPortal = useBillingPortal();
  const showSnack = useUIStore(s => s.showSnack);

  const handleManageBilling = async () => {
    try {
      const res = await billingPortal.mutateAsync(undefined);
      if (res?.url) window.open(res.url, '_blank');
    } catch { showSnack('Failed to open billing portal', 'error'); }
  };

  return (
    <Box sx={{ p: '24px 32px 40px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: 13, color: '#6B7384', fontWeight: 500 }}>Settings</Typography>
            <Typography sx={{ fontSize: 13, color: '#9CA4B2' }}>›</Typography>
            <Typography sx={{ fontSize: 13, color: '#131722', fontWeight: 600 }}>Subscription &amp; billing</Typography>
          </Box>
          <Typography sx={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#131722' }}>Subscription</Typography>
          <Typography sx={{ fontSize: 13, color: '#6B7384', mt: 0.5 }}>Manage your plan, see usage, and download past invoices.</Typography>
        </Box>
        <Button variant="outlined" sx={{ borderColor: '#C9CFD9', color: '#131722' }} onClick={handleManageBilling}>
          Update payment method
        </Button>
      </Box>

      {/* Current plan + usage */}
      <Panel>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', p: '24px 28px', background: 'linear-gradient(135deg,#F5F7FF 0%,#fff 60%)' }}>
          {/* Left: plan info */}
          <Box>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 10, fontWeight: 800, px: '10px', py: '4px', borderRadius: '6px', letterSpacing: '0.08em', textTransform: 'uppercase', bgcolor: '#C9F4E2', color: '#11644B' }}>
              🛡 Growth
            </Box>
            <Typography sx={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', mt: 1, lineHeight: 1.1, color: '#131722' }}>Growth plan</Typography>
            <Typography sx={{ fontSize: 13, color: '#353B4A', mt: '6px', lineHeight: 1.5 }}>Up to 5,000 invoices/mo · 25 team members · 5 workflow templates · all integrations</Typography>
            <Box sx={{ mt: '14px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <Typography sx={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: '#131722' }}>£249</Typography>
              <Typography sx={{ fontSize: 13, color: '#6B7384', fontWeight: 500 }}>/ month · billed monthly</Typography>
            </Box>
            <Box sx={{ mt: '14px', pt: '12px', pb: '12px', borderTop: '1px solid #E1E4EB', borderBottom: '1px solid #E1E4EB', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <Typography sx={{ fontSize: 12, color: '#6B7384' }}>Next charge</Typography>
                <Typography sx={{ fontSize: 12 }}>£249 on <strong>1 Jun 2026</strong> · Visa ending 4242</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <Typography sx={{ fontSize: 12, color: '#6B7384' }}>Member since</Typography>
                <Typography sx={{ fontSize: 12 }}>12 Jan 2024</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1, mt: "14px" }}>
              <Button variant="outlined" sx={{ borderColor: '#C9CFD9', color: '#131722', fontSize: 12 }}>Switch to annual · save 15%</Button>
              <Button sx={{ fontSize: 12, fontWeight: 600, color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}>Cancel subscription</Button>
            </Box>
          </Box>

          {/* Right: usage */}
          <Box>
            <Box sx={{ bgcolor: '#fff', border: '1px solid #E1E4EB', borderRadius: '12px', p: '18px 20px', boxShadow: '0 1px 2px rgba(19,23,34,.06)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6B7384', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Invoices this month</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>62.5%</Typography>
              </Box>
              <Box sx={{ mt: '6px' }}>
                <Box component="span" sx={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: '#131722' }}>3,124</Box>
                <Box component="span" sx={{ fontSize: 18, color: '#6B7384', fontWeight: 600, ml: 0.5 }}>/ 5,000</Box>
              </Box>
              <LinearProgress variant="determinate" value={62.5} sx={{
                mt: '14px', height: 8, borderRadius: '999px', bgcolor: '#EEF0F4',
                '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #1D9E75, #1A56DB)', borderRadius: '999px' },
              }} />
              <Typography sx={{ fontSize: 11, color: '#6B7384', mt: '8px' }}>Resets 1 Jun · avg 104/day · projecting 3,120 by month-end</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', mt: '14px' }}>
              {MINI_STATS.map((m, i) => (
                <Box key={i} sx={{ bgcolor: '#fff', border: '1px solid #E1E4EB', borderRadius: '10px', p: '12px' }}>
                  <Typography sx={{ fontSize: 10, color: '#6B7384', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.k}</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, mt: '3px', fontVariantNumeric: 'tabular-nums' }}>{m.v}</Typography>
                  <Box sx={{ height: 4, bgcolor: '#EEF0F4', borderRadius: '999px', overflow: 'hidden', mt: '6px' }}>
                    <Box sx={{ height: '100%', width: `${m.pct}%`, borderRadius: '999px',
                      bgcolor: m.cls === 'warn' ? '#D97706' : m.cls === 'ok' ? '#16A34A' : '#1A56DB' }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Panel>

      {/* Compare plans */}
      <Panel>
        <Box sx={{ px: '20px', py: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E1E4EB' }}>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#131722' }}>Compare plans</Typography>
            <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25 }}>Upgrade or downgrade — changes prorate to your billing cycle.</Typography>
          </Box>
          <Box sx={{ display: 'flex', bgcolor: '#EEF0F4', borderRadius: '8px', p: '3px' }}>
            {(['monthly','annual'] as const).map(c => (
              <Box key={c} onClick={() => setBillingCycle(c)} sx={{
                px: '12px', py: '6px', fontSize: 12, fontWeight: 600, borderRadius: '6px', cursor: 'pointer',
                color: billingCycle === c ? '#131722' : '#6B7384',
                bgcolor: billingCycle === c ? '#fff' : 'transparent',
                boxShadow: billingCycle === c ? '0 1px 2px rgba(19,23,34,.06)' : 'none',
              }}>
                {c === 'monthly' ? 'Monthly' : 'Annual · 15% off'}
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', p: '20px', bgcolor: '#F7F8FA', gap: 0 }}>
          {PLANS.map((p, i) => {
            const price = billingCycle === 'annual' && p.price ? Math.round(p.price * 0.85) : p.price;
            return (
              <Box key={i} sx={{
                bgcolor: p.hi ? 'linear-gradient(180deg,#15326E 0%,#1745B0 100%)' : p.cur ? 'linear-gradient(180deg,#EFF4FE 0%,#fff 50%)' : '#fff',
                background: p.hi ? 'linear-gradient(180deg,#15326E 0%,#1745B0 100%)' : p.cur ? 'linear-gradient(180deg,#EFF4FE 0%,#fff 50%)' : '#fff',
                border: `1px solid ${p.hi ? '#15326E' : p.cur ? '#8FB0F8' : '#E1E4EB'}`,
                borderLeft: i > 0 ? 'none' : undefined,
                borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : 0,
                p: '24px 22px', display: 'flex', flexDirection: 'column', gap: '14px',
                position: 'relative',
                transform: p.hi ? 'scale(1.02)' : 'none',
                zIndex: p.hi ? 2 : 1,
                boxShadow: p.hi ? '0 18px 48px rgba(19,23,34,.14)' : 'none',
                color: p.hi ? '#fff' : '#131722',
              }}>
                {p.cur && (
                  <Box sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', bgcolor: '#1A56DB', color: '#fff', fontSize: 10, fontWeight: 800, px: '12px', py: '4px', borderRadius: '999px', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Your plan
                  </Box>
                )}
                {p.hi && (
                  <Box sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#F59E0B,#D97706)', color: '#fff', fontSize: 10, fontWeight: 800, px: '12px', py: '4px', borderRadius: '999px', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Most popular
                  </Box>
                )}
                <Box sx={{ display: 'inline-flex', alignItems: 'center', fontSize: 10, fontWeight: 800, px: '10px', py: '4px', borderRadius: '6px', letterSpacing: '0.08em', textTransform: 'uppercase', ...p.badge, background: p.badge.bg, width: 'fit-content' }}>
                  {p.tier}
                </Box>
                <Box>
                  <Box component="span" sx={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1 }}>
                    {price ? `£${price}` : 'Custom'}
                  </Box>
                  {price && <Box component="span" sx={{ fontSize: 13, color: p.hi ? 'rgba(255,255,255,.7)' : '#6B7384', fontWeight: 500, ml: '2px' }}>/mo</Box>}
                </Box>
                <Typography sx={{ fontSize: 12, color: p.hi ? 'rgba(255,255,255,.7)' : '#6B7384', minHeight: 32, lineHeight: 1.4 }}>{p.desc}</Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  {p.features.map((f, j) => (
                    <Box key={j} component="li" sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: 12, color: p.hi ? 'rgba(255,255,255,.92)' : '#353B4A', lineHeight: 1.45 }}>
                      <CheckIcon sx={{ fontSize: 13, color: p.hi ? '#86EFAC' : '#16A34A', flexShrink: 0, mt: '1px' }} />
                      {f}
                    </Box>
                  ))}
                </Box>
                <Button
                  variant={p.ctaVariant === 'primary' ? 'contained' : p.ctaVariant === 'current' ? 'outlined' : 'outlined'}
                  fullWidth
                  disabled={p.ctaVariant === 'current'}
                  sx={{
                    ...(p.ctaVariant === 'current' ? { bgcolor: '#EEF0F4', color: '#6B7384', border: 'none', '&.Mui-disabled': { bgcolor: '#EEF0F4', color: '#6B7384' } } : {}),
                    ...(p.hi && p.ctaVariant === 'primary' ? { bgcolor: '#fff', color: '#1745B0', '&:hover': { bgcolor: '#DBE6FD' } } : {}),
                    ...(p.ctaVariant === 'outlined' && !p.hi ? { borderColor: '#C9CFD9', color: '#131722' } : {}),
                  }}
                >
                  {p.cta}
                </Button>
              </Box>
            );
          })}
        </Box>
      </Panel>

      {/* Payment history */}
      <Panel>
        <Box sx={{ px: '20px', py: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E1E4EB' }}>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#131722' }}>Payment history</Typography>
            <Typography sx={{ fontSize: 12, color: '#6B7384', mt: 0.25 }}>Last 6 months · invoices stored for 7 years</Typography>
          </Box>
          <Button startIcon={<DownloadIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: 12, fontWeight: 600, color: '#1A56DB' }}>
            Export all (CSV)
          </Button>
        </Box>
        <Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '140px 130px 1fr 110px 100px 100px', px: '20px', py: '10px', bgcolor: '#F7F8FA', borderBottom: '1px solid #E1E4EB' }}>
            {['Invoice','Date','Description','Amount','Status',''].map((h,i) => (
              <Typography key={i} sx={{ fontSize: 11, fontWeight: 600, color: '#6B7384', textTransform: 'uppercase', letterSpacing: '0.06em', ...(i===3?{textAlign:'right'}:{}), ...(i===4?{textAlign:'center'}:{}) }}>
                {h}
              </Typography>
            ))}
          </Box>
          {BILLING_HISTORY.map((b, i) => (
            <Box key={i} sx={{
              display: 'grid', gridTemplateColumns: '140px 130px 1fr 110px 100px 100px',
              px: '20px', py: '12px', borderBottom: i < BILLING_HISTORY.length - 1 ? '1px solid #E1E4EB' : 'none',
              alignItems: 'center', gap: '14px',
            }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', color: '#131722' }}>{b.n}</Typography>
              <Typography sx={{ fontSize: 12, color: '#6B7384' }}>{b.date}</Typography>
              <Typography sx={{ fontSize: 12 }}>{b.desc}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}>£ {b.amt.toFixed(2)}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: 10, fontWeight: 700,
                  px: '9px', py: '3px', borderRadius: '999px', letterSpacing: '0.04em', textTransform: 'uppercase',
                  bgcolor: b.paid ? '#DCFCE7' : '#EEF0F4',
                  color: b.paid ? '#166534' : '#6B7384',
                }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: b.paid ? '#16A34A' : '#9CA4B2' }} />
                  {b.paid ? 'Paid' : 'Refunded'}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button startIcon={<DownloadIcon sx={{ fontSize: 12 }} />} sx={{ fontSize: 12, fontWeight: 600, color: '#1A56DB', height: 'auto', minWidth: 0, p: '0 4px' }}>
                  PDF
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Panel>
    </Box>
  );
}
