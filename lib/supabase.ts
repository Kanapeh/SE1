import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Regular client for normal operations
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    cookies: {
      get(name: string) {
        return document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${name}=`))
          ?.split('=')[1];
      },
      set(name: string, value: string, options: { path?: string; maxAge?: number }) {
        document.cookie = `${name}=${value}; path=${options.path || '/'}; max-age=${options.maxAge || 3600}`;
      },
      remove(name: string, options: { path?: string }) {
        document.cookie = `${name}=; path=${options.path || '/'}; max-age=0`;
      },
    },
  }
);

// Admin client for operations that require elevated privileges
export const supabaseAdmin = createBrowserClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    cookies: {
      get(name: string) {
        return document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${name}=`))
          ?.split('=')[1];
      },
      set(name: string, value: string, options: { path?: string; maxAge?: number }) {
        document.cookie = `${name}=${value}; path=${options.path || '/'}; max-age=${options.maxAge || 3600}`;
      },
      remove(name: string, options: { path?: string }) {
        document.cookie = `${name}=; path=${options.path || '/'}; max-age=0`;
      },
    },
  }
);
