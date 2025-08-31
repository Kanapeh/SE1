'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentPageLayout, { Student } from '@/components/StudentPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  Clock,
  BookOpen,
  Star,
  CheckCircle,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  Trophy,
  Flame,
  Heart,
  Smile,
  Brain,
  Users,
  Settings,
  Download,
  Share2,
  RefreshCw
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
  totalStudyHours: number;
  averageScore: number;
}

interface SkillProgress {
  skill: string;
  currentLevel: number;
  maxLevel: number;
  improvement: number;
  lastUpdated: string;
  icon: any;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  earnedDate: string;
  category: string;
}

interface StudySession {
  id: string;
  date: string;
  duration: number;
  topics: string[];
  score: number;
  type: 'lesson' | 'practice' | 'test';
}

export default function ProgressPage() {
  const router = useRouter();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [skillsProgress, setSkillsProgress] = useState<SkillProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentSessions, setRecentSessions] = useState<StudySession[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const handleStudentLoaded = (student: Student) => {
    setCurrentStudent(student);
    
    // Initialize progress data based on student level
    const levelMapping = {
      'مبتدی': { current: 1, next: 2, percentage: 25 },
      'ابتدایی': { current: 2, next: 3, percentage: 40 },
      'متوسط': { current: 3, next: 4, percentage: 60 },
      'متوسط رو به بالا': { current: 4, next: 5, percentage: 75 },
      'پیشرفته': { current: 5, next: 6, percentage: 90 }
    };

    const currentMapping = levelMapping[student.level as keyof typeof levelMapping] || levelMapping['مبتدی'];
    
    const studentProgress: ProgressData = {
      currentLevel: student.level || 'مبتدی',
      nextLevel: student.level === 'پیشرفته' ? 'تسلط کامل' : 'ابتدایی',
      progressPercentage: currentMapping.percentage,
      completedLessons: Math.floor(currentMapping.percentage / 10),
      totalLessons: 20,
      streak: Math.floor(Math.random() * 7) + 1,
      weeklyGoal: 3,
      weeklyProgress: Math.floor(Math.random() * 3) + 1,
      monthlyGoal: 12,
      monthlyProgress: Math.floor(Math.random() * 8) + 2,
      totalStudyHours: Math.floor(currentMapping.percentage / 5),
      averageScore: Math.floor(currentMapping.percentage + Math.random() * 20)
    };

    const studentSkills: SkillProgress[] = [
      {
        skill: 'مکالمه',
        currentLevel: Math.floor(currentMapping.percentage / 20) + 1,
        maxLevel: 5,
        improvement: Math.floor(Math.random() * 15) + 5,
        lastUpdated: '2 روز پیش',
        icon: Users,
        color: 'from-blue-500 to-cyan-600'
      },
      {
        skill: 'شنیداری',
        currentLevel: Math.floor(currentMapping.percentage / 25) + 1,
        maxLevel: 5,
        improvement: Math.floor(Math.random() * 12) + 3,
        lastUpdated: '3 روز پیش',
        icon: Heart,
        color: 'from-pink-500 to-rose-600'
      },
      {
        skill: 'خواندن',
        currentLevel: Math.floor(currentMapping.percentage / 15) + 1,
        maxLevel: 5,
        improvement: Math.floor(Math.random() * 18) + 8,
        lastUpdated: '1 روز پیش',
        icon: BookOpen,
        color: 'from-green-500 to-emerald-600'
      },
      {
        skill: 'نوشتار',
        currentLevel: Math.floor(currentMapping.percentage / 30) + 1,
        maxLevel: 5,
        improvement: Math.floor(Math.random() * 10) + 2,
        lastUpdated: '4 روز پیش',
        icon: PieChart,
        color: 'from-purple-500 to-violet-600'
      },
      {
        skill: 'گرامر',
        currentLevel: Math.floor(currentMapping.percentage / 18) + 1,
        maxLevel: 5,
        improvement: Math.floor(Math.random() * 16) + 6,
        lastUpdated: '1 روز پیش',
        icon: Brain,
        color: 'from-orange-500 to-red-600'
      },
      {
        skill: 'واژگان',
        currentLevel: Math.floor(currentMapping.percentage / 12) + 1,
        maxLevel: 5,
        improvement: Math.floor(Math.random() * 20) + 10,
        lastUpdated: 'امروز',
        icon: Zap,
        color: 'from-yellow-500 to-amber-600'
      }
    ];

    const studentAchievements: Achievement[] = [
      {
        id: 'first-lesson',
        title: 'اولین قدم',
        description: 'اولین درس خود را تکمیل کردید',
        icon: Star,
        color: 'from-yellow-500 to-orange-600',
        earnedDate: '1 هفته پیش',
        category: 'شروع'
      },
      {
        id: 'streak-3',
        title: 'مداوم',
        description: '3 روز متوالی مطالعه کردید',
        icon: Flame,
        color: 'from-red-500 to-pink-600',
        earnedDate: '3 روز پیش',
        category: 'مداومت'
      },
      {
        id: 'perfect-score',
        title: 'نمره کامل',
        description: 'نمره 100 در یک تست گرفتید',
        icon: Trophy,
        color: 'from-blue-500 to-cyan-600',
        earnedDate: '2 روز پیش',
        category: 'موفقیت'
      }
    ];

    const studentSessions: StudySession[] = [
      {
        id: 'session-1',
        date: 'امروز',
        duration: 25,
        topics: ['گرامر پایه', 'زمان حال ساده'],
        score: 85,
        type: 'lesson'
      },
      {
        id: 'session-2',
        date: 'دیروز',
        duration: 30,
        topics: ['واژگان روزانه', 'خانواده'],
        score: 92,
        type: 'practice'
      },
      {
        id: 'session-3',
        date: '2 روز پیش',
        duration: 45,
        topics: ['تست سطح‌یابی'],
        score: 78,
        type: 'test'
      }
    ];

    setProgressData(studentProgress);
    setSkillsProgress(studentSkills);
    setAchievements(studentAchievements);
    setRecentSessions(studentSessions);
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="w-4 h-4" />;
      case 'practice': return <Target className="w-4 h-4" />;
      case 'test': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSessionTypeBadge = (type: string) => {
    const types = {
      lesson: { label: 'درس', color: 'bg-blue-100 text-blue-800' },
      practice: { label: 'تمرین', color: 'bg-green-100 text-green-800' },
      test: { label: 'آزمون', color: 'bg-purple-100 text-purple-800' }
    };
    const typeInfo = types[type as keyof typeof types] || { label: type, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={typeInfo.color}>{typeInfo.label}</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <StudentPageLayout
      title="پیگیری پیشرفت"
      description="آمار و نمودارهای دقیق از پیشرفت یادگیری شما"
      onStudentLoaded={handleStudentLoaded}
    >
      {progressData && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">سطح فعلی</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{progressData.currentLevel}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>پیشرفت به سطح بعد</span>
                    <span>{progressData.progressPercentage}%</span>
                  </div>
                  <Progress value={progressData.progressPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">درس‌های تکمیل شده</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {progressData.completedLessons}/{progressData.totalLessons}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>تکمیل شده</span>
                    <span>{Math.round((progressData.completedLessons / progressData.totalLessons) * 100)}%</span>
                  </div>
                  <Progress value={(progressData.completedLessons / progressData.totalLessons) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">روزهای متوالی</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{progressData.streak}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    بهترین رکورد: {progressData.streak + 2} روز
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">میانگین نمره</p>
                    <p className={`text-2xl font-bold ${getScoreColor(progressData.averageScore)}`}>
                      {progressData.averageScore}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    از {recentSessions.length} جلسه اخیر
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                کلی
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                مهارت‌ها
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                دستاوردها
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                تاریخچه
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Progress */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      پیشرفت هفتگی
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>هدف هفتگی</span>
                          <span>{progressData.weeklyProgress}/{progressData.weeklyGoal} جلسه</span>
                        </div>
                        <Progress value={(progressData.weeklyProgress / progressData.weeklyGoal) * 100} className="h-3" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>هدف ماهانه</span>
                          <span>{progressData.monthlyProgress}/{progressData.monthlyGoal} جلسه</span>
                        </div>
                        <Progress value={(progressData.monthlyProgress / progressData.monthlyGoal) * 100} className="h-3" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{progressData.totalStudyHours}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">ساعت مطالعه</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{achievements.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">دستاورد</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      فعالیت‌های اخیر
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentSessions.slice(0, 4).map((session, index) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              {getSessionTypeIcon(session.type)}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{session.topics[0]}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{session.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-sm ${getScoreColor(session.score)}`}>
                              {session.score}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {session.duration} دقیقه
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillsProgress.map((skill) => (
                  <Card key={skill.skill} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{skill.skill}</CardTitle>
                        <div className={`w-10 h-10 bg-gradient-to-r ${skill.color} rounded-lg flex items-center justify-center`}>
                          <skill.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>سطح فعلی</span>
                            <span>{skill.currentLevel}/{skill.maxLevel}</span>
                          </div>
                          <Progress value={(skill.currentLevel / skill.maxLevel) * 100} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">بهبود:</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-medium">+{skill.improvement}%</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          آخرین به‌روزرسانی: {skill.lastUpdated}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <achievement.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{achievement.description}</p>
                        <div className="flex items-center justify-center gap-2">
                          <Badge variant="secondary">{achievement.category}</Badge>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{achievement.earnedDate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      تاریخچه جلسات
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      دانلود گزارش
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            {getSessionTypeIcon(session.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{session.date}</span>
                              {getSessionTypeBadge(session.type)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              موضوعات: {session.topics.join('، ')}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              مدت زمان: {session.duration} دقیقه
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(session.score)}`}>
                            {session.score}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">امتیاز</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </StudentPageLayout>
  );
}