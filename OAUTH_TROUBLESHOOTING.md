# راهنمای عیب‌یابی OAuth گوگل

## مشکل: پس از ورود با گوگل، کاربر به صفحه لاگین برمی‌گردد

### مراحل عیب‌یابی:

#### 1. بررسی تنظیمات Supabase
- به [Supabase Dashboard](https://supabase.com/dashboard) بروید
- پروژه خود را انتخاب کنید
- به بخش **Authentication** بروید
- روی **Providers** کلیک کنید
- **Google** را پیدا کرده و مطمئن شوید که فعال است

#### 2. بررسی تنظیمات Google OAuth
در Supabase Dashboard:
```
Authentication > Providers > Google
```
مطمئن شوید که:
- ✅ **Enable** فعال است
- ✅ **Client ID** وارد شده
- ✅ **Client Secret** وارد شده
- ✅ **Redirect URL** درست است

#### 3. بررسی Redirect URL در Google Cloud Console
در [Google Cloud Console](https://console.cloud.google.com/):
```
APIs & Services > Credentials > OAuth 2.0 Client IDs
```
مطمئن شوید که **Authorized redirect URIs** شامل:
```
https://your-project-id.supabase.co/auth/v1/callback
```

#### 4. تست با صفحه دیباگ
به آدرس `/test-oauth` بروید و:
- دکمه "تست ورود با گوگل" را بزنید
- Console مرورگر را چک کنید
- خطاها را بررسی کنید

#### 5. بررسی متغیرهای محیطی
مطمئن شوید که در `.env.local` دارید:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 6. بررسی Console مرورگر
خطاهای احتمالی:
- `Unsupported provider`: Google OAuth در Supabase فعال نیست
- `Invalid redirect_uri`: Redirect URL در Google Cloud Console اشتباه است
- `Network error`: مشکل در اتصال به Supabase

### راه‌حل‌های رایج:

#### مشکل 1: Google OAuth غیرفعال
**راه‌حل:**
1. در Supabase Dashboard، Authentication > Providers > Google
2. Enable را فعال کنید
3. Client ID و Secret را از Google Cloud Console وارد کنید

#### مشکل 2: Redirect URL اشتباه
**راه‌حل:**
1. در Google Cloud Console، OAuth 2.0 Client ID را باز کنید
2. Authorized redirect URIs را اضافه کنید:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```

#### مشکل 3: مشکل در Callback Route
**راه‌حل:**
1. فایل `app/auth/callback/route.ts` را بررسی کنید
2. Console سرور را چک کنید
3. مطمئن شوید که route درست کار می‌کند

#### مشکل 4: مشکل در Middleware
**راه‌حل:**
1. فایل `middleware.ts` را بررسی کنید
2. مطمئن شوید که مسیر `/auth/callback` از middleware مستثنی است

### تست نهایی:

1. **تست OAuth:**
   - به `/test-oauth` بروید
   - دکمه "تست ورود با گوگل" را بزنید
   - اگر به گوگل منتقل شد، مشکل در callback است
   - اگر خطا داد، مشکل در تنظیمات است

2. **تست Callback:**
   - پس از ورود با گوگل، به `/auth/callback` بروید
   - Console سرور را چک کنید
   - خطاها را بررسی کنید

3. **تست Session:**
   - پس از ورود موفق، session را چک کنید
   - مطمئن شوید که کاربر در Supabase ثبت شده

### نکات مهم:

- **هرگز** service role key را در client-side استفاده نکنید
- **همیشه** از anon key برای client-side استفاده کنید
- پس از تغییر تنظیمات، سرور را restart کنید
- Console مرورگر و سرور را همیشه چک کنید
- از صفحه `/test-oauth` برای دیباگ استفاده کنید

### تماس با پشتیبانی:

اگر مشکل حل نشد:
1. تمام خطاها را کپی کنید
2. Screenshot از تنظیمات Supabase بگیرید
3. Screenshot از تنظیمات Google Cloud Console بگیرید
4. فایل `.env.local` را بررسی کنید (بدون نمایش کلیدها)
5. مشکل را با جزئیات کامل توضیح دهید
