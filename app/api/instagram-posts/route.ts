import { NextResponse } from 'next/server';

// Instagram Basic Display API configuration
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;

interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

interface InstagramResponse {
  data: InstagramMedia[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next: string;
  };
}

export async function GET() {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
      console.error('Instagram credentials not configured');
      return NextResponse.json({ 
        posts: [],
        error: 'Instagram credentials not configured' 
      });
    }

    // Fetch media from Instagram Basic Display API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=10`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }

    const data: InstagramResponse = await response.json();
    
    // Transform the data to match our interface
    const posts = data.data.map(media => ({
      id: media.id,
      media_type: media.media_type,
      media_url: media.media_url,
      permalink: media.permalink,
      caption: media.caption || '',
      timestamp: media.timestamp,
      like_count: media.like_count || 0,
      comments_count: media.comments_count || 0
    }));

    return NextResponse.json({ posts });

  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    
    // Return mock data for development/testing
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
      }
    ];

    return NextResponse.json({ 
      posts: mockPosts,
      error: 'Using mock data - Instagram API not available'
    });
  }
} 