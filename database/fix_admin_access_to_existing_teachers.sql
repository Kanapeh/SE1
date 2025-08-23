-- راه‌حل دسترسی ادمین به جدول teachers موجود
-- این فایل را در Supabase SQL Editor اجرا کنید

-- 1. بررسی RLS status فعلی
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'teachers';

-- 2. بررسی policies موجود
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

-- 3. فعال کردن RLS (اگر فعال نیست)
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- 4. حذف policies قدیمی (اگر وجود دارند)
DROP POLICY IF EXISTS "Admins can access all teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can access own profile" ON public.teachers;
DROP POLICY IF EXISTS "Public read access to teachers" ON public.teachers;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.teachers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.teachers;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.teachers;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.teachers;

-- 5. ایجاد جدول admins (اگر وجود ندارد)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admins') THEN
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

-- 6. ایجاد جدول auth-users (اگر وجود ندارد)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'auth-users') THEN
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

-- 7. ایجاد policies جدید

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

-- Policy برای ثبت‌نام معلمان جدید
CREATE POLICY "Enable insert for new teachers" ON public.teachers
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 8. اضافه کردن کاربر فعلی به عنوان ادمین (اختیاری)
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

-- 9. بررسی policies ایجاد شده
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

-- 10. تست دسترسی ادمین
-- این query باید کار کند اگر ادمین باشید
SELECT 
    'Admin access test' as test,
    COUNT(*) as total_teachers
FROM public.teachers;

-- 11. نمایش معلمان برای ادمین
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM public.teachers 
ORDER BY created_at DESC;

-- 12. بررسی ساختار جدول
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'teachers' 
ORDER BY ordinal_position;

-- 13. بررسی RLS status نهایی
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'teachers';

-- 14. پیام موفقیت
SELECT '✅ Admin teachers access setup completed successfully!' as status;
