import { createClient } from '@supabase/supabase-js';

// This is used for server-side operations only in API routes
export const createAdminClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be used in server-side code');
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
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
}; 