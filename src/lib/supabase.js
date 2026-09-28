import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || null;

// Client-side Supabase client (using publishable / anon key)
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Server / Edge Admin Supabase client (using service role / secret key)
// Never uses a dummy fallback string. Only initialized when real key is provided.
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

export function getRequiredSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing required Supabase configuration: NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing required Supabase configuration: SUPABASE_SERVICE_ROLE_KEY');
  }
  if (!supabaseAdmin) {
    throw new Error('Missing required Supabase configuration: SUPABASE_SERVICE_ROLE_KEY');
  }
  return supabaseAdmin;
}

export function getRequiredSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing required Supabase configuration: NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing required Supabase configuration: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  if (!supabase) {
    throw new Error('Missing required Supabase configuration: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return supabase;
}

export const SUPABASE_CONFIG = {
  projectId: supabaseUrl ? supabaseUrl.replace('https://', '').split('.')[0] : null,
  url: supabaseUrl || null,
  isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  functionsUrl: supabaseUrl ? `${supabaseUrl}/functions/v1` : null,
};
