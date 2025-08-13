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
  Coins,
  Gem,
  Gift,
  Trophy,
  Star,
  Crown,
  Target,
  TrendingUp,
  Users,
  Share,
  Download,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Minus,
  Eye,
  Settings,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Zap,
  Heart,
  Smile,
  Award,
  Medal,
  Ribbon,
  Flag,
  Flame,
  Sparkles
} from 'lucide-react';

interface RewardStats {
  totalCoins: number;
  totalGems: number;
  currentLevel: number;
  currentExperience: number;
  experienceToNextLevel: number;
  totalRewards: number;
  thisMonthRewards: number;
  streak: number;
  invitations: number;
  invitationsRewards: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'coins' | 'gems' | 'discount' | 'free-class' | 'book' | 'special-course';
  value: number;
  cost: number;
  currency: 'coins' | 'gems';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isAvailable: boolean;
  isClaimed: boolean;
  claimedAt?: string;
  expiresAt?: string;
  image: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  reward: {
    coins: number;
    gems: number;
    experience: number;
  };
}

interface Transaction {
  id: string;
  type: 'earned' | 'spent' | 'rewarded' | 'bonus';
  amount: number;
  currency: 'coins' | 'gems';
  description: string;
  timestamp: Date;
  category: 'lesson' | 'challenge' | 'achievement' | 'invitation' | 'purchase';
}

interface Invitation {
  id: string;
  friendName: string;
  friendEmail: string;
  status: 'pending' | 'accepted' | 'completed';
  invitedAt: string;
  completedAt?: string;
  reward: number;
}

export default function RewardsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<RewardStats | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock reward stats
    const mockStats: RewardStats = {
      totalCoins: 1250,
      totalGems: 85,
      currentLevel: 15,
      currentExperience: 1250,
      experienceToNextLevel: 2000,
      totalRewards: 47,
      thisMonthRewards: 12,
      streak: 7,
      invitations: 5,
      invitationsRewards: 250
    };

    // Mock rewards
    const mockRewards: Reward[] = [
      {
        id: 'reward-1',
        name: 'کلاس رایگان',
        description: 'یک جلسه کلاس خصوصی رایگان',
        type: 'free-class',
        value: 150000,
        cost: 500,
        currency: 'coins',
        rarity: 'rare',
        isAvailable: true,
        isClaimed: false,
        image: '/api/placeholder/100/100'
      },
      {
        id: 'reward-2',
        name: 'تخفیف 20%',
        description: 'تخفیف 20% روی کلاس‌های خصوصی',
        type: 'discount',
        value: 20,
        cost: 200,
        currency: 'gems',
        rarity: 'epic',
        isAvailable: true,
        isClaimed: false,
        image: '/api/placeholder/100/100'
      },
      {
        id: 'reward-3',
        name: 'کتاب گرامر پیشرفته',
        description: 'کتاب الکترونیکی گرامر پیشرفته انگلیسی',
        type: 'book',
        value: 50000,
        cost: 300,
        currency: 'coins',
        rarity: 'common',
        isAvailable: true,
        isClaimed: true,
        claimedAt: '2024-01-10',
        image: '/api/placeholder/100/100'
      }
    ];

    // Mock achievements
    const mockAchievements: Achievement[] = [
      {
        id: 'ach-1',
        name: 'یادگیرنده سریع',
        description: '5 کلاس را در یک هفته تکمیل کنید',
        icon: 'lightning',
        rarity: 'rare',
        isUnlocked: true,
        unlockedAt: '2024-01-15',
        progress: 5,
        maxProgress: 5,
        reward: { coins: 100, gems: 10, experience: 200 }
      },
      {
        id: 'ach-2',
        name: 'مکالمه‌کننده حرفه‌ای',
        description: '10 ساعت مکالمه با معلمان',
        icon: 'message-circle',
        rarity: 'epic',
        isUnlocked: false,
        progress: 7,
        maxProgress: 10,
        reward: { coins: 200, gems: 20, experience: 400 }
      }
    ];

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: 'tx-1',
        type: 'earned',
        amount: 50,
        currency: 'coins',
        description: 'تکمیل درس گرامر',
        timestamp: new Date(Date.now() - 3600000),
        category: 'lesson'
      },
      {
        id: 'tx-2',
        type: 'spent',
        amount: -100,
        currency: 'coins',
        description: 'خرید کتاب واژگان',
        timestamp: new Date(Date.now() - 7200000),
        category: 'purchase'
      },
      {
        id: 'tx-3',
        type: 'rewarded',
        amount: 25,
        currency: 'gems',
        description: 'دستاورد: یادگیرنده سریع',
        timestamp: new Date(Date.now() - 86400000),
        category: 'achievement'
      }
    ];

    // Mock invitations
    const mockInvitations: Invitation[] = [
      {
        id: 'inv-1',
        friendName: 'سارا محمدی',
        friendEmail: 'sara@example.com',
        status: 'completed',
        invitedAt: '2024-01-01',
        completedAt: '2024-01-05',
        reward: 100
      },
      {
        id: 'inv-2',
        friendName: 'علی رضایی',
        friendEmail: 'ali@example.com',
        status: 'pending',
        invitedAt: '2024-01-10',
        reward: 100
      }
    ];

    setStats(mockStats);
    setRewards(mockRewards);
    setAchievements(mockAchievements);
    setTransactions(mockTransactions);
    setInvitations(mockInvitations);
    setLoading(false);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'legendary': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'mythic': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return <Plus className="w-4 h-4 text-green-500" />;
      case 'spent': return <Minus className="w-4 h-4 text-red-500" />;
      case 'rewarded': return <Gift className="w-4 h-4 text-purple-500" />;
      case 'bonus': return <Star className="w-4 h-4 text-yellow-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return 'text-green-600 dark:text-green-400';
      case 'spent': return 'text-red-600 dark:text-red-400';
      case 'rewarded': return 'text-purple-600 dark:text-purple-400';
      case 'bonus': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-200 border-t-yellow-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">سیستم پاداش در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  سیستم پاداش
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  کسب امتیاز و تبدیل به پاداش‌های واقعی
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

        {/* Currency Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">سکه‌های شما</p>
                  <p className="text-2xl font-bold">{stats?.totalCoins.toLocaleString()}</p>
                  <p className="text-yellow-100 text-sm">سکه</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Coins className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">جواهرات شما</p>
                  <p className="text-2xl font-bold">{stats?.totalGems}</p>
                  <p className="text-purple-100 text-sm">جواهر</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Gem className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">سطح شما</p>
                  <p className="text-2xl font-bold">{stats?.currentLevel}</p>
                  <p className="text-blue-100 text-sm">سطح</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Crown className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">روند متوالی</p>
                  <p className="text-2xl font-bold">{stats?.streak}</p>
                  <p className="text-green-100 text-sm">روز</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Flame className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">پیشرفت سطح</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats?.currentExperience}/{stats?.experienceToNextLevel} XP
                  </span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    سطح {stats?.currentLevel}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={((stats?.currentExperience || 0) / (stats?.experienceToNextLevel || 1)) * 100} 
                className="h-3"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {(stats?.experienceToNextLevel || 0) - (stats?.currentExperience || 0)} XP تا سطح بعدی
              </p>
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
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              پاداش‌ها
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              دستاوردها
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              تراکنش‌ها
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              دعوت‌ها
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Stats */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    آمار ماهانه
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats?.thisMonthRewards}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">پاداش این ماه</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats?.totalRewards}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">کل پاداش‌ها</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">سکه‌های کسب شده</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">+{stats?.totalCoins}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">جواهرات کسب شده</span>
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">+{stats?.totalGems}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">دعوت‌های موفق</span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">+{stats?.invitations}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    اقدامات سریع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white">
                    <Share className="w-4 h-4 mr-2" />
                    دعوت دوستان
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                    <Gift className="w-4 h-4 mr-2" />
                    مشاهده پاداش‌ها
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                    <Trophy className="w-4 h-4 mr-2" />
                    دستاوردها
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                    <Activity className="w-4 h-4 mr-2" />
                    تاریخچه تراکنش‌ها
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">پاداش‌های موجود</h2>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white">
                <Gift className="w-4 h-4 mr-2" />
                پاداش جدید
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <Card key={reward.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Gift className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {reward.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {reward.description}
                      </p>
                      
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Badge className={getRarityColor(reward.rarity)}>
                          {reward.rarity}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {reward.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {reward.value.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">ارزش</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            {reward.cost}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {reward.currency === 'coins' ? 'سکه' : 'جواهر'}
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full"
                        disabled={!reward.isAvailable || reward.isClaimed}
                      >
                        {reward.isClaimed ? 'دریافت شده' : 'دریافت پاداش'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">دستاوردها</h2>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                <Trophy className="w-4 h-4 mr-2" />
                مشاهده همه
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        achievement.isUnlocked 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {achievement.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {achievement.description}
                      </p>
                      
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">پیشرفت</span>
                          <span className="text-sm font-medium">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                      </div>
                      
                      {achievement.isUnlocked && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                            پاداش: {achievement.reward.coins} سکه + {achievement.reward.gems} جواهر
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">تاریخچه تراکنش‌ها</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                دانلود گزارش
              </Button>
            </div>

            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {transaction.timestamp.toLocaleDateString('fa-IR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'spent' ? '' : '+'}{transaction.amount} {transaction.currency === 'coins' ? 'سکه' : 'جواهر'}
                        </p>
                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">دعوت دوستان</h2>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                <Share className="w-4 h-4 mr-2" />
                دعوت جدید
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    آمار دعوت‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats?.invitations}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">کل دعوت‌ها</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats?.invitationsRewards}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">پاداش کل</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">پاداش دعوت:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      برای هر دوست دعوت شده که ثبت‌نام کند، 100 سکه پاداش دریافت می‌کنید!
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    دعوت‌های اخیر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {invitation.friendName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {invitation.friendEmail}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          invitation.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          invitation.status === 'accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }>
                          {invitation.status === 'completed' ? 'تکمیل شده' :
                           invitation.status === 'accepted' ? 'پذیرفته شده' : 'در انتظار'}
                        </Badge>
                        {invitation.status === 'completed' && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            +{invitation.reward} سکه
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 