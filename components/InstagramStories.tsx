"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Instagram, Heart, MessageCircle, Share2 } from "lucide-react";
import InstagramStoriesMobile from "./InstagramStoriesMobile";

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

export default function InstagramStories() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  const fetchInstagramPosts = async () => {
    try {
      // در اینجا باید API endpoint خود را قرار دهید
      // برای مثال: /api/instagram-posts
      const response = await fetch('/api/instagram-posts');
      if (!response.ok) {
        throw new Error('خطا در دریافت پست‌های اینستاگرام');
      }
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError('خطا در دریافت پست‌های اینستاگرام');
      console.error('Instagram fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  if (loading) {
    return (
      <div className="w-full h-32 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-center">
          <Instagram className="w-6 h-6 mx-auto mb-2 animate-pulse" />
          <p className="text-sm">در حال بارگذاری استوری‌ها...</p>
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div className="w-full h-32 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-center">
          <Instagram className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm">استوری‌های اینستاگرام در دسترس نیست</p>
        </div>
      </div>
    );
  }

  const currentPost = posts[currentIndex];

  return (
    <>
      {/* Mobile version */}
      <div className="md:hidden">
        <InstagramStoriesMobile />
      </div>

      {/* Desktop version */}
      <div className="hidden md:block w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-white">
              <Instagram className="w-5 h-5 mr-2" />
              <span className="font-semibold">استوری‌های اینستاگرام</span>
            </div>
            <div className="flex items-center space-x-2 text-white text-sm">
              <span>{currentIndex + 1} از {posts.length}</span>
            </div>
          </div>

          <div className="relative">
            <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20">
              <div className="relative aspect-[4/3] md:aspect-[16/9]">
                {currentPost.media_type === 'VIDEO' ? (
                  <video
                    src={currentPost.media_url}
                    className="w-full h-full object-cover"
                    controls
                    muted
                  />
                ) : (
                  <img
                    src={currentPost.media_url}
                    alt={currentPost.caption || 'Instagram post'}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Navigation Buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevStory}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextStory}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Instagram-like overlay */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-black/50 rounded-full px-3 py-1 text-white text-sm">
                    <Heart className="w-4 h-4" />
                    <span>{currentPost.like_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-black/50 rounded-full px-3 py-1 text-white text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>{currentPost.comments_count || 0}</span>
                  </div>
                </div>
              </div>

              {currentPost.caption && (
                <div className="p-4 text-white">
                  <p className="text-sm line-clamp-2">
                    {currentPost.caption.length > 100 
                      ? `${currentPost.caption.substring(0, 100)}...` 
                      : currentPost.caption
                    }
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs opacity-75">
                      {new Date(currentPost.timestamp).toLocaleDateString('fa-IR')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(currentPost.permalink, '_blank')}
                      className="text-white hover:bg-white/20"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      مشاهده در اینستاگرام
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Story indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {posts.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 w-4'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 