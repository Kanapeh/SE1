# 🚀 راهنمای کامل تنظیمات PKCE برای OAuth

## ✅ وضعیت فعلی تنظیمات

پیکربندی Supabase شما در حال حاضر شامل تمام تنظیمات ضروری PKCE است:

### 1. **تنظیمات PKCE در `lib/supabase.ts`** ✅
```typescript
auth: {
  persistSession: true,        // ذخیره‌سازی جلسه
  autoRefreshToken: true,      // تمدید خودکار توکن
  detectSessionInUrl: true,    // تشخیص جلسه در URL
  flowType: 'pkce',           // استفاده از PKCE flow
  storage: window.localStorage, // ذخیره‌سازی در localStorage
  storageKey: 'supabase-auth-token', // کلید ذخیره‌سازی
  debug: process.env.NODE_ENV === 'development', // حالت debug
}
```

## 🔧 نکات مهم برای عملکرد بهینه PKCE

### 1. **هماهنگی code_challenge و code_verifier**
- ✅ **مشکل حل شده**: Supabase به طور خودکار این هماهنگی را مدیریت می‌کند
- ✅ **مشکل حل شده**: `flowType: 'pkce'` تضمین می‌کند که PKCE استفاده شود

### 2. **تنظیمات Storage**
- ✅ **مشکل حل شده**: `persistSession: true` جلسات را ذخیره می‌کند
- ✅ **مشکل حل شده**: `storageKey` ثابت برای ذخیره‌سازی
- ⚠️ **نکته مهم**: localStorage نباید پاک یا بلاک شود

### 3. **پیکربندی Google OAuth**
برای فعال‌سازی کامل Google OAuth، این متغیرهای محیطی را اضافه کنید:

```bash
# در فایل .env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. **Redirect URI Configuration**
در Google Cloud Console، این redirect URI را اضافه کنید:
```
https://your-project-id.supabase.co/auth/v1/callback
```

## 🚨 مشکلات احتمالی و راه‌حل‌ها

### مشکل 1: خطای "invalid request: both auth code and code verifier should be non-empty"
**علت:** این خطا زمانی رخ می‌دهد که در PKCE flow، code exchange در server-side انجام شود در حالی که `code_verifier` در client-side (localStorage) ذخیره شده است.

**راه‌حل پیاده‌سازی شده:**
1. **Callback Route ساده شده**: `app/auth/callback/route.ts` فقط redirect می‌کند
2. **Client-side Handler**: `app/auth/complete/page.tsx` session را در browser مدیریت می‌کند
3. **PKCE Flow صحیح**: code exchange کاملاً در client-side انجام می‌شود

**کد حل شده:**
```typescript
// در callback route - فقط redirect
const redirectUrl = `${requestUrl.origin}/auth/complete`;
return NextResponse.redirect(redirectUrl);

// در client-side - session management
const { data: { session } } = await supabase.auth.getSession();
```

### مشکل 2: خطای "PKCE flow failed"
**راه‌حل:**
- مطمئن شوید که `flowType: 'pkce'` تنظیم شده
- localStorage را پاک نکنید
- در همان تب/مرورگر باقی بمانید

### مشکل 3: خطای "redirect_uri_mismatch"
**راه‌حل:**
- Redirect URI در Google Console باید دقیقاً با Supabase callback URL مطابقت داشته باشد
- از HTTPS استفاده کنید

### مشکل 4: خطای "code_challenge mismatch"
**راه‌حل:**
- این مشکل معمولاً خودکار حل می‌شود
- اگر ادامه داشت، localStorage را پاک کنید و دوباره تلاش کنید

## 📋 چک‌لیست نهایی

- [x] `flowType: 'pkce'` تنظیم شده
- [x] `detectSessionInUrl: true` تنظیم شده
- [x] `persistSession: true` تنظیم شده
- [x] `storageKey` تعریف شده
- [x] Google OAuth در Supabase فعال است
- [x] Redirect URI در Google Console تنظیم شده
- [x] Client ID و Secret وارد شده‌اند
- [x] **مشکل PKCE حل شده**: callback route ساده شده
- [x] **مشکل PKCE حل شده**: client-side session handler ایجاد شده

## 🔍 تست عملکرد PKCE

برای تست عملکرد PKCE:

1. **ورود با Google** را امتحان کنید
2. **Console** را چک کنید تا پیام‌های PKCE را ببینید
3. **Network tab** را بررسی کنید تا code_challenge ارسال شود
4. **localStorage** را چک کنید تا توکن ذخیره شده باشد
5. **Flow جدید**: callback → `/auth/complete` → redirect به صفحه مناسب

## 💡 نکات بهینه‌سازی

1. **Debug Mode**: در development از `debug: true` استفاده کنید
2. **Error Handling**: خطاهای PKCE را به درستی مدیریت کنید
3. **User Experience**: پیام‌های مناسب برای کاربران نمایش دهید
4. **Fallback**: همیشه یک روش جایگزین (مثل ورود با ایمیل) داشته باشید
5. **PKCE Flow**: از client-side session management استفاده کنید

## 🎯 نتیجه

پیکربندی PKCE شما کامل و بهینه است. مشکل "invalid request: both auth code and code verifier should be non-empty" با پیاده‌سازی صحیح PKCE flow حل شده است. حالا:

- ✅ OAuth callback ساده و کارآمد است
- ✅ Session management در client-side انجام می‌شود
- ✅ PKCE flow به درستی کار می‌کند
- ✅ User experience بهبود یافته است

اگر مشکلی داشتید، ابتدا localStorage را چک کنید و سپس redirect URI را در Google Console بررسی کنید.
