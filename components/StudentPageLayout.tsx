'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { getSmartOAuthRedirectUrl } from '@/lib/oauth-utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users } from 'lucide-react';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  level: string | null;
  status: string;
}

interface StudentPageLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onStudentLoaded?: (student: Student) => void;
}

export default function StudentPageLayout({ 
  title, 
  description, 
  children, 
  onStudentLoaded 
}: StudentPageLayoutProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User not authenticated:', userError);
          const loginUrl = await getSmartOAuthRedirectUrl('login');
          window.location.href = loginUrl;
          return;
        }

        setCurrentUser({
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata
        });

        // Get student profile using API endpoint
        try {
          console.log('🔍 Fetching student profile for user:', user.id, user.email);
          
          const response = await fetch(`/api/student-profile?user_id=${user.id}&email=${user.email}`);
          
          if (!response.ok) {
            if (response.status === 404) {
              console.log('❌ No student profile found, redirecting to complete profile');
              const profileUrl = await getSmartOAuthRedirectUrl('complete-profile?type=student');
              window.location.href = profileUrl;
              return;
            }
            throw new Error(`Student profile fetch failed: ${response.status}`);
          }
          
          const result = await response.json();
          const studentData = result.student;
          console.log('✅ Student profile loaded:', studentData);
          
          const student: Student = {
            id: studentData.id,
            first_name: studentData.first_name || 'کاربر',
            last_name: studentData.last_name || 'جدید',
            email: studentData.email,
            avatar: studentData.avatar,
            level: studentData.current_language_level || studentData.level || 'مبتدی',
            status: studentData.status || 'active'
          };
          
          setUserProfile(student);
          
          // Notify parent component
          if (onStudentLoaded) {
            onStudentLoaded(student);
          }
          
        } catch (error) {
          console.error('💥 Student profile fetch error:', error);
          const profileUrl = await getSmartOAuthRedirectUrl('complete-profile?type=student');
          window.location.href = profileUrl;
          return;
        }

      } catch (error) {
        console.error('Error initializing page:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [router, onStudentLoaded]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">لطفاً صبر کنید...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">دانش‌آموز یافت نشد</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">لطفا ابتدا ثبت‌نام کنید</p>
            <Button 
              onClick={() => router.push('/dashboard/student')}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            >
              بازگشت
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/student')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت به داشبورد
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={userProfile.avatar || ''} alt={`${userProfile.first_name} ${userProfile.last_name}`} />
                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  {userProfile.first_name[0]}{userProfile.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {userProfile.first_name} {userProfile.last_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{userProfile.level}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

// Export student type for use in other components
export type { Student };
