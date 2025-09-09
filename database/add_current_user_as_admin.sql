-- اضافه کردن کاربر فعلی به عنوان ادمین
-- این اسکریپت کاربر فعلی را به جدول admins اضافه می‌کند

-- 1. بررسی وجود جدول admins
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    permissions TEXT[] DEFAULT ARRAY['all'],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. فعال کردن Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 3. حذف policies قدیمی
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can manage admins" ON public.admins;

-- 4. ایجاد policies جدید
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

-- 5. اعطای دسترسی‌های لازم
GRANT ALL ON public.admins TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 6. اضافه کردن کاربر فعلی به عنوان ادمین
-- این بخش باید با ایمیل واقعی شما جایگزین شود
INSERT INTO public.admins (user_id, role, permissions, is_active)
SELECT 
    id, 
    'admin', 
    ARRAY['all'], 
    true
FROM auth.users 
WHERE email = 'sepanta@se1a.org'  -- ایمیل خود را اینجا وارد کنید
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
    
    RAISE NOTICE '=== نتیجه اضافه کردن ادمین ===';
    RAISE NOTICE 'ایمیل کاربر فعلی: %', current_user_email;
    RAISE NOTICE 'تعداد ادمین‌های فعال: %', admin_count;
    
    -- نمایش لیست ادمین‌ها
    RAISE NOTICE 'لیست ادمین‌ها:';
    FOR rec IN 
        SELECT a.user_id, u.email, a.role, a.is_active, a.created_at
        FROM public.admins a
        JOIN auth.users u ON a.user_id = u.id
        ORDER BY a.created_at
    LOOP
        RAISE NOTICE '  - % (%): % - فعال: %', rec.email, rec.user_id, rec.role, rec.is_active;
    END LOOP;
    
    IF admin_count > 0 THEN
        RAISE NOTICE '✅ ادمین با موفقیت اضافه شد!';
        RAISE NOTICE 'حالا می‌توانید به /admin/teachers بروید';
    ELSE
        RAISE NOTICE '❌ خطا در اضافه کردن ادمین';
    END IF;
END $$;

-- 8. تست دسترسی به جدول teachers
DO $$
DECLARE
    teacher_count INTEGER;
    can_access BOOLEAN;
BEGIN
    -- تست دسترسی به جدول teachers
    BEGIN
        SELECT COUNT(*) INTO teacher_count FROM public.teachers;
        can_access := true;
    EXCEPTION
        WHEN OTHERS THEN
            can_access := false;
            teacher_count := 0;
    END;
    
    RAISE NOTICE '=== تست دسترسی به جدول teachers ===';
    RAISE NOTICE 'دسترسی: %', CASE WHEN can_access THEN '✅ موفق' ELSE '❌ ناموفق' END;
    RAISE NOTICE 'تعداد معلمان: %', teacher_count;
    
    IF can_access THEN
        RAISE NOTICE '✅ حالا می‌توانید معلمان را در داشبورد ادمین ببینید';
    ELSE
        RAISE NOTICE '❌ هنوز مشکل دسترسی وجود دارد';
        RAISE NOTICE 'لطفاً فایل fix_admin_access_existing_teachers.sql را اجرا کنید';
    END IF;
END $$;
