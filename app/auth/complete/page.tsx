// BACKUP: اگر مشکل ادامه داشت این را rename کنید به page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, clearPKCEState } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { getSmartOAuthRedirectUrl } from '@/lib/oauth-utils';

function AuthCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  if (!searchParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">خطا در بارگذاری</h2>
          <p className="text-gray-600">پارامترهای URL یافت نشد</p>
        </div>
      </div>
    );
  }
  
  const userType = searchParams.get('type');
  const code = searchParams.get('code');
  
  // Debug URL parameters
  console.log('🔍 Auth Complete Debug Info:');
  console.log('User Type from URL:', userType);
  console.log('Authorization Code:', code ? 'Present' : 'Missing');
  console.log('All URL params:', Object.fromEntries(searchParams.entries()));
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const completeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🔄 Completing PKCE authentication...');
        
        // Check for OAuth errors in URL
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        const errorCode = urlParams.get('error_code');
        
        if (error) {
          console.error('🚨 OAuth Error detected:', { error, errorCode, errorDescription });
          if (error === 'server_error' && errorCode === 'flow_state_not_found') {
            setError('مشکل در تنظیمات OAuth. لطفاً مجدد تلاش کنید.');
            return;
          }
          setError(`خطای OAuth: ${errorDescription || error}`);
          return;
        }
        
        // If we have an authorization code, try different approaches
        if (code) {
          console.log('🔄 Processing authorization code...');
          
          // Approach 1: Try direct code exchange
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              console.error('❌ Direct code exchange failed:', error.message);
              
              // If PKCE code verifier issue, try alternative approach
              if (error.message.includes('code verifier') || error.message.includes('non-empty')) {
                console.log('🔄 PKCE issue detected, trying auth state listener...');
                
                // Wait for Supabase to handle the OAuth callback automatically
                console.log('⏳ Waiting for auth state change...');
                
                return new Promise((resolve) => {
                  let resolved = false;
                  
                  // Set up auth state change listener
                  const { data: { subscription } } = supabase.auth.onAuthStateChange(
                    async (event, session) => {
                      // Only log important events
                      if (event === 'SIGNED_IN') {
                        console.log('✅ User signed in via auth state change');
                      }
                      
                      if (event === 'SIGNED_IN' && session && !resolved) {
                        resolved = true;
                        subscription?.unsubscribe();
                        await handleUserSession(session);
                        resolve(undefined);
                      }
                    }
                  );
                  
                  // Fallback: Check for existing session after a delay
                  setTimeout(async () => {
                    if (!resolved) {
                      const { data: { session } } = await supabase.auth.getSession();
                      if (session) {
                        resolved = true;
                        console.log('✅ Session found via direct check');
                        subscription?.unsubscribe();
                        await handleUserSession(session);
                        resolve(undefined);
                      } else {
                        resolved = true;
                        subscription?.unsubscribe();
                        setError('خطا در احراز هویت. لطفاً دوباره تلاش کنید.');
                        resolve(undefined);
                      }
                    }
                  }, 5000);
                });
              }
              
              setError(`خطا در تبدیل کد احراز هویت: ${error.message}`);
              return;
            }
            
            console.log('✅ Direct code exchange successful');
            
            if (data.session) {
              await handleUserSession(data.session);
            } else {
              setError('جلسه کاربری ایجاد نشد');
            }
          } catch (error: any) {
            console.error('💥 Code exchange error:', error);
            setError('خطا در پردازش احراز هویت. لطفاً دوباره تلاش کنید.');
          }
        } else {
          // No code - maybe session already exists
          console.log('🔍 No authorization code, checking for existing session...');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            console.log('✅ Existing session found');
            await handleUserSession(session);
          } else {
            setError('کد احراز هویت یافت نشد');
          }
        }
      } catch (error: any) {
        console.error('💥 Unexpected error in completeAuth:', error);
        setError('خطای غیرمنتظره. لطفاً دوباره تلاش کنید.');
      } finally {
        setIsLoading(false);
      }
    };

    const handleUserSession = async (session: any) => {
      try {
        if (!session.user) {
          setError('اطلاعات کاربر یافت نشد');
          return;
        }

        console.log('✅ OAuth user authenticated:', session.user.id);
        console.log('User email:', session.user.email);

        // Clear PKCE state after successful authentication
        clearPKCEState();

        // Check if user is a teacher using API endpoint (bypasses RLS issues)
        console.log('🔍 Checking if user is a teacher...');
        console.log('🔍 User ID to check:', session.user.id);
        console.log('🔍 User email:', session.user.email);
        
        try {
          const response = await fetch(`/api/teacher-profile?user_id=${session.user.id}&email=${session.user.email}`);
          
          if (response.ok) {
            const { teacher } = await response.json();
            console.log('✅ Teacher found:', teacher);
            
            if (teacher.status === 'active' || teacher.status === 'Approved') {
              console.log("✅ Teacher is approved - redirecting to teacher dashboard");
              toast({
                title: "ورود موفقیت‌آمیز",
                description: "در حال انتقال به پنل معلم...",
              });
              router.push('/dashboard/teacher');
              return;
            } else {
              console.log("⚠️ Teacher not approved:", teacher.status);
              setError(`حساب کاربری معلم شما هنوز تایید نشده است. وضعیت فعلی: ${teacher.status}. لطفاً منتظر تایید ادمین باشید.`);
              return;
            }
          } else if (response.status === 404) {
            console.log('ℹ️ User is not a teacher, continuing to profile completion...');
          } else {
            console.error('❌ Teacher check failed:', response.status);
          }
        } catch (error) {
          console.error('💥 Teacher check error:', error);
          console.log('⚠️ Teacher check failed, continuing to student check...');
        }

        // Check if user has a student profile
        try {
          console.log('🔍 Checking student profile for user:', session.user.id, session.user.email);
          
          const response = await fetch(`/api/student-profile?user_id=${session.user.id}&email=${session.user.email}`);
          
          if (response.ok) {
            const result = await response.json();
            const student = result.student;
            console.log('✅ Student profile found:', student);
            
            if (student.status === 'active') {
              console.log("✅ OAuth user is active student, redirecting to dashboard");
              toast({
                title: "ورود موفقیت‌آمیز",
                description: "در حال انتقال به داشبورد دانش‌آموز...",
              });
              const dashboardUrl = await getSmartOAuthRedirectUrl('dashboard/student');
              window.location.href = dashboardUrl;
              return;
            }
          } else if (response.status === 404) {
            console.log('❌ No student profile found');
          }
        } catch (error) {
          console.error('💥 Student check error:', error);
          console.log('⚠️ Student check failed, continuing to profile completion...');
        }

        // If neither teacher nor student, redirect to complete profile
        console.log("ℹ️ User has no teacher or student profile, redirecting to complete profile");
        console.log("🔍 UserType for redirect:", userType);
        
        toast({
          title: "ورود موفقیت‌آمیز",
          description: `لطفاً پروفایل ${userType === 'teacher' ? 'معلم' : 'دانش‌آموز'} خود را تکمیل کنید`,
        });
        
        const redirectUrl = userType 
          ? `/complete-profile?type=${userType}`
          : '/complete-profile';
        
        console.log("🚀 Redirecting to:", redirectUrl);
        const completeProfileUrl = await getSmartOAuthRedirectUrl(redirectUrl.startsWith('/') ? redirectUrl.substring(1) : redirectUrl);
        window.location.href = completeProfileUrl;
      } catch (error: any) {
        console.error('💥 Unexpected error in handleUserSession:', error);
        setError('خطای غیرمنتظره در پردازش ورود. لطفاً دوباره تلاش کنید.');
      }
    };

    completeAuth();
  }, [router, userType, retryCount, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              در حال تکمیل ورود...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              لطفاً صبر کنید تا احراز هویت شما تکمیل شود
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              خطا در ورود
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {error}
            </p>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  setRetryCount(0);
                  setIsLoading(true);
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                تلاش مجدد
              </button>
              <button
                onClick={() => router.push('/login')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                بازگشت به صفحه ورود
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function AuthCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              در حال بارگذاری...
            </h2>
          </div>
        </div>
      </div>
    }>
      <AuthCompleteContent />
    </Suspense>
  );
}
