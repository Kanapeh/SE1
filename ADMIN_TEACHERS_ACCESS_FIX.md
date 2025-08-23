# 🔧 راه‌حل مشکل دسترسی ادمین به معلمان

## 🚨 مشکل فعلی
در داشبورد ادمین، دسترسی به جدول معلمان وجود ندارد و خطای زیر نمایش داده می‌شود:
```
app/admin/teachers/page.tsx (66:17) @ fetchTeachers
Error counting teachers: permission denied
```

## ✅ راه‌حل کامل

### مرحله 1: اجرای اسکریپت اصلی
فایل `database/admin_teachers_access.sql` را در Supabase SQL Editor اجرا کنید:

1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. روی "SQL Editor" کلیک کنید
4. محتوای فایل `database/admin_teachers_access.sql` را کپی کنید
5. روی "Run" کلیک کنید

### مرحله 2: اضافه کردن کاربر به عنوان ادمین
فایل `database/add_current_user_as_admin.sql` را اجرا کنید:

1. در همان SQL Editor
2. محتوای فایل `database/add_current_user_as_admin.sql` را کپی کنید
3. **مهم**: ایمیل خود را در خط زیر جایگزین کنید:
   ```sql
   WHERE email = 'your-email@example.com'  -- ایمیل خود را اینجا قرار دهید
   ```
4. روی "Run" کلیک کنید

### مرحله 3: بررسی موفقیت
پس از اجرای هر دو اسکریپت، باید پیام‌های موفقیت ببینید:
```
✅ Admin teachers access setup completed successfully!
✅ User added as admin successfully!
```

### مرحله 4: تست سیستم
1. صفحه `/admin/teachers` را refresh کنید
2. باید لیست معلمان نمایش داده شود
3. اگر هنوز خطا دارید، console مرورگر را بررسی کنید

## 🔍 عیب‌یابی

### اگر هنوز خطا دارید:

#### 1. بررسی RLS Policies
```sql
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual
FROM pg_policies 
WHERE tablename = 'teachers';
```

#### 2. بررسی جدول admins
```sql
SELECT * FROM public.admins;
```

#### 3. بررسی جدول auth-users
```sql
SELECT * FROM "public"."auth-users" WHERE is_admin = true;
```

#### 4. بررسی دسترسی کاربر فعلی
```sql
SELECT 
    current_user as current_user,
    session_user as session_user;
```

### خطاهای رایج:

#### خطای "permission denied" (42501)
- RLS policies درست تنظیم نشده‌اند
- کاربر ادمین نیست
- **راه‌حل**: اسکریپت‌ها را دوباره اجرا کنید

#### خطای "relation does not exist" (42P01)
- جدول `teachers` وجود ندارد
- **راه‌حل**: اسکریپت `admin_teachers_access.sql` را اجرا کنید

#### خطای "column does not exist"
- ساختار جدول تغییر کرده
- **راه‌حل**: جدول را دوباره ایجاد کنید

## 📋 ساختار جداول ایجاد شده

### جدول `teachers`
```sql
CREATE TABLE public.teachers (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    gender TEXT,
    birthdate DATE,
    national_id TEXT UNIQUE,
    address TEXT,
    languages TEXT[] NOT NULL,
    levels TEXT[],
    class_types TEXT[] NOT NULL,
    available_days TEXT[],
    available_hours TEXT[],
    max_students_per_class INTEGER,
    bio TEXT,
    experience_years INTEGER,
    hourly_rate INTEGER,
    location TEXT,
    education TEXT,
    certificates TEXT[],
    teaching_methods TEXT[],
    achievements TEXT[],
    avatar TEXT,
    preferred_time TEXT[],
    status TEXT DEFAULT 'pending',
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### جدول `admins`
```sql
CREATE TABLE public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    role TEXT DEFAULT 'admin',
    permissions TEXT[] DEFAULT ARRAY['all'],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### جدول `auth-users`
```sql
CREATE TABLE "public"."auth-users" (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🔒 RLS Policies

### Policy برای ادمین‌ها
```sql
CREATE POLICY "Admins can access all teachers" ON public.teachers
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
        OR
        EXISTS (
            SELECT 1 FROM "public"."auth-users" 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR is_admin = true)
        )
    );
```

### Policy برای معلمان
```sql
CREATE POLICY "Teachers can access own profile" ON public.teachers
    FOR ALL
    TO authenticated
    USING (id = auth.uid());
```

### Policy برای خواندن عمومی
```sql
CREATE POLICY "Public read access to teachers" ON public.teachers
    FOR SELECT
    TO public
    USING (status = 'active' OR status = 'Approved');
```

## 🧪 تست نهایی

### تست 1: دسترسی ادمین
```sql
SELECT COUNT(*) FROM public.teachers;
```
این query باید تعداد معلمان را برگرداند.

### تست 2: نمایش معلمان
```sql
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM public.teachers 
ORDER BY created_at DESC;
```

### تست 3: بررسی policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'teachers';
```

## 🎯 نتیجه نهایی

پس از اجرای این مراحل:
- ✅ جدول `teachers` ایجاد شده
- ✅ RLS policies فعال شده‌اند
- ✅ کاربر شما ادمین شده
- ✅ دسترسی کامل به معلمان دارید
- ✅ داشبورد ادمین کار می‌کند

## 📞 در صورت مشکل

### بررسی console مرورگر:
1. F12 را فشار دهید
2. به تب Console بروید
3. خطاها را بررسی کنید

### بررسی Supabase logs:
1. در Supabase Dashboard
2. به بخش Logs بروید
3. خطاهای SQL را بررسی کنید

### تماس با پشتیبانی:
- خطای دقیق را کپی کنید
- کد خطا را یادداشت کنید
- تصویر از صفحه خطا بگیرید
