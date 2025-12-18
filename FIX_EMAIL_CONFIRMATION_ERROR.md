# راهنمای رفع خطای "Error sending confirmation email"

## مشکل
هنگام ثبت‌نام، خطای "Error sending confirmation email" نمایش داده می‌شود.

## علت
این خطا معمولاً به این دلایل رخ می‌دهد:
1. SMTP در Supabase تنظیم نشده است
2. Email provider در Supabase غیرفعال است
3. Email confirmation در تنظیمات فعال است اما ارسال ایمیل کار نمی‌کند

## راه‌حل‌های پیاده‌سازی شده

### 1. مدیریت خطا در کد
کد به‌روزرسانی شده است تا:
- اگر کاربر ساخته شد اما ایمیل ارسال نشد، کاربر می‌تواند ادامه دهد
- کاربر به صفحه login هدایت می‌شود
- پیام مناسب نمایش داده می‌شود

### 2. راه‌حل‌های پیشنهادی

#### گزینه 1: غیرفعال کردن Email Confirmation (توصیه می‌شود برای Development)
در Supabase Dashboard:
1. به **Authentication** > **Settings** بروید
2. بخش **Email Auth** را پیدا کنید
3. **Enable email confirmations** را غیرفعال کنید
4. تغییرات را ذخیره کنید

#### گزینه 2: تنظیم SMTP (برای Production)
در Supabase Dashboard:
1. به **Authentication** > **Settings** بروید
2. بخش **SMTP Settings** را پیدا کنید
3. تنظیمات SMTP را وارد کنید:
   - **Host**: smtp.gmail.com (برای Gmail)
   - **Port**: 587
   - **Username**: ایمیل شما
   - **Password**: رمز عبور اپلیکیشن Gmail
   - **Sender Name**: نام سایت شما

#### گزینه 3: استفاده از Google OAuth
- کاربران می‌توانند از دکمه "ورود با گوگل" استفاده کنند
- این روش نیازی به تایید ایمیل ندارد

## تغییرات اعمال شده در کد

### فایل `app/register/page.tsx`:
- مدیریت خطای "Error sending confirmation email"
- اگر کاربر ساخته شد اما ایمیل ارسال نشد، کاربر به login هدایت می‌شود
- پیام مناسب نمایش داده می‌شود

### فایل `app/login/page.tsx`:
- مدیریت خطای "Email not confirmed"
- اگر کاربر تازه ثبت‌نام کرده باشد، تلاش برای ورود انجام می‌شود

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

