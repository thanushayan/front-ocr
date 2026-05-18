import { useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Stack,
  Skeleton, MenuItem,
} from '@mui/material';
import { UploadFile as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCompanySettings, useUpdateCompany } from '../../hooks/useSettings';
import { useUIStore } from '../../stores/uiStore';

const schema = z.object({
  name: z.string().min(1, 'Company name is required'),
  tradingName: z.string().optional(),
  registrationNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  billingEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  currency: z.string().optional(),
  fiscalYearStart: z.string().optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const COUNTRIES = ['United Kingdom', 'United States', 'Germany', 'France', 'Netherlands', 'Ireland'];
const CURRENCIES = ['GBP', 'USD', 'EUR'];
const FISCAL_YEAR_STARTS = ['January', 'April', 'July', 'October'];
const TIMEZONES = ['Europe/London', 'America/New_York', 'America/Los_Angeles', 'Europe/Berlin', 'Asia/Tokyo'];
const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];

const panelSx = {
  bgcolor: '#fff',
  border: '1px solid #E1E4EB',
  borderRadius: '12px',
  boxShadow: '0 1px 2px rgba(19,23,34,.06)',
};

// CSS Grid helper: 2 equal columns
const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const grid3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' };

function PanelHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ px: '20px', py: '16px', borderBottom: '1px solid #E1E4EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#131722' }}>{title}</Typography>
        {subtitle && <Typography sx={{ fontSize: 12, color: '#6B7384', mt: '2px' }}>{subtitle}</Typography>}
      </Box>
    </Box>
  );
}

function PanelFooter({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ px: '20px', py: '14px', bgcolor: '#F7F8FA', borderTop: '1px solid #E1E4EB', borderRadius: '0 0 12px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {children}
    </Box>
  );
}

export default function CompanySettingsPage() {
  const { data, isLoading } = useCompanySettings();
  const updateCompany = useUpdateCompany();
  const showSnack = useUIStore(s => s.showSnack);

  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', tradingName: '', registrationNumber: '', vatNumber: '',
      street: '', city: '', postcode: '', country: 'United Kingdom', phone: '', billingEmail: '',
      currency: 'GBP', fiscalYearStart: 'April', timezone: 'Europe/London', dateFormat: 'DD/MM/YYYY',
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name ?? '',
        tradingName: data.tradingName ?? '',
        registrationNumber: data.registrationNumber ?? '',
        vatNumber: data.vatNumber ?? '',
        street: data.address?.street ?? '',
        city: data.address?.city ?? '',
        postcode: data.address?.postcode ?? '',
        country: data.address?.country ?? 'United Kingdom',
        phone: data.phone ?? '',
        billingEmail: data.billingEmail ?? '',
        currency: data.currency ?? 'GBP',
        fiscalYearStart: data.fiscalYearStart ?? 'April',
        timezone: data.timezone ?? 'Europe/London',
        dateFormat: data.dateFormat ?? 'DD/MM/YYYY',
      });
    }
  }, [data, reset]);

  const onSubmit = (values: FormValues) => {
    updateCompany.mutate(values as Record<string, unknown>, {
      onSuccess: () => showSnack('Company settings saved', 'success'),
      onError: () => showSnack('Failed to save settings', 'error'),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: '24px 32px 40px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Breadcrumb + Header */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography sx={{ fontSize: 13, color: '#6B7384', fontWeight: 500 }}>Settings</Typography>
          <Typography sx={{ fontSize: 13, color: '#9CA4B2' }}>›</Typography>
          <Typography sx={{ fontSize: 13, color: '#131722', fontWeight: 600 }}>Company</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: 26, fontWeight: 700, color: '#131722', lineHeight: 1.3, letterSpacing: '-0.02em' }}>Company</Typography>
            <Typography sx={{ fontSize: 13, color: '#6B7384', mt: 0.5 }}>
              Workspace details that appear on invoices, reports, and exports.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => reset()} disabled={!isDirty} sx={{ borderColor: '#C9CFD9', color: '#131722' }}>
              Discard
            </Button>
            <Button variant="contained" type="submit" disabled={updateCompany.isPending}>
              {updateCompany.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Identity Panel */}
      <Box sx={panelSx}>
        <PanelHeader title="Identity" subtitle="Branding that appears on documents and the portal." />
        <Box sx={{ px: '20px', py: '18px' }}>
          {/* Logo Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 3, borderBottom: '1px solid #E1E4EB' }}>
            {/* Brand mark preview: 48x48, teal gradient */}
            <Box sx={{
              width: 48, height: 48, borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #1D9E75 0%, #11644B 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(19,23,34,.2)',
            }}>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1 }}>A</Typography>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#131722', lineHeight: 1.3 }}>Acme</Typography>
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#6B7384', letterSpacing: '0.1em', textTransform: 'uppercase' }}>/ CORP.</Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 0.75 }}>
                <Button variant="outlined" size="small" startIcon={<UploadIcon sx={{ fontSize: 14 }} />}
                  sx={{ fontSize: 12, height: 30, borderColor: '#C9CFD9', color: '#131722' }}>
                  Upload logo
                </Button>
                <Button variant="text" size="small" startIcon={<DeleteIcon sx={{ fontSize: 14 }} />}
                  sx={{ fontSize: 12, height: 30, color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}>
                  Remove
                </Button>
              </Stack>
              <Typography sx={{ fontSize: 11, color: '#9CA4B2', mt: 0.5 }}>PNG or SVG, max 2 MB, min 200×200 px</Typography>
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={grid2}>
              {[...Array(4)].map((_, i) => <Skeleton key={i} height={56} />)}
            </Box>
          ) : (
            <Box sx={grid2}>
              <Controller name="name" control={control} render={({ field, fieldState }) => (
                <TextField {...field} label="Company name *" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
              )} />
              <Controller name="tradingName" control={control} render={({ field }) => (
                <TextField {...field} label="Trading name" fullWidth helperText="Optional — leave blank to use company name" />
              )} />
              <Controller name="registrationNumber" control={control} render={({ field }) => (
                <TextField {...field} label="Registration number" fullWidth
                  helperText={<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box component="span" sx={{ color: '#16A34A', fontWeight: 600 }}>✓</Box> Verified with Companies House
                  </Box>} />
              )} />
              <Controller name="vatNumber" control={control} render={({ field }) => (
                <TextField {...field} label="VAT number" fullWidth
                  helperText={<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box component="span" sx={{ color: '#16A34A', fontWeight: 600 }}>✓</Box> Valid · last checked 2 hours ago
                  </Box>} />
              )} />
            </Box>
          )}
        </Box>
      </Box>

      {/* Registered Address Panel */}
      <Box sx={panelSx}>
        <PanelHeader title="Registered address" subtitle="Used for official documents and HMRC compliance." />
        <Box sx={{ px: '20px', py: '18px' }}>
          {isLoading ? (
            <Stack spacing={2}><Skeleton height={56} /><Skeleton height={56} /><Skeleton height={56} /></Stack>
          ) : (
            <Stack spacing={2}>
              <Controller name="street" control={control} render={({ field }) => (
                <TextField {...field} label="Street address" fullWidth />
              )} />
              <Box sx={grid3}>
                <Controller name="city" control={control} render={({ field }) => (
                  <TextField {...field} label="City" fullWidth />
                )} />
                <Controller name="postcode" control={control} render={({ field }) => (
                  <TextField {...field} label="Postcode" fullWidth />
                )} />
                <Controller name="country" control={control} render={({ field }) => (
                  <TextField {...field} label="Country" fullWidth select>
                    {COUNTRIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                )} />
              </Box>
              <Box sx={grid2}>
                <Controller name="phone" control={control} render={({ field }) => (
                  <TextField {...field} label="Phone" fullWidth />
                )} />
                <Controller name="billingEmail" control={control} render={({ field, fieldState }) => (
                  <TextField {...field} label="Billing email" fullWidth error={!!fieldState.error}
                    helperText={fieldState.error?.message ?? 'Receives payment receipts and tax invoices'}
                  />
                )} />
              </Box>
            </Stack>
          )}
        </Box>
      </Box>

      {/* Defaults Panel */}
      <Box sx={panelSx}>
        <PanelHeader title="Defaults" subtitle="Regional and format preferences for new documents." />
        <Box sx={{ px: '20px', py: '18px' }}>
          {isLoading ? (
            <Box sx={grid2}>{[...Array(4)].map((_, i) => <Skeleton key={i} height={56} />)}</Box>
          ) : (
            <Box sx={grid2}>
              <Controller name="currency" control={control} render={({ field }) => (
                <TextField {...field} label="Base currency" fullWidth select>
                  {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              )} />
              <Controller name="fiscalYearStart" control={control} render={({ field }) => (
                <TextField {...field} label="Fiscal year start" fullWidth select>
                  {FISCAL_YEAR_STARTS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
              )} />
              <Controller name="timezone" control={control} render={({ field }) => (
                <TextField {...field} label="Timezone" fullWidth select>
                  {TIMEZONES.map(tz => <MenuItem key={tz} value={tz}>{tz}</MenuItem>)}
                </TextField>
              )} />
              <Controller name="dateFormat" control={control} render={({ field }) => (
                <TextField {...field} label="Date format" fullWidth select>
                  {DATE_FORMATS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </TextField>
              )} />
            </Box>
          )}
        </Box>
        <PanelFooter>
          <Typography sx={{ fontSize: 11, color: '#6B7384' }}>Changes apply to new documents immediately.</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={() => reset()} disabled={!isDirty} sx={{ borderColor: '#C9CFD9', color: '#131722' }}>
              Discard
            </Button>
            <Button variant="contained" type="submit" disabled={updateCompany.isPending}>
              {updateCompany.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </Box>
        </PanelFooter>
      </Box>
    </Box>
  );
}
