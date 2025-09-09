-- راه‌حل سریع مشکل دسترسی ادمین به معلمان
-- این اسکریپت فقط مشکل دسترسی را حل می‌کند

-- 1. ایجاد جدول admins (اگر وجود ندارد)
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    permissions TEXT[] DEFAULT ARRAY['all'],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. فعال کردن RLS
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 3. حذف تمام policies موجود
DROP POLICY IF EXISTS "Public can view approved teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public can view active teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON public.teachers;
DROP POLICY IF EXISTS "Admins can manage all teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can manage admins" ON public.admins;

-- 4. ایجاد policies جدید
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

-- 5. اعطای دسترسی‌های لازم
GRANT ALL ON public.teachers TO authenticated;
GRANT ALL ON public.admins TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 6. اضافه کردن کاربر فعلی به عنوان ادمین
-- ⚠️ مهم: ایمیل خود را در خط زیر جایگزین کنید
INSERT INTO public.admins (user_id, role, permissions, is_active)
SELECT 
    id, 
    'admin', 
    ARRAY['all'], 
    true
FROM auth.users 
WHERE email = 'sepanta@se1a.org'  -- 🔴 ایمیل خود را اینجا وارد کنید
ON CONFLICT (user_id) 
DO UPDATE SET 
    is_active = true,
    role = 'admin',
    permissions = ARRAY['all'],
    updated_at = now();

-- 7. بررسی نتیجه
DO $$
DECLARE
    admin_count INTEGER;
    teacher_count INTEGER;
    current_user_email TEXT;
BEGIN
    -- دریافت ایمیل کاربر فعلی
    SELECT email INTO current_user_email 
    FROM auth.users 
    WHERE id = auth.uid();
    
    -- شمارش ادمین‌ها
    SELECT COUNT(*) INTO admin_count 
    FROM public.admins 
    WHERE is_active = true;
    
    -- شمارش معلمان
    SELECT COUNT(*) INTO teacher_count 
    FROM public.teachers;
    
    RAISE NOTICE '=== نتیجه تنظیمات ادمین ===';
    RAISE NOTICE 'ایمیل کاربر فعلی: %', current_user_email;
    RAISE NOTICE 'تعداد ادمین‌های فعال: %', admin_count;
    RAISE NOTICE 'تعداد معلمان: %', teacher_count;
    
    IF admin_count > 0 AND teacher_count >= 0 THEN
        RAISE NOTICE '✅ تنظیمات با موفقیت انجام شد!';
        RAISE NOTICE 'حالا می‌توانید به /admin/teachers بروید';
    ELSE
        RAISE NOTICE '❌ خطا در تنظیمات';
    END IF;
END $$;
