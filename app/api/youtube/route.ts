import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const ENV_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || '';
const ENV_CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '';
const ENV_CHANNEL_USERNAME = process.env.YOUTUBE_CHANNEL_USERNAME || '';
const ENV_CHANNEL_URL = process.env.YOUTUBE_CHANNEL_URL || '';

export async function GET() {
  try {
    if (!YOUTUBE_API_KEY) {
      console.error('❌ YouTube API key not found');
      return NextResponse.json({
        success: false,
        error: 'YouTube API key not configured',
        code: 'MISSING_API_KEY'
      }, { status: 500 });
    }

    console.log('🔍 Fetching videos from YouTube channel...');

    // Resolve channel ID via environment variables (preferred) and fallbacks
    const channelId = await resolveChannelId();

    if (!channelId) {
      console.error('❌ Could not find channel ID using any method');
      return NextResponse.json({
        success: false,
        error: 'Channel not found. Set YOUTUBE_CHANNEL_ID or YOUTUBE_CHANNEL_HANDLE or YOUTUBE_CHANNEL_USERNAME.',
        code: 'CHANNEL_NOT_FOUND'
      }, { status: 404 });
    }

    // Now fetch videos using the found channel ID
    return await fetchVideosForChannel(channelId);

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

async function resolveChannelId(): Promise<string | null> {
  // 1) Explicit channel ID from env
  if (ENV_CHANNEL_ID) {
    const id = sanitizeChannelId(ENV_CHANNEL_ID);
    if (await validateChannelId(id)) return id;
  }

  // 2) Channel URL from env (extract handle/ID/username)
  if (ENV_CHANNEL_URL) {
    const parsed = parseChannelUrl(ENV_CHANNEL_URL);
    if (parsed?.type === 'id' && await validateChannelId(parsed.value)) return parsed.value;
    if (parsed?.type === 'handle') {
      const id = await getChannelIdByHandle(parsed.value);
      if (id) return id;
    }
    if (parsed?.type === 'username') {
      const id = await getChannelIdByUsername(parsed.value);
      if (id) return id;
    }
  }

  // 3) Handle from env
  if (ENV_CHANNEL_HANDLE) {
    const id = await getChannelIdByHandle(ENV_CHANNEL_HANDLE);
    if (id) return id;
  }

  // 4) Username from env
  if (ENV_CHANNEL_USERNAME) {
    const id = await getChannelIdByUsername(ENV_CHANNEL_USERNAME);
    if (id) return id;
  }

  // 5) No env provided: return null to signal misconfiguration
  return null;
}

function sanitizeChannelId(raw: string): string {
  // Accept forms like UCxxxx, or full URL containing /channel/UCxxxx
  const trimmed = raw.trim();
  const match = trimmed.match(/UC[0-9A-Za-z_-]{21,}/);
  return match ? match[0] : trimmed;
}

function parseChannelUrl(url: string): { type: 'id' | 'handle' | 'username'; value: string } | null {
  try {
    const u = new URL(url);
    const pathname = u.pathname; // e.g., /@handle, /channel/UC..., /user/username
    if (pathname.startsWith('/@')) {
      return { type: 'handle', value: pathname.slice(2) };
    }
    if (pathname.startsWith('/channel/')) {
      const id = pathname.split('/')[2];
      return { type: 'id', value: id };
    }
    if (pathname.startsWith('/user/')) {
      const username = pathname.split('/')[2];
      return { type: 'username', value: username };
    }
    return null;
  } catch {
    return null;
  }
}

async function validateChannelId(channelId: string): Promise<boolean> {
  try {
    const resp = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&id=${channelId}&key=${YOUTUBE_API_KEY}`);
    if (!resp.ok) return false;
    const data = await resp.json();
    return Array.isArray(data.items) && data.items.length > 0;
  } catch {
    return false;
  }
}

async function getChannelIdByHandle(handle: string): Promise<string | null> {
  const normalized = handle.trim().replace(/^@?/, '@');
  try {
    console.log('🔄 Resolving channel by handle:', normalized);
    const resp = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(normalized)}&key=${YOUTUBE_API_KEY}`);
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.items?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

async function getChannelIdByUsername(username: string): Promise<string | null> {
  const normalized = username.trim().replace(/^@/, '');
  try {
    console.log('🔄 Resolving channel by username:', normalized);
    const resp = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${encodeURIComponent(normalized)}&key=${YOUTUBE_API_KEY}`);
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.items?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

async function fetchVideosForChannel(channelId: string) {
  try {
    // Get videos from the channel (excluding Shorts) - fetch more to filter out Shorts
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`
    );

    if (!videosResponse.ok) {
      console.error('❌ Error fetching videos:', videosResponse.statusText);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch videos',
        code: 'VIDEOS_FETCH_FAILED'
      }, { status: 500 });
    }

    const videosData = await videosResponse.json();
    
    if (!videosData.items || videosData.items.length === 0) {
      console.log('⚠️ No videos found in channel');
      return NextResponse.json({
        videos: [],
        success: true
      });
    }

    // Filter out Shorts (videos with duration less than 60 seconds or aspect ratio 9:16)
    const filteredVideos = videosData.items.filter((item: any) => {
      // Skip videos that are likely Shorts based on title patterns
      const title = item.snippet.title.toLowerCase();
      if (title.includes('#shorts') || title.includes('short') || title.includes('کوتاه')) {
        return false;
      }
      return true;
    });

    console.log(`📊 Found ${videosData.items.length} videos, filtered to ${filteredVideos.length} non-Shorts`);
    
    if (filteredVideos.length === 0) {
      console.log('⚠️ No non-Shorts videos found in channel');
      return NextResponse.json({
        videos: [],
        success: true
      });
    }

    // Get detailed video information including duration and view count
    const videoIds = filteredVideos.map((item: any) => item.id.videoId).join(',');
    
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`
    );

    if (!videoDetailsResponse.ok) {
      console.error('❌ Error fetching video details:', videoDetailsResponse.statusText);
      // Return basic video info without details
      const videos = videosData.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        duration: 'N/A',
        views: 'N/A',
        category: 'intermediate',
        language: 'انگلیسی'
      }));

      return NextResponse.json({
        videos,
        success: true
      });
    }

    const videoDetailsData = await videoDetailsResponse.json();
    
    // Combine basic info with detailed info
    const videos = filteredVideos.map((item: any, index: number) => {
      const details = videoDetailsData.items[index] || {};
      
      // Convert duration from ISO 8601 to readable format
      const duration = details.contentDetails?.duration || 'N/A';
      const readableDuration = duration !== 'N/A' ? formatDuration(duration) : 'N/A';
      
      // Format view count
      const views = details.statistics?.viewCount || '0';
      const formattedViews = formatViewCount(parseInt(views));
      
      // Format published date
      const publishedDate = new Date(item.snippet.publishedAt);
      const timeAgo = formatTimeAgo(publishedDate);
      
      // Determine category based on title/description
      const category = determineCategory(item.snippet.title, item.snippet.description);
      
      // Determine language based on title/description
      const language = determineLanguage(item.snippet.title, item.snippet.description);

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        publishedAt: timeAgo,
        channelTitle: item.snippet.channelTitle,
        duration: readableDuration,
        views: formattedViews,
        category,
        language
      };
    });

    console.log('✅ Videos fetched successfully:', videos.length);
    return NextResponse.json({
      videos,
      success: true
    });

  } catch (error) {
    console.error('💥 Error in fetchVideosForChannel:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch videos for channel',
      code: 'CHANNEL_VIDEOS_FETCH_FAILED'
    }, { status: 500 });
  }
}

// Helper function to format duration
function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 'N/A';
  
  const hours = match[1] ? parseInt(match[1].slice(0, -1)) : 0;
  const minutes = match[2] ? parseInt(match[2].slice(0, -1)) : 0;
  const seconds = match[3] ? parseInt(match[3].slice(0, -1)) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Helper function to format view count
function formatViewCount(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  } else {
    return views.toString();
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'همین الان';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} دقیقه پیش`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ساعت پیش`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} روز پیش`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} ماه پیش`;
  return `${Math.floor(diffInSeconds / 31536000)} سال پیش`;
}

// Helper function to determine category
function determineCategory(title: string, description: string): 'beginner' | 'intermediate' | 'advanced' {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('مبتدی') || text.includes('beginner') || text.includes('پایه') || text.includes('basic')) {
    return 'beginner';
  } else if (text.includes('پیشرفته') || text.includes('advanced') || text.includes('متخصص')) {
    return 'advanced';
  } else {
    return 'intermediate';
  }
}

// Helper function to determine language
function determineLanguage(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('فرانسه') || text.includes('french')) {
    return 'فرانسه';
  } else if (text.includes('آلمانی') || text.includes('german')) {
    return 'آلمانی';
  } else if (text.includes('اسپانیایی') || text.includes('spanish')) {
    return 'اسپانیایی';
  } else {
    return 'انگلیسی';
  }
}
