# راهنمای تنظیم OAuth در Production

## 🚨 مشکل: OAuth در Production کار نمی‌کند

وقتی پروژه از localhost به domain اصلی منتقل می‌شود، OAuth Google ممکن است کار نکند و کاربر را به `localhost:3000` هدایت کند.

## 🔧 راه‌حل‌های ضروری

### 1. تنظیم Google Cloud Console

#### الف) Authorized JavaScript origins:
```
http://localhost:3000
https://your-domain.com
https://www.your-domain.com
```

#### ب) Authorized redirect URIs:
```
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
https://www.your-domain.com/auth/callback
```

### 2. تنظیم Supabase Dashboard

#### الف) Authentication > URL Configuration:
- Site URL: `https://your-domain.com`
- Redirect URLs: `https://your-domain.com/auth/callback`

#### ب) Authentication > Providers > Google:
- Enable: ✅ فعال
- Client ID: Google Client ID شما
- Client Secret: Google Client Secret شما
- Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 3. Environment Variables در Production

#### در Vercel یا hosting platform:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Google OAuth (اختیاری)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4. بررسی فایل‌های کد

#### الف) next.config.js:
```javascript
images: { 
  domains: [
    'localhost', 
    'your-domain.com', // اضافه کنید
    'images.unsplash.com', 
    'via.placeholder.com'
  ],
}
```

#### ب) middleware.ts:
```typescript
// اطمینان حاصل کنید که auth routes از middleware رد شوند
if (
  pathname.startsWith('/_next/') ||
  pathname.startsWith('/api/') ||
  pathname.startsWith('/auth/') || // این خط مهم است
  pathname.includes('.')
) {
  return NextResponse.next();
}
```

## 🧪 تست عملکرد

### 1. تست OAuth Flow:
```bash
# 1. به سایت production بروید
# 2. روی "ورود با گوگل" کلیک کنید
# 3. باید به Google منتقل شوید
# 4. پس از تایید، به سایت برگردید
```

### 2. بررسی Console:
```javascript
// در browser console
console.log('Current origin:', window.location.origin);
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

### 3. بررسی Network Tab:
- OAuth request ها را بررسی کنید
- Redirect ها را دنبال کنید
- Error ها را چک کنید

## 🚨 مشکلات رایج و راه‌حل‌ها

### مشکل 1: "localhost is currently unreachable"
**علت**: Redirect URI در Google Console درست تنظیم نشده
**راه‌حل**: Domain اصلی را به Authorized redirect URIs اضافه کنید

### مشکل 2: "redirect_uri_mismatch"
**علت**: Redirect URI در Google Console با Supabase مطابقت ندارد
**راه‌حل**: هر دو را یکسان تنظیم کنید

### مشکل 3: "invalid_client"
**علت**: Client ID یا Secret در Supabase درست وارد نشده
**راه‌حل**: دوباره چک کنید و save کنید

### مشکل 4: OAuth کار می‌کند اما کاربر به localhost برمی‌گردد
**علت**: Site URL در Supabase درست تنظیم نشده
**راه‌حل**: Site URL را به domain اصلی تغییر دهید

## 📋 چک‌لیست نهایی

- [ ] Google Console: Authorized origins اضافه شده
- [ ] Google Console: Authorized redirect URIs اضافه شده
- [ ] Supabase: Site URL تنظیم شده
- [ ] Supabase: Redirect URLs تنظیم شده
- [ ] Supabase: Google Provider فعال شده
- [ ] Environment Variables در production تنظیم شده
- [ ] next.config.js: domains درست تنظیم شده
- [ ] middleware.ts: auth routes از middleware رد می‌شوند
- [ ] OAuth flow در production تست شده

## 🔍 دیباگ بیشتر

### 1. بررسی Supabase Logs:
- Supabase Dashboard > Logs
- Authentication events را بررسی کنید

### 2. بررسی Google Cloud Console:
- APIs & Services > OAuth consent screen
- APIs & Services > Credentials > OAuth 2.0 Client IDs

### 3. بررسی Browser:
- Console errors
- Network tab
- Application > Local Storage

## 📞 پشتیبانی

اگر مشکل حل نشد:
1. تمام چک‌لیست بالا را بررسی کنید
2. Console errors را کپی کنید
3. Network tab screenshots بگیرید
4. با تیم پشتیبانی تماس بگیرید

---

**نکته مهم**: پس از هر تغییر در تنظیمات OAuth، 5-10 دقیقه صبر کنید تا تغییرات اعمال شود.
