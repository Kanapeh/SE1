import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig } from './supabase-config';

// Initialize Supabase client for client-side operations using anon key
export const supabase = createBrowserClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': 'se1a-client'
      }
    }
  }
);
