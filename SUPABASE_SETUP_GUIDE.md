# راهنمای کامل تنظیم Supabase و حل مشکل ثبت‌نام

## مشکل اصلی:
خطا در `supabase.auth.signUp` - احتمالاً Environment Variables تنظیم نشده‌اند

## مراحل حل مشکل:

### مرحله 1: بررسی Environment Variables

#### 1.1 ایجاد فایل .env.local
در ریشه پروژه، فایل `.env.local` ایجاد کنید:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 1.2 پیدا کردن مقادیر Supabase
1. **Supabase Dashboard** بروید
2. **پروژه خود** را انتخاب کنید
3. **Settings** > **API**
4. **Project URL** و **anon public key** را کپی کنید

### مرحله 2: تست تنظیمات

#### 2.1 صفحه تست را باز کنید
```
http://localhost:3000/test-supabase
```

#### 2.2 بررسی وضعیت Environment Variables
- ✅ NEXT_PUBLIC_SUPABASE_URL: تنظیم شده
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: تنظیم شده

#### 2.3 تست اتصال Supabase
- دکمه **"تست اتصال Supabase"** را کلیک کنید
- نتایج را بررسی کنید

#### 2.4 تست ثبت‌نام
- دکمه **"تست ثبت‌نام"** را کلیک کنید
- نتایج را بررسی کنید

### مرحله 3: تنظیمات Supabase Dashboard

#### 3.1 Authentication > Settings
```
Site URL: https://www.se1a.org
```

#### 3.2 Authentication > Settings > Redirect URLs
```
https://www.se1a.org/auth/callback
https://www.se1a.org/verify-email
https://www.se1a.org/reset-password
```

#### 3.3 Authentication > Providers
- ✅ **Email** را فعال کنید
- ✅ **Confirm email** را فعال کنید

#### 3.4 Authentication > Email Templates
- ✅ **Email Confirmations** را فعال کنید
- ✅ **Password Reset** را فعال کنید

### مرحله 4: Restart سرور

```bash
# سرور را متوقف کنید (Ctrl+C)
# سپس دوباره شروع کنید
npm run dev
# یا
yarn dev
```

## عیب‌یابی:

### مشکل 1: Environment Variables تنظیم نشده
**علائم:**
- خطای "Cannot read properties of undefined"
- صفحه تست نشان می‌دهد "❌ تنظیم نشده"

**راه‌حل:**
1. فایل `.env.local` ایجاد کنید
2. مقادیر Supabase را اضافه کنید
3. سرور را restart کنید

### مشکل 2: اتصال Supabase کار نمی‌کند
**علائم:**
- خطای "Failed to fetch"
- خطای "Network error"

**راه‌حل:**
1. URL و Key را بررسی کنید
2. Supabase Dashboard را چک کنید
3. اینترنت را بررسی کنید

### مشکل 3: ثبت‌نام کار نمی‌کند
**علائم:**
- خطای "Email rate limit exceeded"
- خطای "Email provider not enabled"

**راه‌حل:**
1. Email Provider را فعال کنید
2. Site URL را تنظیم کنید
3. 60 دقیقه صبر کنید (Rate Limit)

## تست‌های اضافی:

### تست 1: بررسی Console
```javascript
// در کنسول مرورگر (F12)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
```

### تست 2: بررسی Network Tab
1. **Developer Tools** > **Network**
2. **ثبت‌نام کنید**
3. **درخواست‌های Supabase** را بررسی کنید
4. **خطاهای HTTP** را بررسی کنید

### تست 3: بررسی Supabase Logs
1. **Supabase Dashboard** > **Logs**
2. **Authentication** را انتخاب کنید
3. **خطاهای اخیر** را بررسی کنید

## تنظیمات پیشرفته:

### تنظیمات SMTP شخصی
اگر Rate Limit مشکل ایجاد می‌کند:

1. **Authentication** > **Email Templates** > **SMTP Settings**
2. **Enable Custom SMTP** را فعال کنید
3. تنظیمات Gmail:
   ```
   Host: smtp.gmail.com
   Port: 587
   Security: TLS
   Username: your-email@gmail.com
   Password: your-app-password
   ```

### تنظیمات Rate Limiting
1. **Authentication** > **Settings** > **Rate Limiting**
2. **Email rate limits** را بررسی کنید
3. در صورت نیاز تنظیمات را تغییر دهید

## فایل‌های مهم:

### 1. فایل تست
```
app/test-supabase/page.tsx
```
- برای تست تنظیمات Supabase
- بررسی Environment Variables
- تست اتصال و ثبت‌نام

### 2. فایل Environment
```
.env.local
```
- تنظیمات Supabase
- URL و Key

### 3. فایل‌های SQL
```
database/check_environment_setup.sql
database/fix_email_rate_limit.sql
```
- بررسی تنظیمات پایگاه داده
- راهنمای عیب‌یابی

## نکات مهم:

### ✅ کارهایی که باید انجام دهید:
- **Environment Variables** را تنظیم کنید
- **سرور را restart** کنید
- **صفحه تست** را بررسی کنید
- **تنظیمات Supabase** را چک کنید

### ❌ کارهایی که نباید انجام دهید:
- **Service Role Key** را در client-side استفاده کنید
- **Environment Variables** را در git commit کنید
- **تنظیمات را نادیده** بگیرید

## راهنمای نهایی:

### اگر مشکل حل نشد:
1. **صفحه تست** را باز کنید (`/test-supabase`)
2. **نتایج تست** را بررسی کنید
3. **Console logs** را کپی کنید
4. **Network errors** را بررسی کنید
5. **Supabase Dashboard** را چک کنید

### تماس با پشتیبانی:
اگر مشکل همچنان ادامه دارد:
1. **لاگ‌های کامل** را آماده کنید
2. **نتایج تست** را کپی کنید
3. **تنظیمات Supabase** را بررسی کنید
4. **با تیم پشتیبانی** تماس بگیرید

## خلاصه:

مشکل اصلی احتمالاً **Environment Variables تنظیم نشده** است. با دنبال کردن مراحل بالا، مشکل حل خواهد شد. مهم‌ترین نکته **تست کردن** تنظیمات با صفحه `/test-supabase` است.