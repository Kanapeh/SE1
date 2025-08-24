import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UCSe1-academy'; // This will be extracted from the URL

export async function GET() {
  try {
    if (!YOUTUBE_API_KEY) {
      console.error('❌ YouTube API key not found');
      return NextResponse.json({ 
        error: 'YouTube API key not configured' 
      }, { status: 500 });
    }

    console.log('🔍 Fetching videos from YouTube channel...');

    // Try to get channel ID using different methods
    let channelId = null;

    // Method 1: Try with handle @Se1-academy
    try {
      console.log('🔄 Trying with channel handle...');
      const handleResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=@Se1-academy&key=${YOUTUBE_API_KEY}`
      );
      
      if (handleResponse.ok) {
        const handleData = await handleResponse.json();
        if (handleData.items && handleData.items.length > 0) {
          channelId = handleData.items[0].id;
          console.log('✅ Channel ID found via handle:', channelId);
        }
      }
    } catch (error) {
      console.log('⚠️ Handle method failed, trying username...');
    }

    // Method 2: Try with username Se1-academy
    if (!channelId) {
      try {
        console.log('🔄 Trying with username...');
        const usernameResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=Se1-academy&key=${YOUTUBE_API_KEY}`
        );
        
        if (usernameResponse.ok) {
          const usernameData = await usernameResponse.json();
          if (usernameData.items && usernameData.items.length > 0) {
            channelId = usernameData.items[0].id;
            console.log('✅ Channel ID found via username:', channelId);
          }
        }
      } catch (error) {
        console.log('⚠️ Username method failed');
      }
    }

    // Method 3: Try with custom channel ID (if we know it)
    if (!channelId) {
      try {
        console.log('🔄 Trying with custom channel ID...');
        // You can replace this with the actual channel ID if you know it
        const customChannelId = 'UCSe1-academy'; // This might be wrong
        const customResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=id&id=${customChannelId}&key=${YOUTUBE_API_KEY}`
        );
        
        if (customResponse.ok) {
          const customData = await customResponse.json();
          if (customData.items && customData.items.length > 0) {
            channelId = customData.items[0].id;
            console.log('✅ Channel ID found via custom ID:', channelId);
          }
        }
      } catch (error) {
        console.log('⚠️ Custom ID method failed');
      }
    }

    if (!channelId) {
      console.error('❌ Could not find channel ID using any method');
      return NextResponse.json({ 
        error: 'Channel not found. Please check the channel URL or provide the correct channel ID.' 
      }, { status: 404 });
    }

    // Now fetch videos using the found channel ID
    return await fetchVideosForChannel(channelId);

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
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
        error: 'Failed to fetch videos' 
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
        category: 'intermediate', // Default category
        language: 'انگلیسی' // Default language
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
      error: 'Failed to fetch videos for channel' 
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
