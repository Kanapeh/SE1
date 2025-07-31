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
  Bell,
  Moon,
  Sun,
  Clock,
  Calendar,
  Brain,
  Heart,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
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
  Zap,
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
  Fire,
  Lightning,
  Sparkles,
  Coffee,
  Bed,
  Sunrise,
  Sunset,
  Cloud,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  Brain as BrainIcon,
  Heart as HeartIcon,
  Activity as ActivityIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Target as TargetIcon,
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
  Zap as ZapIcon,
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
  Fire as FireIcon,
  Lightning as LightningIcon,
  Sparkles as SparklesIcon,
  Coffee as CoffeeIcon,
  Bed as BedIcon,
  Sunrise as SunriseIcon,
  Sunset as SunsetIcon,
  Cloud as CloudIcon,
  CloudRain as CloudRainIcon,
  Wind as WindIcon,
  Thermometer as ThermometerIcon,
  Droplets as DropletsIcon
} from 'lucide-react';

interface SmartReminder {
  id: string;
  title: string;
  description: string;
  type: 'study' | 'break' | 'review' | 'goal' | 'motivation';
  time: string;
  isActive: boolean;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface SleepAnalysis {
  date: string;
  sleepHours: number;
  sleepQuality: number;
  deepSleep: number;
  remSleep: number;
  wakeTime: string;
  bedTime: string;
  learningEfficiency: number;
  mood: 'excellent' | 'good' | 'average' | 'poor';
  recommendations: string[];
}

interface MotivationMessage {
  id: string;
  message: string;
  type: 'achievement' | 'encouragement' | 'challenge' | 'inspiration';
  mood: 'happy' | 'neutral' | 'motivated' | 'focused';
  isRead: boolean;
  timestamp: Date;
  action?: string;
}

interface LearningCalendar {
  date: string;
  events: CalendarEvent[];
  studyHours: number;
  breaks: number;
  productivity: number;
  mood: 'excellent' | 'good' | 'average' | 'poor';
  weather: WeatherData;
}

interface CalendarEvent {
  id: string;
  title: string;
  type: 'lesson' | 'practice' | 'review' | 'break' | 'goal';
  startTime: string;
  endTime: string;
  duration: number;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy';
  temperature: number;
  humidity: number;
  impact: 'positive' | 'neutral' | 'negative';
}

interface InnovativeStats {
  totalReminders: number;
  completedReminders: number;
  averageSleepHours: number;
  sleepQuality: number;
  motivationLevel: number;
  productivityScore: number;
  weatherImpact: number;
  learningStreak: number;
}

export default function InnovativePage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [sleepData, setSleepData] = useState<SleepAnalysis[]>([]);
  const [motivations, setMotivations] = useState<MotivationMessage[]>([]);
  const [calendar, setCalendar] = useState<LearningCalendar[]>([]);
  const [stats, setStats] = useState<InnovativeStats | null>(null);
  const [activeTab, setActiveTab] = useState('reminders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock smart reminders
    const mockReminders: SmartReminder[] = [
      {
        id: 'rem-1',
        title: 'زمان مطالعه بهینه',
        description: 'بر اساس تحلیل، بهترین زمان مطالعه شما شروع شده',
        type: 'study',
        time: '18:00',
        isActive: true,
        isCompleted: false,
        priority: 'high',
        category: 'زمان‌بندی'
      },
      {
        id: 'rem-2',
        title: 'استراحت کوتاه',
        description: '45 دقیقه مطالعه کرده‌اید، 15 دقیقه استراحت کنید',
        type: 'break',
        time: '18:45',
        isActive: true,
        isCompleted: false,
        priority: 'medium',
        category: 'سلامت'
      },
      {
        id: 'rem-3',
        title: 'مرور واژگان',
        description: 'زمان مرور واژگان آموخته شده در هفته گذشته',
        type: 'review',
        time: '20:00',
        isActive: false,
        isCompleted: false,
        priority: 'low',
        category: 'یادگیری'
      }
    ];

    // Mock sleep analysis
    const mockSleepData: SleepAnalysis[] = [
      {
        date: '2024-01-15',
        sleepHours: 7.5,
        sleepQuality: 85,
        deepSleep: 2.5,
        remSleep: 1.8,
        wakeTime: '07:00',
        bedTime: '23:30',
        learningEfficiency: 92,
        mood: 'excellent',
        recommendations: ['زمان خواب منظم', 'کاهش استفاده از موبایل قبل خواب']
      },
      {
        date: '2024-01-14',
        sleepHours: 6.8,
        sleepQuality: 72,
        deepSleep: 2.0,
        remSleep: 1.5,
        wakeTime: '06:30',
        bedTime: '23:45',
        learningEfficiency: 78,
        mood: 'good',
        recommendations: ['افزایش زمان خواب', 'تمرین تنفس عمیق']
      }
    ];

    // Mock motivation messages
    const mockMotivations: MotivationMessage[] = [
      {
        id: 'mot-1',
        message: 'شما 7 روز متوالی مطالعه کرده‌اید! این روند عالی را ادامه دهید.',
        type: 'achievement',
        mood: 'happy',
        isRead: false,
        timestamp: new Date(Date.now() - 3600000),
        action: 'مشاهده دستاوردها'
      },
      {
        id: 'mot-2',
        message: 'امروز روز خوبی برای یادگیری است. با انرژی شروع کنید!',
        type: 'encouragement',
        mood: 'motivated',
        isRead: true,
        timestamp: new Date(Date.now() - 7200000)
      },
      {
        id: 'mot-3',
        message: 'چالش جدید: 10 کلمه جدید در 30 دقیقه یاد بگیرید',
        type: 'challenge',
        mood: 'focused',
        isRead: false,
        timestamp: new Date(Date.now() - 10800000),
        action: 'شروع چالش'
      }
    ];

    // Mock learning calendar
    const mockCalendar: LearningCalendar[] = [
      {
        date: '2024-01-15',
        events: [
          {
            id: 'ev-1',
            title: 'درس گرامر',
            type: 'lesson',
            startTime: '18:00',
            endTime: '18:45',
            duration: 45,
            isCompleted: true,
            priority: 'high'
          },
          {
            id: 'ev-2',
            title: 'استراحت',
            type: 'break',
            startTime: '18:45',
            endTime: '19:00',
            duration: 15,
            isCompleted: true,
            priority: 'medium'
          }
        ],
        studyHours: 2.5,
        breaks: 3,
        productivity: 88,
        mood: 'excellent',
        weather: {
          condition: 'sunny',
          temperature: 22,
          humidity: 45,
          impact: 'positive'
        }
      }
    ];

    // Mock innovative stats
    const mockStats: InnovativeStats = {
      totalReminders: 15,
      completedReminders: 12,
      averageSleepHours: 7.2,
      sleepQuality: 78,
      motivationLevel: 85,
      productivityScore: 92,
      weatherImpact: 8,
      learningStreak: 7
    };

    setReminders(mockReminders);
    setSleepData(mockSleepData);
    setMotivations(mockMotivations);
    setCalendar(mockCalendar);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'study': return <BookOpen className="w-5 h-5" />;
      case 'break': return <Coffee className="w-5 h-5" />;
      case 'review': return <Brain className="w-5 h-5" />;
      case 'goal': return <Target className="w-5 h-5" />;
      case 'motivation': return <Heart className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
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

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'excellent': return <Smile className="w-5 h-5 text-green-500" />;
      case 'good': return <Meh className="w-5 h-5 text-yellow-500" />;
      case 'average': return <Frown className="w-5 h-5 text-orange-500" />;
      case 'poor': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Smile className="w-5 h-5 text-gray-500" />;
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'windy': return <Wind className="w-5 h-5 text-gray-400" />;
      default: return <Cloud className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">سیستم نوآورانه در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  سیستم نوآورانه
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  یادگیری هوشمند با تکنولوژی پیشرفته
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

        {/* Innovative Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">یادآوری‌های تکمیل شده</p>
                  <p className="text-2xl font-bold">{stats?.completedReminders}/{stats?.totalReminders}</p>
                  <p className="text-teal-100 text-sm">یادآوری</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Bell className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">کیفیت خواب</p>
                  <p className="text-2xl font-bold">{stats?.sleepQuality}%</p>
                  <p className="text-blue-100 text-sm">متوسط</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Bed className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">سطح انگیزه</p>
                  <p className="text-2xl font-bold">{stats?.motivationLevel}%</p>
                  <p className="text-purple-100 text-sm">عالی</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Heart className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">روند متوالی</p>
                  <p className="text-2xl font-bold">{stats?.learningStreak}</p>
                  <p className="text-green-100 text-sm">روز</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Fire className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              یادآوری هوشمند
            </TabsTrigger>
            <TabsTrigger value="sleep" className="flex items-center gap-2">
              <Bed className="w-4 h-4" />
              تحلیل خواب
            </TabsTrigger>
            <TabsTrigger value="motivation" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              انگیزه
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              تقویم یادگیری
            </TabsTrigger>
          </TabsList>

          {/* Smart Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">یادآوری‌های هوشمند</h2>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                یادآوری جدید
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reminders.map((reminder) => (
                <Card key={reminder.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
                          {getReminderIcon(reminder.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{reminder.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(reminder.priority)}>
                          {reminder.priority}
                        </Badge>
                        <Switch checked={reminder.isActive} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{reminder.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">{reminder.time}</span>
                      </div>
                      <Button 
                        size="sm"
                        disabled={reminder.isCompleted}
                      >
                        {reminder.isCompleted ? 'تکمیل شده' : 'علامت‌گذاری'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sleep Analysis Tab */}
          <TabsContent value="sleep" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">تحلیل خواب و یادگیری</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                مشاهده گزارش
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sleepData.map((sleep) => (
                <Card key={sleep.date} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Bed className="w-5 h-5" />
                        تحلیل خواب - {new Date(sleep.date).toLocaleDateString('fa-IR')}
                      </CardTitle>
                      {getMoodIcon(sleep.mood)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {sleep.sleepHours}h
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">مدت خواب</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {sleep.sleepQuality}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">کیفیت</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {sleep.deepSleep}h
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">خواب عمیق</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {sleep.learningEfficiency}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">کارایی یادگیری</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">توصیه‌ها:</h4>
                      <div className="space-y-1">
                        {sleep.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Motivation Tab */}
          <TabsContent value="motivation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">پیام‌های انگیزشی</h2>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                <Heart className="w-4 h-4 mr-2" />
                پیام جدید
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {motivations.map((motivation) => (
                <Card key={motivation.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                            {motivation.type}
                          </Badge>
                          {!motivation.isRead && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-gray-900 dark:text-white mb-3">{motivation.message}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {motivation.timestamp.toLocaleDateString('fa-IR')}
                          </span>
                          {motivation.action && (
                            <Button size="sm" variant="outline">
                              {motivation.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">تقویم یادگیری</h2>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                برنامه‌ریزی
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {calendar.map((day) => (
                <Card key={day.date} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {new Date(day.date).toLocaleDateString('fa-IR')}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getMoodIcon(day.mood)}
                        {getWeatherIcon(day.weather.condition)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {day.studyHours}h
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">مطالعه</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {day.breaks}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">استراحت</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {day.productivity}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">بهره‌وری</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">رویدادها:</h4>
                      <div className="space-y-2">
                        {day.events.map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {event.startTime} - {event.endTime}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(event.priority)}>
                                {event.priority}
                              </Badge>
                              {event.isCompleted && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">تأثیر آب و هوا:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {day.weather.condition === 'sunny' ? 'آفتابی' : 
                         day.weather.condition === 'cloudy' ? 'ابری' :
                         day.weather.condition === 'rainy' ? 'بارانی' : 'باد'} 
                        - {day.weather.temperature}°C - 
                        {day.weather.impact === 'positive' ? 'تأثیر مثبت' :
                         day.weather.impact === 'negative' ? 'تأثیر منفی' : 'بدون تأثیر'}
                      </p>
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