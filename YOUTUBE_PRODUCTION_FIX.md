# حل مشکل YouTube API در Production

## 🔍 تشخیص مشکل
خطای "ویدیوهای یوتیوب در دسترس نیستند" نشان می‌دهد که YouTube API در production کار نمی‌کند.

## 🛠️ مراحل حل مشکل

### مرحله 1: بررسی تنظیمات Environment Variables

#### در Vercel Dashboard:
1. به [Vercel Dashboard](https://vercel.com/dashboard) بروید
2. پروژه SE1A را انتخاب کنید
3. به تب **Settings** بروید
4. روی **Environment Variables** کلیک کنید
5. بررسی کنید که متغیرهای زیر تنظیم شده باشند:

```
YOUTUBE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
YOUTUBE_CHANNEL_ID=UCbE2jzkIoA_mv86JP4UsSuw
```

### مرحله 2: تست تنظیمات

#### تست 1: بررسی Environment Variables
```bash
# در مرورگر به آدرس زیر بروید:
https://www.se1a.org/api/youtube/debug
```

این باید اطلاعات زیر را نشان دهد:
```json
{
  "success": true,
  "debug": {
    "hasApiKey": true,
    "apiKeyLength": 39,
    "hasChannelId": true,
    "channelId": "UCbE2jzkIoA_mv86JP4UsSuw",
    "environment": "production"
  }
}
```

#### تست 2: تست مستقیم YouTube API
```bash
# در مرورگر به آدرس زیر بروید:
https://www.se1a.org/api/youtube/test
```

این باید نتیجه موفقیت‌آمیز نشان دهد:
```json
{
  "success": true,
  "message": "YouTube API test successful",
  "videoCount": 5,
  "latestVideo": "نام آخرین ویدیو"
}
```

### مرحله 3: اگر Environment Variables تنظیم نشده‌اند

#### در Vercel Dashboard:
1. **Settings** > **Environment Variables**
2. **Add New** کلیک کنید
3. متغیرهای زیر را اضافه کنید:

**متغیر 1:**
- Name: `YOUTUBE_API_KEY`
- Value: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Environment: `Production`

**متغیر 2:**
- Name: `YOUTUBE_CHANNEL_ID`
- Value: `UCbE2jzkIoA_mv86JP4UsSuw`
- Environment: `Production`

4. **Save** کلیک کنید

### مرحله 4: Redeploy سایت

پس از تنظیم Environment Variables:
1. به تب **Deployments** بروید
2. روی **Redeploy** کلیک کنید
3. منتظر بمانید تا deployment کامل شود

### مرحله 5: تست نهایی

1. به سایت بروید: `https://www.se1a.org`
2. به بخش ویدیوها بروید
3. بررسی کنید که ویدیوهای یوتیوب نمایش داده می‌شوند

## 🔧 عیب‌یابی

### اگر هنوز کار نمی‌کند:

#### 1. بررسی API Key:
```bash
curl "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCbE2jzkIoA_mv86JP4UsSuw&key=YOUR_API_KEY"
```

#### 2. بررسی Channel ID:
```bash
curl "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=UCbE2jzkIoA_mv86JP4UsSuw&key=YOUR_API_KEY"
```

#### 3. بررسی Quota:
- به [Google Cloud Console](https://console.cloud.google.com/) بروید
- APIs & Services > Quotas
- YouTube Data API v3 را بررسی کنید

#### 4. بررسی لاگ‌ها:
- در Vercel Dashboard > Functions
- لاگ‌های `/api/youtube` را بررسی کنید

## 📋 چک‌لیست نهایی

- [ ] YOUTUBE_API_KEY در Vercel تنظیم شده
- [ ] YOUTUBE_CHANNEL_ID در Vercel تنظیم شده
- [ ] سایت دوباره deploy شده
- [ ] تست `/api/youtube/debug` موفقیت‌آمیز
- [ ] تست `/api/youtube/test` موفقیت‌آمیز
- [ ] ویدیوها در سایت نمایش داده می‌شوند

## 🚨 مشکلات رایج

### 1. API Key نامعتبر
**علائم:** خطای 401 یا 403
**حل:** API Key جدید از Google Cloud Console دریافت کنید

### 2. Channel ID اشتباه
**علائم:** خطای 404 یا "Channel not found"
**حل:** Channel ID صحیح را از YouTube Studio دریافت کنید

### 3. Quota Exceeded
**علائم:** خطای 403 با پیام quota
**حل:** منتظر بمانید یا Quota را افزایش دهید

### 4. Environment Variables تنظیم نشده
**علائم:** خطای "API key not configured"
**حل:** متغیرهای محیطی را در Vercel تنظیم کنید

## 📞 پشتیبانی

اگر مشکل حل نشد:
1. نتایج تست‌ها را بررسی کنید
2. لاگ‌های Vercel را چک کنید
3. با تیم توسعه تماس بگیرید

## ✅ نتیجه

پس از انجام این مراحل، ویدیوهای یوتیوب در سایت production نمایش داده خواهند شد و خطای "ویدیوهای یوتیوب در دسترس نیستند" برطرف خواهد شد.
