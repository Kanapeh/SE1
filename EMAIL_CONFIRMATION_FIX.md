# راهنمای رفع خطای "Error sending confirmation email"

## مشکل
هنگام ثبت‌نام، خطای "Error sending confirmation email" نمایش داده می‌شود.

## راه‌حل‌های پیاده‌سازی شده

### 1. مدیریت خطا در کد
کد به‌روزرسانی شده است تا:
- اگر کاربر ساخته شد اما ایمیل ارسال نشد، کاربر می‌تواند ادامه دهد
- اگر کاربر ساخته نشد، از Admin API استفاده می‌شود
- کاربر به صفحه login هدایت می‌شود
- پیام مناسب نمایش داده می‌شود

### 2. API جدید: `/api/auth/register-without-email`
این API از Admin API استفاده می‌کند تا کاربر را بدون نیاز به تایید ایمیل ایجاد کند.

**نکته مهم:** برای استفاده از این API، باید `SUPABASE_SERVICE_ROLE_KEY` را در `.env.local` اضافه کنید:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## راه‌حل نهایی (توصیه می‌شود)

### غیرفعال کردن Email Confirmation در Supabase

در Supabase Dashboard:
1. به **Authentication** > **Settings** بروید
2. بخش **Email Auth** را پیدا کنید
3. **Enable email confirmations** را **غیرفعال** کنید
4. تغییرات را ذخیره کنید

این ساده‌ترین راه‌حل است و مشکل را کاملاً حل می‌کند.

## تست

1. یک کاربر جدید ثبت‌نام کنید
2. اگر خطای "Error sending confirmation email" نمایش داده شد:
   - کاربر باید به صفحه login هدایت شود
   - کاربر می‌تواند با همان ایمیل و رمز عبور وارد شود
   - یا از Google OAuth استفاده کند

## نکات مهم

- در محیط Development، توصیه می‌شود Email Confirmation را غیرفعال کنید
- در محیط Production، باید SMTP را تنظیم کنید
- کاربران می‌توانند از Google OAuth استفاده کنند که نیازی به تایید ایمیل ندارد

