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
  Camera,
  Video,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
  Zap,
  Target,
  Star,
  Trophy,
  Clock,
  Users,
  MessageCircle,
  Headphones,
  BookOpen,
  Gamepad2,
  Globe,
  MapPin,
  Building,
  Car,
  Plane,
  Train,
  Bus,
  Coffee,
  ShoppingBag,
  CreditCard,
  Phone,
  Computer,
  Tv,
  Music,
  Film,
  Heart,
  Smile,
  Frown,
  Meh,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Upload,
  Share,
  Plus,
  Minus,
  Edit,
  Trash2,
  MoreHorizontal,
  Camera as CameraIcon,
  Video as VideoIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  RotateCcw as RotateCcwIcon,
  Settings as SettingsIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  Star as StarIcon,
  Trophy as TrophyIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
  MessageCircle as MessageCircleIcon,
  Headphones as HeadphonesIcon,
  BookOpen as BookOpenIcon,
  Gamepad2 as Gamepad2Icon,
  Globe as GlobeIcon,
  MapPin as MapPinIcon,
  Building as BuildingIcon,
  Car as CarIcon,
  Plane as PlaneIcon,
  Train as TrainIcon,
  Bus as BusIcon,
  Coffee as CoffeeIcon,
  ShoppingBag as ShoppingBagIcon,
  CreditCard as CreditCardIcon,
  Phone as PhoneIcon,
  Computer as ComputerIcon,
  Tv as TvIcon,
  Music as MusicIcon,
  Film as FilmIcon,
  Heart as HeartIcon,
  Smile as SmileIcon,
  Frown as FrownIcon,
  Meh as MehIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  TrendingUp as TrendingUpIcon,
  Activity as ActivityIcon,
  BarChart3 as BarChart3Icon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Share as ShareIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  MoreHorizontal as MoreHorizontalIcon
} from 'lucide-react';

interface InteractiveSession {
  id: string;
  title: string;
  description: string;
  type: 'ar-class' | 'game' | 'simulation' | 'voice-practice';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  participants: number;
  maxParticipants: number;
  isActive: boolean;
  isJoined: boolean;
  progress: number;
  maxProgress: number;
  rewards: {
    experience: number;
    coins: number;
    achievements: string[];
  };
  tags: string[];
  thumbnail: string;
}

interface ARClass {
  id: string;
  title: string;
  description: string;
  environment: string;
  scenario: string;
  objects: ARObject[];
  interactions: Interaction[];
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  maxParticipants: number;
}

interface ARObject {
  id: string;
  name: string;
  type: 'furniture' | 'food' | 'transport' | 'technology' | 'clothing';
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  interactions: string[];
}

interface Interaction {
  id: string;
  type: 'touch' | 'voice' | 'gesture' | 'movement';
  trigger: string;
  response: string;
  feedback: string;
  points: number;
}

interface LanguageGame {
  id: string;
  title: string;
  description: string;
  type: 'word-match' | 'sentence-builder' | 'pronunciation' | 'vocabulary' | 'grammar';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  maxScore: number;
  currentScore: number;
  isCompleted: boolean;
  questions: GameQuestion[];
  leaderboard: GamePlayer[];
}

interface GameQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'drag-drop' | 'voice-input';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

interface GamePlayer {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  isCurrentUser: boolean;
}

interface Simulation {
  id: string;
  title: string;
  description: string;
  environment: 'airport' | 'restaurant' | 'hotel' | 'shopping' | 'transportation' | 'business';
  scenario: string;
  characters: SimulationCharacter[];
  dialogues: Dialogue[];
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isCompleted: boolean;
  score: number;
  maxScore: number;
}

interface SimulationCharacter {
  id: string;
  name: string;
  role: string;
  avatar: string;
  personality: string;
  dialogues: string[];
}

interface Dialogue {
  id: string;
  speaker: string;
  text: string;
  options?: string[];
  correctOption?: string;
  feedback: string;
  points: number;
}

interface VoiceAnalysis {
  id: string;
  text: string;
  pronunciation: number;
  fluency: number;
  accuracy: number;
  overall: number;
  feedback: string[];
  suggestions: string[];
  recordingUrl?: string;
  timestamp: Date;
}

export default function InteractivePage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<InteractiveSession[]>([]);
  const [arClasses, setArClasses] = useState<ARClass[]>([]);
  const [games, setGames] = useState<LanguageGame[]>([]);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [voiceAnalyses, setVoiceAnalyses] = useState<VoiceAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState('sessions');
  const [isRecording, setIsRecording] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock interactive sessions
    const mockSessions: InteractiveSession[] = [
      {
        id: 'session-1',
        title: 'کلاس مجازی رستوران',
        description: 'تمرین سفارش غذا و مکالمه در رستوران با واقعیت افزوده',
        type: 'ar-class',
        difficulty: 'medium',
        duration: 30,
        participants: 8,
        maxParticipants: 12,
        isActive: true,
        isJoined: true,
        progress: 15,
        maxProgress: 30,
        rewards: {
          experience: 150,
          coins: 75,
          achievements: ['آشپز حرفه‌ای', 'مکالمه رستوران']
        },
        tags: ['مکالمه', 'رستوران', 'واقعیت افزوده'],
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'session-2',
        title: 'بازی واژگان',
        description: 'بازی تعاملی برای یادگیری واژگان جدید',
        type: 'game',
        difficulty: 'easy',
        duration: 15,
        participants: 25,
        maxParticipants: 50,
        isActive: true,
        isJoined: false,
        progress: 0,
        maxProgress: 15,
        rewards: {
          experience: 100,
          coins: 50,
          achievements: ['واژگان‌دان']
        },
        tags: ['واژگان', 'بازی', 'تعاملی'],
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'session-3',
        title: 'شبیه‌سازی فرودگاه',
        description: 'تمرین مکالمه در فرودگاه و چک کردن پرواز',
        type: 'simulation',
        difficulty: 'hard',
        duration: 45,
        participants: 5,
        maxParticipants: 10,
        isActive: false,
        isJoined: false,
        progress: 0,
        maxProgress: 45,
        rewards: {
          experience: 200,
          coins: 100,
          achievements: ['مسافر حرفه‌ای']
        },
        tags: ['فرودگاه', 'سفر', 'شبیه‌سازی'],
        thumbnail: '/api/placeholder/300/200'
      }
    ];

    // Mock AR classes
    const mockARClasses: ARClass[] = [
      {
        id: 'ar-1',
        title: 'رستوران مجازی',
        description: 'تمرین سفارش غذا و مکالمه در محیط رستوران',
        environment: 'restaurant',
        scenario: 'شما در یک رستوران مجازی هستید و باید غذا سفارش دهید',
        objects: [
          {
            id: 'obj-1',
            name: 'منو',
            type: 'furniture',
            position: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 },
            interactions: ['touch', 'read', 'order']
          }
        ],
        interactions: [
          {
            id: 'int-1',
            type: 'voice',
            trigger: 'I would like to order',
            response: 'What would you like to order?',
            feedback: 'Great pronunciation!',
            points: 10
          }
        ],
        duration: 30,
        difficulty: 'medium',
        participants: 8,
        maxParticipants: 12
      }
    ];

    // Mock games
    const mockGames: LanguageGame[] = [
      {
        id: 'game-1',
        title: 'مطابقت واژگان',
        description: 'واژگان را با معانی صحیح مطابقت دهید',
        type: 'word-match',
        difficulty: 'easy',
        duration: 15,
        maxScore: 100,
        currentScore: 75,
        isCompleted: false,
        questions: [
          {
            id: 'q-1',
            type: 'multiple-choice',
            question: 'معنی کلمه "Beautiful" چیست؟',
            options: ['زیبا', 'قوی', 'بزرگ', 'کوچک'],
            correctAnswer: 'زیبا',
            explanation: 'Beautiful به معنی زیبا است',
            points: 10
          }
        ],
        leaderboard: [
          {
            id: 'player-1',
            name: 'سارا',
            avatar: '/api/placeholder/50/50',
            score: 95,
            rank: 1,
            isCurrentUser: false
          },
          {
            id: 'player-2',
            name: 'شما',
            avatar: '/api/placeholder/50/50',
            score: 75,
            rank: 2,
            isCurrentUser: true
          }
        ]
      }
    ];

    // Mock simulations
    const mockSimulations: Simulation[] = [
      {
        id: 'sim-1',
        title: 'فرودگاه بین‌المللی',
        description: 'تمرین چک کردن پرواز و عبور از گمرک',
        environment: 'airport',
        scenario: 'شما در فرودگاه هستید و باید پرواز خود را چک کنید',
        characters: [
          {
            id: 'char-1',
            name: 'خانم کارمند',
            role: 'کارمند چک-این',
            avatar: '/api/placeholder/50/50',
            personality: 'مهربان و کمک‌کننده',
            dialogues: ['Good morning! How can I help you?', 'Please show me your passport.']
          }
        ],
        dialogues: [
          {
            id: 'dial-1',
            speaker: 'خانم کارمند',
            text: 'Good morning! How can I help you?',
            options: ['I need to check in for my flight', 'Where is the bathroom?', 'I lost my luggage'],
            correctOption: 'I need to check in for my flight',
            feedback: 'Perfect! That\'s the right response.',
            points: 10
          }
        ],
        duration: 45,
        difficulty: 'hard',
        isCompleted: false,
        score: 0,
        maxScore: 100
      }
    ];

    // Mock voice analyses
    const mockVoiceAnalyses: VoiceAnalysis[] = [
      {
        id: 'voice-1',
        text: 'Hello, how are you today?',
        pronunciation: 85,
        fluency: 78,
        accuracy: 92,
        overall: 85,
        feedback: ['تلفظ "th" عالی است', 'سرعت گفتار مناسب است', 'لهجه طبیعی است'],
        suggestions: ['تمرین بیشتر روی "r"', 'کندتر صحبت کنید'],
        timestamp: new Date()
      }
    ];

    setSessions(mockSessions);
    setArClasses(mockARClasses);
    setGames(mockGames);
    setSimulations(mockSimulations);
    setVoiceAnalyses(mockVoiceAnalyses);
    setLoading(false);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ar-class': return <Camera className="w-5 h-5" />;
      case 'game': return <Gamepad2 className="w-5 h-5" />;
      case 'simulation': return <Globe className="w-5 h-5" />;
      case 'voice-practice': return <Mic className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
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

  const getEnvironmentIcon = (environment: string) => {
    switch (environment) {
      case 'airport': return <Plane className="w-5 h-5" />;
      case 'restaurant': return <Coffee className="w-5 h-5" />;
      case 'hotel': return <Building className="w-5 h-5" />;
      case 'shopping': return <ShoppingBag className="w-5 h-5" />;
      case 'transportation': return <Bus className="w-5 h-5" />;
      case 'business': return <Building className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">دنیای تعاملی در حال آماده‌سازی است...</p>
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
                  یادگیری تعاملی
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  تجربه یادگیری با واقعیت افزوده و بازی‌های تعاملی
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

        {/* Quick Stats */}
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
                  <p className="text-indigo-100 text-sm">جلسات فعال</p>
                  <p className="text-2xl font-bold">{sessions.filter(s => s.isActive).length}</p>
                  <p className="text-indigo-100 text-sm">جلسه</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Play className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">کلاس‌های AR</p>
                  <p className="text-2xl font-bold">{arClasses.length}</p>
                  <p className="text-purple-100 text-sm">کلاس</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Camera className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-red-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">بازی‌های تکمیل شده</p>
                  <p className="text-2xl font-bold">{games.filter(g => g.isCompleted).length}</p>
                  <p className="text-pink-100 text-sm">بازی</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Gamepad2 className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">تحلیل صدا</p>
                  <p className="text-2xl font-bold">{voiceAnalyses.length}</p>
                  <p className="text-green-100 text-sm">تحلیل</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Mic className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              جلسات
            </TabsTrigger>
            <TabsTrigger value="ar-classes" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              کلاس‌های AR
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              بازی‌ها
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              تحلیل صدا
            </TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">جلسات تعاملی</h2>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                جلسه جدید
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sessions.map((session) => (
                <Card key={session.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                          {getTypeIcon(session.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{session.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(session.difficulty)}>
                              {session.difficulty}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              {session.duration} دقیقه
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {session.participants}/{session.maxParticipants} شرکت‌کننده
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">{session.rewards.experience} XP</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{session.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {session.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {session.isJoined && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">پیشرفت</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {session.progress}/{session.maxProgress} دقیقه
                          </span>
                        </div>
                        <Progress value={(session.progress / session.maxProgress) * 100} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {session.isJoined ? (
                        <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                          <Play className="w-4 h-4 mr-2" />
                          ادامه جلسه
                        </Button>
                      ) : (
                        <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          شرکت در جلسه
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

          {/* AR Classes Tab */}
          <TabsContent value="ar-classes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">کلاس‌های واقعیت افزوده</h2>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                onClick={() => setIsARActive(!isARActive)}
              >
                {isARActive ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    غیرفعال کردن AR
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    فعال کردن AR
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {arClasses.map((arClass) => (
                <Card key={arClass.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{arClass.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(arClass.difficulty)}>
                              {arClass.difficulty}
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                              {arClass.environment}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {arClass.participants}/{arClass.maxParticipants} شرکت‌کننده
                        </p>
                        <p className="text-sm text-gray-500">{arClass.duration} دقیقه</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{arClass.description}</p>
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">سناریو:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{arClass.scenario}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                        <Camera className="w-4 h-4 mr-2" />
                        شروع کلاس AR
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">بازی‌های زبانی</h2>
              <Button className="bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white">
                <Gamepad2 className="w-4 h-4 mr-2" />
                بازی جدید
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {games.map((game) => (
                <Card key={game.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg">
                          <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{game.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(game.difficulty)}>
                              {game.difficulty}
                            </Badge>
                            <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300">
                              {game.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                          {game.currentScore}/{game.maxScore}
                        </p>
                        <p className="text-sm text-gray-500">{game.duration} دقیقه</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{game.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">جدول امتیازات:</h4>
                      <div className="space-y-1">
                        {game.leaderboard.slice(0, 3).map((player) => (
                          <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">#{player.rank}</span>
                              <span className="text-sm">{player.name}</span>
                              {player.isCurrentUser && (
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs">
                                  شما
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm font-bold">{player.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white">
                        <Play className="w-4 h-4 mr-2" />
                        {game.isCompleted ? 'بازی مجدد' : 'شروع بازی'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trophy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Voice Analysis Tab */}
          <TabsContent value="voice" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">تحلیل صدا</h2>
              <Button 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    توقف ضبط
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    شروع ضبط
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {voiceAnalyses.map((analysis) => (
                <Card key={analysis.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                        <Mic className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">تحلیل تلفظ</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {analysis.timestamp.toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-900 dark:text-white font-medium">"{analysis.text}"</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {analysis.pronunciation}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">تلفظ</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {analysis.fluency}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">روانی</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {analysis.accuracy}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">دقت</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {analysis.overall}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">کلی</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">نقاط قوت:</h4>
                        <div className="space-y-1">
                          {analysis.feedback.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">پیشنهادات:</h4>
                        <div className="space-y-1">
                          {analysis.suggestions.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                              <AlertCircle className="w-4 h-4" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        پخش مجدد
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="w-4 h-4" />
                      </Button>
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