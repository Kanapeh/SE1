# راهنمای راه‌اندازی YouTube API

## مشکل فعلی
خطای "YouTube API key not configured" به این معنی است که کلید API یوتیوب در فایل `.env.local` تنظیم نشده است.

## راه‌حل

### مرحله 1: دریافت کلید API از Google Cloud Console

1. **ورود به Google Cloud Console**
   - به [Google Cloud Console](https://console.cloud.google.com/) بروید
   - با حساب Google خود وارد شوید

2. **ایجاد پروژه جدید (اختیاری)**
   - اگر پروژه ندارید، روی "Select a project" کلیک کنید
   - "New Project" را انتخاب کنید
   - نام پروژه را وارد کنید (مثل: "SE1A-YouTube-API")
   - "Create" را کلیک کنید

3. **فعال‌سازی YouTube Data API v3**
   - از منوی سمت چپ، "APIs & Services" > "Library" را انتخاب کنید
   - در جستجو "YouTube Data API v3" را تایپ کنید
   - روی آن کلیک کنید و "Enable" را بزنید

4. **ایجاد کلید API**
   - از منوی سمت چپ، "APIs & Services" > "Credentials" را انتخاب کنید
   - "Create Credentials" > "API Key" را کلیک کنید
   - کلید API ایجاد شده را کپی کنید

### مرحله 2: تنظیم کلید API در پروژه

1. **ویرایش فایل .env.local**
   ```bash
   # فایل .env.local را باز کنید
   nano .env.local
   ```

2. **جایگزینی کلید API**
   ```env
   # این خط را پیدا کنید:
   YOUTUBE_API_KEY=your-youtube-api-key-here
   
   # و آن را با کلید واقعی جایگزین کنید:
   YOUTUBE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### مرحله 3: تنظیم شناسه کانال یوتیوب

برای نمایش ویدیوهای کانال یوتیوب، یکی از روش‌های زیر را انتخاب کنید:

#### روش 1: استفاده از شناسه کانال (توصیه شده)
```env
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxx
```

**نحوه پیدا کردن شناسه کانال:**
1. به کانال یوتیوب خود بروید
2. URL کانال را کپی کنید (مثل: `https://www.youtube.com/@your-channel`)
3. شناسه کانال معمولاً در URL یا در source code صفحه قابل مشاهده است
4. یا از ابزارهای آنلاین مثل [Channel ID Finder](https://commentpicker.com/youtube-channel-id.php) استفاده کنید

#### روش 2: استفاده از هندل کانال
```env
YOUTUBE_CHANNEL_HANDLE=@your-channel-handle
```

#### روش 3: استفاده از آدرس کامل کانال
```env
YOUTUBE_CHANNEL_URL=https://www.youtube.com/@your-channel-handle
```

### مرحله 4: تست تنظیمات

1. **راه‌اندازی مجدد سرور**
   ```bash
   npm run dev
   ```

2. **بررسی کنسول مرورگر**
   - صفحه اصلی سایت را باز کنید
   - بخش "ویدیوهای آموزشی" را پیدا کنید
   - اگر خطایی وجود دارد، در کنسول مرورگر (F12) بررسی کنید

3. **تست API مستقیماً**
   ```bash
   curl "http://localhost:3000/api/youtube"
   ```

### مرحله 5: تنظیمات امنیتی (اختیاری اما توصیه شده)

1. **محدود کردن کلید API**
   - در Google Cloud Console، روی کلید API کلیک کنید
   - "Application restrictions" را تنظیم کنید
   - "HTTP referrers" را انتخاب کنید
   - دامنه‌های مجاز را اضافه کنید:
     - `localhost:3000/*` (برای development)
     - `your-domain.com/*` (برای production)

2. **محدود کردن API**
   - "API restrictions" را تنظیم کنید
   - فقط "YouTube Data API v3" را انتخاب کنید

## مثال کامل فایل .env.local

```env
# سایر تنظیمات موجود...

# YouTube API Configuration
YOUTUBE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxx
# یا
YOUTUBE_CHANNEL_HANDLE=@your-channel-handle
# یا
YOUTUBE_CHANNEL_URL=https://www.youtube.com/@your-channel-handle
```

## عیب‌یابی

### خطای "API key not valid"
- کلید API را بررسی کنید
- مطمئن شوید YouTube Data API v3 فعال است
- محدودیت‌های API را بررسی کنید

### خطای "Channel not found"
- شناسه کانال را بررسی کنید
- مطمئن شوید کانال عمومی است
- از هندل یا URL کانال استفاده کنید

### خطای "Quota exceeded"
- سهمیه API تمام شده است
- منتظر بمانید تا سهمیه reset شود (24 ساعت)
- یا سهمیه بیشتری خریداری کنید

## نکات مهم

1. **هرگز کلید API را در کد قرار ندهید**
2. **فایل .env.local را در .gitignore قرار دهید**
3. **برای production، کلید API را در تنظیمات hosting اضافه کنید**
4. **سهمیه API رایگان: 10,000 درخواست در روز**

## پشتیبانی

اگر با مشکل مواجه شدید:
1. کنسول مرورگر را بررسی کنید
2. لاگ‌های سرور را بررسی کنید
3. تنظیمات API را دوباره بررسی کنید
