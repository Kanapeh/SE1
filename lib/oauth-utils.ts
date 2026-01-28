/**
 * OAuth Redirect URL Utilities
 * This file handles the correct redirect URLs for OAuth flows
 */

// Helper function to ensure proper URL construction
const ensureProperUrl = (base: string, path: string): string => {
  // Remove trailing slash from base if exists
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

// Function to get the correct site URL for OAuth redirects
export const getOAuthRedirectUrl = (path: string = '/auth/callback'): string => {
  console.log('🔍 OAuth Redirect URL Detection Started');
  
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    console.log('🌍 Browser environment detected:', { protocol, hostname, port });
    
    // If we're on localhost, use localhost URL
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const base = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
      const localUrl = ensureProperUrl(base, path);
      console.log('🏠 Using localhost URL:', localUrl);
      return localUrl;
    }
    
    // If we're on production domain, use the current origin
    if (hostname.includes('se1a.org') || hostname.includes('vercel.app')) {
      const base = `${protocol}//${hostname}`;
      const prodUrl = ensureProperUrl(base, path);
      console.log('🌐 Using production domain URL:', prodUrl);
      return prodUrl;
    }
    
    // Fallback to current origin for any other domain
    const currentUrl = ensureProperUrl(window.location.origin, path);
    console.log('🔄 Using current origin URL:', currentUrl);
    return currentUrl;
  }
  
  // Server-side: check environment variables
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const envUrl = ensureProperUrl(process.env.NEXT_PUBLIC_SITE_URL, path);
    console.log('🔧 Using environment SITE_URL:', envUrl);
    return envUrl;
  }
  
  // Server-side: detect if we're in development
  if (process.env.NODE_ENV === 'development') {
    const devUrl = ensureProperUrl('http://localhost:3000', path);
    console.log('🧪 Development environment - using localhost:', devUrl);
    return devUrl;
  }
  
  // Final fallback - production URL
  const PRODUCTION_URL = 'https://www.se1a.org';
  const fallbackUrl = ensureProperUrl(PRODUCTION_URL, path);
  console.log('🚨 Server-side fallback - using production URL:', fallbackUrl);
  return fallbackUrl;
};

// Smart function that returns the appropriate URL based on environment
// SSR-safe: returns consistent URLs on server and client
export const getSmartOAuthRedirectUrl = (path: string = '/auth/callback'): string => {
  console.log('🤖 Smart OAuth URL Detection Started');
  console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
  console.log('🔍 NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
  
  // PRIORITY 1: Browser environment detection (most reliable)
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    console.log('🌍 Browser environment detected:', { protocol, hostname, port });
    
    // If we're on localhost, always use localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const base = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
      const localUrl = ensureProperUrl(base, path);
      console.log('🏠 Localhost detected - using local URL:', localUrl);
      return localUrl;
    }
    
    // If we're on production domain (se1a.org with or without www), use current origin
    if (hostname.includes('se1a.org') || hostname.includes('vercel.app')) {
      const base = `${protocol}//${hostname}`;
      const prodUrl = ensureProperUrl(base, path);
      console.log('🌐 Production domain detected - using current origin:', prodUrl);
      console.log('🔍 Hostname:', hostname);
      console.log('🔍 Protocol:', protocol);
      return prodUrl;
    }
    
    // For any other domain, use current origin
    const base = `${protocol}//${hostname}`;
    const currentUrl = ensureProperUrl(base, path);
    console.log('🔄 Using current origin URL:', currentUrl);
    return currentUrl;
  }
  
  // PRIORITY 2: Environment variables for production (server-side)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const envUrl = ensureProperUrl(process.env.NEXT_PUBLIC_SITE_URL, path);
    console.log('🔧 Using environment SITE_URL (server-side):', envUrl);
    return envUrl;
  }
  
  // PRIORITY 3: Check if we're in development mode (server-side fallback)
  if (process.env.NODE_ENV === 'development') {
    const devUrl = `http://localhost:3000${path}`;
    console.log('🧪 Development environment detected - using localhost:', devUrl);
    return devUrl;
  }
  
  // Final server-side fallback - production URL
  const PRODUCTION_URL = 'https://www.se1a.org';
  const fallbackUrl = ensureProperUrl(PRODUCTION_URL, path);
  console.log('🚨 Final fallback - production URL:', fallbackUrl);
  return fallbackUrl;
};

// Legacy function for backward compatibility - now uses smart detection
export const getProductionOAuthRedirectUrl = (path: string = '/auth/callback'): string => {
  return getSmartOAuthRedirectUrl(path);
};

// Function to get the correct admin OAuth redirect URL
export const getAdminOAuthRedirectUrl = (): string => {
  return getSmartOAuthRedirectUrl('/admin/auth/callback');
};

// Function to get the correct teacher OAuth redirect URL
export const getTeacherOAuthRedirectUrl = (userType: string, email?: string): string => {
  const basePath = `/auth/callback?user_type=${userType}`;
  const emailParam = email ? `&email=${encodeURIComponent(email)}` : '';
  return getSmartOAuthRedirectUrl(`${basePath}${emailParam}`);
};

// Function to get the correct student OAuth redirect URL
export const getStudentOAuthRedirectUrl = (userType: string, email?: string): string => {
  const basePath = `/auth/callback?user_type=${userType}`;
  const emailParam = email ? `&email=${encodeURIComponent(email)}` : '';
  return getSmartOAuthRedirectUrl(`${basePath}${emailParam}`);
};

// Function to get the correct password reset redirect URL
export const getPasswordResetRedirectUrl = (): string => {
  return getSmartOAuthRedirectUrl('/reset-password');
};

// Function to get the correct email verification redirect URL
export const getEmailVerificationRedirectUrl = (userType: string): string => {
  return getSmartOAuthRedirectUrl(`/auth/callback?user_type=${userType}`);
};

// Debug function to log current OAuth configuration
export const logOAuthConfig = (): void => {
  console.log('🔍 OAuth Configuration Debug:');
  console.log('Environment NODE_ENV:', process.env.NODE_ENV);
  console.log('Environment SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
  
  if (typeof window !== 'undefined') {
    console.log('Current location:', window.location.href);
    console.log('Current origin:', window.location.origin);
    console.log('Current hostname:', window.location.hostname);
    console.log('Is localhost?:', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    console.log('Current protocol:', window.location.protocol);
    console.log('Current port:', window.location.port);
    console.log('OAuth redirect URL:', getOAuthRedirectUrl());
    console.log('Smart OAuth redirect URL:', getSmartOAuthRedirectUrl());
    console.log('Admin OAuth redirect URL:', getAdminOAuthRedirectUrl());
  } else {
    console.log('Server-side environment detected');
    console.log('OAuth redirect URL (server):', getOAuthRedirectUrl());
    console.log('Smart OAuth redirect URL (server):', getSmartOAuthRedirectUrl());
  }
};
