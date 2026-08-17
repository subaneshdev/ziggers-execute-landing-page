import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xeeujbcdjbyqfzcundjm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_sYZxFLMIcvWRWChG1ryRsA_JpIS6d1c';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_fallback_key_for_server';

// Client-side Supabase client (using publishable / anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Server / Edge Admin Supabase client (using service role / secret key)
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey, 
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const SUPABASE_CONFIG = {
  projectId: 'xeeujbcdjbyqfzcundjm',
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  functionsUrl: `${supabaseUrl}/functions/v1`,
};
