"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft,
  Send,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  User,
  Bot
} from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  experience: number;
  rating: number;
  students: number;
  languages: string[];
  bio: string;
  hourlyRate: number;
  location: string;
  available: boolean;
  certificates: string[];
  phone: string;
  email: string;
  education: string;
  teachingMethods: string[];
  achievements: string[];
  availableDays: string[];
  availableHours: string[];
}

interface Message {
  id: string;
  text: string;
  sender: "student" | "teacher";
  timestamp: Date;
  isRead: boolean;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - در آینده از API دریافت می‌شود
  const mockTeachers: Teacher[] = [
    {
      id: "1",
      name: "سارا احمدی",
      avatar: "/images/teacher1.jpg",
      specialty: "مکالمه انگلیسی",
      experience: 8,
      rating: 4.9,
      students: 156,
      languages: ["انگلیسی", "فارسی"],
      bio: "معلم با تجربه در زمینه آموزش مکالمه انگلیسی با روش‌های مدرن و تعاملی.",
      hourlyRate: 250000,
      location: "تهران",
      available: true,
      certificates: ["CELTA", "TESOL", "IELTS Trainer"],
      phone: "09123456789",
      email: "sara.ahmadi@example.com",
      education: "کارشناسی ارشد آموزش زبان انگلیسی - دانشگاه تهران",
      teachingMethods: ["مکالمه تعاملی", "تمرین‌های عملی", "استفاده از فیلم و موسیقی"],
      achievements: ["برنده جایزه بهترین معلم سال 1402", "نمره 8.5 در آیلتس"],
      availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"],
      availableHours: ["09:00-12:00", "14:00-17:00", "18:00-21:00"]
    },
    {
      id: "2",
      name: "علی محمدی",
      avatar: "/images/teacher2.jpg",
      specialty: "گرامر پیشرفته",
      experience: 12,
      rating: 4.8,
      students: 203,
      languages: ["انگلیسی", "فارسی", "عربی"],
      bio: "متخصص در آموزش گرامر پیشرفته و آمادگی برای آزمون‌های بین‌المللی.",
      hourlyRate: 300000,
      location: "اصفهان",
      available: true,
      certificates: ["DELTA", "Cambridge Trainer", "TOEFL Expert"],
      phone: "09187654321",
      email: "ali.mohammadi@example.com",
      education: "دکترای زبان‌شناسی کاربردی - دانشگاه اصفهان",
      teachingMethods: ["آموزش گرامر تعاملی", "تمرین‌های نوشتاری", "آزمون‌های منظم"],
      achievements: ["مدرس برتر دانشگاه اصفهان", "نویسنده کتاب‌های آموزشی"],
      availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه"],
      availableHours: ["08:00-11:00", "15:00-18:00", "19:00-22:00"]
    }
  ];

  // Mock initial messages
  const initialMessages: Message[] = [
    {
      id: "1",
      text: "سلام! خوشحالم که با شما آشنا شدم. چطور می‌تونم کمکتون کنم؟",
      sender: "teacher",
      timestamp: new Date(Date.now() - 60000),
      isRead: true
    },
    {
      id: "2",
      text: "سلام! من می‌خوام زبان انگلیسی یاد بگیرم. می‌تونید راهنماییم کنید؟",
      sender: "student",
      timestamp: new Date(Date.now() - 30000),
      isRead: true
    },
    {
      id: "3",
      text: "بله حتماً! من تخصصم در مکالمه انگلیسی هست. چه سطحی دارید؟",
      sender: "teacher",
      timestamp: new Date(Date.now() - 15000),
      isRead: false
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      const foundTeacher = mockTeachers.find(t => t.id === params.id);
      setTeacher(foundTeacher || null);
      setMessages(initialMessages);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const studentMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "student",
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, studentMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate teacher response
    setTimeout(() => {
      const teacherResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getTeacherResponse(newMessage),
        sender: "teacher",
        timestamp: new Date(),
        isRead: false
      };
      setMessages(prev => [...prev, teacherResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const getTeacherResponse = (message: string): string => {
    const responses = [
      "بله، حتماً! من آماده کمک به شما هستم.",
      "عالی! این موضوع رو می‌تونیم بررسی کنیم.",
      "ممنون از پیام شما. بله، این امکان وجود داره.",
      "حتماً! من تجربه زیادی در این زمینه دارم.",
      "بله، می‌تونیم از همین امروز شروع کنیم.",
      "عالی! من روش‌های مختلفی برای آموزش دارم.",
      "بله، این موضوع رو می‌تونیم در جلسه اول بررسی کنیم.",
      "ممنون! من آماده شروع کلاس با شما هستم."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              معلم یافت نشد
            </h1>
            <Button onClick={() => router.push("/teachers")}>
              بازگشت به لیست معلمان
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push(`/teachers/${params.id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به پروفایل معلم
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Teacher Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-8">
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={teacher.avatar} alt={teacher.name} />
                  <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  {teacher.name}
                </CardTitle>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{teacher.rating}</span>
                  <span className="text-sm text-gray-500">({teacher.students} دانش‌آموز)</span>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {teacher.specialty}
                </Badge>
                {teacher.available && (
                  <Badge className="bg-green-500 text-white text-xs">
                    آنلاین
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{teacher.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{teacher.experience} سال تجربه</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{teacher.email}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  چت با {teacher.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === "student" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[70%] ${message.sender === "student" ? "flex-row-reverse" : "flex-row"}`}>
                        <Avatar className="w-8 h-8">
                          {message.sender === "teacher" ? (
                            <AvatarImage src={teacher.avatar} alt={teacher.name} />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <AvatarFallback className="text-xs">
                            {message.sender === "teacher" ? teacher.name.split(' ').map(n => n[0]).join('') : "شما"}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`rounded-lg px-4 py-2 ${
                          message.sender === "student" 
                            ? "bg-blue-600 text-white dark:bg-blue-500" 
                            : "bg-muted text-foreground"
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-end gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
                          <AvatarFallback className="text-xs">
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="پیام خود را بنویسید..."
                      className="flex-1 resize-none"
                      rows={1}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      size="icon"
                      className="self-end"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 