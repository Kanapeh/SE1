import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'YOUTUBE_API_KEY not found',
        step: 'API_KEY_CHECK'
      }, { status: 500 });
    }

    if (!YOUTUBE_CHANNEL_ID) {
      return NextResponse.json({
        success: false,
        error: 'YOUTUBE_CHANNEL_ID not found',
        step: 'CHANNEL_ID_CHECK'
      }, { status: 500 });
    }

    // Test API call
    const testUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&order=date&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;
    
    console.log('🧪 Testing YouTube API with URL:', testUrl.replace(YOUTUBE_API_KEY, 'HIDDEN_KEY'));
    
    const response = await fetch(testUrl);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `API call failed: ${response.status} ${response.statusText}`,
        step: 'API_CALL',
        details: data
      }, { status: 500 });
    }

    if (data.error) {
      return NextResponse.json({
        success: false,
        error: `YouTube API error: ${data.error.message}`,
        step: 'YOUTUBE_API_ERROR',
        details: data.error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'YouTube API test successful',
      step: 'SUCCESS',
      videoCount: data.items?.length || 0,
      latestVideo: data.items?.[0]?.snippet?.title || 'No videos found',
      channelId: YOUTUBE_CHANNEL_ID,
      apiKeyLength: YOUTUBE_API_KEY.length
    });

  } catch (error) {
    console.error('💥 YouTube API test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      step: 'EXCEPTION'
    }, { status: 500 });
  }
}
