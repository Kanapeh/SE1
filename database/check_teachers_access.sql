-- بررسی دسترسی به جدول معلمان
-- این فایل را در Supabase SQL Editor اجرا کنید

-- 1. بررسی وجود جدول
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'teachers'
) as table_exists;

-- 2. بررسی تعداد رکوردها
SELECT COUNT(*) as total_teachers FROM public.teachers;

-- 3. نمایش چند رکورد نمونه
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM public.teachers 
LIMIT 5;

-- 4. بررسی RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'teachers';

-- 5. بررسی RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'teachers';

-- 6. بررسی دسترسی کاربر فعلی
SELECT 
    current_user as current_user,
    session_user as session_user,
    current_setting('role') as current_role;

-- 7. تست دسترسی مستقیم (اگر RLS فعال است)
-- این query ممکن است خطا بدهد اگر RLS فعال باشد
SELECT 
    'Direct access test' as test,
    COUNT(*) as count
FROM public.teachers;

-- 8. بررسی RLS policies برای جدول teachers
SELECT 
    p.policyname,
    p.cmd,
    p.qual,
    p.with_check
FROM pg_policies p
WHERE p.tablename = 'teachers'
AND p.schemaname = 'public';
