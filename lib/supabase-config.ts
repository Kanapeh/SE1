// Define types for our configuration
type ClientConfig = {
  url: string;
  anonKey: string;
};

type ServerConfig = ClientConfig & {
  serviceRoleKey: string;
};

// Client-side configuration
const clientConfig: ClientConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
};

// Server-side configuration
const serverConfig: ServerConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
};

// Export configurations
export { clientConfig, serverConfig }; 