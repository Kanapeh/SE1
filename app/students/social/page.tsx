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
import { 
  ArrowLeft,
  Users,
  UserPlus,
  UserCheck,
  Crown,
  Star,
  Trophy,
  Target,
  Calendar,
  Clock,
  BookOpen,
  Activity,
  MessageCircle,
  Search,
  Plus,
  Settings,
  Eye
} from 'lucide-react';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  memberCount: number;
  maxMembers: number;
  isPublic: boolean;
  isJoined: boolean;
  createdAt: string;
  lastActivity: string;
  topics: string[];
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: string;
  language: string;
  isOnline: boolean;
  lastSeen: string;
  mutualInterests: string[];
  studyStreak: number;
  achievements: number;
}

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  expertise: string[];
  level: string;
  rating: number;
  totalStudents: number;
  availability: string[];
  hourlyRate: number;
  isAvailable: boolean;
  description: string;
}

interface SocialStats {
  totalFriends: number;
  onlineFriends: number;
  studyGroups: number;
  activeGroups: number;
  totalMentors: number;
  availableMentors: number;
  weeklyStudyHours: number;
  groupChallenges: number;
  completedChallenges: number;
}

export default function SocialPage() {
  const router = useRouter();
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [stats, setStats] = useState<SocialStats | null>(null);
  const [activeTab, setActiveTab] = useState('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockGroups: StudyGroup[] = [
      {
        id: 'group-1',
        name: 'گروه مکالمه انگلیسی',
        description: 'گروهی برای تمرین مکالمه روزمره انگلیسی با تمرکز بر لهجه آمریکایی',
        avatar: '/api/placeholder/100/100',
        level: 'intermediate',
        language: 'انگلیسی',
        memberCount: 12,
        maxMembers: 20,
        isPublic: true,
        isJoined: true,
        createdAt: '2024-01-01',
        lastActivity: '2024-01-15T10:30:00Z',
        topics: ['مکالمه', 'لهجه', 'واژگان روزمره']
      },
      {
        id: 'group-2',
        name: 'آمادگی آیلتس',
        description: 'گروه تخصصی برای آمادگی آزمون آیلتس با تمرکز بر هر چهار مهارت',
        avatar: '/api/placeholder/100/100',
        level: 'advanced',
        language: 'انگلیسی',
        memberCount: 8,
        maxMembers: 15,
        isPublic: true,
        isJoined: false,
        createdAt: '2024-01-05',
        lastActivity: '2024-01-15T14:20:00Z',
        topics: ['آیلتس', 'آزمون', 'استراتژی']
      }
    ];

    const mockFriends: Friend[] = [
      {
        id: 'friend-1',
        name: 'سارا محمدی',
        avatar: '/api/placeholder/50/50',
        level: 'B2',
        language: 'انگلیسی',
        isOnline: true,
        lastSeen: '2024-01-15T15:30:00Z',
        mutualInterests: ['مکالمه', 'فیلم', 'سفر'],
        studyStreak: 7,
        achievements: 15
      },
      {
        id: 'friend-2',
        name: 'محمد رضایی',
        avatar: '/api/placeholder/50/50',
        level: 'B1',
        language: 'انگلیسی',
        isOnline: false,
        lastSeen: '2024-01-15T12:00:00Z',
        mutualInterests: ['گرامر', 'مطالعه', 'موسیقی'],
        studyStreak: 3,
        achievements: 8
      }
    ];

    const mockMentors: Mentor[] = [
      {
        id: 'mentor-1',
        name: 'دکتر احمدی',
        avatar: '/api/placeholder/50/50',
        expertise: ['آیلتس', 'مکالمه پیشرفته', 'زبان تجاری'],
        level: 'C2',
        rating: 4.9,
        totalStudents: 45,
        availability: ['شنبه', 'یکشنبه', 'دوشنبه'],
        hourlyRate: 150000,
        isAvailable: true,
        description: 'استاد دانشگاه با 10 سال تجربه تدریس زبان انگلیسی'
      }
    ];

    const mockStats: SocialStats = {
      totalFriends: 15,
      onlineFriends: 8,
      studyGroups: 3,
      activeGroups: 2,
      totalMentors: 5,
      availableMentors: 3,
      weeklyStudyHours: 12,
      groupChallenges: 5,
      completedChallenges: 3
    };

    setStudyGroups(mockGroups);
    setFriends(mockFriends);
    setMentors(mockMentors);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">جامعه یادگیری در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  جامعه یادگیری
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  یادگیری گروهی و تعامل با دیگران
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

        {/* Social Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">دوستان آنلاین</p>
                  <p className="text-2xl font-bold">{stats?.onlineFriends}/{stats?.totalFriends}</p>
                  <p className="text-green-100 text-sm">فعال</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">گروه‌های فعال</p>
                  <p className="text-2xl font-bold">{stats?.activeGroups}/{stats?.studyGroups}</p>
                  <p className="text-blue-100 text-sm">گروه</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <BookOpen className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">مربیان در دسترس</p>
                  <p className="text-2xl font-bold">{stats?.availableMentors}/{stats?.totalMentors}</p>
                  <p className="text-purple-100 text-sm">مربی</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Crown className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">ساعت مطالعه هفتگی</p>
                  <p className="text-2xl font-bold">{stats?.weeklyStudyHours}</p>
                  <p className="text-orange-100 text-sm">ساعت</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="جستجو در گروه‌ها، دوستان و مربیان..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              گروه‌های مطالعه
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              دوستان
            </TabsTrigger>
            <TabsTrigger value="mentors" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              مربیان
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              چالش‌ها
            </TabsTrigger>
          </TabsList>

          {/* Study Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">گروه‌های مطالعه</h2>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                ایجاد گروه جدید
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {studyGroups.map((group) => (
                <Card key={group.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={group.avatar} alt={group.name} />
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                            {group.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getLevelColor(group.level)}>
                              {group.level}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              {group.language}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {group.memberCount}/{group.maxMembers} عضو
                        </p>
                        <p className="text-xs text-gray-500">
                          آخرین فعالیت: {new Date(group.lastActivity).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{group.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {group.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {group.isJoined ? (
                        <Button variant="outline" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          چت گروهی
                        </Button>
                      ) : (
                        <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                          <UserPlus className="w-4 h-4 mr-2" />
                          عضویت
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">دوستان</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                افزودن دوست
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friends.map((friend) => (
                <Card key={friend.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <Avatar className="w-20 h-20 mx-auto mb-4">
                          <AvatarImage src={friend.avatar} alt={friend.name} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl">
                            {friend.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                          friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {friend.name}
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {friend.level}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            {friend.language}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="text-center">
                            <p className="font-medium">{friend.studyStreak}</p>
                            <p className="text-xs">روز متوالی</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{friend.achievements}</p>
                            <p className="text-xs">دستاورد</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <Button variant="outline" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          پیام
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <BookOpen className="w-4 h-4 mr-2" />
                          مطالعه مشترک
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mentors Tab */}
          <TabsContent value="mentors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">مربیان</h2>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                <Search className="w-4 h-4 mr-2" />
                جستجوی مربی
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg">
                          {mentor.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mentor.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">{mentor.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{mentor.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                            {mentor.level}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            {mentor.totalStudents} دانش‌آموز
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">تخصص‌ها:</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {mentor.hourlyRate.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">تومان در ساعت</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          پیام
                        </Button>
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                          رزرو جلسه
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">چالش‌های گروهی</h2>
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                <Trophy className="w-4 h-4 mr-2" />
                ایجاد چالش
              </Button>
            </div>

            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">هنوز چالشی وجود ندارد</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                اولین چالش گروهی خود را ایجاد کنید و با دوستان خود رقابت کنید
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                ایجاد چالش جدید
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 