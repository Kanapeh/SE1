"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Heart, MessageCircle, Share2 } from "lucide-react";

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

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  const fetchInstagramPosts = async () => {
    try {
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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white">
            <Instagram className="w-5 h-5 mr-2" />
            <span className="font-semibold text-sm">استوری‌های اینستاگرام</span>
          </div>
          <span className="text-white text-xs">{posts.length} پست</span>
        </div>

        {/* Horizontal scrolling stories */}
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {posts.map((post, index) => (
            <div key={post.id} className="flex-shrink-0 w-64">
              <Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20">
                <div className="relative aspect-square">
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
                      alt={post.caption || 'Instagram post'}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Instagram-like overlay */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1 text-white text-xs">
                    <Heart className="w-3 h-3" />
                    <span>{post.like_count || 0}</span>
                  </div>
                  
                  <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1 text-white text-xs">
                    <MessageCircle className="w-3 h-3" />
                    <span>{post.comments_count || 0}</span>
                  </div>
                </div>

                {post.caption && (
                  <div className="p-3 text-white">
                    <p className="text-xs line-clamp-2 mb-2">
                      {post.caption.length > 80 
                        ? `${post.caption.substring(0, 80)}...` 
                        : post.caption
                      }
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-75">
                        {new Date(post.timestamp).toLocaleDateString('fa-IR')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(post.permalink, '_blank')}
                        className="text-white hover:bg-white/20 p-1 h-6"
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 