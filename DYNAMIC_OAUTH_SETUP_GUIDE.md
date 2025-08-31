# راهنمای تنظیم OAuth داینامیک برای Localhost و Production

## 🎯 هدف
تنظیم سیستمی که OAuth به صورت خودکار تشخیص دهد که روی localhost هستید یا production و بر اساس آن redirect کند.

## 🔧 تنظیمات مورد نیاز

### 1. Supabase Dashboard تنظیمات

#### الف) Authentication > URL Configuration
1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. **Authentication** > **URL Configuration**

**Site URL:**
```
https://www.se1a.org
```

**Redirect URLs (هر دو را اضافه کنید):**
```
http://localhost:3000/auth/callback
https://www.se1a.org/auth/callback
http://localhost:3000/admin/auth/callback
https://www.se1a.org/admin/auth/callback
```

#### ب) Authentication > Providers > Google
1. **Enable** را فعال کنید
2. **Client ID** و **Client Secret** را از Google Cloud Console وارد کنید
3. **Redirect URL** (خودکار تنظیم می‌شود):
```
https://your-project.supabase.co/auth/v1/callback
```

### 2. Vercel Environment Variables

#### الف) Production Environment
1. به [Vercel Dashboard](https://vercel.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. **Settings** > **Environment Variables**
4. این متغیرها را اضافه کنید:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL - مهم برای OAuth!
NEXT_PUBLIC_SITE_URL=https://www.se1a.org

# Node Environment (اختیاری)
NODE_ENV=production
```

#### ب) Development Environment (Local .env.local)
فایل `.env.local` در ریشه پروژه ایجاد کنید:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL - برای development خالی بگذارید یا localhost قرار دهید
# NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### 3. Google Cloud Console تنظیمات

#### الف) OAuth 2.0 Client ID
1. به [Google Cloud Console](https://console.cloud.google.com/) بروید
2. **APIs & Services** > **Credentials**
3. OAuth 2.0 Client ID خود را انتخاب کنید

**Authorized JavaScript origins:**
```
http://localhost:3000
https://www.se1a.org
```

**Authorized redirect URIs:**
```
https://your-project.supabase.co/auth/v1/callback
```

## 🚀 نحوه کارکرد

### Development (localhost):
```javascript
// خودکار تشخیص می‌دهد که روی localhost هستید
getSmartOAuthRedirectUrl() 
// Returns: "http://localhost:3000/auth/callback"
```

### Production (se1a.org):
```javascript
// از متغیر NEXT_PUBLIC_SITE_URL استفاده می‌کند
getSmartOAuthRedirectUrl() 
// Returns: "https://www.se1a.org/auth/callback"
```

## 🧪 تست تنظیمات

### مرحله 1: تست در Development
1. `npm run dev` را اجرا کنید
2. به `http://localhost:3000/test-oauth-redirect` بروید
3. دکمه "تست OAuth URLs" را کلیک کنید
4. باید ببینید: `http://localhost:3000/auth/callback`

### مرحله 2: تست OAuth در Development
1. به صفحه ورود بروید: `http://localhost:3000/login`
2. "ورود با گوگل" را کلیک کنید
3. باید به Google OAuth هدایت شوید
4. بعد از تایید، باید به `http://localhost:3000/auth/callback` برگردید

### مرحله 3: تست در Production
1. به `https://www.se1a.org/login` بروید
2. "ورود با گوگل" را کلیک کنید
3. باید به `https://www.se1a.org/auth/callback` برگردید

## 🔍 عیب‌یابی

### اگر هنوز به localhost ریدایرکت می‌شود:

#### بررسی 1: Console مرورگر
کنسول مرورگر را باز کنید (F12) و این کد را اجرا کنید:
```javascript
import { logOAuthConfig } from '/lib/oauth-utils';
logOAuthConfig();
```

#### بررسی 2: Environment Variables
```javascript
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
```

#### بررسی 3: Supabase Dashboard
- **Authentication** > **URL Configuration** را بررسی کنید
- مطمئن شوید که هر دو URL (localhost و production) در **Redirect URLs** هستند

#### بررسی 4: Cache پاک کنید
```bash
# در پروژه Next.js
rm -rf .next
npm run build
npm run start
```

## ⚠️ نکات مهم

### 1. متغیر NEXT_PUBLIC_SITE_URL
- **Production**: حتماً `https://www.se1a.org` قرار دهید
- **Development**: خالی بگذارید یا `http://localhost:3000`

### 2. Supabase Redirect URLs
- حتماً **هر دو** URL (localhost و production) را اضافه کنید
- فرمت: `http://localhost:3000/auth/callback` و `https://www.se1a.org/auth/callback`

### 3. Google OAuth
- **فقط** Supabase callback URL را اضافه کنید: `https://your-project.supabase.co/auth/v1/callback`
- JavaScript origins شامل هر دو domain باشد

## ✅ چک‌لیست نهایی

- [ ] Supabase Site URL: `https://www.se1a.org`
- [ ] Supabase Redirect URLs: شامل localhost و production
- [ ] Vercel `NEXT_PUBLIC_SITE_URL`: `https://www.se1a.org`
- [ ] Google OAuth JavaScript origins: شامل هر دو domain
- [ ] Google OAuth Redirect URI: فقط Supabase callback
- [ ] Local `.env.local`: تنظیم شده
- [ ] تست localhost: کار می‌کند
- [ ] تست production: کار می‌کند

پس از انجام این مراحل، OAuth شما کاملاً داینامیک خواهد بود! 🎉
