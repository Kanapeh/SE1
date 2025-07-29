# راهنمای عیب‌یابی ثبت‌نام

## مشکل: خطا در `supabase.auth.signUp`

### علت‌های احتمالی:

1. **Environment Variables تنظیم نشده**
2. **تنظیمات Supabase نادرست**
3. **Email Provider غیرفعال**
4. **Site URL تنظیم نشده**
5. **Redirect URLs نادرست**

## مراحل عیب‌یابی:

### مرحله 1: بررسی Environment Variables

فایل `.env.local` را بررسی کنید:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### مرحله 2: بررسی تنظیمات Supabase Dashboard

#### 2.1 Authentication > Settings
1. **Site URL** را تنظیم کنید:
   ```
   https://www.se1a.org
   ```

2. **Redirect URLs** را اضافه کنید:
   ```
   https://www.se1a.org/auth/callback
   https://www.se1a.org/verify-email
   https://www.se1a.org/reset-password
   ```

#### 2.2 Authentication > Providers
1. **Email** را فعال کنید
2. **Confirm email** را فعال کنید

#### 2.3 Authentication > Email Templates
1. **Email Confirmations** را فعال کنید
2. **Password Reset** را فعال کنید

### مرحله 3: اجرای اسکریپت بررسی

فایل `database/check_supabase_auth_setup.sql` را در Supabase SQL Editor اجرا کنید.

### مرحله 4: تست ثبت‌نام

1. **Console را باز کنید** (F12)
2. **به صفحه ثبت‌نام بروید**
3. **فرم را پر کنید**
4. **ثبت‌نام کنید**
5. **لاگ‌های کنسول را بررسی کنید**

## خطاهای رایج و راه‌حل‌ها:

### خطای "User already registered"
**راه‌حل:**
- کاربر قبلاً ثبت شده است
- از ایمیل دیگری استفاده کنید

### خطای "Invalid email"
**راه‌حل:**
- ایمیل معتبر وارد کنید
- فرمت ایمیل را بررسی کنید

### خطای "Password should be at least 6 characters"
**راه‌حل:**
- رمز عبور حداقل 6 کاراکتر باشد
- برای امنیت بیشتر، 8 کاراکتر توصیه می‌شود

### خطای "Email rate limit exceeded"
**راه‌حل:**
- چند دقیقه صبر کنید
- از IP دیگری استفاده کنید

### خطای "Email provider not enabled"
**راه‌حل:**
- Email Provider را در Supabase فعال کنید
- Authentication > Providers > Email

### خطای "Site URL not configured"
**راه‌حل:**
- Site URL را در Supabase تنظیم کنید
- Authentication > Settings > Site URL

## تست‌های اضافی:

### تست 1: بررسی اتصال Supabase
```javascript
// در کنسول مرورگر اجرا کنید
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
```

### تست 2: تست اتصال مستقیم
```javascript
// در کنسول مرورگر اجرا کنید
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

// تست اتصال
supabase.auth.getSession().then(console.log);
```

### تست 3: بررسی Network Tab
1. **Network tab** را در Developer Tools باز کنید
2. **ثبت‌نام کنید**
3. **درخواست‌های Supabase** را بررسی کنید
4. **خطاهای HTTP** را بررسی کنید

## تنظیمات پیشرفته:

### تنظیمات SMTP (اختیاری)
اگر می‌خواهید از SMTP خود استفاده کنید:

1. **Authentication > Email Templates > SMTP Settings**
2. **تنظیمات SMTP:**
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: your-email@gmail.com
   Password: your-app-password
   ```

### تنظیمات امنیتی
1. **Authentication > Settings > Security**
2. **JWT Expiry** را تنظیم کنید
3. **Refresh Token Rotation** را فعال کنید

## لاگ‌های مفید:

### لاگ‌های کنسول
```javascript
// این لاگ‌ها باید در کنسول نمایش داده شوند
console.log("Starting registration process...");
console.log("Email:", email);
console.log("User type:", userType);
console.log("Supabase config:", { url: "Set", anonKey: "Set" });
console.log("Input validation passed, attempting to sign up...");
console.log("Sign up response:", { authData, authError });
```

### لاگ‌های سرور
اگر از Vercel استفاده می‌کنید:
1. **Vercel Dashboard** بروید
2. **Functions** را بررسی کنید
3. **Logs** را بررسی کنید

## نکات مهم:

1. **همیشه Environment Variables را بررسی کنید**
2. **تنظیمات Supabase را درست انجام دهید**
3. **لاگ‌های کنسول را بررسی کنید**
4. **Network tab را بررسی کنید**
5. **از HTTPS استفاده کنید**

## پشتیبانی:

اگر مشکل حل نشد:
1. **لاگ‌های کنسول را کپی کنید**
2. **نتایج اسکریپت SQL را کپی کنید**
3. **تنظیمات Supabase را بررسی کنید**
4. **با تیم پشتیبانی تماس بگیرید**

## تست نهایی:

پس از انجام تنظیمات:
1. **صفحه ثبت‌نام را باز کنید**
2. **فرم را پر کنید**
3. **ثبت‌نام کنید**
4. **ایمیل تایید را بررسی کنید**
5. **حساب کاربری را تایید کنید**

اگر این مراحل را انجام دادید و همچنان مشکل داشتید، لاگ‌های دقیق را بررسی کنید.