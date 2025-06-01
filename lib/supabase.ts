import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig } from './supabase-config';

// Initialize Supabase client for client-side operations
export const supabase = createBrowserClient(
  supabaseConfig.url,
  supabaseConfig.anonKey
);
