'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Youtube, 
  Clock, 
  Eye, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Languages,
  Target,
  Loader2,
  X
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  channelTitle?: string;
}

const categoryColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
};

const categoryIcons = {
  beginner: BookOpen,
  intermediate: GraduationCap,
  advanced: Target
};

export default function YouTubeVideosSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const videosPerPage = 3;

  // Default videos for fallback
  const getDefaultVideos = (): Video[] => [
    {
      id: 'default1',
      title: 'آموزش زبان انگلیسی - مقدمات و الفبا',
      description: 'در این ویدیو با الفبای انگلیسی و تلفظ صحیح حروف آشنا می‌شوید.',
      thumbnail: '/images/default-video1.jpg',
      duration: '15:30',
      viewCount: '2.1K',
      publishedAt: '2024-01-01T00:00:00Z',
      category: 'beginner',
      language: 'persian',
      channelTitle: 'SE1A Academy'
    },
    {
      id: 'default2',
      title: 'گرامر انگلیسی - زمان حال ساده',
      description: 'آموزش کامل زمان حال ساده در زبان انگلیسی با مثال‌های کاربردی.',
      thumbnail: '/images/default-video2.jpg',
      duration: '22:15',
      viewCount: '3.5K',
      publishedAt: '2024-01-02T00:00:00Z',
      category: 'intermediate',
      language: 'persian',
      channelTitle: 'SE1A Academy'
    },
    {
      id: 'default3',
      title: 'مکالمه انگلیسی - گفتگو در رستوران',
      description: 'یادگیری عبارات و جملات کاربردی برای سفارش غذا در رستوران.',
      thumbnail: '/images/default-video3.jpg',
      duration: '18:45',
      viewCount: '1.8K',
      publishedAt: '2024-01-03T00:00:00Z',
      category: 'advanced',
      language: 'persian',
      channelTitle: 'SE1A Academy'
    }
  ];

  // Fetch videos from YouTube API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching videos from YouTube API...');
        const response = await fetch('/api/youtube');
        const result = await response.json();
        
        if (!result.success) {
          console.warn('⚠️ YouTube API failed, using default videos:', result.error);
          setVideos(getDefaultVideos());
          setError('ویدیوهای یوتیوب در دسترس نیستند. ویدیوهای پیش‌فرض نمایش داده می‌شوند.');
          return;
        }
        
        if (result.videos && result.videos.length > 0) {
          console.log('✅ Videos fetched successfully:', result.videos.length);
          setVideos(result.videos);
        } else {
          console.warn('⚠️ No videos found, using default videos');
          setVideos(getDefaultVideos());
          setError('ویدیویی یافت نشد. ویدیوهای پیش‌فرض نمایش داده می‌شوند.');
        }
      } catch (err) {
        console.error('❌ Error fetching videos:', err);
        setVideos(getDefaultVideos());
        setError('خطا در بارگذاری ویدیوها. ویدیوهای پیش‌فرض نمایش داده می‌شوند.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(video => {
    if (selectedCategory !== 'all' && video.category !== selectedCategory) return false;
    if (selectedLanguage !== 'all' && video.language !== selectedLanguage) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const currentVideos = filteredVideos.slice(
    currentPage * videosPerPage,
    (currentPage + 1) * videosPerPage
  );

  const categories = ['all', 'beginner', 'intermediate', 'advanced'];
  const languages = ['all', 'انگلیسی', 'فرانسه', 'آلمانی', 'اسپانیایی'];

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCurrentPage(0);
  };

  const openVideo = (videoId: string) => {
    setSelectedVideo(videoId);
    setShowPlayer(true);
  };

  const closePlayer = () => {
    setShowPlayer(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-500 rounded-full">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              ویدیوهای آموزشی
            </h2>
          </div>
          <div className="flex items-center justify-center mt-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">
              در حال بارگذاری ویدیوها...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-500 rounded-full">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              ویدیوهای آموزشی
            </h2>
          </div>
          <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 mb-4">
              خطا در بارگذاری ویدیوها: {error}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              تلاش مجدد
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-500 rounded-full">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              ویدیوهای آموزشی
            </h2>
          </div>
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              هنوز ویدیویی در کانال یوتیوب آپلود نشده است
            </p>
            <Button 
              onClick={() => window.open('https://www.youtube.com/@Se1-academy', '_blank')}
              className="bg-red-500 hover:bg-red-600"
            >
              <Youtube className="w-4 h-4 mr-2" />
              مشاهده کانال یوتیوب
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-500 rounded-full">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              ویدیوهای آموزشی
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            از کانال یوتیوب آکادمی سِ وان، ویدیوهای آموزشی رایگان را تماشا کنید و مهارت‌های زبانی خود را تقویت کنید
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {videos.length} ویدیو در کانال یوتیوب ما موجود است
          </p>
        </motion.div>

        {/* Filters */}
        {videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 px-4"
          >
            {/* Category Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">سطح:</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange(category)}
                    className="text-xs px-3 py-1 h-8"
                  >
                    {category === 'all' ? 'همه' : 
                     category === 'beginner' ? 'مبتدی' :
                     category === 'intermediate' ? 'متوسط' : 'پیشرفته'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Language Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">زبان:</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {languages.map((language) => (
                  <Button
                    key={language}
                    variant={selectedLanguage === language ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLanguageChange(language)}
                    className="text-xs px-3 py-1 h-8"
                  >
                    {language}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Videos Grid */}
        {currentVideos.length > 0 ? (
          <>
            {/* Mobile: Horizontal scroll */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="block md:hidden mb-12"
            >
              <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
                {currentVideos.map((video, index) => {
                  const CategoryIcon = categoryIcons[video.category];
                  return (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                      className="flex-shrink-0 w-80 group cursor-pointer"
                      onClick={() => openVideo(video.id)}
                    >
                      <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                        {/* Thumbnail */}
                        <div className="relative overflow-hidden">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                          
                          {/* Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                          </div>

                          {/* Duration Badge */}
                          {video.duration !== 'N/A' && (
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                              {video.duration}
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-2 left-2">
                            <Badge className={`${categoryColors[video.category]} text-xs px-2 py-1`}>
                              <CategoryIcon className="w-3 h-3 mr-1" />
                              {video.category === 'beginner' ? 'مبتدی' :
                               video.category === 'intermediate' ? 'متوسط' : 'پیشرفته'}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                              {video.title}
                            </h3>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 leading-relaxed line-clamp-2">
                            {video.description}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                            {video.views !== 'N/A' && (
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{video.views}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{video.publishedAt}</span>
                            </div>
                          </div>

                          {/* Language Badge and Button */}
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs px-2 py-1">
                              <Languages className="w-3 h-3 mr-1" />
                              {video.language}
                            </Badge>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs px-3 py-1 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all duration-300"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              تماشا
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Desktop: Grid layout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {currentVideos.map((video, index) => {
                const CategoryIcon = categoryIcons[video.category];
                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer"
                    onClick={() => openVideo(video.id)}
                  >
                    <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Thumbnail */}
                      <div className="relative overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>

                        {/* Duration Badge */}
                        {video.duration !== 'N/A' && (
                          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className={categoryColors[video.category]}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {video.category === 'beginner' ? 'مبتدی' :
                             video.category === 'intermediate' ? 'متوسط' : 'پیشرفته'}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {video.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                          {video.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {video.views !== 'N/A' && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{video.views}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{video.publishedAt}</span>
                          </div>
                        </div>

                        {/* Language Badge */}
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            <Languages className="w-3 h-3 mr-1" />
                            {video.language}
                          </Badge>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all duration-300"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            تماشا
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              هیچ ویدیویی با فیلترهای انتخاب شده یافت نشد
            </p>
            <Button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLanguage('all');
                setCurrentPage(0);
              }}
              variant="outline"
              className="mt-4"
            >
              پاک کردن فیلترها
            </Button>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-2 md:gap-4"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
            >
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">قبلی</span>
            </Button>
            
            {/* Mobile: Show only current page and dots */}
            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i)}
                  className="w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            
            {/* Mobile: Show current page with dots */}
            <div className="flex sm:hidden items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                صفحه {currentPage + 1} از {totalPages}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
            >
              <span className="hidden sm:inline">بعدی</span>
              <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 px-4"
        >
          <Button
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white px-4 md:px-8 py-3 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            onClick={() => window.open('https://www.youtube.com/@Se1-academy/videos', '_blank')}
          >
            <Youtube className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
            <span className="text-sm md:text-base">مشاهده همه ویدیوها در یوتیوب</span>
          </Button>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm md:text-base">
            {videos.length} ویدیوی آموزشی رایگان در کانال یوتیوب ما
          </p>
        </motion.div>
      </div>

      {/* Video Player Modal */}
      {showPlayer && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                پخش ویدیو
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closePlayer}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Video Player */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                title="YouTube video player"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedVideo}`, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  مشاهده در یوتیوب
                </Button>
                <Button
                  onClick={closePlayer}
                  className="bg-red-500 hover:bg-red-600"
                >
                  بستن
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
