import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const debugInfo = {
      environment: process.env.NODE_ENV,
      hasApiKey: !!process.env.YOUTUBE_API_KEY,
      apiKeyLength: process.env.YOUTUBE_API_KEY?.length || 0,
      hasChannelId: !!process.env.YOUTUBE_CHANNEL_ID,
      channelId: process.env.YOUTUBE_CHANNEL_ID || 'NOT_SET',
      hasChannelHandle: !!process.env.YOUTUBE_CHANNEL_HANDLE,
      channelHandle: process.env.YOUTUBE_CHANNEL_HANDLE || 'NOT_SET',
      hasChannelUsername: !!process.env.YOUTUBE_CHANNEL_USERNAME,
      channelUsername: process.env.YOUTUBE_CHANNEL_USERNAME || 'NOT_SET',
      hasChannelUrl: !!process.env.YOUTUBE_CHANNEL_URL,
      channelUrl: process.env.YOUTUBE_CHANNEL_URL || 'NOT_SET',
      allEnvVars: Object.keys(process.env).filter(key => key.includes('YOUTUBE')),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      debug: debugInfo
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
