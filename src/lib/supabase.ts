import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'togbanroczwndrvznbrl';
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_5ekZS0Jm6U5XFOCbw-6Bmg_AzWtOcjj';

export const BOOTSTRAPPED_ADMIN_EMAIL = 'educationsecom@gmail.com';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const err = error as { code?: string; message?: string };
  return (
    err.code === '42P01' ||
    err.code === 'PGRST205' ||
    Boolean(err.message && err.message.toLowerCase().includes('could not find the table')) ||
    Boolean(err.message && err.message.toLowerCase().includes('does not exist'))
  );
}
