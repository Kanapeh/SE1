# راهنمای کامل رفع مشکل OAuth Redirect

## مشکل فعلی
بعد از ثبت‌نام با Google OAuth، کاربران به localhost هدایت می‌شوند که فعال نیست.

## علل احتمالی

### 1. متغیر محیطی تنظیم نشده
متغیر `NEXT_PUBLIC_SITE_URL` در production تنظیم نشده است.

### 2. تنظیمات Supabase OAuth
Redirect URL در Supabase Dashboard هنوز به localhost اشاره می‌کند.

### 3. تنظیمات Google OAuth
Redirect URI در Google Cloud Console اشتباه است.

## راه‌حل‌های پیاده‌سازی شده

### ✅ 1. اضافه کردن متغیر محیطی
در `vercel.json` اضافه شده:
```json
"NEXT_PUBLIC_SITE_URL": "https://www.se1a.org"
```

### ✅ 2. ایجاد توابع کمکی OAuth
فایل `lib/oauth-utils.ts` ایجاد شده که:
- به صورت dynamic URL صحیح را تشخیص می‌دهد
- بر اساس محیط (localhost vs production) URL مناسب را برمی‌گرداند
- توابع مختلف برای انواع مختلف OAuth redirect دارد

### ✅ 3. به‌روزرسانی صفحات OAuth
تمام صفحات OAuth به‌روزرسانی شده‌اند تا از توابع جدید استفاده کنند.

## مراحل تست و رفع مشکل

### مرحله 1: تست OAuth URLs
1. به صفحه `/test-oauth-redirect` بروید
2. دکمه "تست OAuth URLs" را کلیک کنید
3. نتایج را بررسی کنید

### مرحله 2: بررسی Console
Console مرورگر را باز کنید و پیام‌های debug را بررسی کنید:
```
🔍 OAuth Configuration Debug:
Current location: https://www.se1a.org/test-oauth-redirect
Current origin: https://www.se1a.org
Current hostname: www.se1a.org
Current protocol: https:
Environment SITE_URL: https://www.se1a.org
OAuth redirect URL: https://www.se1a.org/auth/callback
```

### مرحله 3: بررسی Supabase Dashboard
1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. Authentication > URL Configuration
4. Site URL را بررسی کنید - باید `https://www.se1a.org` باشد
5. Redirect URLs را بررسی کنید - باید شامل `https://www.se1a.org/auth/callback` باشد

### مرحله 4: بررسی Google Cloud Console
1. به [Google Cloud Console](https://console.cloud.google.com/) بروید
2. APIs & Services > Credentials
3. OAuth 2.0 Client ID خود را انتخاب کنید
4. Authorized redirect URIs را بررسی کنید
5. باید شامل این URL باشد: `https://www.se1a.org/auth/callback`

## تنظیمات مورد نیاز

### 1. Supabase Dashboard
```
Site URL: https://www.se1a.org
Redirect URLs:
- https://www.se1a.org/auth/callback
- https://www.se1a.org/admin/auth/callback
```

### 2. Google Cloud Console
```
Authorized redirect URIs:
- https://www.se1a.org/auth/callback
- https://www.se1a.org/admin/auth/callback
```

### 3. Vercel Environment Variables
```
NEXT_PUBLIC_SITE_URL=https://www.se1a.org
```

## تست نهایی

### 1. تست ثبت‌نام
1. به صفحه ثبت‌نام بروید
2. با Google ثبت‌نام کنید
3. باید به `https://www.se1a.org/auth/callback` هدایت شوید
4. نه به `localhost:3000/auth/callback`

### 2. تست ورود
1. به صفحه ورود بروید
2. با Google وارد شوید
3. باید به `https://www.se1a.org/auth/callback` هدایت شوید

### 3. تست ادمین
1. به صفحه ورود ادمین بروید
2. با Google وارد شوید
3. باید به `https://www.se1a.org/admin/auth/callback` هدایت شوید

## عیب‌یابی

### اگر هنوز مشکل دارید:

#### 1. بررسی متغیرهای محیطی
```bash
# در Vercel Dashboard
NEXT_PUBLIC_SITE_URL=https://www.se1a.org
```

#### 2. بررسی Console مرورگر
خطاهای مربوط به OAuth را بررسی کنید.

#### 3. بررسی Network Tab
در Developer Tools، Network tab را بررسی کنید تا ببینید OAuth request به کجا می‌رود.

#### 4. تست در localhost
در localhost تست کنید تا ببینید آیا مشکل فقط در production است یا نه.

## کدهای مهم

### تابع getOAuthRedirectUrl
```typescript
export const getOAuthRedirectUrl = (path: string = '/auth/callback'): string => {
  // In production, use environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}${path}`;
  }
  
  // In browser, detect current location
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    
    // If we're on localhost, use localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}${port ? `:${port}` : ''}${path}`;
    }
    
    // If we're on production domain, use https
    if (hostname.includes('vercel.app') || hostname.includes('se1a')) {
      return `https://${hostname}${path}`;
    }
    
    // Fallback to current origin
    return `${window.location.origin}${path}`;
  }
  
  // Server-side fallback
  return `https://se1a.vercel.app${path}`;
};
```

### استفاده در صفحات
```typescript
import { getOAuthRedirectUrl } from '@/lib/oauth-utils';

const redirectUrl = getOAuthRedirectUrl();
// یا
const redirectUrl = getOAuthRedirectUrl('/admin/auth/callback');
```

## نتیجه‌گیری

با اعمال این تغییرات:
1. ✅ متغیر محیطی `NEXT_PUBLIC_SITE_URL` تنظیم شده
2. ✅ توابع کمکی OAuth ایجاد شده‌اند
3. ✅ تمام صفحات OAuth به‌روزرسانی شده‌اند
4. ✅ صفحه تست OAuth ایجاد شده است

حالا OAuth باید به درستی به دامنه اصلی redirect کند و کاربران دیگر به localhost هدایت نمی‌شوند.

## نکات مهم
- پس از اعمال تغییرات، Vercel را redeploy کنید
- Supabase Dashboard را بررسی کنید
- Google Cloud Console را بررسی کنید
- از صفحه تست OAuth استفاده کنید
