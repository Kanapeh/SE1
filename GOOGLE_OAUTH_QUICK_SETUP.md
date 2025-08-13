# 🚀 راهنمای سریع تنظیم Google OAuth برای حل خطای PKCE

## 🚨 مشکل فعلی
خطای **"code challenge does not match previously saved code verifier"** به دلیل عدم تنظیم Google OAuth رخ می‌دهد.

## ✅ راه‌حل: تنظیم Google OAuth

### مرحله 1: ایجاد Google OAuth Client ID

#### 1.1 ورود به Google Cloud Console
- به [Google Cloud Console](https://console.cloud.google.com/) بروید
- پروژه مورد نظر را انتخاب کنید (یا پروژه جدید ایجاد کنید)

#### 1.2 فعال‌سازی Google+ API
```
APIs & Services > Library
جستجو: "Google+ API" یا "Google Identity"
فعال‌سازی API
```

#### 1.3 ایجاد OAuth 2.0 Client ID
```
APIs & Services > Credentials
Create Credentials > OAuth 2.0 Client IDs
Application type: Web application
Name: SE1A Academy
```

#### 1.4 تنظیم Authorized redirect URIs
```
Authorized redirect URIs:
https://vyjcwwrhiorbhfitpxdr.supabase.co/auth/v1/callback
```

### مرحله 2: تنظیم در Supabase

#### 2.1 ورود به Supabase Dashboard
- به [supabase.com](https://supabase.com) بروید
- پروژه `vyjcwwrhiorbhfitpxdr` را انتخاب کنید

#### 2.2 فعال‌سازی Google OAuth
```
Authentication > Providers > Google
Enable: فعال کنید
Client ID: همان ID که از Google گرفتید
Client Secret: همان Secret که از Google گرفتید
Redirect URL: https://vyjcwwrhiorbhfitpxdr.supabase.co/auth/v1/callback
Save
```

### مرحله 3: به‌روزرسانی Environment Variables

#### 3.1 فایل `.env.local`
```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

#### 3.2 جایگزینی مقادیر
- `your-google-client-id-here` را با Client ID واقعی جایگزین کنید
- `your-google-client-secret-here` را با Client Secret واقعی جایگزین کنید

### مرحله 4: تست تنظیمات

#### 4.1 Restart سرور
```bash
# ترمینال را متوقف کنید (Ctrl+C)
# سپس دوباره شروع کنید
npm run dev
```

#### 4.2 تست OAuth
```
http://localhost:3000/test-simple-oauth
```

## 🔍 عیب‌یابی

### مشکل 1: "Unsupported provider"
**علت:** Google OAuth در Supabase فعال نیست
**راه‌حل:** مرحله 2 را تکمیل کنید

### مشکل 2: "Invalid redirect_uri"
**علت:** Redirect URI در Google Cloud Console اشتباه است
**راه‌حل:** دقیقاً این URL را وارد کنید:
```
https://vyjcwwrhiorbhfitpxdr.supabase.co/auth/v1/callback
```

### مشکل 3: "Client ID not found"
**علت:** Client ID اشتباه وارد شده
**راه‌حل:** Client ID را از Google Cloud Console کپی کنید

## 📋 چک‌لیست نهایی

- [ ] Google+ API فعال شده
- [ ] OAuth 2.0 Client ID ایجاد شده
- [ ] Redirect URI درست تنظیم شده
- [ ] Google OAuth در Supabase فعال شده
- [ ] Client ID و Secret در Supabase وارد شده
- [ ] Environment variables به‌روزرسانی شده
- [ ] سرور restart شده
- [ ] OAuth تست شده

## 🎯 نتیجه مورد انتظار

پس از تکمیل این مراحل:
1. ✅ Google OAuth فعال می‌شود
2. ✅ خطای PKCE برطرف می‌شود
3. ✅ ورود با گوگل کار می‌کند
4. ✅ کاربر به صفحه مناسب هدایت می‌شود

## 🆘 در صورت مشکل

اگر همچنان مشکل داشتید:
1. Console مرورگر را بررسی کنید
2. خطاهای دقیق را یادداشت کنید
3. Supabase project settings را چک کنید
4. Google Cloud Console را بررسی کنید
5. Environment variables را تأیید کنید

## 📞 پشتیبانی

برای کمک بیشتر:
1. خطاهای دقیق را کپی کنید
2. Screenshot از Console بگیرید
3. Supabase project URL را به اشتراک بگذارید
4. مراحل انجام شده را توضیح دهید
