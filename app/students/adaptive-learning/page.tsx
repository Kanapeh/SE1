'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Award,
  Zap,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Lightbulb,
  Activity,
  Star,
  AlertCircle,
  Loader2
} from 'lucide-react';
import StudentPageLayout, { Student } from '@/components/StudentPageLayout';
import { supabase } from '@/lib/supabase';

interface SkillData {
  skill_type: string;
  current_score: number;
  mastery_level: string;
  improvement_trend: string;
}

interface LearningPath {
  id: string;
  path: Array<{
    id: string;
    title: string;
    content_type: string;
    skill_type: string;
    difficulty_score: number;
    estimated_duration: number;
  }>;
  current_level: string;
  target_level: string;
  total_duration: number;
  estimated_completion_date: string;
  total_content: number;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  content_type: string;
  skill_type: string;
  difficulty_score: number;
  estimated_duration: number;
  priority: number;
  recommendation_reason: string;
}

interface AssessmentResult {
  overall_level: string;
  total_score: number;
  skill_scores: Record<string, number>;
  recommendations: any[];
}

export default function AdaptiveLearningPage() {
  const router = useRouter();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);

  useEffect(() => {
    loadStudentData();
    loadSkills();
    loadRecommendations();
    loadLearningPath();
  }, []);

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

  const loadSkills = async () => {
    if (!currentStudent) return;

    try {
      const { data, error } = await supabase
        .from('student_skills')
        .select('*')
        .eq('student_id', currentStudent.id)
        .order('current_score', { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const loadRecommendations = async () => {
    if (!currentStudent) return;

    try {
      const response = await fetch('/api/adaptive-learning/recommend-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: currentStudent.id, limit: 10 })
      });

      const result = await response.json();
      if (result.success) {
        setRecommendations(result.data.recommendations || []);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const loadLearningPath = async () => {
    if (!currentStudent) return;

    try {
      const { data, error } = await supabase
        .from('personalized_learning_paths')
        .select('*')
        .eq('student_id', currentStudent.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // بارگذاری جزئیات مسیر
        const response = await fetch('/api/adaptive-learning/generate-path', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: currentStudent.id })
        });

        const result = await response.json();
        if (result.success) {
          setLearningPath(result.data);
        }
      }
    } catch (error) {
      console.error('Error loading learning path:', error);
    }
  };

  const handleStartAssessment = async () => {
    if (!currentStudent) return;

    setIsAssessing(true);
    try {
      // در اینجا باید سوالات تست را نمایش دهیم
      // برای نمونه، یک تست ساده می‌سازیم
      const sampleQuestions = [
        {
          id: '1',
          question: 'Choose the correct form: I ___ to school every day.',
          skill_type: 'grammar',
          options: ['go', 'goes', 'going', 'went'],
          correct_answer: 'go',
          points: 10
        },
        {
          id: '2',
          question: 'What is the meaning of "happy"?',
          skill_type: 'vocabulary',
          options: ['غمگین', 'خوشحال', 'عصبانی', 'خسته'],
          correct_answer: 'خوشحال',
          points: 10
        }
      ];

      // در واقعیت، این باید از یک UI جداگانه بیاید
      const sampleAnswers = ['go', 'خوشحال'];

      const response = await fetch('/api/adaptive-learning/assess-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          questions: sampleQuestions,
          answers: sampleAnswers
        })
      });

      const result = await response.json();
      if (result.success) {
        setAssessmentResult(result.data);
        await loadSkills();
        await loadRecommendations();
        setActiveTab('overview');
      }
    } catch (error) {
      console.error('Error assessing level:', error);
    } finally {
      setIsAssessing(false);
    }
  };

  const handleGeneratePath = async () => {
    if (!currentStudent) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/adaptive-learning/generate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: currentStudent.id })
      });

      const result = await response.json();
      if (result.success) {
        setLearningPath(result.data);
        setActiveTab('path');
      }
    } catch (error) {
      console.error('Error generating path:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillName = (skill: string): string => {
    const names: Record<string, string> = {
      grammar: 'گرامر',
      vocabulary: 'واژگان',
      reading: 'خواندن',
      writing: 'نوشتن',
      listening: 'شنیداری',
      speaking: 'مکالمه',
      pronunciation: 'تلفظ'
    };
    return names[skill] || skill;
  };

  const getLevelName = (level: string): string => {
    const names: Record<string, string> = {
      beginner: 'مبتدی',
      intermediate: 'متوسط',
      advanced: 'پیشرفته'
    };
    return names[level] || level;
  };

  const getSkillColor = (score: number): string => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSkillBgColor = (score: number): string => {
    if (score >= 70) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 40) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <StudentPageLayout
      student={currentStudent}
      onStudentLoaded={setCurrentStudent}
      title="یادگیری تطبیقی"
      description="سیستم هوشمند یادگیری که با شما سازگار می‌شود"
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              یادگیری تطبیقی
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              سیستم هوشمند که با سطح و پیشرفت شما سازگار می‌شود
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleStartAssessment}
              disabled={isAssessing}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              {isAssessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  در حال ارزیابی...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  ارزیابی سطح
                </>
              )}
            </Button>
            <Button
              onClick={handleGeneratePath}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              تولید مسیر یادگیری
            </Button>
          </div>
        </motion.div>

        {/* Assessment Result Banner */}
        {assessmentResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">نتایج ارزیابی شما</h3>
                <p className="text-blue-100">
                  سطح کلی: <span className="font-bold">{getLevelName(assessmentResult.overall_level)}</span>
                  {' • '}
                  نمره کلی: <span className="font-bold">{assessmentResult.total_score}%</span>
                </p>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                {assessmentResult.total_score >= 70 ? 'عالی' : assessmentResult.total_score >= 40 ? 'خوب' : 'نیاز به تمرین'}
              </Badge>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نمای کلی</TabsTrigger>
            <TabsTrigger value="skills">مهارت‌ها</TabsTrigger>
            <TabsTrigger value="path">مسیر یادگیری</TabsTrigger>
            <TabsTrigger value="recommendations">پیشنهادات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Level Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    سطح کلی
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {skills.length > 0 
                        ? getLevelName(
                            skills.reduce((sum, s) => sum + s.current_score, 0) / skills.length >= 70 
                              ? 'advanced' 
                              : skills.reduce((sum, s) => sum + s.current_score, 0) / skills.length >= 40 
                                ? 'intermediate' 
                                : 'beginner'
                          )
                        : 'مبتدی'
                      }
                    </div>
                    <Progress 
                      value={skills.length > 0 ? skills.reduce((sum, s) => sum + s.current_score, 0) / skills.length : 0} 
                      className="mt-4"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Skills Count Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    مهارت‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {skills.length}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      مهارت ارزیابی شده
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Path Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    پیشرفت مسیر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {learningPath ? `${Math.round((learningPath.path.length > 0 ? 1 : 0) * 100)}%` : '0%'}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {learningPath ? `${learningPath.total_content} محتوا` : 'مسیر ایجاد نشده'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>اقدامات سریع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab('skills')}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start"
                  >
                    <BarChart3 className="w-6 h-6 mb-2 text-blue-600" />
                    <span className="font-semibold">مشاهده مهارت‌ها</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      بررسی نقاط قوت و ضعف
                    </span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('path')}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start"
                  >
                    <Sparkles className="w-6 h-6 mb-2 text-purple-600" />
                    <span className="font-semibold">مسیر یادگیری</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      مسیر شخصی‌سازی شده شما
                    </span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('recommendations')}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start"
                  >
                    <Lightbulb className="w-6 h-6 mb-2 text-yellow-600" />
                    <span className="font-semibold">پیشنهادات</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      محتوای پیشنهادی برای شما
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            {skills.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    هنوز مهارتی ارزیابی نشده است. برای شروع، ارزیابی سطح انجام دهید.
                  </p>
                  <Button onClick={handleStartAssessment} className="mt-4">
                    <Target className="w-4 h-4 mr-2" />
                    شروع ارزیابی
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((skill) => (
                  <Card key={skill.skill_type}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{getSkillName(skill.skill_type)}</CardTitle>
                        <Badge className={getSkillBgColor(skill.current_score)}>
                          {getLevelName(skill.mastery_level)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">نمره</span>
                            <span className={`font-bold ${getSkillColor(skill.current_score)}`}>
                              {skill.current_score}%
                            </span>
                          </div>
                          <Progress value={skill.current_score} />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {skill.improvement_trend === 'improving' ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">در حال بهبود</span>
                            </>
                          ) : skill.improvement_trend === 'declining' ? (
                            <>
                              <TrendingDown className="w-4 h-4 text-red-600" />
                              <span className="text-red-600">نیاز به تمرین</span>
                            </>
                          ) : (
                            <>
                              <Activity className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-600">پایدار</span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Learning Path Tab */}
          <TabsContent value="path" className="space-y-6">
            {!learningPath ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Sparkles className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    هنوز مسیر یادگیری برای شما ایجاد نشده است.
                  </p>
                  <Button onClick={handleGeneratePath} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        در حال تولید...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        تولید مسیر یادگیری
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>مسیر یادگیری شما</CardTitle>
                      <Badge variant="outline">
                        {getLevelName(learningPath.current_level)} → {getLevelName(learningPath.target_level)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">تعداد محتوا</p>
                          <p className="text-2xl font-bold">{learningPath.total_content}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">مدت زمان</p>
                          <p className="text-2xl font-bold">{learningPath.total_duration} دقیقه</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">تاریخ تکمیل</p>
                          <p className="text-2xl font-bold">
                            {new Date(learningPath.estimated_completion_date).toLocaleDateString('fa-IR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">محتوای مسیر</h3>
                  {learningPath.path.map((content, index) => (
                    <Card key={content.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold">{content.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{getSkillName(content.skill_type)}</Badge>
                                <Badge variant="outline">{content.content_type}</Badge>
                                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {content.estimated_duration} دقیقه
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            شروع
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            {recommendations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lightbulb className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    در حال حاضر پیشنهادی برای شما وجود ندارد. لطفاً ارزیابی سطح انجام دهید.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec) => (
                  <Card key={rec.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="mb-2">{rec.title}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {rec.description}
                          </p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          اولویت: {rec.priority}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {rec.recommendation_reason}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{getSkillName(rec.skill_type)}</Badge>
                          <Badge variant="outline">{rec.content_type}</Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {rec.estimated_duration} دقیقه
                          </span>
                        </div>
                        <Button className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          شروع یادگیری
                        </Button>
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

