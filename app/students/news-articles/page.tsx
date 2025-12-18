'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Newspaper,
  BookOpen,
  Languages,
  Bookmark,
  BookmarkCheck,
  Eye,
  Clock,
  TrendingUp,
  Award,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Star,
  Lightbulb,
  FileText,
  BarChart3,
  Loader2,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';
import StudentPageLayout, { Student } from '@/components/StudentPageLayout';
import { supabase } from '@/lib/supabase';

interface Article {
  id: string;
  title: string;
  title_translation: string;
  content: string;
  content_translation: string;
  summary: string;
  summary_translation: string;
  category: string;
  difficulty_level: string;
  reading_time: number;
  word_count: number;
  image_url: string;
  published_date: string;
  tags: string[];
  sentences?: ArticleSentence[];
  vocabulary?: Vocabulary[];
  exercises?: Exercise[];
}

interface ArticleSentence {
  id: string;
  original_text: string;
  translation: string;
  sentence_index: number;
}

interface Vocabulary {
  id: string;
  word: string;
  word_type: string;
  definition: string;
  definition_translation: string;
  example_sentence: string;
  example_translation: string;
  pronunciation: string;
  frequency: number;
  difficulty_level: string;
  is_important: boolean;
  learning?: VocabularyLearning;
}

interface VocabularyLearning {
  mastery_level: string;
  review_count: number;
  correct_count: number;
  next_review_at: string;
  is_bookmarked: boolean;
}

interface Exercise {
  id: string;
  exercise_type: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface ReadingProgress {
  reading_status: string;
  progress_percentage: number;
  time_spent: number;
  last_read_position: number;
  comprehension_score: number;
}

export default function NewsArticlesPage() {
  const router = useRouter();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    { value: 'all', label: 'همه' },
    { value: 'news', label: 'اخبار' },
    { value: 'technology', label: 'فناوری' },
    { value: 'science', label: 'علم' },
    { value: 'business', label: 'کسب و کار' },
    { value: 'health', label: 'سلامت' },
    { value: 'sports', label: 'ورزش' },
    { value: 'entertainment', label: 'سرگرمی' }
  ];

  useEffect(() => {
    loadStudentData();
    loadArticles();
  }, [selectedCategory, selectedDifficulty]);

  useEffect(() => {
    if (selectedArticle && currentStudent) {
      loadReadingProgress();
      setStartTime(Date.now());
      
      // شروع تایمر خواندن
      readingTimerRef.current = setInterval(() => {
        updateReadingProgress();
      }, 5000); // هر 5 ثانیه به‌روزرسانی

      return () => {
        if (readingTimerRef.current) {
          clearInterval(readingTimerRef.current);
        }
      };
    }
  }, [selectedArticle, currentStudent]);

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

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      let url = `/api/news-articles/articles?limit=20`;
      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }
      if (selectedDifficulty !== 'all') {
        url += `&difficulty=${selectedDifficulty}`;
      }

      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setArticles(result.data.articles || []);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadArticle = async (articleId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/news-articles/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId })
      });

      const result = await response.json();
      if (result.success) {
        setSelectedArticle(result.data);
        setCurrentSentenceIndex(0);
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReadingProgress = async () => {
    if (!selectedArticle || !currentStudent) return;

    try {
      const response = await fetch(
        `/api/news-articles/progress?studentId=${currentStudent.id}&articleId=${selectedArticle.id}`
      );
      const result = await response.json();
      if (result.success && result.data.progress.length > 0) {
        const progress = result.data.progress[0];
        setReadingProgress({
          reading_status: progress.reading_status,
          progress_percentage: progress.progress_percentage,
          time_spent: progress.time_spent,
          last_read_position: progress.last_read_position,
          comprehension_score: progress.comprehension_score
        });
        setCurrentSentenceIndex(progress.last_read_position || 0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const updateReadingProgress = async () => {
    if (!selectedArticle || !currentStudent || !startTime) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const totalSentences = selectedArticle.sentences?.length || 1;
    const progressPercentage = Math.min(100, Math.round(((currentSentenceIndex + 1) / totalSentences) * 100));

    try {
      await fetch('/api/news-articles/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          articleId: selectedArticle.id,
          readingStatus: progressPercentage === 100 ? 'completed' : 'reading',
          progressPercentage,
          timeSpent,
          lastReadPosition: currentSentenceIndex
        })
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleSelectArticle = async (article: Article) => {
    await loadArticle(article.id);
    setShowVocabulary(false);
    setSelectedVocabulary(null);
  };

  const handleVocabularyClick = async (vocab: Vocabulary) => {
    setSelectedVocabulary(vocab);
    setShowVocabulary(true);
  };

  const handleVocabularyReview = async (isCorrect: boolean) => {
    if (!selectedVocabulary || !currentStudent || !selectedArticle) return;

    try {
      await fetch('/api/news-articles/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          vocabularyId: selectedVocabulary.id,
          articleId: selectedArticle.id,
          isCorrect
        })
      });

      // به‌روزرسانی local state
      if (selectedArticle.vocabulary) {
        const vocabIndex = selectedArticle.vocabulary.findIndex(v => v.id === selectedVocabulary.id);
        if (vocabIndex !== -1) {
          const updatedVocab = { ...selectedArticle.vocabulary[vocabIndex] };
          if (!updatedVocab.learning) {
            updatedVocab.learning = {
              mastery_level: 'new',
              review_count: 0,
              correct_count: 0,
              next_review_at: '',
              is_bookmarked: false
            };
          }
          updatedVocab.learning.review_count += 1;
          if (isCorrect) {
            updatedVocab.learning.correct_count += 1;
          }
          setSelectedArticle({
            ...selectedArticle,
            vocabulary: [
              ...selectedArticle.vocabulary.slice(0, vocabIndex),
              updatedVocab,
              ...selectedArticle.vocabulary.slice(vocabIndex + 1)
            ]
          });
        }
      }
    } catch (error) {
      console.error('Error reviewing vocabulary:', error);
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

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      news: 'اخبار',
      technology: 'فناوری',
      science: 'علم',
      business: 'کسب و کار',
      health: 'سلامت',
      sports: 'ورزش',
      entertainment: 'سرگرمی',
      politics: 'سیاست',
      education: 'آموزش',
      culture: 'فرهنگ'
    };
    return names[category] || category;
  };

  const filteredArticles = articles.filter(article => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        article.title.toLowerCase().includes(query) ||
        article.title_translation?.toLowerCase().includes(query) ||
        article.summary?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <StudentPageLayout
      student={currentStudent}
      onStudentLoaded={setCurrentStudent}
      title="یادگیری از طریق اخبار و مقالات"
      description="بهبود مهارت خواندن با مقالات واقعی و ترجمه"
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
              یادگیری از طریق اخبار و مقالات
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              خواندن مقالات واقعی با ترجمه و یادگیری واژگان تخصصی
            </p>
          </div>
        </motion.div>

        {!selectedArticle ? (
          <>
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="جستجوی مقالات..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      <option value="all">همه سطوح</option>
                      <option value="beginner">مبتدی</option>
                      <option value="intermediate">متوسط</option>
                      <option value="advanced">پیشرفته</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleSelectArticle(article)}
                  >
                    {article.image_url && (
                      <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-lg overflow-hidden">
                        <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getDifficultyColor(article.difficulty_level)}>
                          {getDifficultyName(article.difficulty_level)}
                        </Badge>
                        <Badge variant="outline">
                          {getCategoryName(article.category)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      {article.title_translation && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {article.title_translation}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {article.summary && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {article.summary}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.reading_time} دقیقه</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{article.word_count} کلمه</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4" onClick={(e) => {
                          e.stopPropagation();
                          handleSelectArticle(article);
                        }}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          خواندن مقاله
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Article Reader */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Article Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedArticle(null);
                          setReadingProgress(null);
                          setCurrentSentenceIndex(0);
                          if (readingTimerRef.current) {
                            clearInterval(readingTimerRef.current);
                          }
                        }}
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        بازگشت
                      </Button>
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(selectedArticle.difficulty_level)}>
                          {getDifficultyName(selectedArticle.difficulty_level)}
                        </Badge>
                        <Badge variant="outline">
                          {getCategoryName(selectedArticle.category)}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-2">{selectedArticle.title}</CardTitle>
                    {selectedArticle.title_translation && (
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        {selectedArticle.title_translation}
                      </p>
                    )}
                    {readingProgress && (
                      <div className="mt-4">
                        <Progress value={readingProgress.progress_percentage} className="h-2" />
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <span>{readingProgress.progress_percentage}% خوانده شده</span>
                          <span>{Math.floor(readingProgress.time_spent / 60)} دقیقه</span>
                        </div>
                      </div>
                    )}
                  </CardHeader>
                </Card>

                {/* Article Content */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>محتوا</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTranslation(!showTranslation)}
                      >
                        <Languages className="w-4 h-4 mr-2" />
                        {showTranslation ? 'مخفی کردن' : 'نمایش'} ترجمه
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedArticle.sentences?.map((sentence, index) => (
                        <div
                          key={sentence.id}
                          className={`p-4 rounded-lg border transition-all ${
                            index === currentSentenceIndex
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                              : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                          }`}
                          onClick={() => setCurrentSentenceIndex(index)}
                        >
                          <p className="text-gray-900 dark:text-white mb-2">
                            {sentence.original_text}
                          </p>
                          {showTranslation && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm border-t pt-2 mt-2">
                              {sentence.translation}
                            </p>
                          )}
                          {/* Highlight vocabulary words */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {selectedArticle.vocabulary
                              ?.filter(v => sentence.original_text.toLowerCase().includes(v.word.toLowerCase()))
                              .map(vocab => (
                                <Badge
                                  key={vocab.id}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVocabularyClick(vocab);
                                  }}
                                >
                                  {vocab.word}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentSentenceIndex(Math.max(0, currentSentenceIndex - 1))}
                        disabled={currentSentenceIndex === 0}
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        قبلی
                      </Button>
                      <Button
                        onClick={() => {
                          if (currentSentenceIndex < (selectedArticle.sentences?.length || 0) - 1) {
                            setCurrentSentenceIndex(currentSentenceIndex + 1);
                          } else {
                            updateReadingProgress();
                            setReadingProgress(prev => ({
                              ...prev!,
                              reading_status: 'completed',
                              progress_percentage: 100
                            }));
                          }
                        }}
                      >
                        {currentSentenceIndex < (selectedArticle.sentences?.length || 0) - 1 ? (
                          <>
                            بعدی
                            <ChevronLeft className="w-4 h-4 mr-2" />
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            تکمیل مقاله
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Vocabulary Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      واژگان تخصصی
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {selectedArticle.vocabulary?.map((vocab) => (
                        <div
                          key={vocab.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedVocabulary?.id === vocab.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300'
                              : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          }`}
                          onClick={() => handleVocabularyClick(vocab)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {vocab.word}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {vocab.definition_translation || vocab.definition}
                              </p>
                            </div>
                            {vocab.learning && (
                              <Badge className={
                                vocab.learning.mastery_level === 'mastered' ? 'bg-green-600' :
                                vocab.learning.mastery_level === 'familiar' ? 'bg-yellow-600' :
                                'bg-gray-600'
                              }>
                                {vocab.learning.mastery_level === 'mastered' ? 'مسلط' :
                                 vocab.learning.mastery_level === 'familiar' ? 'آشنا' : 'جدید'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Vocabulary Detail */}
                {showVocabulary && selectedVocabulary && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{selectedVocabulary.word}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowVocabulary(false)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">تعریف:</p>
                          <p className="text-gray-900 dark:text-white">
                            {selectedVocabulary.definition_translation || selectedVocabulary.definition}
                          </p>
                        </div>
                        {selectedVocabulary.example_sentence && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">مثال:</p>
                            <p className="text-gray-900 dark:text-white">
                              {selectedVocabulary.example_sentence}
                            </p>
                            {selectedVocabulary.example_translation && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {selectedVocabulary.example_translation}
                              </p>
                            )}
                          </div>
                        )}
                        {selectedVocabulary.pronunciation && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">تلفظ:</p>
                            <p className="text-gray-900 dark:text-white">
                              /{selectedVocabulary.pronunciation}/
                            </p>
                          </div>
                        )}
                        {selectedVocabulary.learning && (
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium mb-2">وضعیت یادگیری:</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>مرور:</span>
                                <span>{selectedVocabulary.learning.review_count}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>صحیح:</span>
                                <span>{selectedVocabulary.learning.correct_count}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleVocabularyReview(false)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                اشتباه
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleVocabularyReview(true)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                صحیح
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </StudentPageLayout>
  );
}

