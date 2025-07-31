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
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  Bot,
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  BookOpen,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Zap,
  Heart,
  Smile,
  Frown,
  Meh,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Lightbulb as LightbulbIcon,
  MessageCircle as MessageCircleIcon,
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Settings as SettingsIcon,
  BookOpen as BookOpenIcon,
  Clock as ClockIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  XCircle as XCircleIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Zap as ZapIcon,
  Heart as HeartIcon,
  Smile as SmileIcon,
  Frown as FrownIcon,
  Meh as MehIcon,
  Activity as ActivityIcon,
  BarChart3 as BarChart3Icon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';

interface AICoach {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  expertise: string[];
  mood: 'happy' | 'neutral' | 'concerned';
  energy: number;
  totalSessions: number;
  averageRating: number;
}

interface LearningAnalysis {
  strengths: Strength[];
  weaknesses: Weakness[];
  recommendations: Recommendation[];
  progressTrend: 'improving' | 'stable' | 'declining';
  nextMilestone: string;
  estimatedTimeToMilestone: number;
}

interface Strength {
  id: string;
  skill: string;
  score: number;
  description: string;
  trend: 'up' | 'stable' | 'down';
}

interface Weakness {
  id: string;
  skill: string;
  score: number;
  description: string;
  priority: 'high' | 'medium' | 'low';
  suggestedExercises: string[];
}

interface Recommendation {
  id: string;
  type: 'lesson' | 'exercise' | 'practice' | 'review';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'image';
  mood?: 'happy' | 'neutral' | 'sad';
}

interface PracticeSession {
  id: string;
  title: string;
  type: 'conversation' | 'grammar' | 'vocabulary' | 'listening' | 'reading';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  score?: number;
  feedback?: string;
}

export default function AICoachPage() {
  const router = useRouter();
  const [coach, setCoach] = useState<AICoach | null>(null);
  const [analysis, setAnalysis] = useState<LearningAnalysis | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock AI coach data
    const mockCoach: AICoach = {
      id: 'coach-1',
      name: 'سارا هوشمند',
      avatar: '/api/placeholder/100/100',
      personality: 'مهربان و تشویق‌کننده، با تخصص در روش‌های یادگیری تعاملی',
      expertise: ['مکالمه انگلیسی', 'گرامر پیشرفته', 'آمادگی آیلتس', 'زبان تجاری'],
      mood: 'happy',
      energy: 95,
      totalSessions: 47,
      averageRating: 4.8
    };

    // Mock learning analysis
    const mockAnalysis: LearningAnalysis = {
      strengths: [
        {
          id: 'str-1',
          skill: 'مکالمه',
          score: 85,
          description: 'توانایی خوب در مکالمه روزمره',
          trend: 'up'
        },
        {
          id: 'str-2',
          skill: 'واژگان',
          score: 78,
          description: 'دایره واژگان گسترده',
          trend: 'up'
        }
      ],
      weaknesses: [
        {
          id: 'weak-1',
          skill: 'گرامر پیشرفته',
          score: 45,
          description: 'نیاز به تمرین بیشتر در ساختارهای پیچیده',
          priority: 'high',
          suggestedExercises: ['تمرین زمان‌های پیچیده', 'جمله‌سازی پیشرفته', 'تحلیل متن']
        },
        {
          id: 'weak-2',
          skill: 'شنیداری',
          score: 62,
          description: 'درک گفتار سریع نیاز به بهبود دارد',
          priority: 'medium',
          suggestedExercises: ['گوش دادن به پادکست‌ها', 'تماشای فیلم بدون زیرنویس', 'تمرین با لهجه‌های مختلف']
        }
      ],
      recommendations: [
        {
          id: 'rec-1',
          type: 'lesson',
          title: 'زمان‌های پیچیده در انگلیسی',
          description: 'تمرین جامع روی زمان‌های گذشته کامل و آینده کامل',
          priority: 'high',
          estimatedTime: 45,
          difficulty: 'medium',
          tags: ['گرامر', 'پیشرفته', 'زمان‌ها']
        },
        {
          id: 'rec-2',
          type: 'practice',
          title: 'مکالمه با لهجه‌های مختلف',
          description: 'تمرین شنیداری با لهجه‌های آمریکایی، بریتانیایی و استرالیایی',
          priority: 'medium',
          estimatedTime: 30,
          difficulty: 'easy',
          tags: ['شنیداری', 'لهجه', 'مکالمه']
        }
      ],
      progressTrend: 'improving',
      nextMilestone: 'سطح B2',
      estimatedTimeToMilestone: 8
    };

    // Mock chat messages
    const mockMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        sender: 'ai',
        content: 'سلام! چطور هستید؟ امروز چه کاری می‌خواهید انجام دهیم؟',
        timestamp: new Date(Date.now() - 60000),
        type: 'text',
        mood: 'happy'
      },
      {
        id: 'msg-2',
        sender: 'user',
        content: 'سلام سارا! می‌خواهم روی گرامر کار کنم',
        timestamp: new Date(Date.now() - 30000),
        type: 'text'
      },
      {
        id: 'msg-3',
        sender: 'ai',
        content: 'عالی! بر اساس تحلیل من، شما در گرامر پیشرفته نیاز به تمرین بیشتری دارید. پیشنهاد می‌کنم با درس "زمان‌های پیچیده" شروع کنیم.',
        timestamp: new Date(Date.now() - 15000),
        type: 'text',
        mood: 'happy'
      }
    ];

    setCoach(mockCoach);
    setAnalysis(mockAnalysis);
    setChatMessages(mockMessages);
    setLoading(false);
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        content: newMessage,
        timestamp: new Date(),
        type: 'text'
      };

      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          content: 'متوجه شدم! بیایید روی این موضوع کار کنیم. چه سوال خاصی دارید؟',
          timestamp: new Date(),
          type: 'text',
          mood: 'happy'
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="w-5 h-5 text-green-500" />;
      case 'neutral': return <Meh className="w-5 h-5 text-yellow-500" />;
      case 'sad': return <Frown className="w-5 h-5 text-red-500" />;
      default: return <Smile className="w-5 h-5 text-green-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">مربی هوشمند در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">مربی یافت نشد</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">لطفا ابتدا ثبت‌نام کنید</p>
            <Button 
              onClick={() => router.push('/register')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              ثبت‌نام
            </Button>
          </div>
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  مربی هوشمند
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  یادگیری شخصی‌سازی شده با هوش مصنوعی
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

        {/* Coach Stats */}
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
                  <p className="text-blue-100 text-sm">انرژی مربی</p>
                  <p className="text-2xl font-bold">{coach.energy}%</p>
                  <p className="text-blue-100 text-sm">آماده برای کمک</p>
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
                  <p className="text-green-100 text-sm">جلسات انجام شده</p>
                  <p className="text-2xl font-bold">{coach.totalSessions}</p>
                  <p className="text-green-100 text-sm">جلسه</p>
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
                  <p className="text-purple-100 text-sm">امتیاز متوسط</p>
                  <p className="text-2xl font-bold">{coach.averageRating}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm text-purple-100">از 5</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Star className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">وضعیت یادگیری</p>
                  <p className="text-2xl font-bold">
                    {analysis?.progressTrend === 'improving' ? 'در حال بهبود' : 
                     analysis?.progressTrend === 'stable' ? 'ثابت' : 'نیاز به توجه'}
                  </p>
                  <p className="text-orange-100 text-sm">روند کلی</p>
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
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              چت با مربی
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              تحلیل یادگیری
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              توصیه‌ها
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              تمرین‌ها
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 h-96">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={coach.avatar} alt={coach.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                          {coach.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{coach.name}</h3>
                        <div className="flex items-center gap-2">
                          {getMoodIcon(coach.mood)}
                          <span className="text-sm text-gray-600 dark:text-gray-400">آنلاین</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-64 overflow-y-auto space-y-4 mb-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="پیام خود را بنویسید..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsListening(!isListening)}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" onClick={sendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Coach Info */}
              <div className="lg:col-span-1">
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      درباره مربی
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarImage src={coach.avatar} alt={coach.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl">
                          {coach.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {coach.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {coach.personality}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">تخصص‌ها:</h4>
                      <div className="space-y-2">
                        {coach.expertise.map((skill, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    نقاط قوت
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis?.strengths.map((strength) => (
                    <div key={strength.id} className="p-4 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{strength.skill}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {strength.score}%
                          </span>
                          {getTrendIcon(strength.trend)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{strength.description}</p>
                      <Progress value={strength.score} className="h-2 mt-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    نیاز به بهبود
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis?.weaknesses.map((weakness) => (
                    <div key={weakness.id} className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{weakness.skill}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-red-600 dark:text-red-400">
                            {weakness.score}%
                          </span>
                          <Badge className={getPriorityColor(weakness.priority)}>
                            {weakness.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{weakness.description}</p>
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">تمرینات پیشنهادی:</h5>
                        <div className="space-y-1">
                          {weakness.suggestedExercises.map((exercise, index) => (
                            <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {exercise}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Progress value={weakness.score} className="h-2 mt-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Next Milestone */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  هدف بعدی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg">
                    <Target className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">هدف بعدی</h3>
                    <p className="text-2xl font-bold">{analysis?.nextMilestone}</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg">
                    <Clock className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">زمان تخمینی</h3>
                    <p className="text-2xl font-bold">{analysis?.estimatedTimeToMilestone} هفته</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-lg">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">روند پیشرفت</h3>
                    <p className="text-2xl font-bold">
                      {analysis?.progressTrend === 'improving' ? 'در حال بهبود' : 
                       analysis?.progressTrend === 'stable' ? 'ثابت' : 'نیاز به توجه'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysis?.recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        {recommendation.title}
                      </CardTitle>
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">{recommendation.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {recommendation.estimatedTime} دقیقه
                        </span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
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
                      شروع تمرین
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  تمرینات پیشنهادی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      تمرین مکالمه
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      مکالمه با AI در موقعیت‌های مختلف
                    </p>
                    <Button>شروع تمرین</Button>
                  </div>
                  
                  <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      تمرین گرامر
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      تمرین ساختارهای گرامری پیچیده
                    </p>
                    <Button>شروع تمرین</Button>
                  </div>
                  
                  <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                    <Volume2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      تمرین شنیداری
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      گوش دادن و درک گفتار
                    </p>
                    <Button>شروع تمرین</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 