import { createServerClient } from '@supabase/ssr';
import { supabaseConfig } from './supabase-config';
import { CookieOptions } from '@supabase/ssr';

export async function createClient() {
  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        get(name: string) {
          return document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1];
        },
        set(name: string, value: string, options: CookieOptions) {
          document.cookie = `${name}=${value}; ${Object.entries(options)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ')}`;
        },
        remove(name: string, options: CookieOptions) {
          document.cookie = `${name}=; ${Object.entries(options)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ')}`;
        },
      },
    }
  );
}