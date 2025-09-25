'use client';

import { useState, useRef, useEffect } from 'react';
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
  BarChart3,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  BookMarked,
  Award,
  Trophy
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
  suggestions?: string[];
  exercises?: Exercise[];
  isTyping?: boolean;
  audioUrl?: string;
}

interface Exercise {
  id: string;
  type: 'grammar' | 'vocabulary' | 'speaking' | 'listening' | 'test';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  content?: any;
  isCompleted?: boolean;
  score?: number;
}

interface VoiceSettings {
  isEnabled: boolean;
  language: string;
  speed: number;
  pitch: number;
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
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    isEnabled: true,
    language: 'fa-IR',
    speed: 1.0,
    pitch: 1.0
  });
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [sessionStats, setSessionStats] = useState({
    messagesCount: 0,
    exercisesCompleted: 0,
    timeSpent: 0,
    streak: 0
  });

  // Refs for voice functionality
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize voice recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fa-IR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Text-to-speech function
  const speakText = (text: string) => {
    if (!voiceSettings.isEnabled || isMuted) return;

    // Stop any current speech
    if (synthesisRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceSettings.language;
    utterance.rate = voiceSettings.speed;
    utterance.pitch = voiceSettings.pitch;
    
    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

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

  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || newMessage;
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date(),
      type: messageText ? 'voice' : 'text'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    setIsTyping(true);

    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      messagesCount: prev.messagesCount + 1
    }));

    try {
      // Call AI API
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          studentLevel: currentStudent?.level || 'مبتدی',
          studentName: currentStudent?.first_name || 'کاربر',
          conversationHistory: chatMessages.slice(-5) // Last 5 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.success) {
        const aiResponse: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          content: data.data.response,
          sender: 'coach',
          timestamp: new Date(),
          type: 'text',
          mood: data.data.mood,
          suggestions: data.data.suggestions,
          exercises: data.data.exercises
        };

        setChatMessages(prev => [...prev, aiResponse]);
        
        // Speak the response if voice is enabled
        if (voiceSettings.isEnabled && !isMuted) {
          speakText(data.data.response);
        }
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response
      const fallbackResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: 'متاسفم، در حال حاضر مشکل فنی دارم. لطفاً دوباره تلاش کنید. 😔',
        sender: 'coach',
        timestamp: new Date(),
        type: 'text',
        mood: 'thinking'
      };
      
      setChatMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('مرورگر شما از تشخیص صدا پشتیبانی نمی‌کند');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      window.speechSynthesis.cancel();
    }
  };

  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setActiveTab('chat');
    
    const exerciseMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: `شروع کردم: "${exercise.title}"`,
      sender: 'user',
      timestamp: new Date(),
      type: 'exercise'
    };
    
    setChatMessages(prev => [...prev, exerciseMessage]);
  };

  const completeExercise = (score: number) => {
    if (currentExercise) {
      setCurrentExercise(prev => prev ? { ...prev, isCompleted: true, score } : null);
      
      setSessionStats(prev => ({
        ...prev,
        exercisesCompleted: prev.exercisesCompleted + 1
      }));

      const completionMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: `تمرین "${currentExercise.title}" با نمره ${score} تکمیل شد! 🎉`,
        sender: 'coach',
        timestamp: new Date(),
        type: 'text',
        mood: 'excited'
      };
      
      setChatMessages(prev => [...prev, completionMessage]);
      setCurrentExercise(null);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
    handleSendMessage(suggestion);
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
            <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                گفتگو
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                تحلیل
              </TabsTrigger>
              <TabsTrigger value="exercises" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                تمرینات
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                پیشنهادات
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-4">
              <Card className="h-[500px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      گفتگو با مربی
                      {isTyping && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          در حال تایپ...
                        </div>
                      )}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleMute}
                        className={isMuted ? 'text-red-500' : ''}
                        title={isMuted ? 'فعال کردن صدا' : 'خاموش کردن صدا'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleListening}
                        className={isListening ? 'text-red-500 animate-pulse' : ''}
                        title={isListening ? 'توقف ضبط' : 'شروع ضبط صدا'}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-[420px]">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
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
                            <div className="flex-1">
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString('fa-IR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                              
                              {/* Suggestions */}
                              {message.suggestions && message.suggestions.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {message.suggestions.map((suggestion, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-6"
                                      onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                      {suggestion}
                                    </Button>
                                  ))}
                                </div>
                              )}
                              
                              {/* Exercises */}
                              {message.exercises && message.exercises.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.exercises.map((exercise, index) => (
                                    <div key={index} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border">
                                      <h4 className="font-semibold text-sm">{exercise.title}</h4>
                                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{exercise.description}</p>
                                      <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={() => startExercise(exercise)}
                                      >
                                        شروع تمرین
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Current Exercise */}
                  {currentExercise && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                          {currentExercise.title}
                        </h3>
                        <Badge variant="secondary">{currentExercise.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {currentExercise.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => completeExercise(Math.floor(Math.random() * 40) + 60)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          تکمیل تمرین
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCurrentExercise(null)}
                        >
                          لغو
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="پیام خود را بنویسید..."
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={() => handleSendMessage()} 
                      size="sm"
                      disabled={isLoading || !newMessage.trim()}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Exercises Tab */}
            <TabsContent value="exercises" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Grammar Exercises */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <BookOpen className="w-5 h-5" />
                      تمرینات گرامر
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold text-sm">زمان حال ساده</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">تمرین ساخت جملات با زمان حال ساده</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">آسان</Badge>
                          <Button size="sm" className="text-xs">شروع</Button>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold text-sm">زمان گذشته</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">تمرین ساخت جملات با زمان گذشته</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">متوسط</Badge>
                          <Button size="sm" className="text-xs">شروع</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vocabulary Exercises */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <BookOpen className="w-5 h-5" />
                      تمرینات واژگان
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="font-semibold text-sm">کلمات روزمره</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">یادگیری کلمات پرکاربرد</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">آسان</Badge>
                          <Button size="sm" className="text-xs">شروع</Button>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="font-semibold text-sm">کلمات تجاری</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">واژگان مربوط به کسب و کار</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">متوسط</Badge>
                          <Button size="sm" className="text-xs">شروع</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Speaking Exercises */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-600">
                      <Mic className="w-5 h-5" />
                      تمرینات مکالمه
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-semibold text-sm">احوالپرسی</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">تمرین مکالمه روزمره</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">آسان</Badge>
                          <Button size="sm" className="text-xs">شروع</Button>
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-semibold text-sm">مکالمه تجاری</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">مکالمه در محیط کار</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">سخت</Badge>
                          <Button size="sm" className="text-xs">شروع</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Achievements */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    دستاوردها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold">اولین پیام</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">✅ تکمیل شده</p>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold">5 تمرین</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">⏳ در حال انجام</p>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold">3 روز متوالی</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">⏳ در حال انجام</p>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold">مکالمه‌کننده</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">⏳ در حال انجام</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              {/* Session Stats */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    آمار جلسه فعلی
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{sessionStats.messagesCount}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">پیام</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{sessionStats.exercisesCompleted}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">تمرین تکمیل شده</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{sessionStats.timeSpent}دق</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">زمان صرف شده</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{sessionStats.streak}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">روز متوالی</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Add to favorites or bookmark
                            console.log('Added to favorites:', rec.title);
                          }}
                        >
                          <BookMarked className="w-4 h-4" />
                        </Button>
                      </div>
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