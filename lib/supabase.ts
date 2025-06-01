import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { supabaseConfig } from './supabase-config';

// Initialize Supabase client for client-side operations using anon key
export const supabase = createClientComponentClient({
  supabaseUrl: supabaseConfig.url,
  supabaseKey: supabaseConfig.anonKey,
});
