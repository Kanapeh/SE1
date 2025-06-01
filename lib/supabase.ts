import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig } from './supabase-config';

// Initialize Supabase client for client-side operations using anon key
export const supabase = createBrowserClient(
  supabaseConfig.url!,
  supabaseConfig.anonKey!
);
