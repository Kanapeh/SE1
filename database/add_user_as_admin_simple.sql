-- اضافه کردن کاربر به عنوان ادمین - نسخه ساده
-- این فایل را در Supabase SQL Editor اجرا کنید

-- 1. بررسی کاربران موجود
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC;

-- 2. ایجاد جدول admins (اگر وجود ندارد)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admins') THEN
        CREATE TABLE public.admins (
            user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            role TEXT DEFAULT 'admin',
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );
        
        RAISE NOTICE 'Table admins created successfully';
    ELSE
        RAISE NOTICE 'Table admins already exists';
    END IF;
END $$;

-- 3. اضافه کردن کاربر به عنوان ادمین
-- ایمیل خود را اینجا قرار دهید
INSERT INTO public.admins (user_id, role, is_active)
SELECT id, 'admin', true
FROM auth.users 
WHERE email = 'your-email@example.com'  -- ایمیل خود را اینجا قرار دهید
ON CONFLICT (user_id) DO UPDATE SET 
    role = 'admin',
    is_active = true,
    updated_at = timezone('utc'::text, now());

-- 4. بررسی ادمین‌های موجود
SELECT 
    a.user_id,
    a.role,
    a.is_active,
    a.created_at,
    u.email
FROM public.admins a
JOIN auth.users u ON a.user_id = u.id;

-- 5. تست دسترسی ادمین
SELECT 
    'Admin access test' as test,
    COUNT(*) as total_teachers
FROM public.teachers;

-- 6. پیام موفقیت
SELECT '✅ User added as admin successfully!' as status;
