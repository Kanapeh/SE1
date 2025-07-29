# راهنمای عیب‌یابی ورود به سیستم

## مشکل: کاربر ادمین نمی‌تواند وارد شود

### علت‌های احتمالی:

1. **ایمیل تایید نشده است**
2. **رمز عبور اشتباه است**
3. **کاربر در جدول admins ثبت نشده است**
4. **تنظیمات احراز هویت مشکل دارد**

## مراحل عیب‌یابی

### مرحله 1: بررسی وضعیت کاربر در دیتابیس

فایل `database/check_user_login_status.sql` را در Supabase SQL Editor اجرا کنید:

```sql
-- بررسی کاربر در auth.users
SELECT 
  'User in auth.users' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN 'Email Not Confirmed'
    ELSE 'Email Confirmed'
  END as email_status
FROM auth.users 
WHERE email = 'kanapehlife@gmail.com';
```

### مرحله 2: بررسی کاربر در جدول admins

```sql
-- بررسی کاربر در جدول admins
SELECT 
  'User in admins table' as check_type,
  user_id,
  full_name,
  role,
  created_at
FROM admins 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'kanapehlife@gmail.com'
);
```

### مرحله 3: بررسی کاربر در جدول auth-users

```sql
-- بررسی کاربر در جدول auth-users
SELECT 
  'User in auth-users table' as check_type,
  id,
  email,
  role,
  is_admin,
  first_name,
  last_name,
  created_at,
  updated_at
FROM "auth-users" 
WHERE email = 'kanapehlife@gmail.com';
```

## راه‌حل‌های احتمالی

### راه‌حل 1: تایید ایمیل کاربر

اگر `email_confirmed_at` برابر `NULL` است:

1. فایل `database/confirm_user_email.sql` را اجرا کنید
2. یا از Supabase Dashboard استفاده کنید:
   - Authentication > Users
   - کاربر را پیدا کنید
   - روی "Confirm email" کلیک کنید

### راه‌حل 2: تنظیم مجدد رمز عبور

اگر رمز عبور فراموش شده:

1. از صفحه فراموشی رمز عبور استفاده کنید (`/forgot-password`)
2. یا از Supabase Dashboard:
   - Authentication > Users
   - کاربر را پیدا کنید
   - روی "Reset password" کلیک کنید

### راه‌حل 3: اضافه کردن کاربر به جدول admins

اگر کاربر در جدول admins نیست:

```sql
-- اضافه کردن کاربر به جدول admins
INSERT INTO admins (
  user_id,
  full_name,
  role,
  created_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'kanapehlife@gmail.com'),
  'نام کامل کاربر',
  'admin',
  NOW()
);
```

### راه‌حل 4: بررسی تنظیمات احراز هویت

در Supabase Dashboard:
1. Authentication > Settings
2. بررسی کنید که "Enable email confirmations" غیرفعال باشد (برای تست)
3. یا "Enable email confirmations" فعال باشد و ایمیل تایید شود

## تست ورود

### تست 1: ورود با ایمیل و رمز عبور
1. به `/login` بروید
2. ایمیل: `kanapehlife@gmail.com`
3. رمز عبور: رمز عبور صحیح
4. باید به `/admin` هدایت شوید

### تست 2: بررسی لاگ‌ها
در کنسول مرورگر، لاگ‌های زیر را بررسی کنید:
- "Attempting login for: kanapehlife@gmail.com"
- "Login successful: [user object]"
- "User is admin: [admin data]"

### تست 3: بررسی خطاها
اگر خطایی رخ داد، پیام خطا را بررسی کنید:
- "ایمیل یا رمز عبور اشتباه است"
- "لطفاً ابتدا ایمیل خود را تایید کنید"
- "خطای غیرمنتظره رخ داد"

## مشکلات رایج

### مشکل: "ایمیل یا رمز عبور اشتباه است"
**راه‌حل:**
1. رمز عبور را بررسی کنید
2. از فراموشی رمز عبور استفاده کنید
3. رمز عبور را در Supabase Dashboard تنظیم کنید

### مشکل: "لطفاً ابتدا ایمیل خود را تایید کنید"
**راه‌حل:**
1. ایمیل تایید را بررسی کنید
2. ایمیل را به صورت دستی تایید کنید
3. تنظیمات احراز هویت را بررسی کنید

### مشکل: کاربر به صفحه ادمین هدایت نمی‌شود
**راه‌حل:**
1. بررسی کنید که کاربر در جدول admins باشد
2. بررسی کنید که role در auth-users برابر 'admin' باشد
3. لاگ‌های کنسول را بررسی کنید

## اسکریپت‌های مفید

### بررسی کامل وضعیت کاربر
```sql
-- بررسی کامل وضعیت کاربر
SELECT 
  'Complete User Status' as check_type,
  au.id as auth_user_id,
  au.email,
  au.email_confirmed_at,
  au.last_sign_in_at,
  aru.role as auth_users_role,
  aru.is_admin as auth_users_is_admin,
  adm.user_id as admin_user_id,
  adm.role as admin_role,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN 'Email Not Confirmed'
    WHEN adm.user_id IS NOT NULL THEN 'Admin User'
    WHEN aru.role = 'admin' OR aru.is_admin = true THEN 'Admin by Role'
    ELSE 'Regular User'
  END as user_status
FROM auth.users au
LEFT JOIN "auth-users" aru ON au.id = aru.id
LEFT JOIN admins adm ON au.id = adm.user_id
WHERE au.email = 'kanapehlife@gmail.com';
```

### نمایش تمام کاربران ادمین
```sql
-- نمایش تمام کاربران ادمین
SELECT 
  'All Admin Users' as check_type,
  au.email,
  au.email_confirmed_at,
  aru.role as auth_users_role,
  aru.is_admin as auth_users_is_admin,
  adm.role as admin_role,
  CASE 
    WHEN adm.user_id IS NOT NULL THEN 'Admin Table'
    WHEN aru.role = 'admin' OR aru.is_admin = true THEN 'Auth-Users Table'
    ELSE 'Not Admin'
  END as admin_source
FROM auth.users au
LEFT JOIN "auth-users" aru ON au.id = aru.id
LEFT JOIN admins adm ON au.id = adm.user_id
WHERE adm.user_id IS NOT NULL 
   OR aru.role = 'admin' 
   OR aru.is_admin = true
ORDER BY au.created_at DESC;
```

## نکات مهم

1. **همیشه لاگ‌های کنسول را بررسی کنید**
2. **اطمینان حاصل کنید که کاربر در جدول admins باشد**
3. **ایمیل کاربر تایید شده باشد**
4. **رمز عبور صحیح باشد**
5. **تنظیمات احراز هویت درست باشد**

## پشتیبانی

اگر مشکل حل نشد:
1. لاگ‌های کنسول را کپی کنید
2. نتایج اسکریپت‌های SQL را کپی کنید
3. با تیم پشتیبانی تماس بگیرید