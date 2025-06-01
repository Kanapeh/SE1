import { createClient } from '@supabase/supabase-js';

// This is used for server-side operations only
export const createAdminClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Admin client cannot be used in the browser');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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