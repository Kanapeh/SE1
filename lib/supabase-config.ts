// Define types for our configuration
type SupabaseConfig = {
  url: string;
  anonKey: string;
};

// Configuration using only public environment variables
// This should never include service role key
const config: SupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
};

// Validate configuration
const validateConfig = (config: SupabaseConfig): void => {
  if (!config.url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
  }
  
  if (!config.anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
  }
  
  if (!config.url.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must start with https://');
  }
  
  if (!config.url.includes('supabase.co')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase URL');
  }
  
  if (!config.anonKey.startsWith('eyJ')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid JWT token');
  }
};

// Validate configuration on import
try {
  validateConfig(config);
  console.log('✅ Supabase configuration validated successfully');
} catch (error) {
  console.error('❌ Supabase configuration validation failed:', error);
  if (typeof window !== 'undefined') {
    // Only show error in browser
    console.error('Please check your .env.local file for proper Supabase configuration');
  }
}

// Export configuration
export const supabaseConfig = config; 