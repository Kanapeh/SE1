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

// Export validated client configuration
export const clientConfig: ClientConfig = validateClientEnv();

// Server-side configuration
let serverConfig: ServerConfig;

try {
  // This will only work on the server
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  serverConfig = {
    ...clientConfig,
    serviceRoleKey,
  };
} catch (error) {
  // On the client, this will throw when accessed
  serverConfig = new Proxy({} as ServerConfig, {
    get: () => {
      throw new Error('Server configuration is not available on the client side');
    },
  });
}

export { serverConfig }; 