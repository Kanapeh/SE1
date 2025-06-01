import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseConfig } from './supabase-config';
import { CookieOptions } from '@supabase/ssr';

export async function createClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              // Ensure cookies are secure in production
              secure: process.env.NODE_ENV === 'production',
              // Prevent JavaScript access to cookies
              httpOnly: true,
              // Same site policy
              sameSite: 'lax',
            });
          } catch (error) {
            console.error('Error setting cookie:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value: '',
              ...options,
              // Set expiration to past date to remove cookie
              expires: new Date(0),
              // Ensure cookies are secure in production
              secure: process.env.NODE_ENV === 'production',
              // Prevent JavaScript access to cookies
              httpOnly: true,
              // Same site policy
              sameSite: 'lax',
            });
          } catch (error) {
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  );
}