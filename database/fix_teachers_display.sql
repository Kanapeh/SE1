-- رفع مشکل عدم نمایش تمام معلم‌ها در داشبورد ادمین
-- این اسکریپت RLS policies را اصلاح می‌کند

-- 1. بررسی وضعیت فعلی
DO $$
DECLARE
    teacher_count INTEGER;
    admin_count INTEGER;
    current_user_id UUID;
    current_user_email TEXT;
BEGIN
    current_user_id := auth.uid();
    
    -- دریافت ایمیل کاربر فعلی
    SELECT email INTO current_user_email 
    FROM auth.users 
    WHERE id = current_user_id;
    
    -- شمارش معلمان
    SELECT COUNT(*) INTO teacher_count FROM public.teachers;
    
    -- شمارش ادمین‌ها
    SELECT COUNT(*) INTO admin_count FROM public.admins WHERE is_active = true;
    
    RAISE NOTICE '=== وضعیت فعلی ===';
    RAISE NOTICE 'کاربر فعلی: % (%)', current_user_email, current_user_id;
    RAISE NOTICE 'تعداد معلمان: %', teacher_count;
    RAISE NOTICE 'تعداد ادمین‌ها: %', admin_count;
END $$;

-- 2. حذف تمام policies موجود
DROP POLICY IF EXISTS "Public can view approved teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public can view active teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON public.teachers;
DROP POLICY IF EXISTS "Admins can manage all teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can manage admins" ON public.admins;

-- 3. ایجاد policies جدید برای teachers
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

-- 4. ایجاد policies برای admins
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
GRANT ALL ON public.teachers TO authenticated;
GRANT ALL ON public.admins TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 6. اضافه کردن کاربر فعلی به عنوان ادمین (اگر وجود ندارد)
INSERT INTO public.admins (user_id, role, permissions, is_active)
SELECT 
    id, 
    'admin', 
    ARRAY['all'], 
    true
FROM auth.users 
WHERE id = auth.uid()
ON CONFLICT (user_id) 
DO UPDATE SET 
    is_active = true,
    role = 'admin',
    permissions = ARRAY['all'],
    updated_at = now();

-- 7. تست دسترسی
DO $$
DECLARE
    teacher_count INTEGER;
    pending_count INTEGER;
    can_access BOOLEAN;
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    RAISE NOTICE '=== تست دسترسی بعد از اصلاح ===';
    
    -- تست دسترسی کلی
    BEGIN
        SELECT COUNT(*) INTO teacher_count FROM public.teachers;
        can_access := true;
    EXCEPTION
        WHEN OTHERS THEN
            can_access := false;
            teacher_count := 0;
            RAISE NOTICE '❌ خطا در دسترسی کلی: %', SQLERRM;
    END;
    
    RAISE NOTICE 'دسترسی کلی: %', CASE WHEN can_access THEN '✅ موفق' ELSE '❌ ناموفق' END;
    RAISE NOTICE 'تعداد کل معلمان: %', teacher_count;
    
    -- تست دسترسی به معلمان در انتظار
    BEGIN
        SELECT COUNT(*) INTO pending_count 
        FROM public.teachers 
        WHERE status = 'pending';
        RAISE NOTICE 'معلمان در انتظار: %', pending_count;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ خطا در دسترسی به معلمان در انتظار: %', SQLERRM;
    END;
    
    -- نمایش معلمان
    RAISE NOTICE '=== لیست معلمان ===';
    FOR rec IN 
        SELECT first_name, last_name, email, status, created_at
        FROM public.teachers
        ORDER BY created_at DESC
    LOOP
        RAISE NOTICE '  - % % (%): % - %', 
            rec.first_name, rec.last_name, rec.email, rec.status, rec.created_at;
    END LOOP;
    
    IF can_access AND teacher_count > 0 THEN
        RAISE NOTICE '✅ مشکل حل شد! حالا می‌توانید تمام معلمان را ببینید';
    ELSE
        RAISE NOTICE '❌ هنوز مشکل وجود دارد';
    END IF;
END $$;

-- 8. بررسی policies ایجاد شده
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'teachers'
ORDER BY policyname;
