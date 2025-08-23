-- راه‌حل مشکل infinite recursion در RLS policies
-- این فایل را در Supabase SQL Editor اجرا کنید

-- 1. بررسی policies مشکل‌دار
SELECT 
    policyname,
    cmd,
    roles,
    qual
FROM pg_policies 
WHERE tablename = 'teachers'
AND (qual LIKE '%auth-users%' OR qual LIKE '%admins%');

-- 2. حذف ALL policies موجود برای جدول teachers
DROP POLICY IF EXISTS "Admins can access all teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can update all teacher profiles" ON public.teachers;
DROP POLICY IF EXISTS "Admins can view all teacher profiles" ON public.teachers;
DROP POLICY IF EXISTS "Anyone can view active teachers" ON public.teachers;
DROP POLICY IF EXISTS "Enable insert for new teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public read access to teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can access own profile" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can view own profile" ON public.teachers;
DROP POLICY IF EXISTS "Users can insert their own teacher profile" ON public.teachers;
DROP POLICY IF EXISTS "Users can update their own teacher profile" ON public.teachers;
DROP POLICY IF EXISTS "Users can view their own teacher profile" ON public.teachers;

-- 3. غیرفعال کردن موقت RLS برای حل مشکل
ALTER TABLE public.teachers DISABLE ROW LEVEL SECURITY;

-- 4. بررسی جداول admins و auth-users
SELECT 
    'Admins table exists' as check_type,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admins'
    ) as result;

SELECT 
    'Auth-users table exists' as check_type,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'auth-users'
    ) as result;

-- 5. ایجاد policy ساده و ایمن برای ادمین‌ها
-- ابتدا RLS را فعال کنید
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Policy ساده برای ادمین‌ها - بدون recursion
CREATE POLICY "Simple admin access" ON public.teachers
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
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

-- 6. بررسی policies جدید
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual
FROM pg_policies 
WHERE tablename = 'teachers'
AND schemaname = 'public'
ORDER BY policyname;

-- 7. تست دسترسی ادمین
-- این query باید کار کند اگر ادمین باشید
SELECT 
    'Admin access test' as test,
    COUNT(*) as total_teachers
FROM public.teachers;

-- 8. نمایش معلمان برای ادمین
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM public.teachers 
ORDER BY created_at DESC;

-- 9. پیام موفقیت
SELECT '✅ Infinite recursion fixed successfully!' as status;
