'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { getSmartOAuthRedirectUrl } from '@/lib/oauth-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Brain,
  Users,
  Target,
  Trophy,
  Gamepad2,
  MessageCircle,
  Video,
  BarChart3,
  Gift,
  Sparkles,
  BookOpen,
  Monitor,
  Headphones,
  Globe,
  Calendar,
  Clock,
  Star,
  Heart,
  Zap,
  Award,
  Smile,
  TrendingUp,
  CheckCircle,
  Play,
  Download,
  Mic,
  Camera,
  Share2,
  PenTool
} from 'lucide-react';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  level: string | null;
  status: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  href: string;
  status: 'available' | 'coming_soon' | 'beta';
  category: 'learning' | 'tools' | 'social' | 'analytics';
}

export default function StudentFeaturesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const features: Feature[] = [
    // Learning Features
    {
      id: 'ai-coach',
      title: 'مربی هوشمند',
      description: 'مربی هوش مصنوعی که به شما در یادگیری زبان کمک می‌کند',
      icon: Brain,
      color: 'from-blue-500 to-cyan-600',
      href: '/students/ai-coach',
      status: 'available',
      category: 'learning'
    },
    {
      id: 'interactive',
      title: 'یادگیری تعاملی',
      description: 'روش‌های نوین و تعاملی برای یادگیری بهتر زبان',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      href: '/students/interactive',
      status: 'available',
      category: 'learning'
    },
    {
      id: 'personalized',
      title: 'یادگیری شخصی‌سازی شده',
      description: 'برنامه آموزشی اختصاصی متناسب با نیاز شما',
      icon: Target,
      color: 'from-purple-500 to-violet-600',
      href: '/students/personalized',
      status: 'available',
      category: 'learning'
    },
    {
      id: 'innovative',
      title: 'روش‌های نوآورانه',
      description: 'جدیدترین روش‌های آموزش زبان در جهان',
      icon: Sparkles,
      color: 'from-orange-500 to-red-600',
      href: '/students/innovative',
      status: 'available',
      category: 'learning'
    },
    
    // Tools Features
    {
      id: 'video-call',
      title: 'تماس ویدیویی',
      description: 'کلاس‌های آنلاین با کیفیت HD و ابزارهای تعاملی',
      icon: Video,
      color: 'from-indigo-500 to-blue-600',
      href: '/students/video-call',
      status: 'available',
      category: 'tools'
    },
    {
      id: 'progress',
      title: 'پیگیری پیشرفت',
      description: 'نمودارها و آمار دقیق از پیشرفت یادگیری شما',
      icon: BarChart3,
      color: 'from-teal-500 to-cyan-600',
      href: '/students/progress',
      status: 'available',
      category: 'analytics'
    },
    {
      id: 'profile',
      title: 'مدیریت پروفایل',
      description: 'ویرایش اطلاعات شخصی و تنظیمات حساب کاربری',
      icon: Monitor,
      color: 'from-gray-500 to-slate-600',
      href: '/students/profile',
      status: 'available',
      category: 'tools'
    },
    
    // Social Features
    {
      id: 'social',
      title: 'شبکه اجتماعی',
      description: 'ارتباط با سایر دانش‌آموزان و تبادل تجربه',
      icon: MessageCircle,
      color: 'from-pink-500 to-rose-600',
      href: '/students/social',
      status: 'available',
      category: 'social'
    },
    
    // Gamification Features
    {
      id: 'gamification',
      title: 'بازی‌سازی',
      description: 'یادگیری از طریق بازی و چالش‌های جذاب',
      icon: Gamepad2,
      color: 'from-yellow-500 to-orange-600',
      href: '/students/gamification',
      status: 'available',
      category: 'learning'
    },
    {
      id: 'rewards',
      title: 'سیستم پاداش',
      description: 'کسب امتیاز و جوایز در ازای یادگیری و فعالیت',
      icon: Gift,
      color: 'from-emerald-500 to-teal-600',
      href: '/students/rewards',
      status: 'available',
      category: 'learning'
    },
    
    // Payment Features
    {
      id: 'payments',
      title: 'مدیریت پرداخت‌ها',
      description: 'تاریخچه پرداخت‌ها و رزرو کلاس‌های جدید',
      icon: Trophy,
      color: 'from-amber-500 to-yellow-600',
      href: '/students/payments',
      status: 'available',
      category: 'tools'
    }
  ];

  const categories = [
    { id: 'all', name: 'همه امکانات', icon: Sparkles },
    { id: 'learning', name: 'یادگیری', icon: BookOpen },
    { id: 'tools', name: 'ابزارها', icon: Monitor },
    { id: 'social', name: 'اجتماعی', icon: Users },
    { id: 'analytics', name: 'آمار', icon: BarChart3 }
  ];

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
          
          setUserProfile({
            id: studentData.id,
            first_name: studentData.first_name || 'کاربر',
            last_name: studentData.last_name || 'جدید',
            email: studentData.email,
            avatar: studentData.avatar,
            level: studentData.current_language_level || 'مبتدی',
            status: studentData.status || 'active'
          });
          
        } catch (error) {
          console.error('💥 Student profile fetch error:', error);
          const profileUrl = await getSmartOAuthRedirectUrl('complete-profile?type=student');
          window.location.href = profileUrl;
          return;
        }

      } catch (error) {
        console.error('Error initializing features page:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [router]);

  const handleNavigation = (href: string, title: string) => {
    console.log(`🚀 Navigating to ${title}: ${href}`);
    router.push(href);
  };

  const getStatusBadge = (status: Feature['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">فعال</Badge>;
      case 'beta':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">آزمایشی</Badge>;
      case 'coming_soon':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">به‌زودی</Badge>;
      default:
        return null;
    }
  };

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">امکانات در حال آماده‌سازی است...</p>
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
                  امکانات دانش‌آموزان
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  همه امکانات و ابزارهای یادگیری در دسترس شما
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

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 ${
                  selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' 
                    : ''
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <Button
                    onClick={() => handleNavigation(feature.href, feature.title)}
                    disabled={feature.status === 'coming_soon'}
                    className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-white font-medium ${
                      feature.status === 'coming_soon' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {feature.status === 'coming_soon' ? 'به زودی' : 'شروع'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {features.filter(f => f.status === 'available').length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">امکانات فعال</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {features.filter(f => f.status === 'beta').length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">امکانات آزمایشی</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {features.filter(f => f.status === 'coming_soon').length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">امکانات آینده</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
