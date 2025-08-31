/**
 * EMERGENCY OAUTH FIX
 * This file hardcodes all OAuth redirect URLs to prevent localhost redirects
 * Use this as a temporary solution while fixing the main OAuth configuration
 */

// CRITICAL: Hardcoded production URLs
const PRODUCTION_BASE_URL = 'https://www.se1a.org';

// Emergency OAuth redirect functions
export const emergencyOAuthRedirect = (path: string = '/auth/callback'): string => {
  console.log('🚨 EMERGENCY: Using hardcoded production URL');
  return `${PRODUCTION_BASE_URL}${path}`;
};

export const emergencyAdminOAuthRedirect = (): string => {
  return emergencyOAuthRedirect('/admin/auth/callback');
};

export const emergencyTeacherOAuthRedirect = (userType: string, email?: string): string => {
  const basePath = `/auth/callback?user_type=${userType}`;
  const emailParam = email ? `&email=${encodeURIComponent(email)}` : '';
  return emergencyOAuthRedirect(`${basePath}${emailParam}`);
};

export const emergencyPasswordResetRedirect = (): string => {
  return emergencyOAuthRedirect('/reset-password');
};

export const emergencyEmailVerificationRedirect = (userType: string): string => {
  return emergencyOAuthRedirect(`/auth/callback?user_type=${userType}`);
};

// Debug function
export const debugEmergencyOAuth = (): void => {
  console.log('🚨 EMERGENCY OAUTH CONFIGURATION:');
  console.log('Base URL:', PRODUCTION_BASE_URL);
  console.log('Auth Callback:', emergencyOAuthRedirect());
  console.log('Admin Callback:', emergencyAdminOAuthRedirect());
  console.log('Teacher Callback:', emergencyTeacherOAuthRedirect('teacher'));
  console.log('Student Callback:', emergencyTeacherOAuthRedirect('student'));
};
