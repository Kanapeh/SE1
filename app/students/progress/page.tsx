'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Clock,
  BookOpen,
  Star,
  CheckCircle,
  AlertCircle,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  Trophy,
  Flame,
  Heart,
  Smile,
  Languages,
  GraduationCap,
  Clock3,
  UserCheck,
  CalendarDays,
  Clock4,
  DollarSign,
  TrendingDown,
  BarChart,
  Download,
  MessageCircle,
  Headphones,
  PenTool,
  Target as TargetIcon,
  Award as AwardIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  BookOpen as BookOpenIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Activity as ActivityIcon,
  BarChart3 as BarChart3Icon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Zap as ZapIcon,
  Trophy as TrophyIcon,
  Flame as FlameIcon,
  Heart as HeartIcon,
  Smile as SmileIcon,
  Languages as LanguagesIcon,
  GraduationCap as GraduationCapIcon,
  Clock3 as Clock3Icon,
  UserCheck as UserCheckIcon,
  CalendarDays as CalendarDaysIcon,
  Clock4 as Clock4Icon,
  DollarSign as DollarSignIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon
} from 'lucide-react';

interface ProgressData {
  currentLevel: string;
  nextLevel: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  streak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyGoal: number;
  monthlyProgress: number;
  totalStudyTime: number;
  averageStudyTime: number;
  improvementRate: number;
  accuracyRate: number;
  completionRate: number;
}

interface LessonProgress {
  id: string;
  title: string;
  category: string;
  status: 'completed' | 'in_progress' | 'not_started';
  score: number;
  timeSpent: number;
  completedAt?: string;
}

interface WeeklyProgress {
  week: string;
  lessonsCompleted: number;
  studyTime: number;
  accuracy: number;
  streak: number;
}

interface SkillProgress {
  skill: string;
  currentLevel: number;
  maxLevel: number;
  progress: number;
  description: string;
}

export default function StudentProgressPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [lessons, setLessons] = useState<LessonProgress[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyProgress[]>([]);
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is new (no classes taken yet)
    const isNewUser = true; // This should be fetched from actual user data
    
    if (isNewUser) {
      // Empty progress data for new user
      const emptyProgress: ProgressData = {
        currentLevel: 'مبتدی',
        nextLevel: 'ابتدایی',
        progressPercentage: 0,
        completedLessons: 0,
        totalLessons: 0,
        streak: 0,
        weeklyGoal: 2,
        weeklyProgress: 0,
        monthlyGoal: 8,
        monthlyProgress: 0,
        totalStudyTime: 0,
        averageStudyTime: 0,
        improvementRate: 0,
        accuracyRate: 0,
        completionRate: 0
      };
      setProgress(emptyProgress);
    } else {
      // Mock progress data for existing user
      const existingProgress: ProgressData = {
        currentLevel: 'متوسط',
        nextLevel: 'پیشرفته',
        progressPercentage: 75,
        completedLessons: 15,
        totalLessons: 20,
        streak: 7,
        weeklyGoal: 5,
        weeklyProgress: 3,
        monthlyGoal: 20,
        monthlyProgress: 15,
        totalStudyTime: 45,
        averageStudyTime: 3,
        improvementRate: 85,
        accuracyRate: 92,
        completionRate: 78
      };
      setProgress(existingProgress);
    }

    // Lessons data based on user status
    if (isNewUser) {
      // Empty lessons for new user
      setLessons([]);
    } else {
      // Mock lessons data for existing user
      const mockLessons: LessonProgress[] = [
        {
          id: '1',
          title: 'مکالمه روزمره',
          category: 'مکالمه',
          status: 'completed',
          score: 95,
          timeSpent: 45,
          completedAt: '2024-01-15'
        },
        {
          id: '2',
          title: 'گرامر زمان حال',
          category: 'گرامر',
          status: 'completed',
          score: 88,
          timeSpent: 60,
          completedAt: '2024-01-14'
        },
        {
          id: '3',
          title: 'واژگان تجاری',
          category: 'واژگان',
          status: 'in_progress',
          score: 65,
          timeSpent: 30
        },
        {
          id: '4',
          title: 'شنیداری پیشرفته',
          category: 'شنیداری',
          status: 'not_started',
          score: 0,
          timeSpent: 0
        },
        {
          id: '5',
          title: 'نوشتاری رسمی',
          category: 'نوشتاری',
          status: 'completed',
          score: 92,
          timeSpent: 75,
          completedAt: '2024-01-13'
        }
      ];
      setLessons(mockLessons);
    }

    // Weekly and skills data based on user status
    if (isNewUser) {
      // Empty data for new user
      setWeeklyData([]);
      setSkills([]);
    } else {
      // Mock data for existing user
      const mockWeeklyData: WeeklyProgress[] = [
        { week: 'هفته 1', lessonsCompleted: 3, studyTime: 12, accuracy: 85, streak: 3 },
        { week: 'هفته 2', lessonsCompleted: 4, studyTime: 15, accuracy: 88, streak: 5 },
        { week: 'هفته 3', lessonsCompleted: 5, studyTime: 18, accuracy: 92, streak: 7 },
        { week: 'هفته 4', lessonsCompleted: 3, studyTime: 10, accuracy: 90, streak: 7 }
      ];

      const mockSkills: SkillProgress[] = [
        {
          skill: 'مکالمه',
          currentLevel: 4,
          maxLevel: 5,
          progress: 80,
          description: 'توانایی مکالمه در موقعیت‌های روزمره'
        },
        {
          skill: 'گرامر',
          currentLevel: 3,
          maxLevel: 5,
          progress: 60,
          description: 'درک و استفاده از ساختارهای گرامری'
        },
        {
          skill: 'واژگان',
          currentLevel: 4,
          maxLevel: 5,
          progress: 80,
          description: 'دایره واژگان گسترده و متنوع'
        },
        {
          skill: 'شنیداری',
          currentLevel: 3,
          maxLevel: 5,
          progress: 60,
          description: 'درک گفتار در سرعت‌های مختلف'
        },
        {
          skill: 'نوشتاری',
          currentLevel: 4,
          maxLevel: 5,
          progress: 80,
          description: 'نوشتن متون رسمی و غیررسمی'
        }
      ];
      setWeeklyData(mockWeeklyData);
      setSkills(mockSkills);
    }

    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">تکمیل شده</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">در حال انجام</Badge>;
      case 'not_started':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">شروع نشده</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'مکالمه':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'گرامر':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'واژگان':
        return <Languages className="w-4 h-4 text-purple-500" />;
      case 'شنیداری':
        return <Headphones className="w-4 h-4 text-orange-500" />;
      case 'نوشتاری':
        return <PenTool className="w-4 h-4 text-red-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">پیشرفت شما در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  پیشرفت من
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  پیگیری پیشرفت و دستاوردهای یادگیری
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                دانلود گزارش
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">سطح فعلی</p>
                  <p className="text-2xl font-bold">{progress?.currentLevel}</p>
                  <p className="text-blue-100 text-sm">{progress?.progressPercentage}% تکمیل شده</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <GraduationCap className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">درس‌های تکمیل شده</p>
                  <p className="text-2xl font-bold">{progress?.completedLessons}</p>
                  <p className="text-green-100 text-sm">از {progress?.totalLessons} درس</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">روزهای متوالی</p>
                  <p className="text-2xl font-bold">{progress?.streak}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm text-purple-100">روز مطالعه</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Activity className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">نرخ بهبود</p>
                  <p className="text-2xl font-bold">{progress?.improvementRate}%</p>
                  <p className="text-orange-100 text-sm">در ماه گذشته</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              نمای کلی
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              درس‌ها
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              مهارت‌ها
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              تحلیل‌ها
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Level Progress */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    پیشرفت سطح
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">سطح {progress?.currentLevel}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{progress?.progressPercentage}%</span>
                    </div>
                    <Progress value={progress?.progressPercentage || 0} className="h-3" />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {progress?.completedLessons} از {progress?.totalLessons} درس تکمیل شده
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {progress?.streak}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">روز متوالی</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {progress?.accuracyRate}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">دقت</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Goals */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    اهداف هفتگی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">درس‌های هفته</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {progress?.weeklyProgress}/{progress?.weeklyGoal}
                      </span>
                    </div>
                    <Progress value={(progress?.weeklyProgress || 0) / (progress?.weeklyGoal || 1) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">زمان مطالعه</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {progress?.totalStudyTime} ساعت
                      </span>
                    </div>
                    <Progress value={(progress?.totalStudyTime || 0) / 50 * 100} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {progress?.averageStudyTime}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">ساعت/روز</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {progress?.completionRate}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">تکمیل</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  درس‌های من
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lessons.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">هنوز درسی ندارید</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">برای شروع یادگیری، اولین کلاس خود را رزرو کنید</p>
                    <Button 
                      onClick={() => router.push('/teachers')}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      مشاهده معلمان
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessons.map((lesson) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              {getCategoryIcon(lesson.category)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {lesson.title}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span>{lesson.category}</span>
                                <span>{lesson.timeSpent} دقیقه</span>
                                {lesson.score > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    {lesson.score}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(lesson.status)}
                          </div>
                        </div>
                        
                        {lesson.status === 'in_progress' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">پیشرفت</span>
                              <span className="text-sm font-medium">{lesson.score}%</span>
                            </div>
                            <Progress value={lesson.score} className="h-2" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            {skills.length === 0 ? (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">هنوز مهارتی ندارید</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">با شرکت در کلاس‌ها، مهارت‌های خود را توسعه دهید</p>
                    <Button 
                      onClick={() => router.push('/teachers')}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    >
                      مشاهده معلمان
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {skills.map((skill) => (
                  <Card key={skill.skill} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        {skill.skill}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">سطح {skill.currentLevel} از {skill.maxLevel}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{skill.progress}%</span>
                        </div>
                        <Progress value={skill.progress} className="h-3" />
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {skill.description}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        {[...Array(skill.maxLevel)].map((_, index) => (
                          <div
                            key={index}
                            className={`w-4 h-4 rounded-full ${
                              index < skill.currentLevel
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Chart */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    روند هفتگی
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        نمودار روند هفتگی
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        نمایش پیشرفت در طول هفته
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    آمار عملکرد
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {progress?.accuracyRate}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">دقت کلی</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {progress?.completionRate}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">نرخ تکمیل</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">میانگین امتیاز</span>
                      <span className="text-sm font-medium">4.2/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">کلاس‌های شرکت کرده</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ساعت مطالعه</span>
                      <span className="text-sm font-medium">{progress?.totalStudyTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 