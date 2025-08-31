'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentPageLayout, { Student } from '@/components/StudentPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
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
  Zap,
  Heart,
  Smile,
  Activity,
  BarChart3
} from 'lucide-react';

interface AICoach {
  id: string;
  name: string;
  avatar: string | null;
  personality: string;
  expertise: string[];
  mood: 'happy' | 'excited' | 'thinking' | 'encouraging';
  energy: number;
  totalSessions: number;
  averageRating: number;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  type: 'text' | 'voice' | 'exercise';
  mood?: 'happy' | 'excited' | 'thinking' | 'encouraging';
}

interface LearningAnalysis {
  strengths: Array<{
    id: string;
    skill: string;
    score: number;
    description: string;
    trend: 'up' | 'down' | 'stable';
  }>;
  weaknesses: Array<{
    id: string;
    skill: string;
    score: number;
    description: string;
    priority: 'high' | 'medium' | 'low';
    suggestedExercises: string[];
  }>;
  recommendations: Array<{
    id: string;
    type: 'lesson' | 'practice' | 'exercise' | 'assessment';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
  }>;
  overallScore: number;
  learningStyle: string;
  preferredTime: string;
  lastAssessment: string;
}

export default function AICoachPage() {
  const router = useRouter();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [coach, setCoach] = useState<AICoach | null>(null);
  const [analysis, setAnalysis] = useState<LearningAnalysis | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleStudentLoaded = (student: Student) => {
    setCurrentStudent(student);
    
    // Initialize AI coach data based on student info
    const studentCoach: AICoach = {
      id: 'coach-1',
      name: 'سارا هوشمند',
      avatar: null,
      personality: 'مهربان و تشویق‌کننده، با تخصص در روش‌های یادگیری تعاملی',
      expertise: ['مکالمه انگلیسی', 'گرامر پیشرفته', 'آمادگی آیلتس', 'زبان تجاری'],
      mood: 'happy',
      energy: 95,
      totalSessions: 0,
      averageRating: 5.0
    };

    // Initialize learning analysis based on student level
    const levelScore = student.level === 'مبتدی' ? 30 : student.level === 'متوسط' ? 60 : 80;
    
    const studentAnalysis: LearningAnalysis = {
      strengths: [
        {
          id: 'str-1',
          skill: 'انگیزه یادگیری',
          score: 90,
          description: 'انگیزه بالا برای یادگیری زبان انگلیسی',
          trend: 'up'
        },
        {
          id: 'str-2',
          skill: 'تعامل',
          score: 75,
          description: 'مشارکت فعال در فرآیند یادگیری',
          trend: 'stable'
        }
      ],
      weaknesses: [
        {
          id: 'weak-1',
          skill: 'ارزیابی جامع',
          score: 20,
          description: 'نیاز به انجام تست‌های تکمیلی برای شناخت بهتر نقاط قوت و ضعف',
          priority: 'high',
          suggestedExercises: ['تست تعیین سطح کامل', 'ارزیابی مهارت‌های چهارگانه', 'تست شخصیت یادگیری']
        }
      ],
      recommendations: [
        {
          id: 'rec-1',
          type: 'assessment',
          title: 'تست تعیین سطح جامع',
          description: 'ارزیابی کامل مهارت‌های شما برای تنظیم برنامه آموزشی',
          priority: 'high',
          estimatedTime: 45,
          difficulty: 'medium',
          tags: ['ارزیابی', 'تعیین سطح', 'مهارت‌ها']
        },
        {
          id: 'rec-2',
          type: 'lesson',
          title: 'آشنایی با مربی هوشمند',
          description: 'راهنمای استفاده از امکانات مربی هوش مصنوعی',
          priority: 'high',
          estimatedTime: 20,
          difficulty: 'easy',
          tags: ['راهنما', 'آموزش', 'شروع']
        },
        {
          id: 'rec-3',
          type: 'practice',
          title: 'مکالمه روزانه',
          description: 'تمرین مکالمه ساده برای شروع راحت',
          priority: 'medium',
          estimatedTime: 15,
          difficulty: 'easy',
          tags: ['مکالمه', 'روزانه', 'شروع']
        }
      ],
      overallScore: levelScore,
      learningStyle: 'تعاملی',
      preferredTime: 'صبح',
      lastAssessment: new Date().toISOString().split('T')[0]
    };

    // Welcome messages based on student
    const welcomeMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        content: `سلام ${student.first_name} عزیز! من سارا هستم، مربی هوش مصنوعی شما. خیلی خوشحالم که با شما آشنا شدم! 😊`,
        sender: 'coach',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        type: 'text',
        mood: 'happy'
      },
      {
        id: 'msg-2',
        content: `می‌بینم که سطح فعلی شما "${student.level}" است. این عالیه! من اینجا هستم تا در تمام مراحل یادگیری کنارتان باشم. 🎯`,
        sender: 'coach',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: 'text',
        mood: 'encouraging'
      },
      {
        id: 'msg-3',
        content: 'چه چیزی بیش از همه علاقه‌مندید امروز یاد بگیرید؟ من برای شروع چند پیشنهاد دارم! 💡',
        sender: 'coach',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        type: 'text',
        mood: 'excited'
      }
    ];

    setCoach(studentCoach);
    setAnalysis(studentAnalysis);
    setChatMessages(welcomeMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate AI response based on message content
    setTimeout(() => {
      const message = newMessage.toLowerCase();
      let response = '';
      let mood: ChatMessage['mood'] = 'thinking';

      if (message.includes('سلام') || message.includes('hello')) {
        response = 'سلام! چه خبر؟ چطور می‌تونم کمکتون کنم؟ 😊';
        mood = 'happy';
      } else if (message.includes('گرامر') || message.includes('grammar')) {
        response = 'گرامر خیلی مهمه! بیایید با قواعد ساده شروع کنیم. کدوم بخش رو میخواید تمرین کنیم؟ 📚';
        mood = 'encouraging';
      } else if (message.includes('مکالمه') || message.includes('speaking')) {
        response = 'مکالمه بهترین راه یادگیری زبانه! بیایید با جملات ساده شروع کنیم. آماده‌اید؟ 🗣️';
        mood = 'excited';
      } else if (message.includes('تست') || message.includes('test')) {
        response = 'تست‌ها خیلی مفیدن برای اندازه‌گیری پیشرفت! می‌تونیم یه تست کوتاه شروع کنیم. موافقید؟ 📊';
        mood = 'encouraging';
      } else {
        const responses = [
          'جالبه! بذارید این موضوع رو بیشتر بررسی کنیم 🤔',
          'متشکرم که این رو مطرح کردید! این نکته مهمیه 💡',
          'خیلی خوب! این دقیقاً چیزیه که باید روش کار کنیم 🎯',
          'عالی! بیایید قدم به قدم پیش بریم 📝',
          'سوال خوبی پرسیدید! من جواب کاملی براتون دارم ✨'
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
        mood = 'thinking';
      }
      
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: response,
        sender: 'coach',
        timestamp: new Date(),
        type: 'text',
        mood: mood
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate speech recognition
      setTimeout(() => {
        const speechMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          content: 'پیام صوتی ضبط شد: "سلام، میخوام گرامر تمرین کنم"',
          sender: 'user',
          timestamp: new Date(),
          type: 'voice'
        };
        setChatMessages(prev => [...prev, speechMessage]);
        setIsListening(false);
      }, 3000);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="w-4 h-4 text-yellow-500" />;
      case 'excited': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'encouraging': return <Heart className="w-4 h-4 text-pink-500" />;
      default: return <Brain className="w-4 h-4 text-blue-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    const labels = {
      high: 'اولویت بالا',
      medium: 'اولویت متوسط',
      low: 'اولویت پایین'
    };
    return <Badge className={colors[priority as keyof typeof colors]}>{labels[priority as keyof typeof labels]}</Badge>;
  };

  return (
    <StudentPageLayout
      title="مربی هوشمند"
      description="مربی هوش مصنوعی شخصی شما برای یادگیری بهتر زبان"
      onStudentLoaded={handleStudentLoaded}
    >
      {coach && analysis && (
        <div className="space-y-6">
          {/* Coach Info Card */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg">
                    🤖
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{coach.name}</h2>
                    {getMoodIcon(coach.mood)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{coach.personality}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span>انرژی: {coach.energy}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{coach.averageRating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span>{coach.totalSessions} جلسه</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">تخصص‌ها:</h4>
                <div className="flex flex-wrap gap-2">
                  {coach.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <Progress value={coach.energy} className="h-2" />
            </CardContent>
          </Card>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                گفتگو
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                تحلیل
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                پیشنهادات
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-4">
              <Card className="h-96 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      گفتگو با مربی
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleMute}
                        className={isMuted ? 'text-red-500' : ''}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleListening}
                        className={isListening ? 'text-red-500 animate-pulse' : ''}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-72">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.sender === 'coach' && message.mood && getMoodIcon(message.mood)}
                            <div>
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString('fa-IR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="پیام خود را بنویسید..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overall Score */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      نمره کلی
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}
                      </div>
                      <Progress value={analysis.overallScore} className="h-3 mb-4" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">سبک یادگیری</p>
                          <p className="font-semibold">{analysis.learningStyle}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">زمان ترجیحی</p>
                          <p className="font-semibold">{analysis.preferredTime}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <TrendingUp className="w-5 h-5" />
                      نقاط قوت
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.strengths.map((strength) => (
                        <div key={strength.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{strength.skill}</h4>
                            <div className="flex items-center gap-1">
                              {strength.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                              <span className={`font-bold ${getScoreColor(strength.score)}`}>
                                {strength.score}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{strength.description}</p>
                          <Progress value={strength.score} className="h-2 mt-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weaknesses */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <TrendingDown className="w-5 h-5" />
                    نقاط قابل بهبود
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.weaknesses.map((weakness) => (
                      <div key={weakness.id} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{weakness.skill}</h4>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(weakness.priority)}
                            <span className={`font-bold ${getScoreColor(weakness.score)}`}>
                              {weakness.score}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{weakness.description}</p>
                        <Progress value={weakness.score} className="h-2 mb-3" />
                        <div>
                          <h5 className="font-medium text-sm mb-2">تمرین‌های پیشنهادی:</h5>
                          <div className="flex flex-wrap gap-1">
                            {weakness.suggestedExercises.map((exercise, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {exercise}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysis.recommendations.map((rec) => (
                  <Card key={rec.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{rec.title}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            {getPriorityBadge(rec.priority)}
                            <Badge variant="secondary">{rec.type}</Badge>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{rec.estimatedTime} دقیقه</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                        {rec.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {rec.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        onClick={() => {
                          // Simulate starting a recommendation
                          const startMessage: ChatMessage = {
                            id: `msg-${Date.now()}`,
                            content: `شروع کردم: "${rec.title}"`,
                            sender: 'user',
                            timestamp: new Date(),
                            type: 'text'
                          };
                          setChatMessages(prev => [...prev, startMessage]);
                          
                          setTimeout(() => {
                            const responseMessage: ChatMessage = {
                              id: `msg-${Date.now() + 1}`,
                              content: `عالی! بیایید با "${rec.title}" شروع کنیم. این ${rec.estimatedTime} دقیقه وقت می‌بره. آماده‌اید؟ 🚀`,
                              sender: 'coach',
                              timestamp: new Date(),
                              type: 'text',
                              mood: 'excited'
                            };
                            setChatMessages(prev => [...prev, responseMessage]);
                          }, 1000);
                          
                          setActiveTab('chat');
                        }}
                      >
                        شروع
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </StudentPageLayout>
  );
}