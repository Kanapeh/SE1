import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig } from './supabase-config';

// Initialize Supabase client for client-side operations only
// This should only use public keys and never access service role key
export const supabase = createBrowserClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
