# راهنمای تایید معلمان

## 🎯 وضعیت فعلی
پروفایل معلم با موفقیت ثبت شده و در انتظار تایید ادمین است.

## 🔐 مراحل تایید معلم

### مرحله 1: ایجاد حساب ادمین

#### 1.1 ایجاد جدول admins
فایل `database/create_admin_user.sql` را در Supabase اجرا کنید:

```sql
-- ایجاد جدول admins
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    permissions TEXT[] DEFAULT ARRAY['all'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

#### 1.2 اضافه کردن کاربر ادمین
اگر قبلاً حساب کاربری دارید:

```sql
-- ایمیل خود را اینجا قرار دهید
INSERT INTO public.admins (user_id, role, permissions)
SELECT id, 'admin', ARRAY['all']
FROM auth.users 
WHERE email = 'your-email@example.com';
```

#### 1.3 یا ایجاد کاربر جدید
اگر حساب کاربری ندارید:
1. در سایت ثبت‌نام کنید
2. سپس آن را ادمین کنید:

```sql
INSERT INTO public.admins (user_id, role, permissions)
SELECT id, 'admin', ARRAY['all']
FROM auth.users 
WHERE email = 'your-email@example.com';
```

### مرحله 2: ورود به عنوان ادمین

#### 2.1 ورود به سایت
- به `/login` بروید
- با ایمیل ادمین وارد شوید
- باید به پنل ادمین هدایت شوید

#### 2.2 بررسی دسترسی ادمین
اگر به پنل ادمین هدایت نشدید:
- به `/admin/test-admin` بروید
- وضعیت دسترسی ادمین را بررسی کنید

### مرحله 3: تایید معلمان

#### 3.1 مشاهده معلمان در انتظار تایید
در پنل ادمین، بخش معلمان را بررسی کنید:

```sql
-- مشاهده معلمان در انتظار تایید
SELECT 
    id,
    email,
    first_name,
    last_name,
    status,
    created_at
FROM teachers 
WHERE status = 'pending'
ORDER BY created_at DESC;
```

#### 3.2 تایید معلم
معلم مورد نظر را تایید کنید:

```sql
-- تایید معلم
UPDATE teachers 
SET status = 'Approved', updated_at = now()
WHERE id = 'teacher-uuid-here';

-- یا تغییر به active
UPDATE teachers 
SET status = 'active', updated_at = now()
WHERE id = 'teacher-uuid-here';
```

#### 3.3 تایید از طریق UI
اگر پنل ادمین UI دارد:
1. به بخش "معلمان" بروید
2. معلم در انتظار تایید را پیدا کنید
3. روی "تایید" کلیک کنید

## 🔍 بررسی وضعیت

### مشاهده همه معلمان
```sql
SELECT 
    id,
    email,
    first_name || ' ' || last_name as full_name,
    status,
    created_at,
    CASE 
        WHEN status = 'pending' THEN 'در انتظار تایید'
        WHEN status = 'Approved' THEN 'تایید شده'
        WHEN status = 'active' THEN 'فعال'
        ELSE status
    END as status_fa
FROM teachers 
ORDER BY created_at DESC;
```

### مشاهده کاربران ادمین
```sql
SELECT 
    au.id,
    au.email,
    au.role,
    adm.role as admin_role,
    adm.permissions
FROM auth.users au
LEFT JOIN public.admins adm ON au.id = adm.user_id
WHERE adm.user_id IS NOT NULL;
```

## 🚨 مشکلات احتمالی

### 1. دسترسی ادمین ندارید
**علت**: کاربر در جدول `admins` نیست
**راه‌حل**: 
```sql
INSERT INTO public.admins (user_id, role, permissions)
SELECT id, 'admin', ARRAY['all']
FROM auth.users 
WHERE email = 'your-email@example.com';
```

### 2. جدول admins وجود ندارد
**راه‌حل**: فایل `create_admin_user.sql` را اجرا کنید

### 3. معلم تایید شده اما نمی‌تواند وارد شود
**بررسی کنید**:
- آیا status = 'Approved' یا 'active' است؟
- آیا RLS policies درست کار می‌کنند؟

## ✅ مراحل نهایی

1. **ایجاد حساب ادمین** ✅
2. **ورود به عنوان ادمین** ✅
3. **مشاهده معلمان در انتظار** ✅
4. **تایید معلم** ✅
5. **تست ورود معلم** ✅

## 🎯 نتیجه
بعد از تایید، معلم می‌تواند:
- وارد پنل معلم شود (`/admin`)
- کلاس‌ها را مدیریت کند
- دانش‌آموزان را ببیند
- از تمام امکانات معلم استفاده کند

## 🔧 تست
1. معلم تایید شده را logout کنید
2. دوباره وارد شوید
3. باید به پنل معلم هدایت شود
4. پیام "حساب کاربری معلم شما غیرفعال است" نباید نمایش داده شود
