"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight } from "lucide-react";

interface InstagramPost {
  id: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  caption: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export default function InstagramStoriesMobile() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  // Touch/Swipe handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setDragScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = dragScrollLeft - walk;
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setDragScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = dragScrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const fetchInstagramPosts = async () => {
    try {
      // Mock data for display
      const mockPosts = [
        {
          id: '1',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example1',
          caption: 'این یک پست نمونه از اینستاگرام است که در سایت نمایش داده می‌شود. #آموزش_زبان #انگلیسی',
          timestamp: new Date().toISOString(),
          like_count: 150,
          comments_count: 25
        },
        {
          id: '2',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example2',
          caption: 'پست دوم: آموزش زبان انگلیسی با روش‌های نوین و کاربردی',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          like_count: 89,
          comments_count: 12
        },
        {
          id: '3',
          media_type: 'VIDEO' as const,
          media_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          permalink: 'https://instagram.com/p/example3',
          caption: 'ویدیوی آموزشی: تلفظ صحیح کلمات انگلیسی',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          like_count: 234,
          comments_count: 45
        },
        {
          id: '4',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example4',
          caption: 'کلاس‌های گروهی: یادگیری بهتر با هم',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          like_count: 167,
          comments_count: 28
        },
        {
          id: '5',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example5',
          caption: 'تمرین مکالمه: بهبود مهارت‌های گفتاری',
          timestamp: new Date(Date.now() - 345600000).toISOString(),
          like_count: 203,
          comments_count: 34
        },
        {
          id: '6',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example6',
          caption: 'آزمون‌های بین‌المللی: آماده‌سازی کامل',
          timestamp: new Date(Date.now() - 432000000).toISOString(),
          like_count: 145,
          comments_count: 22
        },
        {
          id: '7',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example7',
          caption: 'معلمان متخصص: تجربه و تخصص',
          timestamp: new Date(Date.now() - 518400000).toISOString(),
          like_count: 189,
          comments_count: 31
        },
        {
          id: '8',
          media_type: 'VIDEO' as const,
          media_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          permalink: 'https://instagram.com/p/example8',
          caption: 'ویدیوی آموزشی: گرامر پیشرفته',
          timestamp: new Date(Date.now() - 604800000).toISOString(),
          like_count: 276,
          comments_count: 48
        },
        {
          id: '9',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example9',
          caption: 'محیط یادگیری: راحت و حرفه‌ای',
          timestamp: new Date(Date.now() - 691200000).toISOString(),
          like_count: 134,
          comments_count: 19
        },
        {
          id: '10',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example10',
          caption: 'دوره‌های تخصصی: IELTS و TOEFL',
          timestamp: new Date(Date.now() - 777600000).toISOString(),
          like_count: 298,
          comments_count: 52
        },
        {
          id: '11',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example11',
          caption: 'کلاس‌های آنلاین: انعطاف‌پذیری کامل',
          timestamp: new Date(Date.now() - 864000000).toISOString(),
          like_count: 178,
          comments_count: 29
        },
        {
          id: '12',
          media_type: 'VIDEO' as const,
          media_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          permalink: 'https://instagram.com/p/example12',
          caption: 'ویدیوی آموزشی: واژگان پیشرفته',
          timestamp: new Date(Date.now() - 950400000).toISOString(),
          like_count: 245,
          comments_count: 41
        }
      ];
      setPosts(mockPosts);
    } catch (err) {
      console.error('Instagram fetch error:', err);
      setError('خطا در دریافت پست‌های اینستاگرام');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-white">
            <Instagram className="w-5 h-5 mr-2 animate-pulse" />
            <span className="text-sm">در حال بارگذاری استوری‌ها...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-white">
            <Instagram className="w-5 h-5 mr-2" />
            <span className="text-sm">استوری‌های اینستاگرام در دسترس نیست</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white">
            <Instagram className="w-5 h-5 mr-2" />
            <span className="font-semibold text-sm">استوری‌های اینستاگرام</span>
          </div>
          <span className="text-white text-xs">{posts.length} پست</span>
        </div>

        {/* Instagram-style circular stories */}
        <div className="relative">
          {/* Scroll Left Button */}
          {scrollPosition > 0 && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          
          {/* Scroll Right Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`flex space-x-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-8 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
            style={{ userSelect: isDragging ? 'none' : 'auto' }}
          >
            {posts.map((post, index) => (
              <div key={post.id} className="flex-shrink-0 flex flex-col items-center">
                {/* Circular story container */}
                <div className="relative w-16 h-16 mb-2">
                  {/* Gradient border like Instagram */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        {post.media_type === 'VIDEO' ? (
                          <video
                            src={post.media_url}
                            className="w-full h-full object-cover"
                            muted
                            loop
                          />
                        ) : (
                          <img
                            src={post.media_url}
                            alt={post.caption || 'Instagram story'}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Story indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Instagram className="w-2 h-2 text-white" />
                  </div>
                </div>
                
                {/* Story title */}
                <span className="text-xs text-white text-center max-w-16 truncate">
                  {post.caption ? 
                    (post.caption.length > 12 ? `${post.caption.substring(0, 12)}...` : post.caption) 
                    : `Story ${index + 1}`
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 