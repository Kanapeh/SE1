# راه‌اندازی سیستم فراموشی رمز عبور

## خلاصه

این سیستم به کاربران امکان بازیابی رمز عبور فراموش شده را می‌دهد. کاربران می‌توانند با وارد کردن ایمیل خود، لینک بازیابی دریافت کنند.

## صفحات ایجاد شده

### 1. صفحه فراموشی رمز عبور (`/forgot-password`)
- کاربر ایمیل خود را وارد می‌کند
- لینک بازیابی به ایمیل ارسال می‌شود
- پیام موفقیت نمایش داده می‌شود

### 2. صفحه تنظیم رمز عبور جدید (`/reset-password`)
- کاربر پس از کلیک روی لینک ایمیل به این صفحه هدایت می‌شود
- رمز عبور جدید را وارد می‌کند
- رمز عبور به‌روزرسانی می‌شود

## نحوه کارکرد

### مرحله 1: درخواست بازیابی
1. کاربر به `/forgot-password` می‌رود
2. ایمیل خود را وارد می‌کند
3. سیستم لینک بازیابی را به ایمیل ارسال می‌کند

### مرحله 2: دریافت ایمیل
1. کاربر ایمیل بازیابی را دریافت می‌کند
2. روی لینک کلیک می‌کند
3. به `/reset-password` هدایت می‌شود

### مرحله 3: تنظیم رمز عبور جدید
1. کاربر رمز عبور جدید را وارد می‌کند
2. رمز عبور تایید می‌شود
3. رمز عبور به‌روزرسانی می‌شود

## تنظیمات Supabase

### 1. فعال کردن Email Templates
در Supabase Dashboard:
1. به بخش **Authentication** بروید
2. به **Email Templates** بروید
3. **Password Reset** را فعال کنید
4. **Enable Email Confirmations** را فعال کنید

### 2. تنظیم URL Redirect
در Supabase Dashboard:
1. به بخش **Authentication** بروید
2. به **URL Configuration** بروید
3. **Site URL** را تنظیم کنید
4. **Redirect URLs** را اضافه کنید:
   ```
   https://yourdomain.com/reset-password
   http://localhost:3000/reset-password
   ```

### 3. تنظیم SMTP (اختیاری)
اگر می‌خواهید از SMTP خود استفاده کنید:
1. به بخش **Authentication** بروید
2. به **Email Templates** بروید
3. **SMTP Settings** را تنظیم کنید:
   ```
   Host: smtp.gmail.com (یا سرور SMTP شما)
   Port: 587
   Username: your-email@gmail.com
   Password: your-app-password
   ```

### 4. بررسی Email Provider
در Supabase Dashboard:
1. به بخش **Authentication** بروید
2. به **Providers** بروید
3. **Email** را فعال کنید

## فایل‌های ایجاد شده

```
app/
├── forgot-password/
│   └── page.tsx          # صفحه فراموشی رمز عبور
└── reset-password/
    └── page.tsx          # صفحه تنظیم رمز عبور جدید

database/
└── check_supabase_email_setup.sql  # بررسی تنظیمات ایمیل
```

## ویژگی‌های امنیتی

### 1. اعتبارسنجی رمز عبور
- حداقل 6 کاراکتر
- تایید رمز عبور
- بررسی یکسان بودن رمز عبور و تکرار آن

### 2. مدیریت خطا
- نمایش خطاهای واضح
- مدیریت خطاهای شبکه
- بررسی اعتبار لینک بازیابی

### 3. تجربه کاربری
- نمایش وضعیت loading
- پیام‌های موفقیت
- امکان درخواست مجدد

## تست سیستم

### تست 1: درخواست بازیابی
1. به `/forgot-password` بروید
2. ایمیل معتبر وارد کنید
3. روی "ارسال لینک بازیابی" کلیک کنید
4. پیام موفقیت باید نمایش داده شود

### تست 2: دریافت ایمیل
1. ایمیل خود را بررسی کنید
2. لینک بازیابی را پیدا کنید
3. روی لینک کلیک کنید

### تست 3: تنظیم رمز عبور جدید
1. رمز عبور جدید وارد کنید
2. تکرار رمز عبور را وارد کنید
3. روی "تغییر رمز عبور" کلیک کنید
4. پیام موفقیت باید نمایش داده شود

### تست 4: ورود با رمز عبور جدید
1. به `/login` بروید
2. با رمز عبور جدید وارد شوید
3. باید موفقیت‌آمیز باشد

## عیب‌یابی

### مشکل: AuthApiError - Error sending recovery email

**علت:** تنظیمات Supabase برای ارسال ایمیل درست نیست.

**راه‌حل:**

#### مرحله 1: بررسی تنظیمات Supabase Dashboard
1. به **Supabase Dashboard** بروید
2. پروژه خود را انتخاب کنید
3. به بخش **Authentication** بروید
4. به **Settings** بروید
5. موارد زیر را بررسی کنید:
   - **Site URL** تنظیم شده باشد
   - **Redirect URLs** شامل `/reset-password` باشد

#### مرحله 2: فعال کردن Email Templates
1. به بخش **Authentication** بروید
2. به **Email Templates** بروید
3. **Password Reset** را فعال کنید
4. **Enable Email Confirmations** را فعال کنید

#### مرحله 3: بررسی Email Provider
1. به بخش **Authentication** بروید
2. به **Providers** بروید
3. **Email** را فعال کنید

#### مرحله 4: تنظیم SMTP (اختیاری)
اگر می‌خواهید از SMTP خود استفاده کنید:
1. به بخش **Authentication** بروید
2. به **Email Templates** بروید
3. **SMTP Settings** را تنظیم کنید:
   ```
   Host: smtp.gmail.com (یا سرور SMTP شما)
   Port: 587
   Username: your-email@gmail.com
   Password: your-app-password
   ```

#### مرحله 5: بررسی Environment Variables
فایل `.env.local` را بررسی کنید:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### مرحله 6: اجرای اسکریپت بررسی
فایل `database/check_supabase_email_setup.sql` را در Supabase SQL Editor اجرا کنید.

### مشکل: ایمیل ارسال نمی‌شود
**راه‌حل:**
1. بررسی تنظیمات SMTP در Supabase
2. بررسی Email Templates
3. بررسی Site URL و Redirect URLs
4. بررسی Email Provider

### مشکل: لینک بازیابی کار نمی‌کند
**راه‌حل:**
1. بررسی Redirect URLs در Supabase
2. بررسی اعتبار لینک
3. بررسی تنظیمات DNS

### مشکل: خطای 404 در صفحه reset-password
**راه‌حل:**
1. بررسی وجود فایل `app/reset-password/page.tsx`
2. بررسی مسیر در کد
3. بررسی تنظیمات Next.js

### مشکل: رمز عبور تغییر نمی‌کند
**راه‌حل:**
1. بررسی اعتبارسنجی رمز عبور
2. بررسی اتصال به Supabase
3. بررسی لاگ‌های سرور

## خطاهای رایج و راه‌حل‌ها

### خطای "Email rate limit exceeded"
**راه‌حل:** چند دقیقه صبر کنید و دوباره امتحان کنید.

### خطای "User not found"
**راه‌حل:** ایمیل را بررسی کنید یا ابتدا ثبت‌نام کنید.

### خطای "Email not confirmed"
**راه‌حل:** ابتدا ایمیل خود را تایید کنید.

### خطای "Invalid email"
**راه‌حل:** ایمیل معتبر وارد کنید.

### خطای "Email provider not enabled"
**راه‌حل:** Email Provider را در Supabase فعال کنید.

## نکات مهم

1. **همیشه از HTTPS استفاده کنید**
2. **تنظیمات SMTP را بررسی کنید**
3. **Redirect URLs را درست تنظیم کنید**
4. **Email Templates را شخصی‌سازی کنید**
5. **لاگ‌ها را بررسی کنید**
6. **Environment Variables را درست تنظیم کنید**

## شخصی‌سازی

### تغییر متن‌ها
فایل‌های `page.tsx` را ویرایش کنید تا متن‌ها را تغییر دهید.

### تغییر استایل
کلاس‌های Tailwind CSS را تغییر دهید تا ظاهر را شخصی‌سازی کنید.

### تغییر منطق
توابع `handleSubmit` را ویرایش کنید تا منطق را تغییر دهید.

## پشتیبانی

برای سوالات و مشکلات:
- مستندات Supabase: https://supabase.com/docs/guides/auth
- مستندات Next.js: https://nextjs.org/docs
- لاگ‌های سرور را بررسی کنید
- فایل `database/check_supabase_email_setup.sql` را اجرا کنید