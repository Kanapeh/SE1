// Define types for our configuration
type ClientConfig = {
  url: string;
  anonKey: string;
};

type ServerConfig = ClientConfig & {
  serviceRoleKey: string;
};

// Validate environment variables for client-side
export const validateClientEnv = (): ClientConfig => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return {
    url,
    anonKey,
  };
};

// Validate environment variables for server-side
export const validateServerEnv = (): ServerConfig => {
  const clientConfig = validateClientEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  return {
    ...clientConfig,
    serviceRoleKey,
  };
};

// Export validated configurations
export const clientConfig: ClientConfig = validateClientEnv();
export const serverConfig: ServerConfig = validateServerEnv(); 