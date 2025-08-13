# راهنمای سریع راه‌اندازی جدول معلمان

## 🚨 مشکلات فعلی
1. جدول `teachers` در Supabase وجود ندارد
2. خطای ارسال ایمیل تایید

## ✅ راه‌حل سریع

### مرحله 1: ایجاد جدول معلمان
فایل `database/create_teachers_table_simple.sql` را در Supabase SQL Editor اجرا کنید:

1. به Supabase Dashboard بروید
2. روی "SQL Editor" کلیک کنید
3. محتوای فایل `create_teachers_table_simple.sql` را کپی کنید
4. روی "Run" کلیک کنید

### مرحله 2: بررسی ایجاد جدول
پس از اجرای اسکریپت، باید پیام موفقیت ببینید و جدول `teachers` ایجاد شود.

### مرحله 3: تست سیستم
1. به `/register?type=teacher` بروید
2. روی "ثبت‌نام کامل معلم" کلیک کنید
3. فرم 5 مرحله‌ای را تکمیل کنید

## 🔧 رفع مشکل ایمیل

### مشکل: "Error sending confirmation email"
این خطا معمولاً به دلیل تنظیمات SMTP در Supabase است.

### راه‌حل:
1. **بررسی تنظیمات Supabase:**
   - به Authentication > Settings بروید
   - Email Templates را بررسی کنید
   - SMTP settings را چک کنید

2. **استفاده از Google OAuth (توصیه شده):**
   - در فرم ثبت‌نام از دکمه "ادامه با گوگل" استفاده کنید
   - این روش نیازی به تایید ایمیل ندارد

3. **تنظیم SMTP خود:**
   - در Supabase، SMTP settings خود را اضافه کنید
   - یا از سرویس‌های مثل SendGrid استفاده کنید

## 📋 ساختار جدول ایجاد شده

```sql
CREATE TABLE teachers (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  gender TEXT,
  birthdate DATE,
  national_id TEXT UNIQUE,
  languages TEXT[],
  levels TEXT[],
  class_types TEXT[],
  experience_years INTEGER,
  education TEXT,
  bio TEXT,
  available_days TEXT[],
  available_hours TEXT[],
  hourly_rate INTEGER,
  max_students_per_class INTEGER,
  location TEXT,
  certificates TEXT[],
  teaching_methods TEXT[],
  achievements TEXT[],
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  avatar TEXT,
  rating DECIMAL(3,2),
  total_students INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🧪 تست سریع

### تست 1: بررسی جدول
```sql
SELECT * FROM teachers LIMIT 1;
```

### تست 2: بررسی RLS
```sql
SELECT * FROM teachers WHERE status = 'active';
```

### تست 3: بررسی Index ها
```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'teachers';
```

## 🚀 در صورت موفقیت

اگر همه چیز درست کار کرد:
1. ✅ جدول `teachers` ایجاد شده
2. ✅ RLS policies فعال شده
3. ✅ Index ها ایجاد شده
4. ✅ فرم ثبت‌نام کار می‌کند

## 📞 در صورت مشکل

### خطاهای رایج:
1. **"relation teachers does not exist"**
   - اسکریپت SQL را دوباره اجرا کنید

2. **"permission denied"**
   - RLS policies را بررسی کنید

3. **"duplicate key value"**
   - جدول قبلاً وجود دارد، اسکریپت را نادیده بگیرید

### تماس با پشتیبانی:
- Console مرورگر را بررسی کنید
- Supabase logs را چک کنید
- Error message دقیق را یادداشت کنید

## 🎯 نتیجه نهایی

پس از اجرای این مراحل:
- ✅ سیستم ثبت‌نام معلمان کار می‌کند
- ✅ داده‌ها در دیتابیس ذخیره می‌شود
- ✅ امنیت با RLS تامین می‌شود
- ✅ فرم چند مرحله‌ای کامل است
