'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  PenTool,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  Lightbulb,
  Target,
  BarChart3,
  RefreshCw,
  Save,
  Send,
  Eye,
  Edit,
  Sparkles,
  Loader2,
  X,
  Check,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import StudentPageLayout, { Student } from '@/components/StudentPageLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface WritingExercise {
  id: string;
  title: string;
  description: string;
  prompt: string;
  topic_category: string;
  difficulty_level: string;
  word_limit_min: number;
  word_limit_max: number;
  estimated_time: number;
  evaluation_criteria: any;
  tips: string[];
}

interface CorrectionResult {
  word_count: number;
  character_count: number;
  scores: {
    overall: number;
    grammar: number;
    vocabulary: number;
    coherence: number;
    creativity: number;
  };
  grammar_errors: Array<{
    type: string;
    original: string;
    corrected: string;
    start: number;
    end: number;
    explanation: string;
    severity: string;
  }>;
  improvements: Array<{
    type: string;
    original: string;
    suggested: string;
    explanation: string;
    priority: string;
  }>;
  feedback: string;
}

interface WritingSubmission {
  id: string;
  content: string;
  word_count: number;
  overall_score: number;
  submitted_at: string;
  exercise: WritingExercise;
}

export default function WritingPracticePage() {
  const router = useRouter();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [exercises, setExercises] = useState<WritingExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<WritingExercise | null>(null);
  const [writingContent, setWritingContent] = useState('');
  const [correctionResult, setCorrectionResult] = useState<CorrectionResult | null>(null);
  const [submissions, setSubmissions] = useState<WritingSubmission[]>([]);
  const [activeTab, setActiveTab] = useState('exercises');
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadStudentData();
    loadExercises();
    loadSubmissions();
  }, []);

  useEffect(() => {
    if (writingContent) {
      const words = writingContent.trim().split(/\s+/).filter(w => w.length > 0);
      setWordCount(words.length);
      setCharacterCount(writingContent.length);
    } else {
      setWordCount(0);
      setCharacterCount(0);
    }
  }, [writingContent]);

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
      const response = await fetch('/api/writing-practice/exercises?limit=20');
      const result = await response.json();
      if (result.success) {
        setExercises(result.data.exercises || []);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const loadSubmissions = async () => {
    if (!currentStudent) return;

    try {
      const response = await fetch(`/api/writing-practice/submissions?studentId=${currentStudent.id}&limit=10`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Failed to load submissions');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // تبدیل ساختار داده به فرمت مورد نیاز
        const formattedSubmissions = result.data.submissions.map((sub: any) => ({
          id: sub.id,
          content: sub.content,
          word_count: sub.word_count,
          overall_score: sub.overall_score,
          submitted_at: sub.submitted_at,
          exercise: sub.exercise ? {
            id: sub.exercise.id,
            title: sub.exercise.title,
            description: sub.exercise.description,
            prompt: sub.exercise.prompt,
            difficulty_level: sub.exercise.difficulty_level,
            topic_category: sub.exercise.topic_category
          } : null
        }));
        
        setSubmissions(formattedSubmissions);
      } else {
        console.warn('Submissions API returned success=false:', result.error);
        setSubmissions([]);
      }
    } catch (error: any) {
      console.error('Error loading submissions:', error);
      toast.error('خطا در بارگذاری نوشته‌های قبلی', {
        description: error.message || 'لطفاً دوباره تلاش کنید'
      });
      setSubmissions([]);
    }
  };

  const handleSelectExercise = (exercise: WritingExercise) => {
    // ابتدا محتوای قبلی را پاک کن
    setWritingContent('');
    setCorrectionResult(null);
    setActiveTab('write');
    // سپس تمرین جدید را انتخاب کن
    setSelectedExercise(exercise);
    // بعد از اینکه state به‌روزرسانی شد، پیش‌نویس را بارگذاری کن
    setTimeout(() => {
      const draft = localStorage.getItem(`writing_draft_${exercise.id}`);
      if (draft !== null) {
        setWritingContent(draft);
        if (draft.trim()) {
          toast.info('پیش‌نویس بارگذاری شد', {
            description: 'نوشته قبلی شما بازیابی شد',
            duration: 2000
          });
        }
      }
    }, 100);
  };

  const handleAutoCorrect = async () => {
    if (!selectedExercise || !currentStudent || !writingContent.trim()) {
      toast.warning('لطفاً ابتدا متنی بنویسید');
      return;
    }

    if (wordCount < selectedExercise.word_limit_min) {
      toast.warning(`حداقل ${selectedExercise.word_limit_min} کلمه لازم است`);
      return;
    }

    setIsCorrecting(true);
    try {
      console.log('Starting auto-correct...', {
        studentId: currentStudent.id,
        exerciseId: selectedExercise.id,
        contentLength: writingContent.length
      });

      // ابتدا submission ایجاد می‌کنیم
      const submitResponse = await fetch('/api/writing-practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          exerciseId: selectedExercise.id,
          content: writingContent
        })
      });

      console.log('Submit response status:', submitResponse.status);

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json().catch(() => ({}));
        console.error('Submit API error:', {
          status: submitResponse.status,
          error: errorData
        });
        throw new Error(errorData.error || errorData.details || 'خطا در ارسال نوشته');
      }

      const submitResult = await submitResponse.json();
      console.log('Submit result:', submitResult);
      
      if (submitResult.success) {
        // همیشه مستقیماً auto-correct را فراخوانی کنیم تا مطمئن شویم
        console.log('Calling auto-correct directly...');
        const correctionResponse = await fetch('/api/writing-practice/auto-correct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submissionId: submitResult.data.submission_id,
            content: writingContent,
            exerciseId: selectedExercise.id
          })
        });

        if (!correctionResponse.ok) {
          const errorText = await correctionResponse.text();
          console.error('Auto-correct API error:', errorText);
          throw new Error('خطا در تصحیح خودکار');
        }

        const correctionResult = await correctionResponse.json();
        console.log('Correction result:', correctionResult);

        if (correctionResult.success && correctionResult.data) {
          // تبدیل ساختار داده به فرمت مورد نیاز
          const formattedCorrection: CorrectionResult = {
            scores: correctionResult.data.scores,
            grammar_errors: correctionResult.data.grammar_errors || [],
            improvements: correctionResult.data.improvements || [],
            feedback: correctionResult.data.feedback || 'تصحیح انجام شد'
          };
          
          setCorrectionResult(formattedCorrection);
          toast.success('تصحیح خودکار انجام شد!', {
            description: `نمره شما: ${formattedCorrection.scores.overall}%`,
            duration: 3000
          });
          await loadSubmissions();
        } else {
          throw new Error(correctionResult.error || 'خطا در تصحیح خودکار');
        }
      } else {
        throw new Error(submitResult.error || 'خطا در ارسال نوشته');
      }
    } catch (error: any) {
      console.error('Error correcting:', error);
      toast.error('خطا در تصحیح خودکار', {
        description: error.message || 'لطفاً دوباره تلاش کنید',
        duration: 5000
      });
    } finally {
      setIsCorrecting(false);
    }
  };

  const handleSaveDraft = async () => {
    // ذخیره در localStorage و ایجاد submission
    if (!selectedExercise || !currentStudent) {
      toast.warning('لطفاً ابتدا یک تمرین انتخاب کنید');
      return;
    }

    if (!writingContent.trim()) {
      toast.warning('هیچ متنی برای ذخیره وجود ندارد');
      return;
    }

    try {
      // ذخیره در localStorage
      const key = `writing_draft_${selectedExercise.id}`;
      localStorage.setItem(key, writingContent);
      
      // بررسی اینکه واقعاً ذخیره شد
      const saved = localStorage.getItem(key);
      if (saved !== writingContent) {
        throw new Error('Failed to verify draft save');
      }

      // بررسی وجود submission قبلی
      const existingSubmission = submissions.find(
        sub => sub.exercise && (sub.exercise as any).id === selectedExercise.id
      );

      // ایجاد یا به‌روزرسانی submission در دیتابیس
      try {
        const submitResponse = await fetch('/api/writing-practice/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: currentStudent.id,
            exerciseId: selectedExercise.id,
            content: writingContent
          })
        });

        if (submitResponse.ok) {
          // بارگذاری مجدد submissions
          await loadSubmissions();
          
          toast.success('پیش‌نویس ذخیره شد', {
            description: existingSubmission 
              ? 'نوشته شما به‌روزرسانی شد' 
              : 'نوشته شما ذخیره شد و در "نوشته‌های من" نمایش داده می‌شود',
            duration: 3000
          });
        } else {
          // اگر submission ایجاد/به‌روزرسانی نشد، حداقل localStorage ذخیره شده
          toast.success('پیش‌نویس در مرورگر ذخیره شد', {
            description: 'نوشته شما در مرورگر ذخیره شد',
            duration: 2000
          });
        }
      } catch (submitError) {
        // اگر submission ایجاد/به‌روزرسانی نشد، حداقل localStorage ذخیره شده
        console.warn('Could not save submission, but draft saved in localStorage:', submitError);
        toast.success('پیش‌نویس در مرورگر ذخیره شد', {
          description: 'نوشته شما در مرورگر ذخیره شد',
          duration: 2000
        });
      }

      console.log('Draft saved successfully:', { key, length: writingContent.length });
    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast.error('خطا در ذخیره پیش‌نویس', {
        description: error.message || 'لطفاً دوباره تلاش کنید',
        duration: 3000
      });
    }
  };

  const handleLoadDraft = () => {
    if (!selectedExercise) return;
    
    try {
      const key = `writing_draft_${selectedExercise.id}`;
      const draft = localStorage.getItem(key);
      
      if (draft !== null) {
        setWritingContent(draft);
        console.log('Draft loaded successfully:', { key, length: draft.length });
        
        // نمایش پیام فقط اگر متن غیر خالی باشد
        if (draft.trim()) {
          toast.info('پیش‌نویس بارگذاری شد', {
            description: 'نوشته قبلی شما بازیابی شد',
            duration: 2000
          });
        }
      } else {
        console.log('No draft found for exercise:', selectedExercise.id);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این نوشته را حذف کنید؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/writing-practice/submissions/${submissionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'خطا در حذف نوشته');
      }

      const result = await response.json();
      
      if (result.success) {
        // حذف از localStorage هم اگر وجود دارد
        const submission = submissions.find(s => s.id === submissionId);
        if (submission && submission.exercise) {
          const key = `writing_draft_${(submission.exercise as any).id}`;
          localStorage.removeItem(key);
        }

        // بارگذاری مجدد submissions
        await loadSubmissions();
        
        toast.success('نوشته حذف شد', {
          description: 'نوشته شما با موفقیت حذف شد',
          duration: 2000
        });
      } else {
        throw new Error(result.error || 'خطا در حذف نوشته');
      }
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      toast.error('خطا در حذف نوشته', {
        description: error.message || 'لطفاً دوباره تلاش کنید',
        duration: 3000
      });
    }
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

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const highlightErrors = (content: string, errors: any[]): string => {
    let highlighted = content;
    // Sort errors by position (reverse order to maintain positions)
    const sortedErrors = [...errors].sort((a, b) => b.start - a.start);
    
    sortedErrors.forEach(error => {
      const before = highlighted.substring(0, error.start);
      const errorText = highlighted.substring(error.start, error.end);
      const after = highlighted.substring(error.end);
      highlighted = `${before}<mark class="bg-red-200 dark:bg-red-900/30">${errorText}</mark>${after}`;
    });
    
    return highlighted;
  };

  // حذف useEffect - حالا handleSelectExercise خودش پیش‌نویس را بارگذاری می‌کند
  // useEffect(() => {
  //   if (selectedExercise) {
  //     handleLoadDraft();
  //   }
  // }, [selectedExercise]);

  return (
    <StudentPageLayout
      student={currentStudent}
      onStudentLoaded={setCurrentStudent}
      title="تمرین نوشتن"
      description="بهبود مهارت نوشتن با تصحیح خودکار و پیشنهادات بهبود"
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              تمرین نوشتن
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              نوشتن را تمرین کنید و با تصحیح خودکار پیشرفت کنید
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="exercises">تمرین‌ها</TabsTrigger>
            <TabsTrigger value="write">نوشتن</TabsTrigger>
            <TabsTrigger value="submissions">نوشته‌های من</TabsTrigger>
          </TabsList>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-6">
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
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {exercise.prompt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{exercise.word_limit_min}-{exercise.word_limit_max} کلمه</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{exercise.estimated_time} دقیقه</span>
                        </div>
                      </div>
                      {exercise.tips && exercise.tips.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">نکات:</p>
                          <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                            {exercise.tips.slice(0, 2).map((tip, idx) => (
                              <li key={idx}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Button className="w-full mt-4" onClick={(e) => {
                        e.stopPropagation();
                        handleSelectExercise(exercise);
                      }}>
                        <PenTool className="w-4 h-4 mr-2" />
                        شروع نوشتن
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Write Tab */}
          <TabsContent value="write" className="space-y-6">
            {!selectedExercise ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <PenTool className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    لطفاً یک تمرین را انتخاب کنید تا شروع به نوشتن کنید.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Exercise Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{selectedExercise.title}</CardTitle>
                        {selectedExercise.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {selectedExercise.description}
                          </p>
                        )}
                      </div>
                      <Badge className={getDifficultyColor(selectedExercise.difficulty_level)}>
                        {getDifficultyName(selectedExercise.difficulty_level)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">موضوع:</p>
                      <p className="text-gray-700 dark:text-gray-300">{selectedExercise.prompt}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>حداقل {selectedExercise.word_limit_min} کلمه</span>
                      <span>حداکثر {selectedExercise.word_limit_max} کلمه</span>
                      <span>زمان تخمینی: {selectedExercise.estimated_time} دقیقه</span>
                    </div>
                    {selectedExercise.tips && selectedExercise.tips.length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          نکات مهم:
                        </p>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                          {selectedExercise.tips.map((tip, idx) => (
                            <li key={idx}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Writing Editor */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>نوشته شما</CardTitle>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {wordCount} / {selectedExercise.word_limit_max} کلمه
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {characterCount} کاراکتر
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        ref={textareaRef}
                        value={writingContent}
                        onChange={(e) => setWritingContent(e.target.value)}
                        placeholder="نوشته خود را اینجا بنویسید..."
                        className="min-h-[300px] font-mono text-base"
                        onBlur={handleSaveDraft}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(wordCount / selectedExercise.word_limit_max) * 100} 
                            className="w-32"
                          />
                          {wordCount < selectedExercise.word_limit_min && (
                            <span className="text-xs text-red-600">
                              حداقل {selectedExercise.word_limit_min} کلمه لازم است
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={handleSaveDraft}
                            size="sm"
                            title="ذخیره پیش‌نویس در مرورگر"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            ذخیره پیش‌نویس
                          </Button>
                          <Button
                            onClick={handleAutoCorrect}
                            disabled={isCorrecting || wordCount < selectedExercise.word_limit_min}
                            className="bg-gradient-to-r from-purple-500 to-pink-600"
                          >
                            {isCorrecting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                در حال تصحیح...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                تصحیح خودکار
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Correction Results */}
                {correctionResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Scores */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          نتایج تصحیح
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">نمره کلی</p>
                            <p className={`text-3xl font-bold ${getScoreColor(correctionResult.scores.overall)}`}>
                              {correctionResult.scores.overall}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">گرامر</p>
                            <p className={`text-2xl font-bold ${getScoreColor(correctionResult.scores.grammar)}`}>
                              {correctionResult.scores.grammar}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">واژگان</p>
                            <p className={`text-2xl font-bold ${getScoreColor(correctionResult.scores.vocabulary)}`}>
                              {correctionResult.scores.vocabulary}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">انسجام</p>
                            <p className={`text-2xl font-bold ${getScoreColor(correctionResult.scores.coherence)}`}>
                              {correctionResult.scores.coherence}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">خلاقیت</p>
                            <p className={`text-2xl font-bold ${getScoreColor(correctionResult.scores.creativity)}`}>
                              {correctionResult.scores.creativity}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            {correctionResult.feedback}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Grammar Errors */}
                    {correctionResult.grammar_errors.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-5 h-5" />
                            خطاهای گرامری ({correctionResult.grammar_errors.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {correctionResult.grammar_errors.map((error, idx) => (
                              <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <div className="flex items-start justify-between mb-2">
                                  <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                    {error.type}
                                  </Badge>
                                  <Badge className={error.severity === 'critical' ? 'bg-red-600' : 'bg-yellow-600'}>
                                    {error.severity === 'critical' ? 'مهم' : 'متوسط'}
                                  </Badge>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm">
                                    <span className="text-red-600 line-through">{error.original}</span>
                                    {' → '}
                                    <span className="text-green-600 font-semibold">{error.corrected}</span>
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {error.explanation}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Improvement Suggestions */}
                    {correctionResult.improvements.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-blue-600">
                            <Lightbulb className="w-5 h-5" />
                            پیشنهادات بهبود ({correctionResult.improvements.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {correctionResult.improvements.map((improvement, idx) => (
                              <div key={idx} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start justify-between mb-2">
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                    {improvement.type}
                                  </Badge>
                                  <Badge className={
                                    improvement.priority === 'high' ? 'bg-red-600' :
                                    improvement.priority === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'
                                  }>
                                    {improvement.priority === 'high' ? 'اولویت بالا' :
                                     improvement.priority === 'medium' ? 'اولویت متوسط' : 'اولویت پایین'}
                                  </Badge>
                                </div>
                                {improvement.original && (
                                  <p className="text-sm mb-1">
                                    <span className="text-gray-600">{improvement.original}</span>
                                    {' → '}
                                    <span className="text-green-600 font-semibold">{improvement.suggested}</span>
                                  </p>
                                )}
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {improvement.explanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            {submissions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    هنوز نوشته‌ای ارسال نکرده‌اید.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{(submission.exercise as any)?.title || 'تمرین نوشتن'}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {new Date(submission.submitted_at).toLocaleDateString('fa-IR')}
                          </p>
                        </div>
                        {submission.overall_score !== null && (
                          <Badge className={`text-lg px-3 py-1 ${getScoreColor(submission.overall_score)}`}>
                            {submission.overall_score}%
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{submission.content}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{submission.word_count} کلمه</span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedExercise(submission.exercise as any);
                                setWritingContent(submission.content);
                                setCorrectionResult(null);
                                setActiveTab('write');
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              مشاهده و ویرایش
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSubmission(submission.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              حذف
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StudentPageLayout>
  );
}

