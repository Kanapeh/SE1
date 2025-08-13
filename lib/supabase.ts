import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig } from './supabase-config';

// Enhanced error handling and retry logic
const createSupabaseClient = () => {
  try {
    // Validate environment variables
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Validate URL format
    if (!supabaseConfig.url.startsWith('https://')) {
      throw new Error('Invalid Supabase URL format');
    }

    console.log('🔧 Initializing Supabase client with URL:', supabaseConfig.url);
    
    return createBrowserClient(
      supabaseConfig.url,
      supabaseConfig.anonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
          storageKey: 'supabase-auth-token',
          debug: process.env.NODE_ENV === 'development',
        },
        global: {
          headers: {
            'X-Client-Info': 'supabase-js-ssr',
          },
        },
        // Add retry configuration
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      }
    );
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    throw error;
  }
};

// Initialize Supabase client with error handling
export const supabase = createSupabaseClient();

// Enhanced storage clearing with better error handling
export const clearSupabaseStorage = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const keysToRemove = [
      'supabase-auth-token',
      'sb-' + supabaseConfig.url.replace(/https?:\/\//, '').replace(/\./g, '-') + '-auth-token',
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      // Don't clear PKCE verifier immediately - let the flow complete
      // 'supabase-pkce-verifier'
    ];
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (e) {
        console.warn(`⚠️ Failed to remove storage key ${key}:`, e);
      }
    });
    
    // Clear any other Supabase-related items except PKCE
    Object.keys(localStorage).forEach(key => {
      if ((key.includes('supabase') || key.includes('sb-')) && !key.includes('pkce')) {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`⚠️ Failed to remove localStorage key ${key}:`, e);
        }
      }
    });
    
    Object.keys(sessionStorage).forEach(key => {
      if ((key.includes('supabase') || key.includes('sb-')) && !key.includes('pkce')) {
        try {
          sessionStorage.removeItem(key);
        } catch (e) {
          console.warn(`⚠️ Failed to remove sessionStorage key ${key}:`, e);
        }
      }
    });
    
    console.log('🧹 Cleared Supabase storage (preserving PKCE state)');
  } catch (error) {
    console.error('❌ Error clearing Supabase storage:', error);
  }
};

// Enhanced PKCE state clearing
export const clearPKCEState = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const pkceKeys = [
      'supabase-pkce-verifier',
      'sb-' + supabaseConfig.url.replace(/https?:\/\//, '').replace(/\./g, '-') + '-pkce-verifier'
    ];
    
    pkceKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (e) {
        console.warn(`⚠️ Failed to remove PKCE key ${key}:`, e);
      }
    });
    
    console.log('🧹 Cleared PKCE state');
  } catch (error) {
    console.error('❌ Error clearing PKCE state:', error);
  }
};

// Enhanced session check with retry logic
export const checkSessionWithRetry = async (maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Session check attempt ${attempt}/${maxRetries}`);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error(`❌ Session check error (attempt ${attempt}):`, error);
        if (attempt === maxRetries) throw error;
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      
      console.log('✅ Session check successful:', !!session);
      return { session, error: null };
    } catch (error) {
      console.error(`💥 Session check failed (attempt ${attempt}):`, error);
      if (attempt === maxRetries) throw error;
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw new Error('Session check failed after all retries');
};
