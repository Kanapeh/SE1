// Define types for our configuration
type SupabaseConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
};

// Validate environment variables
const validateEnv = (): SupabaseConfig => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  return {
    url,
    anonKey,
    serviceRoleKey,
  };
};

// Export validated configuration
export const supabaseConfig: SupabaseConfig = validateEnv(); 