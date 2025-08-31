-- رفع مشکل دسترسی ادمین به جدول معلمان موجود
-- این اسکریپت برای جدول teachers که قبلاً ایجاد شده است

-- 1. ایجاد جدول admins (اگر وجود ندارد)
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    permissions TEXT[] DEFAULT ARRAY['all'],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. فعال کردن Row Level Security برای جداول
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 3. حذف policies قدیمی (اگر وجود دارند)
DROP POLICY IF EXISTS "Public can view approved teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON public.teachers;
DROP POLICY IF EXISTS "Admins can manage all teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can manage admins" ON public.admins;

-- 4. ایجاد policies جدید برای teachers
-- عموم می‌تواند معلمان فعال را ببینند
CREATE POLICY "Public can view active teachers" ON public.teachers
    FOR SELECT USING (status IN ('active', 'Approved'));

-- معلمان می‌توانند پروفایل خود را ویرایش کنند
CREATE POLICY "Teachers can update own profile" ON public.teachers
    FOR UPDATE USING (auth.uid() = id);

-- معلمان می‌توانند پروفایل خود را ایجاد کنند
CREATE POLICY "Teachers can insert own profile" ON public.teachers
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ادمین‌ها می‌توانند همه کار را با معلمان انجام دهند
CREATE POLICY "Admins can manage all teachers" ON public.teachers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- 5. ایجاد policies برای admins
-- ادمین‌ها می‌توانند همه ادمین‌ها را ببینند
CREATE POLICY "Admins can view all admins" ON public.admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- ادمین‌ها می‌توانند ادمین‌ها را مدیریت کنند
CREATE POLICY "Admins can manage admins" ON public.admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- 6. اعطای دسترسی‌های لازم
GRANT ALL ON public.teachers TO authenticated;
GRANT ALL ON public.admins TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 7. ایجاد functions مفید برای ادمین

-- تابع تایید معلم
CREATE OR REPLACE FUNCTION public.approve_teacher(teacher_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- بررسی دسترسی ادمین
    IF NOT EXISTS (
        SELECT 1 FROM public.admins 
        WHERE user_id = auth.uid() 
        AND is_active = true
    ) THEN
        RAISE EXCEPTION 'فقط ادمین‌ها می‌توانند معلمان را تایید کنند';
    END IF;
    
    -- بروزرسانی وضعیت معلم
    UPDATE public.teachers 
    SET status = 'Approved', updated_at = now()
    WHERE id = teacher_id;
    
    RETURN FOUND;
END;
$$;

-- تابع رد معلم
CREATE OR REPLACE FUNCTION public.reject_teacher(teacher_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- بررسی دسترسی ادمین
    IF NOT EXISTS (
        SELECT 1 FROM public.admins 
        WHERE user_id = auth.uid() 
        AND is_active = true
    ) THEN
        RAISE EXCEPTION 'فقط ادمین‌ها می‌توانند معلمان را رد کنند';
    END IF;
    
    -- بروزرسانی وضعیت معلم
    UPDATE public.teachers 
    SET status = 'rejected', updated_at = now()
    WHERE id = teacher_id;
    
    RETURN FOUND;
END;
$$;

-- تابع آمار معلمان
CREATE OR REPLACE FUNCTION public.get_teacher_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    -- بررسی دسترسی ادمین
    IF NOT EXISTS (
        SELECT 1 FROM public.admins 
        WHERE user_id = auth.uid() 
        AND is_active = true
    ) THEN
        RAISE EXCEPTION 'فقط ادمین‌ها می‌توانند آمار معلمان را ببینند';
    END IF;
    
    SELECT json_build_object(
        'total', COUNT(*),
        'pending', COUNT(*) FILTER (WHERE status = 'pending'),
        'approved', COUNT(*) FILTER (WHERE status IN ('Approved', 'active')),
        'rejected', COUNT(*) FILTER (WHERE status = 'rejected'),
        'active', COUNT(*) FILTER (WHERE status = 'active')
    ) INTO result
    FROM public.teachers;
    
    RETURN result;
END;
$$;

-- 8. بررسی کنیم که جدول teachers درست ساخته شده
DO $$
DECLARE
    table_exists BOOLEAN;
    admin_table_exists BOOLEAN;
BEGIN
    -- بررسی وجود جدول teachers
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'teachers'
    ) INTO table_exists;
    
    -- بررسی وجود جدول admins
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admins'
    ) INTO admin_table_exists;
    
    IF table_exists THEN
        RAISE NOTICE '✅ جدول teachers موجود است';
    ELSE
        RAISE NOTICE '❌ جدول teachers وجود ندارد';
    END IF;
    
    IF admin_table_exists THEN
        RAISE NOTICE '✅ جدول admins موجود است';
    ELSE
        RAISE NOTICE '❌ جدول admins وجود ندارد';
    END IF;
    
    -- نمایش تعداد معلمان
    DECLARE
        teacher_count INTEGER;
    BEGIN
        SELECT COUNT(*) INTO teacher_count FROM public.teachers;
        RAISE NOTICE '📊 تعداد معلمان: %', teacher_count;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ خطا در خواندن جدول teachers: %', SQLERRM;
    END;
END $$;

-- 9. پیام‌های راهنما
DO $$
BEGIN
    RAISE NOTICE '=== راهنمای تکمیل تنظیمات ===';
    RAISE NOTICE '';
    RAISE NOTICE '1. خودتان را ادمین کنید:';
    RAISE NOTICE 'INSERT INTO public.admins (user_id, role, permissions, is_active)';
    RAISE NOTICE 'SELECT id, ''admin'', ARRAY[''all''], true';
    RAISE NOTICE 'FROM auth.users WHERE email = ''YOUR_EMAIL@example.com''';
    RAISE NOTICE 'ON CONFLICT (user_id) DO UPDATE SET is_active = true;';
    RAISE NOTICE '';
    RAISE NOTICE '2. بررسی کنید که ادمین شده‌اید:';
    RAISE NOTICE 'SELECT a.*, u.email FROM public.admins a JOIN auth.users u ON a.user_id = u.id;';
    RAISE NOTICE '';
    RAISE NOTICE '3. تست دسترسی به معلمان:';
    RAISE NOTICE 'SELECT COUNT(*) FROM public.teachers;';
    RAISE NOTICE '';
    RAISE NOTICE '4. به داشبورد ادمین بروید: /admin/';
    RAISE NOTICE '';
END $$;
