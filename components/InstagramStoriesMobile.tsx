"use client";

import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";

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

  useEffect(() => {
    // Simulate loading delay and set mock data
    const timer = setTimeout(() => {
      const mockPosts = [
        {
          id: '1',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example1',
          caption: 'آموزش زبان انگلیسی',
          timestamp: new Date().toISOString(),
          like_count: 150,
          comments_count: 25
        },
        {
          id: '2',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example2',
          caption: 'کلاس‌های آنلاین',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          like_count: 89,
          comments_count: 12
        },
        {
          id: '3',
          media_type: 'IMAGE' as const,
          media_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
          permalink: 'https://instagram.com/p/example3',
          caption: 'مدرسین متخصص',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          like_count: 234,
          comments_count: 45
        }
      ];
      setPosts(mockPosts);
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-white">
            <Instagram className="w-5 h-5 mr-2 animate-pulse" />
            <span className="text-sm">در حال بارگذاری...</span>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-white">
            <Instagram className="w-5 h-5 mr-2" />
            <span className="text-sm">استوری‌ها در دسترس نیست</span>
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
            <span className="font-semibold text-base">استوری‌های اینستاگرام</span>
          </div>
          <span className="text-white text-xs">{posts.length} پست</span>
        </div>

        {/* Mobile-friendly horizontal scroll */}
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {posts.map((post, index) => (
            <div key={post.id} className="flex-shrink-0 flex flex-col items-center">
              {/* Circular story container */}
              <div className="relative w-16 h-16 mb-2">
                {/* Gradient border like Instagram */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-1">
                  <div className="w-full h-full rounded-full bg-white p-1">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src={post.media_url}
                        alt={post.caption || 'Instagram story'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback image if loading fails
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/64x64/6366f1/ffffff?text=SE1A';
                        }}
                      />
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
  );
} 