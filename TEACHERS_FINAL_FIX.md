# راهنمای نهایی حل مشکل عدم نمایش معلم‌ها

## 🔍 مشکل
خطای syntax در اجرای اسکریپت‌های SQL

## ✅ راه‌حل مرحله‌ای

### مرحله 1: اجرای اسکریپت نهایی
```sql
-- در Supabase SQL Editor اجرا کنید:
-- فایل: database/final_teachers_fix.sql
```

### مرحله 2: اگر خطای syntax داشتید
هر بخش را جداگانه اجرا کنید:

#### 2.1. بررسی وضعیت فعلی
```sql
SELECT COUNT(*) as total_teachers FROM public.teachers;
```

#### 2.2. نمایش معلمان موجود
```sql
SELECT id, first_name, last_name, email, status, created_at
FROM public.teachers
ORDER BY created_at DESC;
```

#### 2.3. ایجاد جدول admins
```sql
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

#### 2.4. فعال کردن RLS
```sql
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
```

#### 2.5. اضافه کردن ستون user_id
```sql
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
```

#### 2.6. ایجاد ایندکس
```sql
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);
```

#### 2.7. حذف policies قدیمی
```sql
DROP POLICY IF EXISTS "Public can view approved teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public can view active teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON public.teachers;
DROP POLICY IF EXISTS "Admins can manage all teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can manage admins" ON public.admins;
```

#### 2.8. ایجاد policies جدید
```sql
CREATE POLICY "Public can view active teachers" ON public.teachers
    FOR SELECT USING (status IN ('active', 'Approved'));

CREATE POLICY "Teachers can update own profile" ON public.teachers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teachers can insert own profile" ON public.teachers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all teachers" ON public.teachers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

CREATE POLICY "Admins can view all admins" ON public.admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

CREATE POLICY "Admins can manage admins" ON public.admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );
```

#### 2.9. اعطای دسترسی‌ها
```sql
GRANT ALL ON public.teachers TO authenticated;
GRANT ALL ON public.admins TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
```

#### 2.10. اضافه کردن ادمین
```sql
INSERT INTO public.admins (user_id, role, is_active)
SELECT id, 'admin', true
FROM auth.users 
WHERE id = auth.uid()
ON CONFLICT (user_id) 
DO UPDATE SET 
    is_active = true,
    role = 'admin',
    updated_at = now();
```

#### 2.11. تست نهایی
```sql
SELECT COUNT(*) as final_teacher_count FROM public.teachers;
```

### مرحله 3: تست در داشبورد
1. به `/admin/teachers` بروید
2. صفحه را refresh کنید
3. باید تمام 3 معلم نمایش داده شوند

## 🚨 اگر هنوز مشکل دارید

### بررسی جداگانه:
```sql
-- بررسی معلمان
SELECT * FROM public.teachers;

-- بررسی ادمین‌ها
SELECT * FROM public.admins;

-- بررسی policies
SELECT policyname FROM pg_policies WHERE tablename = 'teachers';
```

### بررسی لاگ‌های کنسول:
1. F12 را فشار دهید
2. به تب Console بروید
3. خطاهای مربوط به Supabase را بررسی کنید

## ✅ نتیجه نهایی
بعد از اجرای تمام مراحل:
- تمام 3 معلم در داشبورد ادمین نمایش داده می‌شوند
- ادمین می‌تواند وضعیت معلمان را تغییر دهد
- RLS policies درست کار می‌کنند
