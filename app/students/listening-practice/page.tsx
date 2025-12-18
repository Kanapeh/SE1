'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Mic,
  MicOff,
  Globe,
  TrendingUp,
  BarChart3,
  Loader2,
  AlertCircle,
  RefreshCw,
  FileText,
  Sparkles
} from 'lucide-react';
import StudentPageLayout, { Student } from '@/components/StudentPageLayout';
import { supabase } from '@/lib/supabase';

interface ListeningExercise {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  transcript: string;
  accent_type: string;
  difficulty_level: string;
  duration: number;
  topic_category: string;
  questions: ListeningQuestion[];
}

interface ListeningQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
  audio_start_time: number;
  audio_end_time: number;
}

interface SubmissionResult {
  submission_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  answers: Array<{
    question_id: string;
    student_answer: string;
    is_correct: boolean;
    points_earned: number;
  }>;
}

interface SpeechRecognitionExercise {
  id: string;
  title: string;
  description: string;
  target_text: string;
  accent_type: string;
  difficulty_level: string;
  pronunciation_hints: string[];
}

interface AccentPracticeExercise {
  id: string;
  title: string;
  description: string;
  target_accent: string;
  audio_url: string;
  transcript: string;
  difficulty_level: string;
  accent_features: any;
  practice_tips: string[];
}

export default function ListeningPracticePage() {
  const router = useRouter();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [exercises, setExercises] = useState<ListeningExercise[]>([]);
  const [speechExercises, setSpeechExercises] = useState<SpeechRecognitionExercise[]>([]);
  const [accentExercises, setAccentExercises] = useState<AccentPracticeExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ListeningExercise | null>(null);
  const [selectedSpeechExercise, setSelectedSpeechExercise] = useState<SpeechRecognitionExercise | null>(null);
  const [selectedAccentExercise, setSelectedAccentExercise] = useState<AccentPracticeExercise | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [activeTab, setActiveTab] = useState('listening');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [listeningAttempts, setListeningAttempts] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [speechResult, setSpeechResult] = useState<any>(null);
  const [accentResult, setAccentResult] = useState<any>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    loadStudentData();
    loadExercises();
    loadSpeechExercises();
    loadAccentExercises();
    initializeSpeechRecognition();
  }, []);

  useEffect(() => {
    if (selectedExercise && audioRef.current) {
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
    }
  }, [selectedExercise]);

  const loadStudentData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data: studentData, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      setCurrentStudent(studentData);
    } catch (error) {
      console.error('Error loading student:', error);
    }
  };

  const loadExercises = async () => {
    try {
      const response = await fetch('/api/listening-practice/exercises?limit=20');
      const result = await response.json();
      if (result.success) {
        setExercises(result.data.exercises || []);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const loadSpeechExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('speech_recognition_exercises')
        .select('*')
        .eq('is_active', true)
        .limit(10);

      if (error) throw error;
      setSpeechExercises(data || []);
    } catch (error) {
      console.error('Error loading speech exercises:', error);
    }
  };

  const loadAccentExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('accent_practice_exercises')
        .select('*')
        .eq('is_active', true)
        .limit(10);

      if (error) throw error;
      setAccentExercises(data || []);
    } catch (error) {
      console.error('Error loading accent exercises:', error);
    }
  };

  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  };

  const handleSelectExercise = (exercise: ListeningExercise) => {
    setSelectedExercise(exercise);
    setAnswers({});
    setSubmissionResult(null);
    setListeningAttempts(0);
    setShowTranscript(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !selectedExercise) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setListeningAttempts(prev => prev + 1);
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSubmit = async () => {
    if (!selectedExercise || !currentStudent) return;

    setIsLoading(true);
    try {
      const startTime = Date.now();
      const response = await fetch('/api/listening-practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          exerciseId: selectedExercise.id,
          answers: answers,
          timeTaken: Math.floor((Date.now() - startTime) / 1000),
          listeningAttempts: listeningAttempts
        })
      });

      const result = await response.json();
      if (result.success) {
        setSubmissionResult(result.data);
      }
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = () => {
    if (!recognitionRef.current) {
      alert('تشخیص گفتار در این مرورگر پشتیبانی نمی‌شود');
      return;
    }

    setIsRecording(true);
    setRecognizedText('');
    recognitionRef.current.start();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSpeechSubmit = async () => {
    if (!selectedSpeechExercise || !currentStudent || !recognizedText) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/listening-practice/speech-recognition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          exerciseId: selectedSpeechExercise.id,
          recognizedText: recognizedText
        })
      });

      const result = await response.json();
      if (result.success) {
        setSpeechResult(result.data);
      }
    } catch (error) {
      console.error('Error submitting speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccentSubmit = async () => {
    if (!selectedAccentExercise || !currentStudent) return;

    setIsLoading(true);
    try {
      // در اینجا باید فایل صوتی را آپلود کنیم
      // برای نمونه، از recognizedText استفاده می‌کنیم
      const response = await fetch('/api/listening-practice/accent-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          exerciseId: selectedAccentExercise.id,
          recognizedText: recognizedText || selectedAccentExercise.transcript
        })
      });

      const result = await response.json();
      if (result.success) {
        setAccentResult(result.data);
      }
    } catch (error) {
      console.error('Error submitting accent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (level: string): string => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyName = (level: string): string => {
    const names: Record<string, string> = {
      beginner: 'مبتدی',
      intermediate: 'متوسط',
      advanced: 'پیشرفته'
    };
    return names[level] || level;
  };

  const getAccentName = (accent: string): string => {
    const names: Record<string, string> = {
      american: 'آمریکایی',
      british: 'بریتانیایی',
      australian: 'استرالیایی',
      canadian: 'کانادایی',
      irish: 'ایرلندی',
      neutral: 'خنثی'
    };
    return names[accent] || accent;
  };

  return (
    <StudentPageLayout
      student={currentStudent}
      onStudentLoaded={setCurrentStudent}
      title="تمرین شنیداری"
      description="بهبود مهارت شنیداری با تمرین‌های پیشرفته"
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              تمرین شنیداری پیشرفته
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              بهبود مهارت شنیداری با تمرین‌های متنوع و تشخیص گفتار
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listening">تمرین شنیداری</TabsTrigger>
            <TabsTrigger value="speech">تشخیص گفتار</TabsTrigger>
            <TabsTrigger value="accent">تمرین لهجه</TabsTrigger>
          </TabsList>

          {/* Listening Tab */}
          <TabsContent value="listening" className="space-y-6">
            {!selectedExercise ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.map((exercise) => (
                  <Card key={exercise.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleSelectExercise(exercise)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{exercise.title}</CardTitle>
                        <Badge className={getDifficultyColor(exercise.difficulty_level)}>
                          {getDifficultyName(exercise.difficulty_level)}
                        </Badge>
                      </div>
                      {exercise.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {exercise.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <span>{getAccentName(exercise.accent_type || 'neutral')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{exercise.duration} ثانیه</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span>{exercise.questions?.length || 0} سوال</span>
                        </div>
                        <Button className="w-full mt-4" onClick={(e) => {
                          e.stopPropagation();
                          handleSelectExercise(exercise);
                        }}>
                          <Headphones className="w-4 h-4 mr-2" />
                          شروع تمرین
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Audio Player */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{selectedExercise.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(selectedExercise.difficulty_level)}>
                          {getDifficultyName(selectedExercise.difficulty_level)}
                        </Badge>
                        <Badge variant="outline">
                          {getAccentName(selectedExercise.accent_type || 'neutral')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Audio Controls */}
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={handlePlayPause}
                          size="lg"
                          className="rounded-full w-16 h-16"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                        </Button>
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          size="sm"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          از ابتدا
                        </Button>
                        <Button
                          onClick={() => setShowTranscript(!showTranscript)}
                          variant="outline"
                          size="sm"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {showTranscript ? 'مخفی کردن' : 'نمایش'} متن
                        </Button>
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {listeningAttempts} بار گوش داده شده
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <Progress value={(currentTime / duration) * 100} />
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Audio Element */}
                      <audio
                        ref={audioRef}
                        src={selectedExercise.audio_url}
                        onEnded={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        className="hidden"
                      />

                      {/* Transcript */}
                      {showTranscript && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedExercise.transcript}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Questions */}
                {!submissionResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle>سوالات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {selectedExercise.questions?.map((question, index) => (
                          <div key={question.id} className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Badge className="mt-1">{index + 1}</Badge>
                              <div className="flex-1">
                                <p className="font-medium mb-3">{question.question_text}</p>
                                {question.question_type === 'multiple_choice' && (
                                  <RadioGroup
                                    value={answers[question.id] || ''}
                                    onValueChange={(value) => {
                                      setAnswers(prev => ({ ...prev, [question.id]: value }));
                                    }}
                                  >
                                    {question.options?.map((option, optIdx) => (
                                      <div key={optIdx} className="flex items-center space-x-2 space-x-reverse mb-2">
                                        <RadioGroupItem value={option} id={`${question.id}-${optIdx}`} />
                                        <Label htmlFor={`${question.id}-${optIdx}`} className="cursor-pointer">
                                          {option}
                                        </Label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                )}
                                {question.question_type === 'true_false' && (
                                  <RadioGroup
                                    value={answers[question.id] || ''}
                                    onValueChange={(value) => {
                                      setAnswers(prev => ({ ...prev, [question.id]: value }));
                                    }}
                                  >
                                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                                      <RadioGroupItem value="true" id={`${question.id}-true`} />
                                      <Label htmlFor={`${question.id}-true`} className="cursor-pointer">درست</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                      <RadioGroupItem value="false" id={`${question.id}-false`} />
                                      <Label htmlFor={`${question.id}-false`} className="cursor-pointer">غلط</Label>
                                    </div>
                                  </RadioGroup>
                                )}
                                {question.question_type === 'fill_blank' && (
                                  <input
                                    type="text"
                                    value={answers[question.id] || ''}
                                    onChange={(e) => {
                                      setAnswers(prev => ({ ...prev, [question.id]: e.target.value }));
                                    }}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="پاسخ خود را بنویسید..."
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          onClick={handleSubmit}
                          disabled={isLoading || Object.keys(answers).length !== selectedExercise.questions?.length}
                          className="w-full"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              در حال ارسال...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              ارسال پاسخ‌ها
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Results */}
                {submissionResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          نتایج
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-5xl font-bold text-blue-600 mb-2">
                              {submissionResult.score}%
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {submissionResult.correct_answers} از {submissionResult.total_questions} سوال صحیح
                            </p>
                          </div>
                          <Progress value={submissionResult.score} className="h-3" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Answer Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>جزئیات پاسخ‌ها</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {submissionResult.answers.map((answer, idx) => {
                            const question = selectedExercise.questions?.find(q => q.id === answer.question_id);
                            return (
                              <div
                                key={answer.question_id}
                                className={`p-4 rounded-lg border ${
                                  answer.is_correct
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {answer.is_correct ? (
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span className="font-medium">سوال {idx + 1}</span>
                                  </div>
                                  <Badge className={answer.is_correct ? 'bg-green-600' : 'bg-red-600'}>
                                    {answer.points_earned} امتیاز
                                  </Badge>
                                </div>
                                <p className="text-sm mb-2">{question?.question_text}</p>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">پاسخ شما: </span>
                                    <span className={answer.is_correct ? 'text-green-600' : 'text-red-600'}>
                                      {answer.student_answer}
                                    </span>
                                  </p>
                                  {!answer.is_correct && (
                                    <p>
                                      <span className="font-medium">پاسخ صحیح: </span>
                                      <span className="text-green-600">{question?.correct_answer}</span>
                                    </p>
                                  )}
                                  {question?.explanation && (
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                      {question.explanation}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedExercise(null);
                          setSubmissionResult(null);
                          setAnswers({});
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        تمرین جدید
                      </Button>
                      <Button
                        onClick={() => {
                          setAnswers({});
                          setSubmissionResult(null);
                          handleReset();
                        }}
                        className="flex-1"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        تلاش مجدد
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </TabsContent>

          {/* Speech Recognition Tab */}
          <TabsContent value="speech" className="space-y-6">
            {!selectedSpeechExercise ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {speechExercises.map((exercise) => (
                  <Card key={exercise.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedSpeechExercise(exercise)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{exercise.title}</CardTitle>
                        <Badge className={getDifficultyColor(exercise.difficulty_level)}>
                          {getDifficultyName(exercise.difficulty_level)}
                        </Badge>
                      </div>
                      {exercise.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {exercise.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {exercise.target_text}
                          </p>
                        </div>
                        {exercise.pronunciation_hints && exercise.pronunciation_hints.length > 0 && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="font-medium mb-1">نکات:</p>
                            <ul className="space-y-1">
                              {exercise.pronunciation_hints.map((hint, idx) => (
                                <li key={idx}>• {hint}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <Button className="w-full mt-4" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpeechExercise(exercise);
                        }}>
                          <Mic className="w-4 h-4 mr-2" />
                          شروع تمرین
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{selectedSpeechExercise.title}</CardTitle>
                      <Badge className={getDifficultyColor(selectedSpeechExercise.difficulty_level)}>
                        {getDifficultyName(selectedSpeechExercise.difficulty_level)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white mb-2">متن هدف:</p>
                        <p className="text-gray-700 dark:text-gray-300">{selectedSpeechExercise.target_text}</p>
                      </div>

                      {selectedSpeechExercise.pronunciation_hints && selectedSpeechExercise.pronunciation_hints.length > 0 && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                          <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">نکات تلفظ:</p>
                          <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                            {selectedSpeechExercise.pronunciation_hints.map((hint, idx) => (
                              <li key={idx}>• {hint}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-4">
                          <Button
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                            size="lg"
                            className={`rounded-full w-20 h-20 ${
                              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            {isRecording ? (
                              <MicOff className="w-8 h-8" />
                            ) : (
                              <Mic className="w-8 h-8" />
                            )}
                          </Button>
                        </div>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                          {isRecording ? 'در حال ضبط...' : 'روی دکمه کلیک کنید و متن را بگویید'}
                        </p>

                        {recognizedText && (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                            <p className="font-medium text-gray-900 dark:text-white mb-2">متن تشخیص داده شده:</p>
                            <p className="text-gray-700 dark:text-gray-300">{recognizedText}</p>
                          </div>
                        )}

                        <Button
                          onClick={handleSpeechSubmit}
                          disabled={isLoading || !recognizedText}
                          className="w-full"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              در حال ارزیابی...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              ارسال و ارزیابی
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Speech Results */}
                {speechResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          نتایج تشخیص گفتار
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">دقت</p>
                            <p className="text-3xl font-bold text-blue-600">
                              {Math.round(speechResult.accuracy)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">تلفظ</p>
                            <p className="text-3xl font-bold text-green-600">
                              {Math.round(speechResult.pronunciation_score)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">روانی</p>
                            <p className="text-3xl font-bold text-purple-600">
                              {Math.round(speechResult.fluency_score)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">نمره کلی</p>
                            <p className="text-3xl font-bold text-orange-600">
                              {Math.round(speechResult.overall_score)}%
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            {speechResult.feedback}
                          </p>
                        </div>
                        {speechResult.word_errors && speechResult.word_errors.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">خطاها:</p>
                            <div className="space-y-2">
                              {speechResult.word_errors.map((error: any, idx: number) => (
                                <div key={idx} className="text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                                  <span className="text-red-600">{error.word}</span>
                                  {' → '}
                                  <span className="text-green-600">{error.expected}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </>
            )}
          </TabsContent>

          {/* Accent Practice Tab */}
          <TabsContent value="accent" className="space-y-6">
            {!selectedAccentExercise ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accentExercises.map((exercise) => (
                  <Card key={exercise.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedAccentExercise(exercise)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{exercise.title}</CardTitle>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                          {getAccentName(exercise.target_accent)}
                        </Badge>
                      </div>
                      {exercise.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {exercise.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {exercise.transcript}
                          </p>
                        </div>
                        {exercise.practice_tips && exercise.practice_tips.length > 0 && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="font-medium mb-1">نکات تمرین:</p>
                            <ul className="space-y-1">
                              {exercise.practice_tips.map((tip, idx) => (
                                <li key={idx}>• {tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <Button className="w-full mt-4" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAccentExercise(exercise);
                        }}>
                          <Globe className="w-4 h-4 mr-2" />
                          شروع تمرین لهجه
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{selectedAccentExercise.title}</CardTitle>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                        لهجه {getAccentName(selectedAccentExercise.target_accent)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white mb-2">متن:</p>
                        <p className="text-gray-700 dark:text-gray-300">{selectedAccentExercise.transcript}</p>
                      </div>

                      {/* Audio Player for Accent Example */}
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-2">گوش دادن به نمونه:</p>
                          <audio controls className="w-full" src={selectedAccentExercise.audio_url}>
                            مرورگر شما از پخش صوتی پشتیبانی نمی‌کند.
                          </audio>
                        </div>

                        <div className="space-y-4">
                          <p className="font-medium">ضبط تلفظ خود:</p>
                          <div className="flex items-center justify-center gap-4">
                            <Button
                              onClick={isRecording ? handleStopRecording : handleStartRecording}
                              size="lg"
                              className={`rounded-full w-20 h-20 ${
                                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
                              }`}
                            >
                              {isRecording ? (
                                <MicOff className="w-8 h-8" />
                              ) : (
                                <Mic className="w-8 h-8" />
                              )}
                            </Button>
                          </div>
                          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            {isRecording ? 'در حال ضبط...' : 'روی دکمه کلیک کنید و متن را با لهجه هدف بگویید'}
                          </p>

                          {recognizedText && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                              <p className="font-medium text-gray-900 dark:text-white mb-2">متن تشخیص داده شده:</p>
                              <p className="text-gray-700 dark:text-gray-300">{recognizedText}</p>
                            </div>
                          )}

                          <Button
                            onClick={handleAccentSubmit}
                            disabled={isLoading || !recognizedText}
                            className="w-full"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                در حال ارزیابی...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                ارزیابی لهجه
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Accent Results */}
                {accentResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="w-5 h-5" />
                          نتایج تمرین لهجه
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">تطابق لهجه</p>
                            <p className="text-3xl font-bold text-purple-600">
                              {Math.round(accentResult.accent_match_score)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">دقت تلفظ</p>
                            <p className="text-3xl font-bold text-green-600">
                              {Math.round(accentResult.pronunciation_accuracy)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">ریتم</p>
                            <p className="text-3xl font-bold text-blue-600">
                              {Math.round(accentResult.rhythm_score)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">آهنگ</p>
                            <p className="text-3xl font-bold text-orange-600">
                              {Math.round(accentResult.intonation_score)}%
                            </p>
                          </div>
                        </div>
                        {accentResult.feedback && (
                          <div className="mt-4 space-y-3">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-sm text-blue-800 dark:text-blue-300">
                                {accentResult.feedback.overall}
                              </p>
                            </div>
                            {accentResult.feedback.strengths && accentResult.feedback.strengths.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-2">نقاط قوت:</p>
                                <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                                  {accentResult.feedback.strengths.map((strength: string, idx: number) => (
                                    <li key={idx}>✓ {strength}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {accentResult.feedback.improvements && accentResult.feedback.improvements.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-2">نیاز به بهبود:</p>
                                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                                  {accentResult.feedback.improvements.map((improvement: string, idx: number) => (
                                    <li>• {improvement}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {accentResult.feedback.tips && accentResult.feedback.tips.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-2">نکات:</p>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                  {accentResult.feedback.tips.map((tip: string, idx: number) => (
                                    <li>💡 {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StudentPageLayout>
  );
}

