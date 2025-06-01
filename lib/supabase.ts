import { createBrowserClient } from '@supabase/ssr';
import { clientConfig } from './supabase-config';

// Initialize Supabase client for client-side operations using anon key
export const supabase = createBrowserClient(
  clientConfig.url,
  clientConfig.anonKey
);
