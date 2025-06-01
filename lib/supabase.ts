import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Initialize Supabase client for client-side operations using anon key
export const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
