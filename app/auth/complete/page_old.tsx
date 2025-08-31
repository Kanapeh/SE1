'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, clearPKCEState } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
        console.log('Retry count:', retryCount);
        console.log('Authorization code:', code ? 'Present' : 'Missing');
        
        // Check for OAuth errors in URL
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        const errorCode = urlParams.get('error_code');
        
        if (error) {
          console.error('🚨 OAuth Error detected:', { error, errorCode, errorDescription });
          if (error === 'server_error' && errorCode === 'flow_state_not_found') {
            setError('مشکل در تنظیمات OAuth. لطفاً مجدد تلاش کنید و اطمینان حاصل کنید که redirect URL در Google Console درست است.');
            return;
          }
          setError(`خطای OAuth: ${errorDescription || error}`);
          return;
        }
        
        // Skip health checks - go directly to PKCE flow
        console.log('⚡ Skipping health checks - proceeding directly to OAuth...');
        
        // If we have an authorization code, exchange it for a session
        if (code) {
          console.log('🔄 Exchanging authorization code for session...');
          
          // Wait a bit to ensure PKCE state is properly established
          await new Promise(resolve => setTimeout(resolve, 500));
          
          try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            
            if (exchangeError) {
              console.error('❌ Code exchange error:', exchangeError);
              
              // Handle specific PKCE errors
              if (exchangeError.message.includes('code verifier') || 
                  exchangeError.message.includes('non-empty') ||
                  exchangeError.message.includes('invalid request')) {
                
                console.log('🔄 PKCE code verifier issue detected, trying alternative approach...');
                
                // Try to get the session directly (PKCE might have already handled it)
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) {
                  console.error('❌ Session retrieval error:', sessionError);
                  throw new Error(`خطا در دریافت جلسه: ${sessionError.message}`);
                }
                
                if (sessionData.session) {
                  console.log('✅ Session found via direct retrieval');
                  await handleUserSession(sessionData.session);
                  return;
                }
                
                // If still no session, try auth state change listener
                console.log('🔄 Setting up auth state change listener...');
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                  async (event, session) => {
                    console.log('🔐 Auth state change event:', event);
                    if (event === 'SIGNED_IN' && session) {
                      console.log('✅ Session established via auth state change');
                      await handleUserSession(session);
                      subscription?.unsubscribe();
                    }
                  }
                );
                
                // Wait for auth state change
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Check session again
                const { data: retrySessionData } = await supabase.auth.getSession();
                if (retrySessionData.session) {
                  console.log('✅ Session found after auth state change');
                  await handleUserSession(retrySessionData.session);
                  subscription?.unsubscribe();
                  return;
                }
                
                subscription?.unsubscribe();
                throw new Error('کد احراز هویت منقضی شده یا نامعتبر است. لطفاً دوباره تلاش کنید.');
              }
              
              throw new Error(`خطا در تبادل کد احراز هویت: ${exchangeError.message}`);
            }
            
            if (!data.session) {
              console.error('❌ No session after code exchange');
              throw new Error('جلسه احراز هویت پس از تبادل کد ایجاد نشد');
            }
            
            console.log('✅ Code exchange successful, session established');
            console.log('User ID:', data.session.user.id);
            console.log('User email:', data.session.user.email);
            
            await handleUserSession(data.session);
            return;
          } catch (exchangeError: any) {
            console.error('❌ Exchange attempt failed:', exchangeError);
            
            // If this is a retry, try the fallback approach
            if (retryCount > 0) {
              console.log('🔄 Exchange failed on retry, trying fallback...');
              // Continue to fallback logic below
            } else {
              throw exchangeError;
            }
          }
        }
        
        // Fallback: Wait for PKCE flow to complete and session to be established
        console.log('⏳ Using fallback approach - waiting for PKCE flow to complete...');
        
        if (retryCount === 0) {
          console.log('⏳ Initial wait for PKCE flow...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.log(`⏳ Retry ${retryCount} wait for PKCE flow...`);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        // Get the current session (PKCE flow should have already handled the exchange)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          throw sessionError;
        }

        if (!session) {
          console.error('❌ No session found after PKCE flow');
          
          // Retry logic for PKCE flow - but limit retries
          if (retryCount < 2) {
            console.log(`🔄 Retrying PKCE flow (${retryCount + 1}/3)...`);
            setRetryCount(prev => prev + 1);
            setIsLoading(false);
            return;
          }
          
          // If still no session after retries, try to handle the auth state change
          console.log('🔄 Trying to listen for auth state changes...');
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              console.log('🔐 Auth state change event:', event);
              if (event === 'SIGNED_IN' && session) {
                console.log('✅ Session established via auth state change');
                await handleUserSession(session);
              }
            }
          );
          
          // Wait a bit more for auth state change
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Check session again
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (retrySession) {
            console.log('✅ Session found after retry');
            await handleUserSession(retrySession);
            subscription?.unsubscribe();
            return;
          }
          
          // Clean up subscription
          subscription?.unsubscribe();
          
          setError('جلسه احراز هویت یافت نشد. لطفاً دوباره تلاش کنید.');
          return;
        }

        await handleUserSession(session);

      } catch (error: any) {
        console.error('💥 Auth completion error:', error);
        setError(error.message || 'خطا در تکمیل احراز هویت');
        toast({
          title: "خطا",
          description: "خطا در تکمیل احراز هویت",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    const handleUserSession = async (session: any) => {
      try {
        if (!session.user) {
          console.error('❌ No user data in session');
          setError('اطلاعات کاربر یافت نشد');
          return;
        }

        console.log('✅ OAuth user authenticated via PKCE:', session.user.id);
        console.log('User email:', session.user.email);
        console.log('User metadata:', session.user.app_metadata);
        console.log('User user_metadata:', session.user.user_metadata);

        // Clear PKCE state after successful authentication
        clearPKCEState();

        // TEMPORARILY SKIP ADMIN CHECK DUE TO DATABASE ISSUES
        console.log('⚡ Skipping admin check temporarily...');

        // Check if user has admin role in auth-users table (if it exists)
        console.log('🔍 Checking if auth-users table exists...');
        
        try {
          // First check if the table exists by trying to access it
          const { data: tableTest, error: tableError } = await supabase
            .from("auth-users")
            .select("count")
            .limit(1);
          
          if (tableError) {
            if (tableError.code === '42P01') { // Table doesn't exist
              console.log('ℹ️ Auth-users table does not exist, skipping admin check');
            } else {
              console.log('⚠️ Auth-users table access error (may not exist):', tableError.message);
            }
          } else {
            console.log('✅ Auth-users table is accessible, checking admin status...');
            
            const { data: authUserData, error: authUserError } = await supabase
              .from("auth-users")
              .select("id, role, is_admin")
              .eq("id", session.user.id)
              .single();

            if (authUserError) {
              if (authUserError.code === 'PGRST116') {
                console.log('ℹ️ User not found in auth-users table (this is normal for new users)');
              } else {
                console.log('⚠️ Auth user check error:', authUserError.message);
              }
            } else {
              console.log('✅ Auth user data found:', authUserData);
              
              if (authUserData && (authUserData.role === 'admin' || authUserData.is_admin === true)) {
                console.log("✅ OAuth user is admin by role:", authUserData);
                toast({
                  title: "ورود موفقیت‌آمیز",
                  description: "در حال انتقال به پنل ادمین...",
                });
                router.push('/admin');
                return;
              }
            }
          }
        } catch (error) {
          console.log('ℹ️ Auth-users table check failed, continuing with other checks...');
          // Continue with other checks even if this fails
        }

        // Check if user has a profile in teachers table
        console.log('🔍 Checking teachers table...');
        console.log('🔍 User ID to check:', session.user.id);
        console.log('🔍 User email:', session.user.email);
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("id, status, email, first_name, last_name")
          .eq("id", session.user.id)
          .single();

        if (teacherError && teacherError.code !== 'PGRST116') {
          console.error('❌ Teacher check error:', {
            message: teacherError.message,
            code: teacherError.code,
            details: teacherError.details,
            hint: teacherError.hint
          });
        }

        if (teacherData) {
          console.log('✅ Teacher found in database:', teacherData);
          if (teacherData.status === 'active' || teacherData.status === 'Approved') {
            console.log("✅ OAuth user is active/approved teacher");
            toast({
              title: "ورود موفقیت‌آمیز",
              description: "در حال انتقال به پنل معلم...",
            });
            router.push('/dashboard/teacher');
            return;
          } else {
            console.log("⚠️ OAuth user is inactive teacher, status:", teacherData.status);
            setError(`حساب کاربری معلم شما هنوز تایید نشده است. وضعیت فعلی: ${teacherData.status}. لطفاً منتظر تایید ادمین باشید.`);
            return;
          }
        } else {
          console.log('❌ No teacher profile found for this user');
        }

        // Check if user has a profile in students table
        console.log('🔍 Checking students table...');
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("id, status")
          .eq("id", session.user.id)
          .single();

        if (studentError && studentError.code !== 'PGRST116') {
          console.error('❌ Student check error:', {
            message: studentError.message,
            code: studentError.code,
            details: studentError.details,
            hint: studentError.hint
          });
        }

        if (studentData) {
          if (studentData.status === 'active') {
            console.log("✅ OAuth user is active student");
            toast({
              title: "ورود موفقیت‌آمیز",
              description: "در حال انتقال به داشبورد...",
            });
            router.push('/dashboard');
            return;
          } else {
            console.log("⚠️ OAuth user is inactive student");
            setError('حساب کاربری دانشجو شما غیرفعال است');
            return;
          }
        }

        // User exists in auth but no profile - redirect to complete profile
        console.log("ℹ️ OAuth user has no profile, redirecting to complete profile");
        console.log("🔍 UserType for redirect:", userType);
        console.log("🔍 Redirect URL will be:", userType ? `/complete-profile?type=${userType}` : '/complete-profile');
        
        toast({
          title: "ورود موفقیت‌آمیز",
          description: `لطفاً پروفایل ${userType === 'teacher' ? 'معلم' : 'دانش‌آموز'} خود را تکمیل کنید`,
        });
        
        const redirectUrl = userType 
          ? `/complete-profile?type=${userType}`
          : '/complete-profile';
        
        console.log("🚀 Redirecting to:", redirectUrl);
        router.push(redirectUrl);
      } catch (error: any) {
        console.error('💥 Unexpected error in handleUserSession:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
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
              {retryCount > 0 ? `تلاش ${retryCount + 1}/3` : 'لطفاً صبر کنید تا احراز هویت شما تکمیل شود'}
            </p>
            {retryCount > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                در حال تلاش مجدد برای تکمیل احراز هویت...
              </p>
            )}
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
