// BACKUP: اگر مشکل ادامه داشت این را rename کنید به page.tsx
'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
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
  
  const userType = searchParams.get('user_type') || searchParams.get('type') || 'student';
  const code = searchParams.get('code');
  
  // Debug URL parameters
  console.log('🔍 Auth Complete Debug Info:');
  console.log('User Type from URL (user_type):', searchParams.get('user_type'));
  console.log('User Type from URL (type):', searchParams.get('type'));
  console.log('Final User Type:', userType);
  console.log('Authorization Code:', code ? 'Present' : 'Missing');
  console.log('All URL params:', Object.fromEntries(searchParams.entries()));
  const { toast } = useToast();

  const notifyOwner = useCallback(async (details: {
    email: string;
    fullName?: string;
    userType: string;
    metadata?: Record<string, unknown>;
  }): Promise<boolean> => {
    try {
      const response = await fetch('/api/owner-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn('Owner notification failed:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Owner notification error:', error);
      return false;
    }
  }, []);
  
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
          
          // Use auth state listener approach (more reliable for PKCE)
          console.log('⏳ Waiting for auth state change...');
          
          return new Promise((resolve) => {
            let resolved = false;
            let timeoutId: NodeJS.Timeout;
            
            // Set up auth state change listener
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
              async (event, session) => {
                console.log(`🔄 Auth state change: ${event}`);
                
                if (event === 'SIGNED_IN' && session && !resolved) {
                  resolved = true;
                  clearTimeout(timeoutId);
                  subscription?.unsubscribe();
                  console.log('✅ User signed in successfully');
                  await handleUserSession(session);
                  resolve(undefined);
                }
              }
            );
            
            // Also check for existing session (in case auth state change doesn't fire)
            const checkSession = async () => {
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session && !resolved) {
                  resolved = true;
                  clearTimeout(timeoutId);
                  subscription?.unsubscribe();
                  console.log('✅ Session found via direct check');
                  await handleUserSession(session);
                  resolve(undefined);
                }
              } catch (error) {
                console.error('❌ Session check failed:', error);
              }
            };
            
            // Check immediately and then every 500ms
            checkSession();
            const intervalId = setInterval(checkSession, 500);
            
            // Timeout after 10 seconds (increased for better reliability)
            timeoutId = setTimeout(() => {
              if (!resolved) {
                resolved = true;
                clearInterval(intervalId);
                subscription?.unsubscribe();
                console.log('❌ Auth timeout - no session found');
                setError('Authentication timeout - please try again');
                // Redirect to login page instead of showing error
                setTimeout(() => {
                  router.push('/login?error=oauth_timeout');
                }, 2000);
                resolve(undefined);
              }
            }, 10000);
            
            // Clean up interval when resolved
            const originalResolve = resolve;
            resolve = (value: any) => {
              clearInterval(intervalId);
              originalResolve(value);
            };
          });
        } else {
          // No code - maybe session already exists
          console.log('🔍 No authorization code, checking for existing session...');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            console.log('✅ Existing session found');
            await handleUserSession(session);
          } else {
            console.log('❌ No session found, redirecting to login');
            setError('کد احراز هویت یافت نشد');
            // Redirect to login page
            setTimeout(() => {
              router.push('/login?error=no_code');
            }, 2000);
          }
        }
      } catch (error: any) {
        console.error('💥 Unexpected error in completeAuth:', error);
        setError('خطای غیرمنتظره. لطفاً دوباره تلاش کنید.');
        // Redirect to login page on error
        setTimeout(() => {
          router.push('/login?error=unexpected_error');
        }, 3000);
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

        const notificationKey = session.user?.id
          ? `owner-notified-${session.user.id}`
          : null;
        const hasNotificationFlag =
          notificationKey && typeof window !== 'undefined'
            ? window.localStorage.getItem(notificationKey) === 'true'
            : false;

        // Clear PKCE state after successful authentication
        clearPKCEState();

        // Show progress message
        toast({
          title: "در حال بررسی پروفایل...",
          description: "لطفاً کمی صبر کنید",
        });

        // Check profiles simultaneously for better performance
        console.log('🔍 Checking for existing profiles...');
        const [teacherResponse, studentResponse] = await Promise.allSettled([
          fetch(`/api/teacher-profile?user_id=${session.user.id}&email=${encodeURIComponent(session.user.email || '')}`),
          fetch(`/api/student-profile?user_id=${session.user.id}&email=${encodeURIComponent(session.user.email || '')}`)
        ]);

        console.log('📊 Profile check results:', {
          teacher: teacherResponse.status,
          teacherOk: teacherResponse.status === 'fulfilled' ? teacherResponse.value.ok : false,
          student: studentResponse.status,
          studentOk: studentResponse.status === 'fulfilled' ? studentResponse.value.ok : false
        });

        // Check teacher profile
        if (teacherResponse.status === 'fulfilled' && teacherResponse.value.ok) {
          try {
            const { teacher } = await teacherResponse.value.json();
            console.log('✅ Teacher profile found:', teacher);
            
            if (teacher && teacher.id) {
              if (teacher.status === 'active' || teacher.status === 'Approved') {
                console.log("✅ Redirecting to teacher dashboard");
                toast({
                  title: "خوش آمدید!",
                  description: `سلام ${teacher.first_name || 'معلم'}، به پنل معلم خود خوش آمدید`,
                });
                
            // Use window.location.href for reliable redirect
            window.location.href = '/dashboard/teacher';
            return;
              } else {
                console.log("⚠️ Teacher not approved:", teacher.status);
                setError(`حساب کاربری معلم شما هنوز تایید نشده است. وضعیت فعلی: ${teacher.status}. لطفاً منتظر تایید ادمین باشید.`);
                // Still redirect to complete profile to allow updates
                setTimeout(() => {
                  window.location.href = `/complete-profile?type=teacher`;
                }, 3000);
                return;
              }
            }
          } catch (parseError) {
            console.error('❌ Error parsing teacher response:', parseError);
          }
        } else {
          console.log('ℹ️ No teacher profile found');
        }

        // Check student profile
        if (studentResponse.status === 'fulfilled' && studentResponse.value.ok) {
          try {
            const result = await studentResponse.value.json();
            const student = result.student;
            console.log('✅ Student profile found:', student);
            
            if (student && student.id) {
              if (student.status === 'active') {
                console.log("✅ Redirecting to student dashboard");
                toast({
                  title: "خوش آمدید!",
                  description: `سلام ${student.first_name || 'دانشجو'}، به داشبورد خود خوش آمدید`,
                });
                
            // Use window.location.href for reliable redirect
            window.location.href = '/dashboard/student';
            return;
              } else {
                console.log("⚠️ Student not active:", student.status);
                // Student exists but not active - redirect to complete profile
                const userTypeFromMetadata = session.user.user_metadata?.user_type || 'student';
                window.location.href = `/complete-profile?type=${userTypeFromMetadata}`;
                return;
              }
            }
          } catch (parseError) {
            console.error('❌ Error parsing student response:', parseError);
          }
        } else {
          console.log('ℹ️ No student profile found');
        }

        // No profile found - redirect to complete profile
        console.log("ℹ️ No active profile found, redirecting to complete profile");
        console.log("📋 Session user metadata:", session.user.user_metadata);
        console.log("📋 Session user app metadata:", session.user.app_metadata);

        // Priority order for userType:
        // 1. user_metadata.user_type (source of truth - stored in Supabase)
        // 2. URL params (from callback or registration)
        // 3. sessionStorage (backup - might be cleared)
        // 4. Check if user email matches any existing teacher/student (by email)
        // 5. default to student
        const userTypeFromMetadata = session.user.user_metadata?.user_type;
        const userTypeFromParams = userType;
        const userTypeFromStorage = typeof window !== 'undefined' ? sessionStorage.getItem('userType') : null;
        
        // Try to detect userType by checking if email exists in teachers or students table
        let detectedUserType: string | null = null;
        if (session.user.email) {
          try {
            // Quick check: if teacher response had any data (even if not ok), user might be teacher
            if (teacherResponse.status === 'fulfilled') {
              const teacherData = await teacherResponse.value.json().catch(() => null);
              if (teacherData?.teacher?.id) {
                detectedUserType = 'teacher';
                console.log('🔍 Detected userType as teacher from API response');
              }
            }
            // Quick check: if student response had any data (even if not ok), user might be student
            if (!detectedUserType && studentResponse.status === 'fulfilled') {
              const studentData = await studentResponse.value.json().catch(() => null);
              if (studentData?.student?.id) {
                detectedUserType = 'student';
                console.log('🔍 Detected userType as student from API response');
              }
            }
          } catch (detectError) {
            console.error('Error detecting userType:', detectError);
          }
        }
        
        const finalUserType = userTypeFromMetadata || userTypeFromParams || userTypeFromStorage || detectedUserType || 'student';

        console.log('🔍 User type detection:', {
          metadata: userTypeFromMetadata,
          params: userTypeFromParams,
          storage: userTypeFromStorage,
          detected: detectedUserType,
          final: finalUserType
        });

        // Save userType to sessionStorage for future use (backup)
        if (finalUserType && typeof window !== 'undefined') {
          sessionStorage.setItem('userType', finalUserType);
          sessionStorage.setItem('userEmail', session.user.email || '');
        }
        
        // If user_metadata doesn't have user_type, update it
        if (!userTypeFromMetadata && finalUserType) {
          try {
            await supabase.auth.updateUser({
              data: { user_type: finalUserType }
            });
            console.log('✅ Updated user_metadata with user_type:', finalUserType);
          } catch (updateError) {
            console.error('Error updating user_metadata:', updateError);
          }
        }

        if (!hasNotificationFlag && session.user.email) {
          const ownerNotified = await notifyOwner({
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name,
            userType: finalUserType,
            metadata: {
              provider: session.user.app_metadata?.provider || 'unknown',
              reason: 'missing-profile',
              source: 'auth-complete',
            },
          });

          if (ownerNotified && notificationKey && typeof window !== 'undefined') {
            window.localStorage.setItem(notificationKey, 'true');
          }
        }
        
        toast({
          title: "تکمیل پروفایل",
          description: `لطفاً پروفایل ${finalUserType === 'teacher' ? 'معلم' : 'دانش‌آموز'} خود را تکمیل کنید`,
        });
        
        // Use window.location.href for reliable redirect
        const redirectPath = `/complete-profile?type=${finalUserType}`;
        console.log('🔄 Redirecting to complete profile:', redirectPath);
        console.log('🔄 Full redirect URL:', `${window.location.origin}${redirectPath}`);
        
        // Force redirect using window.location.href
        window.location.href = redirectPath;
      } catch (error: any) {
        console.error('💥 Unexpected error in handleUserSession:', error);
        setError('خطای غیرمنتظره در پردازش ورود. لطفاً دوباره تلاش کنید.');
        // Redirect to login page on error
        setTimeout(() => {
          router.push('/login?error=session_error');
        }, 3000);
      }
    };

    completeAuth();
  }, [router, userType, retryCount, toast, notifyOwner]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            {/* Enhanced loading animation */}
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              تکمیل ورود
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              در حال بررسی اطلاعات شما...
            </p>
            
            {/* Progress steps */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">احراز هویت</span>
              </div>
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-xs text-gray-400">بررسی پروفایل</span>
              </div>
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-xs text-gray-400">هدایت به داشبورد</span>
              </div>
            </div>
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
