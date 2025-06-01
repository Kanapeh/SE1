// Define types for our configuration
type SupabaseConfig = {
  url: string;
  anonKey: string;
};

// Configuration using only public environment variables
const config: SupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
};

// Export configuration
export const supabaseConfig = config; 