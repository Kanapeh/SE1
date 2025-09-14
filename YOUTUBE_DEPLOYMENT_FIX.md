# YouTube API Deployment Fix Guide

## مشکل
ویدیوهای یوتیوب در localhost کار می‌کنند اما در سایت دیپلوی شده خطای "Channel not found" می‌دهند.

## علت
متغیرهای محیطی YouTube API در محیط production تنظیم نشده‌اند.

## راه حل

### 1. تنظیم متغیرهای محیطی در Vercel

#### روش 1: از طریق Vercel Dashboard
1. به [Vercel Dashboard](https://vercel.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. به تب **Settings** بروید
4. روی **Environment Variables** کلیک کنید
5. متغیرهای زیر را اضافه کنید:

```
YOUTUBE_API_KEY=your-youtube-api-key-here
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxx
```

#### روش 2: از طریق Vercel CLI
```bash
vercel env add YOUTUBE_API_KEY
vercel env add YOUTUBE_CHANNEL_ID
```

### 2. دریافت YouTube API Key

#### مرحله 1: ایجاد پروژه در Google Cloud Console
1. به [Google Cloud Console](https://console.cloud.google.com/) بروید
2. پروژه جدید ایجاد کنید یا پروژه موجود را انتخاب کنید
3. **APIs & Services** > **Library** بروید
4. "YouTube Data API v3" را جستجو کنید
5. روی **Enable** کلیک کنید

#### مرحله 2: ایجاد API Key
1. به **APIs & Services** > **Credentials** بروید
2. روی **Create Credentials** کلیک کنید
3. **API Key** را انتخاب کنید
4. API Key را کپی کنید

#### مرحله 3: محدود کردن API Key (اختیاری اما توصیه می‌شود)
1. روی API Key کلیک کنید
2. **Application restrictions** را روی **HTTP referrers** تنظیم کنید
3. دامنه سایت خود را اضافه کنید:
   - `https://www.se1a.org/*`
   - `https://se1a.org/*`
4. **API restrictions** را روی **Restrict key** تنظیم کنید
5. **YouTube Data API v3** را انتخاب کنید

### 3. دریافت Channel ID

#### روش 1: از URL کانال
اگر URL کانال شما `https://www.youtube.com/@your-handle` است:
1. به کانال خود بروید
2. روی **About** کلیک کنید
3. Channel ID را کپی کنید (شبیه `UCxxxxxxxxxxxxxxxxxxxxx`)

#### روش 2: از طریق YouTube Studio
1. به [YouTube Studio](https://studio.youtube.com/) بروید
2. به **Settings** > **Channel** بروید
3. Channel ID را کپی کنید

#### روش 3: از طریق API (اگر API Key دارید)
```bash
curl "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=YOUR_USERNAME&key=YOUR_API_KEY"
```

### 4. تنظیم متغیرهای محیطی

#### در Vercel Dashboard:
```
YOUTUBE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxx
```

#### در فایل .env.local (برای تست محلی):
```env
YOUTUBE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxx
```

### 5. تست تنظیمات

#### تست محلی:
```bash
npm run dev
```

#### تست در production:
1. تغییرات را commit کنید
2. به Vercel push کنید
3. به سایت بروید و بخش ویدیوها را بررسی کنید

### 6. عیب‌یابی

#### اگر هنوز کار نمی‌کند:

1. **بررسی API Key:**
   ```bash
   curl "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=YOUR_CHANNEL_ID&key=YOUR_API_KEY"
   ```

2. **بررسی Channel ID:**
   ```bash
   curl "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=YOUR_CHANNEL_ID&key=YOUR_API_KEY"
   ```

3. **بررسی لاگ‌ها در Vercel:**
   - به Vercel Dashboard بروید
   - تب **Functions** را انتخاب کنید
   - لاگ‌های `/api/youtube` را بررسی کنید

### 7. جایگزین‌های پیشنهادی

اگر نمی‌خواهید از YouTube API استفاده کنید:

#### گزینه 1: ویدیوهای ثابت
```typescript
const staticVideos = [
  {
    id: 'video1',
    title: 'آموزش زبان انگلیسی - درس اول',
    thumbnail: '/images/video1-thumb.jpg',
    duration: '10:30',
    viewCount: '1.2K',
    publishedAt: '2024-01-01',
    category: 'beginner',
    language: 'persian'
  }
];
```

#### گزینه 2: RSS Feed
```typescript
// استفاده از RSS feed کانال یوتیوب
const rssUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=YOUR_CHANNEL_ID';
```

### 8. کد بهینه‌شده برای مدیریت خطا

```typescript
// در components/YouTubeVideosSection.tsx
useEffect(() => {
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/youtube');
      const result = await response.json();
      
      if (!result.success) {
        // نمایش ویدیوهای پیش‌فرض در صورت خطا
        setVideos(getDefaultVideos());
        setError('ویدیوهای یوتیوب در دسترس نیستند');
        return;
      }
      
      setVideos(result.videos);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setVideos(getDefaultVideos());
      setError('خطا در بارگذاری ویدیوها');
    } finally {
      setLoading(false);
    }
  };

  fetchVideos();
}, []);

const getDefaultVideos = () => [
  {
    id: 'default1',
    title: 'آموزش زبان انگلیسی - مقدمات',
    thumbnail: '/images/default-video1.jpg',
    duration: '15:30',
    viewCount: '2.1K',
    publishedAt: '2024-01-01',
    category: 'beginner',
    language: 'persian'
  }
];
```

## نتیجه
پس از تنظیم صحیح متغیرهای محیطی، ویدیوهای یوتیوب در سایت دیپلوی شده نیز نمایش داده خواهند شد.
