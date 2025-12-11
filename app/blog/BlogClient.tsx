"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight, 
  BookOpen, 
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Share2,
  Filter,
  Grid3X3,
  List,
  Star,
  Sparkles,
  Globe,
  Award,
  Target,
  Zap
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  image_url: string;
  author: string;
  published_at: string;
  status: string;
  tags: string[];
  excerpt?: string;
  views?: number;
  likes?: number;
  read_time?: number;
  category?: string;
  featured?: boolean;
}

interface BlogClientProps {
  posts: BlogPost[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Helper function to strip HTML tags
  const stripHtmlTags = (html: string): string => {
    return html.replace(/<[^>]*>/g, '');
  };

  useEffect(() => {
    filterPosts();
  }, [searchQuery, selectedCategory, sortBy, posts]);

  const filterPosts = () => {
    let filtered = posts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        stripHtmlTags(post.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
        stripHtmlTags(post.content).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "trending":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
  };

  const categories = ["all", "آموزش", "نکات", "گرامر", "مکالمه", "آیلتس"];
  const sortOptions = [
    { value: "newest", label: "جدیدترین" },
    { value: "popular", label: "محبوب‌ترین" },
    { value: "trending", label: "ترند" }
  ];

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl mb-8 shadow-2xl"
            >
              <BookOpen className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
            >
              بلاگ آموزشی
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              مجموعه مقالات آموزشی و نکات یادگیری زبان انگلیسی از آکادمی سِ وان. 
              راهنمای کامل برای یادگیری زبان با بهترین روش‌ها.
            </motion.p>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
                  <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="جستجو در مقالات..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-3 w-full text-lg rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white/50 dark:bg-gray-700/50"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="px-3 py-2 rounded-lg"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="px-3 py-2 rounded-lg"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Filter Toggle */}
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-4 py-2 rounded-xl border-2"
                    >
                      <Filter className="w-4 h-4 ml-2" />
                      فیلترها
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 dark:border-gray-700 pt-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            دسته‌بندی
                          </label>
                          <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category === "all" ? "همه دسته‌ها" : category}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Sort Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            مرتب‌سازی
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {sortOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              مقالات ویژه
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                      <div className="relative">
                        <Image
                          src={post.image_url || '/api/placeholder/400/256'}
                          alt={stripHtmlTags(post.title)}
                          width={400}
                          height={256}
                          className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized={post.image_url?.includes('cloudinary') || post.image_url?.includes('unsplash') || false}
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/256';
                          }}
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                            <Star className="w-3 h-3 ml-1" />
                            ویژه
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.published_at).toLocaleDateString('fa-IR')}</span>
                          <span>•</span>
                          <Clock className="w-4 h-4" />
                          <span>{post.read_time} دقیقه</span>
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {stripHtmlTags(post.title)}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {post.excerpt || stripHtmlTags(post.content).substring(0, 150) + '...'}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            {post.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              همه مقالات
            </h2>
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {regularPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <Card className={`overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] ${
                      viewMode === "list" ? "flex flex-col md:flex-row" : ""
                    }`}>
                      <div className={`relative ${viewMode === "list" ? "md:w-80 md:flex-shrink-0" : ""}`}>
                        <Image
                          src={post.image_url || '/api/placeholder/400/256'}
                          alt={stripHtmlTags(post.title)}
                          width={400}
                          height={256}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                            viewMode === "list" ? "h-48 sm:h-full" : "h-48"
                          }`}
                          unoptimized={post.image_url?.includes('cloudinary') || post.image_url?.includes('unsplash') || false}
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/256';
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 border-0">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.published_at).toLocaleDateString('fa-IR')}</span>
                          <span>•</span>
                          <Clock className="w-4 h-4" />
                          <span>{post.read_time} دقیقه</span>
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {stripHtmlTags(post.title)}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {post.excerpt || stripHtmlTags(post.content).substring(0, 150) + '...'}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">{post.author}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl mb-8 shadow-xl"
            >
              <BookOpen className="w-12 h-12 text-gray-400" />
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              مقاله‌ای یافت نشد
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
            >
              با فیلترهای انتخاب شده مقاله‌ای یافت نشد. لطفاً فیلترها را تغییر دهید.
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
