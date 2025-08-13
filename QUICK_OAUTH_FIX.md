# راهنمای سریع حل مشکل OAuth

## مشکل: خطا در تبادل کد احراز هویت

### مرحله 1: تست اولیه
```
http://localhost:3000/test-simple-oauth
```

### مرحله 2: بررسی تنظیمات Supabase

#### در Supabase Dashboard:
1. **Authentication** > **Providers** > **Google**
2. مطمئن شوید که:
   - ✅ **Enable** فعال است
   - ✅ **Client ID** وارد شده
   - ✅ **Client Secret** وارد شده

#### در Google Cloud Console:
1. **APIs & Services** > **Credentials** > **OAuth 2.0 Client IDs**
2. **Authorized redirect URIs** را چک کنید:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```

### مرحله 3: بررسی متغیرهای محیطی

#### فایل `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### مرحله 4: تست OAuth

#### تست 1: صفحه ساده
```
http://localhost:3000/test-simple-oauth
```

#### تست 2: صفحه کامل
```
http://localhost:3000/test-oauth
```

### مرحله 5: بررسی Console

#### Console مرورگر:
- F12 را فشار دهید
- Console را انتخاب کنید
- خطاها را بررسی کنید

#### Console سرور:
- ترمینال را چک کنید
- خطاهای callback را بررسی کنید

### مشکلات احتمالی و راه‌حل‌ها:

#### مشکل 1: Google OAuth غیرفعال
**راه‌حل:**
- در Supabase، Google OAuth را فعال کنید

#### مشکل 2: Redirect URL اشتباه
**راه‌حل:**
- در Google Cloud Console، redirect URI را درست کنید

#### مشکل 3: مشکل در Callback Route
**راه‌حل:**
- فایل `app/auth/callback/route.ts` را بررسی کنید
- Console سرور را چک کنید

#### مشکل 4: مشکل در Middleware
**راه‌حل:**
- فایل `middleware.ts` را بررسی کنید
- مطمئن شوید که `/auth/callback` مستثنی است

### تست نهایی:

1. **تست OAuth:**
   - به `/test-simple-oauth` بروید
   - دکمه "تست ورود با گوگل" را بزنید

2. **بررسی Callback:**
   - پس از ورود با گوگل، callback را بررسی کنید
   - خطاها را در console ببینید

3. **بررسی Session:**
   - پس از ورود موفق، session را چک کنید

### نکات مهم:

- **هرگز** service role key را در client-side استفاده نکنید
- **همیشه** از anon key برای client-side استفاده کنید
- پس از تغییر تنظیمات، سرور را restart کنید
- Console مرورگر و سرور را همیشه چک کنید

### اگر مشکل حل نشد:

1. تمام خطاها را کپی کنید
2. Screenshot از تنظیمات Supabase بگیرید
3. Screenshot از تنظیمات Google Cloud Console بگیرید
4. فایل `.env.local` را بررسی کنید (بدون نمایش کلیدها)
5. مشکل را با جزئیات کامل توضیح دهید
