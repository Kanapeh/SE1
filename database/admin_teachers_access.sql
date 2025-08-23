-- دسترسی ادمین‌ها به تمام معلمان - راه‌حل کامل
-- این فایل را در Supabase SQL Editor اجرا کنید

-- 1. بررسی وجود جدول teachers
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'teachers') THEN
        -- ایجاد جدول teachers اگر وجود ندارد
        CREATE TABLE public.teachers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );
        
        -- ایجاد index ها
        CREATE INDEX IF NOT EXISTS idx_teachers_email ON public.teachers(email);
        CREATE INDEX IF NOT EXISTS idx_teachers_status ON public.teachers(status);
        CREATE INDEX IF NOT EXISTS idx_teachers_languages ON public.teachers USING GIN(languages);
        CREATE INDEX IF NOT EXISTS idx_teachers_levels ON public.teachers USING GIN(levels);
        CREATE INDEX IF NOT EXISTS idx_teachers_location ON public.teachers(location);
        CREATE INDEX IF NOT EXISTS idx_teachers_created_at ON public.teachers(created_at);
        
        RAISE NOTICE 'Table teachers created successfully';
    ELSE
        RAISE NOTICE 'Table teachers already exists';
    END IF;
END $$;

-- 2. بررسی وجود جدول admins
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admins') THEN
        -- ایجاد جدول admins اگر وجود ندارد
        CREATE TABLE public.admins (
            user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            role TEXT DEFAULT 'admin',
            permissions TEXT[] DEFAULT ARRAY['all'],
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );
        
        RAISE NOTICE 'Table admins created successfully';
    ELSE
        RAISE NOTICE 'Table admins already exists';
    END IF;
END $$;

-- 3. بررسی وجود جدول auth-users
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'auth-users') THEN
        -- ایجاد جدول auth-users اگر وجود ندارد
        CREATE TABLE "public"."auth-users" (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT UNIQUE NOT NULL,
            role TEXT DEFAULT 'user',
            is_admin BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );
        
        RAISE NOTICE 'Table auth-users created successfully';
    ELSE
        RAISE NOTICE 'Table auth-users already exists';
    END IF;
END $$;

-- 4. فعال کردن RLS برای جدول teachers
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- 5. حذف policies قدیمی (اگر وجود دارند)
DROP POLICY IF EXISTS "Admins can access all teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can access own profile" ON public.teachers;
DROP POLICY IF EXISTS "Public read access to teachers" ON public.teachers;

-- 6. ایجاد policies جدید
-- Policy برای ادمین‌ها - دسترسی کامل به تمام معلمان
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

-- Policy برای معلمان - فقط دسترسی به پروفایل خودشان
CREATE POLICY "Teachers can access own profile" ON public.teachers
    FOR ALL
    TO authenticated
    USING (id = auth.uid());

-- Policy برای خواندن عمومی - فقط معلمان فعال
CREATE POLICY "Public read access to teachers" ON public.teachers
    FOR SELECT
    TO public
    USING (status = 'active' OR status = 'Approved');

-- 7. اضافه کردن کاربر فعلی به عنوان ادمین (اختیاری)
-- اگر می‌خواهید کاربر فعلی را ادمین کنید، این خط را uncomment کنید
-- و ایمیل خود را جایگزین کنید
/*
INSERT INTO public.admins (user_id, role, permissions, is_active)
SELECT id, 'admin', ARRAY['all'], true
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET 
    role = 'admin',
    permissions = ARRAY['all'],
    is_active = true,
    updated_at = timezone('utc'::text, now());
*/

-- 8. بررسی policies ایجاد شده
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'teachers'
AND schemaname = 'public';

-- 9. تست دسترسی ادمین
-- این query باید کار کند اگر ادمین باشید
SELECT 
    'Admin access test' as test,
    COUNT(*) as total_teachers
FROM public.teachers;

-- 10. نمایش معلمان برای ادمین
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM public.teachers 
ORDER BY created_at DESC;

-- 11. بررسی ساختار جدول
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'teachers' 
ORDER BY ordinal_position;

-- 12. بررسی RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'teachers';

-- 13. پیام موفقیت
SELECT '✅ Admin teachers access setup completed successfully!' as status;
