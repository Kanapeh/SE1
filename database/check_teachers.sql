-- بررسی معلم‌های ثبت شده در دیتابیس
-- این اسکریپت تمام معلم‌ها را نمایش می‌دهد

-- 1. بررسی تعداد کل معلمان
SELECT 
    COUNT(*) as total_teachers,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_teachers,
    COUNT(CASE WHEN status = 'Approved' THEN 1 END) as approved_teachers,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_teachers,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_teachers
FROM public.teachers;

-- 2. نمایش جزئیات تمام معلمان
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at,
    updated_at
FROM public.teachers
ORDER BY created_at DESC;

-- 3. بررسی معلم‌های در انتظار
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM public.teachers
WHERE status = 'pending'
ORDER BY created_at DESC;

-- 4. بررسی معلم‌های تایید شده
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM public.teachers
WHERE status IN ('Approved', 'active')
ORDER BY created_at DESC;

-- 5. بررسی RLS policies
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

-- 6. بررسی دسترسی ادمین
SELECT 
    a.user_id,
    u.email,
    a.role,
    a.is_active,
    a.created_at
FROM public.admins a
JOIN auth.users u ON a.user_id = u.id
ORDER BY a.created_at;

-- 7. تست دسترسی به جدول teachers
DO $$
DECLARE
    teacher_count INTEGER;
    can_access BOOLEAN;
    current_user_id UUID;
BEGIN
    -- دریافت ID کاربر فعلی
    current_user_id := auth.uid();
    
    RAISE NOTICE '=== تست دسترسی به جدول teachers ===';
    RAISE NOTICE 'کاربر فعلی: %', current_user_id;
    
    -- تست دسترسی
    BEGIN
        SELECT COUNT(*) INTO teacher_count FROM public.teachers;
        can_access := true;
    EXCEPTION
        WHEN OTHERS THEN
            can_access := false;
            teacher_count := 0;
            RAISE NOTICE 'خطا در دسترسی: %', SQLERRM;
    END;
    
    RAISE NOTICE 'دسترسی: %', CASE WHEN can_access THEN '✅ موفق' ELSE '❌ ناموفق' END;
    RAISE NOTICE 'تعداد معلمان: %', teacher_count;
    
    -- تست دسترسی با RLS
    BEGIN
        SELECT COUNT(*) INTO teacher_count 
        FROM public.teachers 
        WHERE status = 'pending';
        RAISE NOTICE 'معلمان در انتظار: %', teacher_count;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'خطا در دسترسی به معلمان در انتظار: %', SQLERRM;
    END;
END $$;
