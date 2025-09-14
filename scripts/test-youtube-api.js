#!/usr/bin/env node

/**
 * YouTube API Test Script
 * This script tests your YouTube API configuration
 */

const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const YOUTUBE_CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE;
const YOUTUBE_CHANNEL_URL = process.env.YOUTUBE_CHANNEL_URL;

console.log('🧪 Testing YouTube API Configuration');
console.log('=====================================\n');

// Check if API key exists
if (!YOUTUBE_API_KEY) {
  console.log('❌ YOUTUBE_API_KEY not found in environment variables');
  console.log('💡 Please set YOUTUBE_API_KEY in your .env.local file');
  process.exit(1);
}

console.log('✅ YOUTUBE_API_KEY found');

// Check channel configuration
let channelConfig = '';
if (YOUTUBE_CHANNEL_ID) {
  channelConfig = `Channel ID: ${YOUTUBE_CHANNEL_ID}`;
} else if (YOUTUBE_CHANNEL_HANDLE) {
  channelConfig = `Channel Handle: ${YOUTUBE_CHANNEL_HANDLE}`;
} else if (YOUTUBE_CHANNEL_URL) {
  channelConfig = `Channel URL: ${YOUTUBE_CHANNEL_URL}`;
} else {
  console.log('❌ No channel configuration found');
  console.log('💡 Please set one of: YOUTUBE_CHANNEL_ID, YOUTUBE_CHANNEL_HANDLE, or YOUTUBE_CHANNEL_URL');
  process.exit(1);
}

console.log(`✅ Channel configuration: ${channelConfig}`);

// Test API call
async function testAPI() {
  try {
    console.log('\n🔍 Testing API call...');
    
    // Test with channel ID if available
    if (YOUTUBE_CHANNEL_ID) {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&order=date&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        console.log('❌ API Error:', data.error.message);
        return;
      }
      
      if (data.items && data.items.length > 0) {
        console.log('✅ API call successful!');
        console.log(`📊 Found ${data.items.length} videos`);
        console.log('📺 Latest video:', data.items[0].snippet.title);
      } else {
        console.log('⚠️ No videos found in channel');
      }
    } else {
      console.log('⚠️ Cannot test API without Channel ID');
      console.log('💡 Please set YOUTUBE_CHANNEL_ID for full testing');
    }
    
  } catch (error) {
    console.log('❌ API call failed:', error.message);
  }
}

// Run the test
testAPI();
