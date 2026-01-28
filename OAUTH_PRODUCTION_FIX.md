# راهنمای رفع مشکل OAuth در Production (se1a.org)

## مشکل
OAuth Google در localhost کار می‌کند اما در production (se1a.org) کار نمی‌کند.

## راه‌حل‌های ضروری

### 1. بررسی تنظیمات Supabase Dashboard

#### الف) Authentication > URL Configuration
1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. **Authentication** > **URL Configuration**

**Site URL:**
```
https://www.se1a.org
```

**Redirect URLs (همه را اضافه کنید):**
```
http://localhost:3000/auth/callback
https://www.se1a.org/auth/callback
https://se1a.org/auth/callback
http://localhost:3000/admin/auth/callback
https://www.se1a.org/admin/auth/callback
```

#### ب) Authentication > Providers > Google
1. **Enable** را فعال کنید
2. **Client ID** و **Client Secret** را از Google Cloud Console وارد کنید
3. مطمئن شوید که **Redirect URL** به درستی تنظیم شده است:
```
https://your-project.supabase.co/auth/v1/callback
```

### 2. بررسی تنظیمات Google Cloud Console

#### الف) Authorized JavaScript origins:
```
http://localhost:3000
https://www.se1a.org
https://se1a.org
```

#### ب) Authorized redirect URIs:
```
https://your-project.supabase.co/auth/v1/callback
```

**نکته مهم:** در Google Cloud Console فقط باید Supabase callback URL را اضافه کنید، نه URL های خود سایت.

### 3. بررسی Environment Variables در Vercel

1. به [Vercel Dashboard](https://vercel.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. **Settings** > **Environment Variables**
4. مطمئن شوید که این متغیرها تنظیم شده‌اند:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL - مهم برای OAuth!
NEXT_PUBLIC_SITE_URL=https://www.se1a.org

# Node Environment
NODE_ENV=production
```

**نکته:** بعد از تغییر environment variables، باید پروژه را **Redeploy** کنید.

### 4. تست و Debug

#### الف) بررسی Console در Production
1. به `https://www.se1a.org/login` بروید
2. Console مرورگر (F12) را باز کنید
3. روی دکمه "ورود با گوگل" کلیک کنید
4. پیام‌های console را بررسی کنید:

```
🤖 Smart OAuth URL Detection Started
🌍 Browser environment detected: { protocol: 'https:', hostname: 'www.se1a.org', port: '' }
🌐 Production domain detected - using current origin: https://www.se1a.org/auth/callback
```

#### ب) بررسی Network Tab
1. Network tab را در Console باز کنید
2. روی دکمه "ورود با گوگل" کلیک کنید
3. بررسی کنید که redirect URL درست است:
   - باید به `https://accounts.google.com/...` برود
   - بعد از تایید، باید به `https://your-project.supabase.co/auth/v1/callback` برود
   - سپس به `https://www.se1a.org/auth/callback` redirect شود

### 5. مشکلات رایج و راه‌حل

#### مشکل 1: Redirect به localhost
**علت:** `NEXT_PUBLIC_SITE_URL` در Vercel تنظیم نشده است.
**راه‌حل:** Environment variable را اضافه کنید و Redeploy کنید.

#### مشکل 2: OAuth error: redirect_uri_mismatch
**علت:** Redirect URL در Google Cloud Console اشتباه است.
**راه‌حل:** فقط Supabase callback URL را اضافه کنید: `https://your-project.supabase.co/auth/v1/callback`

#### مشکل 3: Session پیدا نمی‌شود
**علت:** Cookie domain یا SameSite settings اشتباه است.
**راه‌حل:** در Supabase Dashboard > Authentication > Settings، Cookie settings را بررسی کنید.

### 6. بررسی نهایی

بعد از انجام همه تنظیمات:

1. ✅ Supabase Redirect URLs شامل `https://www.se1a.org/auth/callback` است
2. ✅ Google Cloud Console فقط Supabase callback URL دارد
3. ✅ `NEXT_PUBLIC_SITE_URL=https://www.se1a.org` در Vercel تنظیم شده است
4. ✅ پروژه در Vercel Redeploy شده است
5. ✅ Console مرورگر نشان می‌دهد که URL درست تشخیص داده می‌شود

### 7. تست نهایی

1. به `https://www.se1a.org/login` بروید
2. روی "ورود با گوگل" کلیک کنید
3. با Google وارد شوید
4. باید به `https://www.se1a.org/auth/complete` redirect شوید
5. سپس به داشبورد یا `/complete-profile` هدایت شوید

## نکات مهم

- **هرگز** URL های مستقیم سایت را در Google Cloud Console اضافه نکنید
- فقط Supabase callback URL را در Google Cloud Console اضافه کنید
- بعد از تغییر environment variables، حتماً Redeploy کنید
- Console مرورگر را بررسی کنید تا مطمئن شوید URL درست تشخیص داده می‌شود

