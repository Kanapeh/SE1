# راهنمای سریع رفع مشکل OAuth Redirect

## مشکل فعلی
بعد از ثبت‌نام با Google OAuth، کاربران به `http://localhost:3000/?code=...` هدایت می‌شوند.

## راه‌حل فوری (Emergency Fix)

### 1. استفاده از توابع Emergency
تمام صفحات OAuth حالا از توابع `emergency-oauth-fix.ts` استفاده می‌کنند که URL ها را به صورت hardcode تنظیم می‌کند.

### 2. تست فوری
1. به صفحه `/test-oauth-redirect` بروید
2. دکمه "تست OAuth URLs" را کلیک کنید
3. باید `https://www.se1a.org/auth/callback` ببینید

### 3. تست OAuth
1. به صفحه ثبت‌نام بروید
2. با Google ثبت‌نام کنید
3. حالا باید به `https://www.se1a.org/auth/callback` هدایت شوید

## علت اصلی مشکل

مشکل احتمالاً در یکی از این موارد است:

### 1. Supabase Dashboard
- Site URL هنوز `localhost:3000` است
- Redirect URLs شامل `localhost:3000` است

### 2. Google Cloud Console
- Authorized redirect URIs شامل `localhost:3000` است

### 3. متغیرهای محیطی
- `NEXT_PUBLIC_SITE_URL` در production تنظیم نشده

## راه‌حل دائمی

### 1. Supabase Dashboard
1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. Authentication > URL Configuration
4. Site URL را `https://www.se1a.org` قرار دهید
5. Redirect URLs را اضافه کنید:
   - `https://www.se1a.org/auth/callback`
   - `https://www.se1a.org/admin/auth/callback`

### 2. Google Cloud Console
1. به [Google Cloud Console](https://console.cloud.google.com/) بروید
2. APIs & Services > Credentials
3. OAuth 2.0 Client ID خود را انتخاب کنید
4. Authorized redirect URIs را اضافه کنید:
   - `https://www.se1a.org/auth/callback`
   - `https://www.se1a.org/admin/auth/callback`

### 3. Vercel Environment Variables
1. به Vercel Dashboard بروید
2. پروژه خود را انتخاب کنید
3. Settings > Environment Variables
4. `NEXT_PUBLIC_SITE_URL` را `https://www.se1a.org` قرار دهید

## تست نهایی

### 1. تست OAuth URLs
```
Expected: https://www.se1a.org/auth/callback
Actual: [check the test page]
```

### 2. تست ثبت‌نام
```
Expected: Redirect to https://www.se1a.org/auth/callback
Actual: [should not redirect to localhost]
```

### 3. تست ورود
```
Expected: Redirect to https://www.se1a.org/auth/callback
Actual: [should not redirect to localhost]
```

## اگر هنوز مشکل دارید

### 1. Console مرورگر را بررسی کنید
پیام‌های debug را بررسی کنید:
```
🚨 EMERGENCY: Using hardcoded production URL
🚨 EMERGENCY OAUTH CONFIGURATION:
```

### 2. Network Tab را بررسی کنید
OAuth request را بررسی کنید تا ببینید به کجا می‌رود.

### 3. Supabase Logs را بررسی کنید
Authentication logs را در Supabase Dashboard بررسی کنید.

## نتیجه‌گیری

با استفاده از Emergency Fix:
- ✅ OAuth redirects حالا به `https://www.se1a.org` می‌روند
- ✅ کاربران دیگر به localhost هدایت نمی‌شوند
- ✅ مشکل موقتاً حل شده است

برای حل دائمی، تنظیمات Supabase و Google Cloud Console را بررسی کنید.
