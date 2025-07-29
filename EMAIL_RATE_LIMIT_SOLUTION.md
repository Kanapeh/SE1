# راه‌حل کامل مشکل Email Rate Limit Exceeded

## مشکل چیست؟

خطای "Email rate limit exceeded" زمانی رخ می‌دهد که:
- بیش از 10 درخواست ایمیل در ساعت برای یک ایمیل ارسال شده
- Supabase محدودیت Rate Limiting دارد
- تنظیمات SMTP نادرست است

## راه‌حل‌های فوری:

### 1. صبر کنید (سریع‌ترین راه‌حل)
```
⏰ 60 دقیقه صبر کنید
📧 Supabase محدودیت 10 درخواست در ساعت دارد
🔄 پس از 60 دقیقه دوباره امتحان کنید
```

### 2. از ایمیل دیگری استفاده کنید
```
📧 از ایمیل‌های مختلف استفاده کنید
🔧 برای تست از سرویس‌های موقت استفاده کنید
📱 از ایمیل موبایل خود استفاده کنید
```

### 3. تنظیمات SMTP خود را اضافه کنید

#### مرحله 1: به Supabase Dashboard بروید
1. **Authentication** > **Email Templates**
2. **SMTP Settings** را کلیک کنید
3. **Enable Custom SMTP** را فعال کنید

#### مرحله 2: تنظیمات Gmail SMTP
```
Host: smtp.gmail.com
Port: 587
Security: TLS
Username: your-email@gmail.com
Password: your-app-password
```

#### مرحله 3: ایجاد App Password برای Gmail
1. **Google Account** > **Security**
2. **2-Step Verification** را فعال کنید
3. **App Passwords** > **Generate**
4. **Mail** و **Other (Custom name)** را انتخاب کنید
5. **16-character password** را کپی کنید

## راه‌حل‌های پیشرفته:

### 1. تنظیمات Rate Limiting در Supabase
```
📍 Authentication > Settings > Rate Limiting
🔧 Email rate limits را بررسی کنید
⚙️ در صورت نیاز تنظیمات را تغییر دهید
```

### 2. استفاده از SMTP شخصی
```javascript
// تنظیمات SMTP برای Gmail
{
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
}
```

### 3. تست ایمیل بدون Rate Limit
```sql
-- تایید دستی ایمیل (فقط برای تست)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-email@example.com';
```

## مراحل عیب‌یابی:

### مرحله 1: بررسی وضعیت فعلی
```sql
-- اجرا در Supabase SQL Editor
SELECT 
  email,
  created_at,
  email_confirmed_at,
  EXTRACT(EPOCH FROM (NOW() - created_at))/60 as minutes_ago
FROM auth.users 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### مرحله 2: بررسی تنظیمات SMTP
1. **Supabase Dashboard** > **Authentication**
2. **Email Templates** > **SMTP Settings**
3. **Test Connection** را کلیک کنید

### مرحله 3: بررسی Environment Variables
```env
# فایل .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## راه‌حل‌های جایگزین:

### 1. استفاده از سرویس‌های ایمیل موقت
```
📧 temp-mail.org
📧 10minutemail.com
📧 mailinator.com
```

### 2. تنظیمات SMTP برای سرویس‌های دیگر

#### Outlook/Hotmail:
```
Host: smtp-mail.outlook.com
Port: 587
Security: STARTTLS
```

#### Yahoo:
```
Host: smtp.mail.yahoo.com
Port: 587
Security: STARTTLS
```

#### Custom SMTP:
```
Host: your-smtp-server.com
Port: 587
Security: TLS
```

## تست و بررسی:

### تست 1: بررسی اتصال SMTP
```javascript
// در کنسول مرورگر
console.log('SMTP Status:', 'Check Supabase Dashboard');
console.log('Email Provider:', 'Should be enabled');
```

### تست 2: تست ثبت‌نام
1. **صفحه ثبت‌نام** را باز کنید
2. **ایمیل جدید** وارد کنید
3. **فرم را پر کنید**
4. **ثبت‌نام کنید**
5. **ایمیل تایید** را بررسی کنید

### تست 3: بررسی لاگ‌ها
```javascript
// لاگ‌های کنسول را بررسی کنید
console.log("Registration process started");
console.log("Email rate limit check");
console.log("SMTP connection status");
```

## نکات مهم:

### ✅ کارهایی که باید انجام دهید:
- **60 دقیقه صبر کنید** قبل از تلاش مجدد
- **از ایمیل‌های مختلف** استفاده کنید
- **تنظیمات SMTP** را بررسی کنید
- **Environment Variables** را چک کنید

### ❌ کارهایی که نباید انجام دهید:
- **تکرار مداوم** درخواست‌های ایمیل
- **استفاده از ایمیل‌های تکراری**
- **نادیده گرفتن** تنظیمات SMTP
- **استفاده از** ایمیل‌های نامعتبر

## راه‌حل‌های نهایی:

### اگر مشکل همچنان ادامه دارد:

1. **SMTP شخصی** تنظیم کنید
2. **Rate Limiting** را بررسی کنید
3. **Environment Variables** را چک کنید
4. **Supabase Support** تماس بگیرید

### تنظیمات پیشنهادی:

```javascript
// تنظیمات بهینه برای SMTP
{
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  },
  tls: {
    rejectUnauthorized: false
  }
}
```

## خلاصه:

مشکل "Email rate limit exceeded" یک مشکل رایج در Supabase است که با:
- **صبر کردن 60 دقیقه**
- **استفاده از ایمیل‌های مختلف**
- **تنظیم SMTP شخصی**

قابل حل است. مهم‌ترین نکته این است که **عجله نکنید** و **تنظیمات را درست انجام دهید**.

## پشتیبانی:

اگر مشکل حل نشد:
1. **لاگ‌های کنسول** را کپی کنید
2. **تنظیمات SMTP** را بررسی کنید
3. **Supabase Dashboard** را چک کنید
4. **با تیم پشتیبانی** تماس بگیرید