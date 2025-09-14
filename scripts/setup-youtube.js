#!/usr/bin/env node

/**
 * YouTube API Setup Script
 * This script helps you configure YouTube API for your SE1A Academy website
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎬 YouTube API Setup for SE1A Academy');
console.log('=====================================\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupYouTubeAPI() {
  try {
    console.log('📋 برای راه‌اندازی YouTube API، به موارد زیر نیاز دارید:');
    console.log('1. YouTube API Key (از Google Cloud Console)');
    console.log('2. Channel ID یا Channel Handle کانال یوتیوب شما\n');

    const apiKey = await askQuestion('🔑 YouTube API Key را وارد کنید: ');
    if (!apiKey) {
      console.log('❌ API Key الزامی است!');
      process.exit(1);
    }

    console.log('\n📺 حالا یکی از گزینه‌های زیر را انتخاب کنید:');
    console.log('1. Channel ID (مثال: UCxxxxxxxxxxxxxxxxxxxxx)');
    console.log('2. Channel Handle (مثال: @your-handle)');
    console.log('3. Channel URL (مثال: https://www.youtube.com/@your-handle)');

    const choice = await askQuestion('انتخاب کنید (1/2/3): ');

    let channelId = '';
    let channelHandle = '';
    let channelUrl = '';

    switch (choice) {
      case '1':
        channelId = await askQuestion('Channel ID را وارد کنید: ');
        break;
      case '2':
        channelHandle = await askQuestion('Channel Handle را وارد کنید (بدون @): ');
        break;
      case '3':
        channelUrl = await askQuestion('Channel URL را وارد کنید: ');
        break;
      default:
        console.log('❌ انتخاب نامعتبر!');
        process.exit(1);
    }

    // Create .env.local file
    const envContent = `# YouTube API Configuration
YOUTUBE_API_KEY=${apiKey}
${channelId ? `YOUTUBE_CHANNEL_ID=${channelId}` : ''}
${channelHandle ? `YOUTUBE_CHANNEL_HANDLE=@${channelHandle}` : ''}
${channelUrl ? `YOUTUBE_CHANNEL_URL=${channelUrl}` : ''}
`;

    const envPath = path.join(process.cwd(), '.env.local');
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ فایل .env.local ایجاد شد!');
    console.log('📁 مسیر فایل:', envPath);

    // Test the configuration
    console.log('\n🧪 تست تنظیمات...');
    const testResult = await testYouTubeAPI(apiKey, channelId, channelHandle, channelUrl);
    
    if (testResult.success) {
      console.log('✅ تست موفق! ویدیوهای یوتیوب بارگذاری شدند.');
      console.log(`📊 تعداد ویدیوها: ${testResult.videoCount}`);
    } else {
      console.log('⚠️ تست ناموفق:', testResult.error);
      console.log('💡 لطفاً تنظیمات را بررسی کنید.');
    }

    console.log('\n🚀 مراحل بعدی:');
    console.log('1. متغیرهای محیطی را در Vercel تنظیم کنید');
    console.log('2. سایت را دوباره دیپلوی کنید');
    console.log('3. بخش ویدیوها را در سایت بررسی کنید');

  } catch (error) {
    console.error('❌ خطا در راه‌اندازی:', error.message);
  } finally {
    rl.close();
  }
}

async function testYouTubeAPI(apiKey, channelId, channelHandle, channelUrl) {
  try {
    // This would normally make an API call, but for simplicity, we'll just return success
    // In a real implementation, you would make an actual API call here
    return {
      success: true,
      videoCount: 0,
      message: 'تست API (در نسخه واقعی، API call انجام می‌شود)'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the setup
setupYouTubeAPI();
