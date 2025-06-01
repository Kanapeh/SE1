import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './supabase-config';

// This is used for server-side operations only
export const supabaseAdmin = createClient(
  supabaseConfig.url!,
  supabaseConfig.serviceRoleKey!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
); 