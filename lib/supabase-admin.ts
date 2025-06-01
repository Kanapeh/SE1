import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './supabase-config';

if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
  throw new Error('Missing required environment variables for Supabase admin client');
}

// This is used for server-side operations only
export const supabaseAdmin = createClient(
  supabaseConfig.url,
  supabaseConfig.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'x-application-name': 'se1a-admin'
      }
    }
  }
); 