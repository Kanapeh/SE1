'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft,
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Clock,
  Calendar,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Zap,
  Heart,
  Smile,
  Frown,
  Meh,
  BookOpen,
  Users,
  MessageCircle,
  Headphones,
  PenTool,
  Globe,
  Languages,
  Award,
  Trophy,
  Crown,
  Flame,
  Sparkles,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Lightbulb as LightbulbIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  XCircle as XCircleIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Settings as SettingsIcon,
  BarChart3 as BarChart3Icon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity as ActivityIcon,
  Zap as ZapIcon,
  Heart as HeartIcon,
  Smile as SmileIcon,
  Frown as FrownIcon,
  Meh as MehIcon,
  BookOpen as BookOpenIcon,
  Users as UsersIcon,
  MessageCircle as MessageCircleIcon,
  Headphones as HeadphonesIcon,
  PenTool as PenToolIcon,
  Globe as GlobeIcon,
  Languages as LanguagesIcon,
  Award as AwardIcon,
  Trophy as TrophyIcon,
  Crown as CrownIcon,
  Flame as FireIcon,
  Zap as LightningIcon,
  Sparkles as SparklesIcon
} from 'lucide-react';

interface PersonalizedStats {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  preferredTime: string;
  studyDuration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  focus: number;
  motivation: number;
  energy: number;
  totalSessions: number;
  averageScore: number;
  improvementRate: number;
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'long-term';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
  isDynamic: boolean;
}

interface PersonalizedRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'exercise' | 'practice' | 'review' | 'challenge';
  reason: string;
  confidence: number;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  isRecommended: boolean;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalLessons: number;
  completedLessons: number;
  estimatedDuration: number;
  currentLesson: number;
  progress: number;
  isCustom: boolean;
  lessons: PathLesson[];
}

interface PathLesson {
  id: string;
  title: string;
  type: 'grammar' | 'vocabulary' | 'conversation' | 'listening' | 'reading' | 'writing';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isCompleted: boolean;
  isRecommended: boolean;
  score?: number;
}

interface StudyPreference {
  id: string;
  category: string;
  setting: string;
  value: boolean | string | number;
  description: string;
}

export default function PersonalizedPage() {
  const router = useRouter();
  const [stats, setStats] = useState<PersonalizedStats | null>(null);
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [preferences, setPreferences] = useState<StudyPreference[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock personalized stats
    const mockStats: PersonalizedStats = {
      learningStyle: 'visual',
      preferredTime: '18:00',
      studyDuration: 45,
      difficulty: 'medium',
      focus: 85,
      motivation: 92,
      energy: 78,
      totalSessions: 47,
      averageScore: 87,
      improvementRate: 12
    };

    // Mock learning goals
    const mockGoals: LearningGoal[] = [
      {
        id: 'goal-1',
        title: 'تمرین روزانه',
        description: '30 دقیقه مطالعه روزانه',
        type: 'daily',
        target: 30,
        current: 25,
        unit: 'دقیقه',
        deadline: '2024-01-16',
        priority: 'high',
        isCompleted: false,
        isDynamic: true
      },
      {
        id: 'goal-2',
        title: 'واژگان جدید',
        description: 'یادگیری 50 کلمه جدید',
        type: 'weekly',
        target: 50,
        current: 35,
        unit: 'کلمه',
        deadline: '2024-01-21',
        priority: 'medium',
        isCompleted: false,
        isDynamic: false
      },
      {
        id: 'goal-3',
        title: 'سطح B2',
        description: 'رسیدن به سطح B2 تا پایان ماه',
        type: 'monthly',
        target: 100,
        current: 75,
        unit: '%',
        deadline: '2024-01-31',
        priority: 'high',
        isCompleted: false,
        isDynamic: true
      }
    ];

    // Mock personalized recommendations
    const mockRecommendations: PersonalizedRecommendation[] = [
      {
        id: 'rec-1',
        title: 'زمان‌های پیچیده',
        description: 'تمرین روی زمان‌های گذشته کامل و آینده کامل',
        type: 'lesson',
        reason: 'بر اساس تحلیل، شما در این بخش نیاز به تمرین بیشتری دارید',
        confidence: 95,
        estimatedTime: 45,
        difficulty: 'medium',
        tags: ['گرامر', 'زمان‌ها', 'پیشرفته'],
        isRecommended: true
      },
      {
        id: 'rec-2',
        title: 'مکالمه با لهجه آمریکایی',
        description: 'تمرین تلفظ و لهجه آمریکایی',
        type: 'practice',
        reason: 'شما علاقه‌مند به لهجه آمریکایی هستید',
        confidence: 88,
        estimatedTime: 30,
        difficulty: 'easy',
        tags: ['مکالمه', 'لهجه', 'تلفظ'],
        isRecommended: true
      }
    ];

    // Mock learning paths
    const mockLearningPaths: LearningPath[] = [
      {
        id: 'path-1',
        name: 'مسیر مکالمه حرفه‌ای',
        description: 'مسیر سفارشی برای بهبود مهارت مکالمه',
        level: 'intermediate',
        totalLessons: 20,
        completedLessons: 12,
        estimatedDuration: 30,
        currentLesson: 13,
        progress: 60,
        isCustom: true,
        lessons: [
          {
            id: 'lesson-1',
            title: 'مکالمه روزمره',
            type: 'conversation',
            duration: 30,
            difficulty: 'easy',
            isCompleted: true,
            isRecommended: false,
            score: 85
          },
          {
            id: 'lesson-2',
            title: 'واژگان تجاری',
            type: 'vocabulary',
            duration: 45,
            difficulty: 'medium',
            isCompleted: false,
            isRecommended: true
          }
        ]
      }
    ];

    // Mock study preferences
    const mockPreferences: StudyPreference[] = [
      {
        id: 'pref-1',
        category: 'زمان مطالعه',
        setting: 'زمان ترجیحی',
        value: '18:00',
        description: 'زمانی که بیشترین تمرکز را دارید'
      },
      {
        id: 'pref-2',
        category: 'مدت مطالعه',
        setting: 'مدت جلسه',
        value: 45,
        description: 'مدت زمان بهینه برای هر جلسه مطالعه'
      },
      {
        id: 'pref-3',
        category: 'سطح دشواری',
        setting: 'سطح پیشنهادی',
        value: 'medium',
        description: 'سطح دشواری مناسب برای شما'
      },
      {
        id: 'pref-4',
        category: 'یادآوری',
        setting: 'یادآوری هوشمند',
        value: true,
        description: 'دریافت یادآوری در بهترین زمان'
      }
    ];

    setStats(mockStats);
    setGoals(mockGoals);
    setRecommendations(mockRecommendations);
    setLearningPaths(mockLearningPaths);
    setPreferences(mockPreferences);
    setLoading(false);
  }, []);

  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return <Eye className="w-5 h-5" />;
      case 'auditory': return <Headphones className="w-5 h-5" />;
      case 'kinesthetic': return <PenTool className="w-5 h-5" />;
      case 'reading': return <BookOpen className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getLearningStyleColor = (style: string) => {
    switch (style) {
      case 'visual': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'auditory': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'kinesthetic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'reading': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">سیستم شخصی‌سازی در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  یادگیری شخصی‌سازی شده
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  تجربه یادگیری منحصر به فرد برای شما
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                تنظیمات
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Personalized Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">سبک یادگیری</p>
                  <p className="text-2xl font-bold">
                    {stats?.learningStyle === 'visual' ? 'بصری' :
                     stats?.learningStyle === 'auditory' ? 'شنیداری' :
                     stats?.learningStyle === 'kinesthetic' ? 'حرکتی' : 'خواندن'}
                  </p>
                  <p className="text-indigo-100 text-sm">شما</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  {getLearningStyleIcon(stats?.learningStyle || 'visual')}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">انگیزه</p>
                  <p className="text-2xl font-bold">{stats?.motivation}%</p>
                  <p className="text-purple-100 text-sm">بالا</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Heart className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-red-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">تمرکز</p>
                  <p className="text-2xl font-bold">{stats?.focus}%</p>
                  <p className="text-pink-100 text-sm">عالی</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Target className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">نرخ بهبود</p>
                  <p className="text-2xl font-bold">+{stats?.improvementRate}%</p>
                  <p className="text-green-100 text-sm">این ماه</p>
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
          <TabsList className="grid w-full grid-cols-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              نمای کلی
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              اهداف
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              توصیه‌ها
            </TabsTrigger>
            <TabsTrigger value="paths" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              مسیرها
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              ترجیحات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Profile */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    پروفایل یادگیری
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">سبک یادگیری:</span>
                      <Badge className={getLearningStyleColor(stats?.learningStyle || 'visual')}>
                        {stats?.learningStyle === 'visual' ? 'بصری' :
                         stats?.learningStyle === 'auditory' ? 'شنیداری' :
                         stats?.learningStyle === 'kinesthetic' ? 'حرکتی' : 'خواندن'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">زمان ترجیحی:</span>
                      <span className="text-sm font-medium">{stats?.preferredTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">مدت مطالعه:</span>
                      <span className="text-sm font-medium">{stats?.studyDuration} دقیقه</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">سطح دشواری:</span>
                      <Badge className={getDifficultyColor(stats?.difficulty || 'medium')}>
                        {stats?.difficulty === 'easy' ? 'آسان' :
                         stats?.difficulty === 'medium' ? 'متوسط' : 'سخت'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">انرژی</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{stats?.energy}%</span>
                      </div>
                      <Progress value={stats?.energy || 0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">تمرکز</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{stats?.focus}%</span>
                      </div>
                      <Progress value={stats?.focus || 0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">انگیزه</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{stats?.motivation}%</span>
                      </div>
                      <Progress value={stats?.motivation || 0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    آمار سریع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats?.totalSessions}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">جلسات</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats?.averageScore}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">میانگین</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        +{stats?.improvementRate}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">بهبود</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {goals.filter(g => g.isCompleted).length}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">اهداف</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">اهداف یادگیری</h2>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                هدف جدید
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <Card key={goal.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        {goal.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                        {goal.isDynamic && (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                            پویا
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{goal.description}</p>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">پیشرفت</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>مهلت: {new Date(goal.deadline).toLocaleDateString('fa-IR')}</span>
                      <span>{goal.type}</span>
                    </div>
                    
                    <Button 
                      className="w-full"
                      disabled={goal.isCompleted}
                    >
                      {goal.isCompleted ? 'تکمیل شده' : 'به‌روزرسانی پیشرفت'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">توصیه‌های شخصی</h2>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                <Lightbulb className="w-4 h-4 mr-2" />
                به‌روزرسانی
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        {recommendation.title}
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {recommendation.confidence}% اطمینان
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{recommendation.description}</p>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">دلیل توصیه:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{recommendation.reason}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {recommendation.estimatedTime} دقیقه
                        </span>
                      </div>
                      <Badge className={getDifficultyColor(recommendation.difficulty)}>
                        {recommendation.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {recommendation.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full">
                      شروع یادگیری
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="paths" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">مسیرهای یادگیری</h2>
              <Button className="bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                مسیر جدید
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {learningPaths.map((path) => (
                <Card key={path.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {path.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(path.level)}>
                          {path.level}
                        </Badge>
                        {path.isCustom && (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                            سفارشی
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{path.description}</p>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">پیشرفت</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {path.completedLessons}/{path.totalLessons} درس
                        </span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="font-bold text-blue-600 dark:text-blue-400">
                          {path.estimatedDuration}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">ساعت تخمینی</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="font-bold text-green-600 dark:text-green-400">
                          {path.currentLesson}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">درس فعلی</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">درس‌های بعدی:</h4>
                      {path.lessons.slice(path.currentLesson - 1, path.currentLesson + 2).map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{lesson.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.duration} دقیقه</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(lesson.difficulty)}>
                              {lesson.difficulty}
                            </Badge>
                            {lesson.isRecommended && (
                              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                پیشنهادی
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full">
                      ادامه مسیر
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">ترجیحات مطالعه</h2>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                <Settings className="w-4 h-4 mr-2" />
                ذخیره تغییرات
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {preferences.map((preference) => (
                <Card key={preference.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      {preference.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{preference.setting}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{preference.description}</p>
                      
                      {typeof preference.value === 'boolean' ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">فعال</span>
                          <Switch checked={preference.value as boolean} />
                        </div>
                      ) : typeof preference.value === 'string' ? (
                        <Input 
                          value={preference.value as string}
                          placeholder="مقدار را وارد کنید"
                        />
                      ) : (
                        <Input 
                          type="number"
                          value={preference.value as number}
                          placeholder="عدد را وارد کنید"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 