-- اضافه کردن کاربر فعلی به عنوان ادمین
-- این فایل را در Supabase SQL Editor اجرا کنید
-- ابتدا فایل admin_teachers_access.sql را اجرا کنید

-- 1. بررسی کاربران موجود
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC;

-- 2. اضافه کردن کاربر به جدول auth-users (اگر وجود ندارد)
INSERT INTO "public"."auth-users" (id, email, role, is_admin)
SELECT 
    id,
    email,
    'user',
    false
FROM auth.users 
WHERE id NOT IN (SELECT id FROM "public"."auth-users")
ON CONFLICT (id) DO NOTHING;

-- 3. اضافه کردن کاربر به عنوان ادمین
-- ایمیل خود را اینجا قرار دهید
INSERT INTO public.admins (user_id, role, permissions, is_active)
SELECT id, 'admin', ARRAY['all'], true
FROM auth.users 
WHERE email = 'your-email@example.com'  -- ایمیل خود را اینجا قرار دهید
ON CONFLICT (user_id) DO UPDATE SET 
    role = 'admin',
    permissions = ARRAY['all'],
    is_active = true,
    updated_at = timezone('utc'::text, now());

-- 4. یا فعال کردن ادمین موجود
UPDATE "public"."auth-users" 
SET is_admin = true, role = 'admin'
WHERE email = 'your-email@example.com';  -- ایمیل خود را اینجا قرار دهید

-- 5. بررسی ادمین‌های موجود
SELECT 
    a.user_id,
    a.role,
    a.permissions,
    a.is_active,
    u.email
FROM public.admins a
JOIN auth.users u ON a.user_id = u.id;

-- 6. بررسی کاربران ادمین در auth-users
SELECT 
    id,
    email,
    role,
    is_admin
FROM "public"."auth-users" 
WHERE role = 'admin' OR is_admin = true;

-- 7. تست دسترسی ادمین
-- این query باید کار کند اگر ادمین باشید
SELECT 
    'Admin access test' as test,
    COUNT(*) as total_teachers
FROM public.teachers;

-- 8. پیام موفقیت
SELECT '✅ User added as admin successfully!' as status;
