# راهنمای کامل Debug و رفع مشکل OAuth در Production

## مشکل
OAuth Google در localhost کار می‌کند اما در production (se1a.org) کار نمی‌کند.

## مراحل Debug

### مرحله 1: بررسی Console در Production

1. به `https://www.se1a.org/login` بروید
2. Console مرورگر (F12) را باز کنید
3. روی دکمه "ورود با گوگل" کلیک کنید
4. پیام‌های console را بررسی کنید:

**پیام‌های مورد انتظار:**
```
🔄 Starting Google OAuth with PKCE...
🤖 Smart OAuth URL Detection Started
🌍 Browser environment detected: { protocol: 'https:', hostname: 'www.se1a.org', port: '' }
🌐 Production domain detected - using current origin: https://www.se1a.org/auth/callback
✅ Google OAuth initiated successfully with PKCE
```

**اگر خطا دیدید، آن را یادداشت کنید.**

### مرحله 2: بررسی Network Tab

1. Network tab را در Console باز کنید
2. روی دکمه "ورود با گوگل" کلیک کنید
3. بررسی کنید:
   - آیا request به `accounts.google.com` ارسال می‌شود؟
   - آیا redirect به Supabase callback انجام می‌شود؟
   - آیا redirect به `https://www.se1a.org/auth/callback` انجام می‌شود؟

### مرحله 3: بررسی تنظیمات Supabase Dashboard

#### الف) Authentication > URL Configuration
1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. **Authentication** > **URL Configuration**

**Site URL باید باشد:**
```
https://www.se1a.org
```

**Redirect URLs باید شامل باشد:**
```
http://localhost:3000/auth/callback
https://www.se1a.org/auth/callback
https://se1a.org/auth/callback
```

**⚠️ مهم:** اگر این URL ها وجود ندارند، اضافه کنید و Save کنید.

#### ب) Authentication > Providers > Google
1. مطمئن شوید که **Enable** فعال است
2. **Client ID** و **Client Secret** را بررسی کنید
3. **Redirect URL** باید باشد:
```
https://your-project.supabase.co/auth/v1/callback
```

### مرحله 4: بررسی تنظیمات Google Cloud Console

1. به [Google Cloud Console](https://console.cloud.google.com) بروید
2. پروژه خود را انتخاب کنید
3. **APIs & Services** > **Credentials**
4. OAuth 2.0 Client ID خود را باز کنید

**Authorized JavaScript origins باید شامل باشد:**
```
http://localhost:3000
https://www.se1a.org
https://se1a.org
```

**Authorized redirect URIs باید فقط شامل باشد:**
```
https://your-project.supabase.co/auth/v1/callback
```

**⚠️ مهم:** در Google Cloud Console فقط باید Supabase callback URL را اضافه کنید، نه URL های مستقیم سایت.

### مرحله 5: بررسی Environment Variables در Vercel

1. به [Vercel Dashboard](https://vercel.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. **Settings** > **Environment Variables**
4. بررسی کنید که این متغیرها وجود دارند:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://www.se1a.org
```

**⚠️ مهم:** اگر `NEXT_PUBLIC_SITE_URL` وجود ندارد یا اشتباه است:
1. آن را اضافه/ویرایش کنید
2. **Redeploy** پروژه را انجام دهید

### مرحله 6: تست بعد از تغییرات

بعد از انجام تغییرات:

1. **Supabase Dashboard:** Save کنید
2. **Google Cloud Console:** Save کنید
3. **Vercel:** اگر environment variable تغییر دادید، Redeploy کنید
4. **Cache مرورگر را پاک کنید** (Ctrl+Shift+Delete)
5. دوباره تست کنید

## مشکلات رایج و راه‌حل

### مشکل 1: Redirect به localhost
**علت:** `NEXT_PUBLIC_SITE_URL` در Vercel تنظیم نشده است.
**راه‌حل:** Environment variable را اضافه کنید و Redeploy کنید.

### مشکل 2: OAuth error: redirect_uri_mismatch
**علت:** Redirect URL در Google Cloud Console اشتباه است.
**راه‌حل:** فقط Supabase callback URL را اضافه کنید.

### مشکل 3: Session پیدا نمی‌شود
**علت:** Cookie domain یا SameSite settings اشتباه است.
**راه‌حل:** در Supabase Dashboard > Authentication > Settings، Cookie settings را بررسی کنید.

### مشکل 4: Code exchange fails
**علت:** PKCE flow مشکل دارد.
**راه‌حل:** Cache مرورگر را پاک کنید و دوباره تست کنید.

## تست نهایی

1. به `https://www.se1a.org/login` بروید
2. Console را باز کنید
3. روی "ورود با گوگل" کلیک کنید
4. با Google وارد شوید
5. باید به `https://www.se1a.org/auth/complete` redirect شوید
6. سپس به داشبورد یا `/complete-profile` هدایت شوید

## اگر هنوز مشکل دارید

لطفاً این اطلاعات را ارسال کنید:

1. **Console logs** از مرورگر (تمام پیام‌ها)
2. **Network tab** screenshots
3. **Supabase Dashboard** screenshots (URL Configuration)
4. **Google Cloud Console** screenshots (OAuth credentials)
5. **Vercel Environment Variables** screenshots

