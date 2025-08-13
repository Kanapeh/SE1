# 🔧 راهنمای حل خطای PKCE: "code challenge does not match previously saved code verifier"

## 🚨 مشکل فعلی
خطای **"code challenge does not match previously saved code verifier"** در OAuth flow رخ می‌دهد.

## 🔍 علت مشکل
این خطا زمانی رخ می‌دهد که:
1. **Server-side code exchange**: کد احراز هویت در سمت سرور تبادل می‌شود
2. **Client-side code_verifier**: `code_verifier` در localStorage مرورگر ذخیره شده
3. **Mismatch**: بین سرور و کلاینت هماهنگی وجود ندارد

## ✅ راه‌حل پیاده‌سازی شده

### 1. **Callback Route اصلاح شده** (`app/auth/callback/route.ts`)
```typescript
// قبل: تبادل کد در سمت سرور
const { data, error } = await supabase.auth.exchangeCodeForSession(code);

// بعد: انتقال کد به کلاینت برای تبادل
const redirectUrl = `${requestUrl.origin}/auth/complete?code=${encodeURIComponent(code)}`;
return NextResponse.redirect(redirectUrl);
```

### 2. **Complete Page اصلاح شده** (`app/auth/complete/page.tsx`)
```typescript
// دریافت کد از URL
const code = searchParams.get('code');

// تبادل کد در سمت کلاینت
if (code) {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  // مدیریت جلسه
}
```

## 🧪 تست راه‌حل

### مرحله 1: پاک کردن کش مرورگر
```bash
# در مرورگر:
1. F12 را فشار دهید
2. Application tab را انتخاب کنید
3. Local Storage را انتخاب کنید
4. تمام موارد مربوط به Supabase را پاک کنید
5. Session Storage را نیز پاک کنید
```

### مرحله 2: تست ورود
1. به صفحه `/login` بروید
2. روی "ورود با گوگل" کلیک کنید
3. Console مرورگر را چک کنید
4. خطاها را بررسی کنید

### مرحله 3: بررسی Console
پیام‌های مورد انتظار:
```
🚀 Starting Google OAuth sign in with PKCE...
✅ Google OAuth initiated successfully with PKCE
🔄 PKCE flow detected - redirecting to client-side handler
🔄 Completing PKCE authentication...
🔄 Exchanging authorization code for session...
✅ Code exchange successful, session established
```

## 🔧 تنظیمات مورد نیاز

### 1. **Supabase Project**
- Google OAuth باید فعال باشد
- Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 2. **Google Cloud Console**
- Authorized redirect URIs شامل:
  ```
  https://vyjcwwrhiorbhfitpxdr.supabase.co/auth/v1/callback
  ```

### 3. **Environment Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=https://vyjcwwrhiorbhfitpxdr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🚀 مراحل تست

### تست 1: صفحه ساده OAuth
```
http://localhost:3000/test-simple-oauth
```

### تست 2: صفحه کامل OAuth
```
http://localhost:3000/test-oauth
```

### تست 3: صفحه اصلی ورود
```
http://localhost:3000/login
```

## 🔍 عیب‌یابی

### مشکل 1: Google OAuth غیرفعال
**راه‌حل:**
- در Supabase Dashboard، Google OAuth را فعال کنید
- Client ID و Secret را وارد کنید

### مشکل 2: Redirect URL اشتباه
**راه‌حل:**
- در Google Cloud Console، redirect URI را درست کنید
- باید دقیقاً با Supabase callback URL مطابقت داشته باشد

### مشکل 3: مشکل در PKCE Flow
**راه‌حل:**
- localStorage را پاک کنید
- مرورگر را refresh کنید
- دوباره تلاش کنید

### مشکل 4: خطای "Unsupported provider"
**راه‌حل:**
- Google OAuth در Supabase فعال نیست
- ابتدا آن را فعال کنید

## 📋 چک‌لیست نهایی

- [x] **Callback Route اصلاح شده**: کد در سمت سرور تبادل نمی‌شود
- [x] **Complete Page اصلاح شده**: کد در سمت کلاینت تبادل می‌شود
- [x] **PKCE Flow صحیح**: code_verifier در localStorage باقی می‌ماند
- [x] **Error Handling**: خطاها به درستی مدیریت می‌شوند
- [x] **User Experience**: پیام‌های مناسب نمایش داده می‌شوند

## 🎯 نتیجه مورد انتظار

پس از اعمال این تغییرات:
1. ✅ PKCE flow به درستی کار می‌کند
2. ✅ خطای "code challenge mismatch" برطرف می‌شود
3. ✅ ورود با گوگل موفقیت‌آمیز است
4. ✅ کاربر به صفحه مناسب هدایت می‌شود

## 🆘 در صورت ادامه مشکل

اگر مشکل همچنان ادامه داشت:
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
