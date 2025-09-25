'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Trophy,
  Star,
  Flame,
  Target,
  Award,
  Crown,
  Zap,
  Sword,
  Shield,
  Heart,
  Gem,
  Coins,
  Gift,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Activity,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Lock,
  Unlock,
  Sparkles,
  Moon,
  Sun,
  Cloud,
  Mountain,
  Trees,
  Droplets,
  Earth,
  Wind,
  Plus,
  Minus,
  ShoppingCart,
  Bell,
  Settings,
  RefreshCw,
  BarChart3,
  TrendingDown,
  UserPlus,
  MessageCircle,
  Share2,
  Download,
  Upload,
  Filter,
  Search,
  X,
  Check,
  AlertCircle,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface HeroCharacter {
  id: string;
  name: string;
  level: number;
  experience: number;
  maxExperience: number;
  avatar: string;
  class: 'warrior' | 'mage' | 'archer' | 'healer';
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  strength: number;
  intelligence: number;
  agility: number;
  charisma: number;
  equipment: Equipment[];
  skills: Skill[];
  achievements: Achievement[];
}

interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  bonus: {
    strength?: number;
    intelligence?: number;
    agility?: number;
    charisma?: number;
  };
  image: string;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  type: 'passive' | 'active';
  effect: string;
  cooldown?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  isHidden: boolean;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  reward: {
    experience: number;
    coins: number;
    gems: number;
    items?: string[];
  };
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  expiresAt: string;
}

interface League {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';
  rank: number;
  totalPlayers: number;
  season: number;
  endDate: string;
  rewards: {
    experience: number;
    coins: number;
    gems: number;
    title?: string;
  };
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  level: number;
  experience: number;
  rank: number;
  tier: string;
  isCurrentUser: boolean;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'equipment' | 'consumable' | 'cosmetic' | 'skill';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: {
    coins?: number;
    gems?: number;
  };
  image: string;
  isPurchased: boolean;
  isAvailable: boolean;
}

interface Notification {
  id: string;
  type: 'achievement' | 'level_up' | 'challenge' | 'reward' | 'social';
  title: string;
  message: string;
  icon: string;
  isRead: boolean;
  timestamp: string;
}

interface SkillTree {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  prerequisites: string[];
  isUnlocked: boolean;
  isMaxed: boolean;
  effects: string[];
}

interface Guild {
  id: string;
  name: string;
  description: string;
  level: number;
  members: number;
  maxMembers: number;
  isJoined: boolean;
  isInvited: boolean;
  leader: string;
  emblem: string;
}

export default function GamificationPage() {
  const router = useRouter();
  const [hero, setHero] = useState<HeroCharacter | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [league, setLeague] = useState<League | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [skillTree, setSkillTree] = useState<SkillTree[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showGuilds, setShowGuilds] = useState(false);
  const [coins, setCoins] = useState(1250);
  const [gems, setGems] = useState(85);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    // Mock hero data
    const mockHero: HeroCharacter = {
      id: 'hero-1',
      name: 'سارا جنگجو',
      level: 15,
      experience: 1250,
      maxExperience: 2000,
      avatar: '/api/placeholder/100/100',
      class: 'warrior',
      health: 85,
      maxHealth: 100,
      mana: 60,
      maxMana: 80,
      strength: 18,
      intelligence: 12,
      agility: 14,
      charisma: 16,
      equipment: [
        {
          id: 'sword-1',
          name: 'شمشیر آتشین',
          type: 'weapon',
          rarity: 'epic',
          bonus: { strength: 5, agility: 2 },
          image: '/api/placeholder/50/50'
        },
        {
          id: 'armor-1',
          name: 'زره اژدها',
          type: 'armor',
          rarity: 'rare',
          bonus: { strength: 3, agility: 2 },
          image: '/api/placeholder/50/50'
        }
      ],
      skills: [
        {
          id: 'skill-1',
          name: 'ضربه قدرتمند',
          description: 'ضربه‌ای قوی که دشمن را گیج می‌کند',
          level: 3,
          maxLevel: 5,
          type: 'active',
          effect: 'damage + stun',
          cooldown: 30
        },
        {
          id: 'skill-2',
          name: 'دفاع آهنین',
          description: 'افزایش دفاع برای مدت کوتاه',
          level: 2,
          maxLevel: 5,
          type: 'active',
          effect: 'defense boost',
          cooldown: 60
        }
      ],
      achievements: [
        {
          id: 'ach-1',
          name: 'شروع سفر',
          description: 'اولین کلاس خود را تکمیل کردید',
          icon: 'star',
          rarity: 'common',
          isHidden: false,
          isUnlocked: true,
          unlockedAt: '2024-01-10',
          progress: 1,
          maxProgress: 1
        },
        {
          id: 'ach-2',
          name: 'یادگیرنده سریع',
          description: '5 کلاس را در یک هفته تکمیل کردید',
          icon: 'lightning',
          rarity: 'rare',
          isHidden: false,
          isUnlocked: true,
          unlockedAt: '2024-01-15',
          progress: 5,
          maxProgress: 5
        },
        {
          id: 'ach-3',
          name: 'راز پنهان',
          description: '???',
          icon: 'eye',
          rarity: 'mythic',
          isHidden: true,
          isUnlocked: false,
          progress: 0,
          maxProgress: 10
        }
      ]
    };

    // Mock leaderboard data
    const mockLeaderboard: LeaderboardEntry[] = [
      { id: '1', name: 'احمد قهرمان', avatar: '/api/placeholder/40/40', level: 25, experience: 5000, rank: 1, tier: 'master', isCurrentUser: false },
      { id: '2', name: 'فاطمه جنگجو', avatar: '/api/placeholder/40/40', level: 23, experience: 4800, rank: 2, tier: 'diamond', isCurrentUser: false },
      { id: '3', name: 'سارا جنگجو', avatar: '/api/placeholder/40/40', level: 15, experience: 1250, rank: 3, tier: 'gold', isCurrentUser: true },
      { id: '4', name: 'محمد دانشجو', avatar: '/api/placeholder/40/40', level: 14, experience: 1200, rank: 4, tier: 'gold', isCurrentUser: false },
      { id: '5', name: 'زهرا معلم', avatar: '/api/placeholder/40/40', level: 13, experience: 1100, rank: 5, tier: 'silver', isCurrentUser: false }
    ];

    // Mock shop items
    const mockShopItems: ShopItem[] = [
      {
        id: 'item-1',
        name: 'شمشیر الماس',
        description: 'شمشیری قدرتمند با قدرت بالا',
        type: 'equipment',
        rarity: 'legendary',
        price: { coins: 500, gems: 25 },
        image: '/api/placeholder/60/60',
        isPurchased: false,
        isAvailable: true
      },
      {
        id: 'item-2',
        name: 'زره طلایی',
        description: 'زره محافظ با دفاع بالا',
        type: 'equipment',
        rarity: 'epic',
        price: { coins: 300, gems: 15 },
        image: '/api/placeholder/60/60',
        isPurchased: true,
        isAvailable: true
      },
      {
        id: 'item-3',
        name: 'نوشیدنی انرژی',
        description: 'بازیابی کامل سلامت و مانا',
        type: 'consumable',
        rarity: 'common',
        price: { coins: 50 },
        image: '/api/placeholder/60/60',
        isPurchased: false,
        isAvailable: true
      }
    ];

    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        type: 'achievement',
        title: 'دستاورد جدید!',
        message: 'شما دستاورد "یادگیرنده سریع" را کسب کردید',
        icon: 'award',
        isRead: false,
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: 'notif-2',
        type: 'level_up',
        title: 'سطح بالا رفت!',
        message: 'تبریک! شما به سطح 15 رسیدید',
        icon: 'star',
        isRead: true,
        timestamp: '2024-01-14T15:20:00Z'
      },
      {
        id: 'notif-3',
        type: 'challenge',
        title: 'چالش جدید',
        message: 'چالش هفتگی "مکالمه حرفه‌ای" شروع شد',
        icon: 'target',
        isRead: false,
        timestamp: '2024-01-16T08:00:00Z'
      }
    ];

    // Mock skill tree
    const mockSkillTree: SkillTree[] = [
      {
        id: 'skill-tree-1',
        name: 'قدرت',
        description: 'افزایش قدرت حمله',
        level: 3,
        maxLevel: 10,
        cost: 100,
        prerequisites: [],
        isUnlocked: true,
        isMaxed: false,
        effects: ['+5% damage', '+10% critical chance']
      },
      {
        id: 'skill-tree-2',
        name: 'دفاع',
        description: 'افزایش مقاومت در برابر آسیب',
        level: 2,
        maxLevel: 10,
        cost: 150,
        prerequisites: ['skill-tree-1'],
        isUnlocked: true,
        isMaxed: false,
        effects: ['+10% damage reduction', '+5% health']
      },
      {
        id: 'skill-tree-3',
        name: 'هوش',
        description: 'افزایش مانا و قدرت جادویی',
        level: 0,
        maxLevel: 10,
        cost: 200,
        prerequisites: ['skill-tree-2'],
        isUnlocked: false,
        isMaxed: false,
        effects: ['+20% mana', '+15% spell power']
      }
    ];

    // Mock guilds
    const mockGuilds: Guild[] = [
      {
        id: 'guild-1',
        name: 'شوالیه‌های دانش',
        description: 'گروهی از دانشجویان متعهد',
        level: 5,
        members: 24,
        maxMembers: 30,
        isJoined: false,
        isInvited: true,
        leader: 'احمد قهرمان',
        emblem: '/api/placeholder/50/50'
      },
      {
        id: 'guild-2',
        name: 'جنگجویان زبان',
        description: 'متخصصان زبان انگلیسی',
        level: 8,
        members: 28,
        maxMembers: 30,
        isJoined: true,
        isInvited: false,
        leader: 'فاطمه جنگجو',
        emblem: '/api/placeholder/50/50'
      }
    ];

    // Mock challenges
    const mockChallenges: Challenge[] = [
      {
        id: 'ch-1',
        title: 'تمرین روزانه',
        description: '3 درس را امروز تکمیل کنید',
        type: 'daily',
        difficulty: 'easy',
        reward: { experience: 100, coins: 50, gems: 5 },
        progress: 2,
        maxProgress: 3,
        isCompleted: false,
        expiresAt: '2024-01-16T23:59:59Z'
      },
      {
        id: 'ch-2',
        title: 'مکالمه حرفه‌ای',
        description: 'با 5 معلم مختلف مکالمه کنید',
        type: 'weekly',
        difficulty: 'medium',
        reward: { experience: 300, coins: 150, gems: 15 },
        progress: 3,
        maxProgress: 5,
        isCompleted: false,
        expiresAt: '2024-01-21T23:59:59Z'
      },
      {
        id: 'ch-3',
        title: 'قهرمان هفته',
        description: 'در لیگ هفتگی رتبه اول شوید',
        type: 'weekly',
        difficulty: 'hard',
        reward: { experience: 500, coins: 300, gems: 30, items: ['sword-legendary'] },
        progress: 0,
        maxProgress: 1,
        isCompleted: false,
        expiresAt: '2024-01-21T23:59:59Z'
      }
    ];

    // Mock league data
    const mockLeague: League = {
      id: 'league-1',
      name: 'لیگ طلایی',
      tier: 'gold',
      rank: 3,
      totalPlayers: 150,
      season: 1,
      endDate: '2024-01-21T23:59:59Z',
      rewards: { experience: 1000, coins: 500, gems: 50, title: 'قهرمان طلایی' }
    };

    setHero(mockHero);
    setChallenges(mockChallenges);
    setLeague(mockLeague);
    setLeaderboard(mockLeaderboard);
    setShopItems(mockShopItems);
    setNotifications(mockNotifications);
    setSkillTree(mockSkillTree);
    setGuilds(mockGuilds);
    setLoading(false);
  }, []);

  // Challenge completion handler
  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isCompleted: true, progress: challenge.maxProgress }
        : challenge
    ));
    
    // Add experience and coins
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setCoins(prev => prev + challenge.reward.coins);
      setGems(prev => prev + challenge.reward.gems);
      
      // Check for level up
      const newExp = hero!.experience + challenge.reward.experience;
      if (newExp >= hero!.maxExperience) {
        setNewLevel(hero!.level + 1);
        setShowLevelUp(true);
        setHero(prev => prev ? {
          ...prev,
          level: prev.level + 1,
          experience: newExp - prev.maxExperience,
          maxExperience: prev.maxExperience + 500
        } : null);
      } else {
        setHero(prev => prev ? { ...prev, experience: newExp } : null);
      }
    }
  };

  // Shop purchase handler
  const purchaseItem = (itemId: string) => {
    const item = shopItems.find(i => i.id === itemId);
    if (item && !item.isPurchased) {
      if (item.price.coins && coins >= item.price.coins) {
        setCoins(prev => prev - item.price.coins!);
        setShopItems(prev => prev.map(i => 
          i.id === itemId ? { ...i, isPurchased: true } : i
        ));
      }
      if (item.price.gems && gems >= item.price.gems) {
        setGems(prev => prev - item.price.gems!);
        setShopItems(prev => prev.map(i => 
          i.id === itemId ? { ...i, isPurchased: true } : i
        ));
      }
    }
  };

  // Skill upgrade handler
  const upgradeSkill = (skillId: string) => {
    const skill = skillTree.find(s => s.id === skillId);
    if (skill && skill.isUnlocked && !skill.isMaxed && coins >= skill.cost) {
      setCoins(prev => prev - skill.cost);
      setSkillTree(prev => prev.map(s => 
        s.id === skillId 
          ? { 
              ...s, 
              level: s.level + 1,
              isMaxed: s.level + 1 >= s.maxLevel
            }
          : s
      ));
    }
  };

  // Guild join handler
  const joinGuild = (guildId: string) => {
    setGuilds(prev => prev.map(guild => 
      guild.id === guildId 
        ? { ...guild, isJoined: true, members: guild.members + 1 }
        : guild
    ));
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'platinum': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'diamond': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'master': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">دنیای گیمیفیکیشن در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">کاراکتر یافت نشد</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">لطفا ابتدا ثبت‌نام کنید</p>
            <Button 
              onClick={() => router.push('/register')}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
            >
              ثبت‌نام
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  دنیای گیمیفیکیشن
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  سفر قهرمانی خود را آغاز کنید
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-yellow-600 dark:text-yellow-400">{coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2">
                <Gem className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-purple-600 dark:text-purple-400">{gems}</span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShop(!showShop)}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                >
                  <Trophy className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSkillTree(!showSkillTree)}
                >
                  <Zap className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGuilds(!showGuilds)}
                >
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">سطح قهرمان</p>
                  <p className="text-2xl font-bold">{hero.level}</p>
                  <p className="text-purple-100 text-sm">{hero.experience}/{hero.maxExperience} XP</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Crown className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-orange-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">سلامت</p>
                  <p className="text-2xl font-bold">{hero.health}/{hero.maxHealth}</p>
                  <p className="text-red-100 text-sm">HP</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Heart className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">مانا</p>
                  <p className="text-2xl font-bold">{hero.mana}/{hero.maxMana}</p>
                  <p className="text-blue-100 text-sm">MP</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Zap className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">رتبه لیگ</p>
                  <p className="text-2xl font-bold">#{league?.rank}</p>
                  <p className="text-green-100 text-sm">{league?.tier}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Sword className="w-4 h-4" />
              قهرمان من
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              چالش‌ها
            </TabsTrigger>
            <TabsTrigger value="league" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              لیگ
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              دستاوردها
            </TabsTrigger>
          </TabsList>

          {/* Hero Tab */}
          <TabsContent value="hero" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hero Profile */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sword className="w-5 h-5" />
                    پروفایل قهرمان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={hero.avatar} alt={hero.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-2xl">
                        {hero.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {hero.name}
                    </h3>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                      {hero.class}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">تجربه</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {hero.experience}/{hero.maxExperience}
                      </span>
                    </div>
                    <Progress value={(hero.experience / hero.maxExperience) * 100} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {hero.strength}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">قدرت</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {hero.intelligence}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">هوش</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {hero.agility}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">چابکی</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {hero.charisma}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">جذابیت</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Equipment */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    تجهیزات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hero.equipment.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Sword className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                        <Badge className={getRarityColor(item.rarity)}>
                          {item.rarity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    مهارت‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hero.skills.map((skill) => (
                    <div key={skill.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h4>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          سطح {skill.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{skill.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{skill.type}</span>
                        {skill.cooldown && <span>CD: {skill.cooldown}s</span>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        {challenge.title}
                      </CardTitle>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{challenge.description}</p>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">پیشرفت</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {challenge.progress}/{challenge.maxProgress}
                        </span>
                      </div>
                      <Progress value={(challenge.progress / challenge.maxProgress) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>منقضی: {new Date(challenge.expiresAt).toLocaleDateString('fa-IR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">{challenge.reward.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">{challenge.reward.coins}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gem className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">{challenge.reward.gems}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      disabled={challenge.isCompleted}
                      onClick={() => completeChallenge(challenge.id)}
                    >
                      {challenge.isCompleted ? 'تکمیل شده' : 'شروع چالش'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* League Tab */}
          <TabsContent value="league" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  {league?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-lg">
                    <Trophy className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">رتبه شما</h3>
                    <p className="text-3xl font-bold">#{league?.rank}</p>
                    <p className="text-yellow-100">از {league?.totalPlayers} بازیکن</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-lg">
                    <Crown className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">سطح</h3>
                    <p className="text-3xl font-bold">{league?.tier}</p>
                    <p className="text-purple-100">فصل {league?.season}</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg">
                    <Gift className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">پاداش</h3>
                    <p className="text-3xl font-bold">{league?.rewards.experience}</p>
                    <p className="text-green-100">XP + {league?.rewards.coins} سکه</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    پایان فصل: {new Date(league?.endDate || '').toLocaleDateString('fa-IR')}
                  </p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                    مشاهده جدول رده‌بندی
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hero.achievements.map((achievement) => (
                <Card key={achievement.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        achievement.isUnlocked 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        {achievement.isUnlocked ? (
                          <Award className="w-8 h-8 text-white" />
                        ) : (
                          <Lock className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {achievement.isHidden && !achievement.isUnlocked ? '???' : achievement.name}
                      </h4>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {achievement.isHidden && !achievement.isUnlocked ? 'دستاورد مخفی' : achievement.description}
                      </p>
                      
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      
                      {achievement.isUnlocked && (
                        <p className="text-xs text-gray-500 mt-2">
                          کسب شده در {new Date(achievement.unlockedAt || '').toLocaleDateString('fa-IR')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Notifications Modal */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowNotifications(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">اعلان‌ها</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.isRead 
                          ? 'bg-gray-50 dark:bg-gray-700' 
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Bell className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.timestamp).toLocaleDateString('fa-IR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shop Modal */}
        <AnimatePresence>
          {showShop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowShop(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">فروشگاه</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowShop(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shopItems.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <Sword className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <Badge className={getRarityColor(item.rarity)}>
                            {item.rarity}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.price.coins && (
                            <div className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{item.price.coins}</span>
                            </div>
                          )}
                          {item.price.gems && (
                            <div className="flex items-center gap-1">
                              <Gem className="w-4 h-4 text-purple-500" />
                              <span className="text-sm">{item.price.gems}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          disabled={item.isPurchased || (item.price.coins && coins < item.price.coins) || (item.price.gems && gems < item.price.gems)}
                          onClick={() => purchaseItem(item.id)}
                        >
                          {item.isPurchased ? 'خریداری شده' : 'خرید'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard Modal */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowLeaderboard(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">جدول رده‌بندی</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowLeaderboard(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        entry.isCurrentUser 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                        {entry.rank}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>{entry.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{entry.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          سطح {entry.level} • {entry.experience.toLocaleString()} XP
                        </p>
                      </div>
                      <Badge className={getTierColor(entry.tier)}>
                        {entry.tier}
                      </Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skill Tree Modal */}
        <AnimatePresence>
          {showSkillTree && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowSkillTree(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">درخت مهارت</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowSkillTree(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {skillTree.map((skill) => (
                    <div key={skill.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{skill.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">سطح {skill.level}/{skill.maxLevel}</Badge>
                          {skill.isUnlocked && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              باز شده
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{skill.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{skill.cost} سکه</span>
                        </div>
                        <Button
                          size="sm"
                          disabled={!skill.isUnlocked || skill.isMaxed || coins < skill.cost}
                          onClick={() => upgradeSkill(skill.id)}
                        >
                          {skill.isMaxed ? 'حداکثر' : 'ارتقا'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guilds Modal */}
        <AnimatePresence>
          {showGuilds && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowGuilds(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">گروه‌ها</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowGuilds(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {guilds.map((guild) => (
                    <div key={guild.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{guild.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{guild.description}</p>
                          <p className="text-xs text-gray-500">رهبر: {guild.leader}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">سطح {guild.level}</p>
                          <p className="text-xs text-gray-500">{guild.members}/{guild.maxMembers} عضو</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {guild.isInvited && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              دعوت شده
                            </Badge>
                          )}
                          {guild.isJoined && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              عضو
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          disabled={guild.isJoined || guild.members >= guild.maxMembers}
                          onClick={() => joinGuild(guild.id)}
                        >
                          {guild.isJoined ? 'عضو' : 'عضویت'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level Up Animation */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowLevelUp(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-lg text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Crown className="w-10 h-10" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">تبریک!</h2>
                <p className="text-xl mb-4">شما به سطح {newLevel} رسیدید!</p>
                <Button
                  onClick={() => setShowLevelUp(false)}
                  className="bg-white text-orange-500 hover:bg-gray-100"
                >
                  ادامه
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 