import { createClient } from '@supabase/supabase-js';
import { serverConfig } from './supabase-config';

// This is used for server-side operations only
export const supabaseAdmin = createClient(
  serverConfig.url,
  serverConfig.serviceRoleKey,
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