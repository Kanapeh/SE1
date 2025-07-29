-- ایجاد کاربر ادمین نمونه
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- ابتدا کاربر را در Supabase Auth ایجاد کنید
-- سپس UUID کاربر را در این اسکریپت جایگزین کنید

-- روش 1: اضافه کردن کاربر ادمین جدید
INSERT INTO admins (
  user_id,
  full_name,
  role,
  created_at
) VALUES (
  'YOUR_USER_UUID_HERE', -- UUID کاربر از auth.users
  'ادمین سیستم',
  'admin',
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name = 'ادمین سیستم',
  role = 'admin',
  created_at = NOW();

-- روش 2: به‌روزرسانی کاربر موجود به ادمین
-- UPDATE admins 
-- SET 
--   full_name = 'ادمین سیستم',
--   role = 'admin',
--   created_at = NOW()
-- WHERE user_id = 'YOUR_USER_UUID_HERE';

-- روش 3: بررسی ادمین‌های موجود
SELECT 
  a.user_id,
  a.full_name,
  a.role,
  a.created_at,
  u.email
FROM admins a
LEFT JOIN auth.users u ON a.user_id = u.id
ORDER BY a.created_at DESC;

-- روش 4: حذف دسترسی ادمین از کاربر
-- DELETE FROM admins WHERE user_id = 'YOUR_USER_UUID_HERE';

-- روش 5: نمایش تمام کاربران با نقش‌های مختلف
SELECT 
  u.email,
  u.id as user_id,
  CASE 
    WHEN a.user_id IS NOT NULL THEN 'Admin'
    WHEN au.role = 'teacher' THEN 'Teacher'
    WHEN au.role = 'student' THEN 'Student'
    ELSE 'Unknown'
  END as role_type,
  a.full_name as admin_name,
  a.created_at as admin_created_at
FROM auth.users u
LEFT JOIN admins a ON u.id = a.user_id
LEFT JOIN "auth-users" au ON u.id = au.id
ORDER BY 
  CASE 
    WHEN a.user_id IS NOT NULL THEN 1
    WHEN au.role = 'teacher' THEN 2
    WHEN au.role = 'student' THEN 3
    ELSE 4
  END,
  u.created_at DESC;

-- روش 6: تست توابع
SELECT 
  'is_admin()' as function_name,
  is_admin() as result
UNION ALL
SELECT 
  'is_teacher()' as function_name,
  is_teacher()::text as result
UNION ALL
SELECT 
  'get_user_role()' as function_name,
  get_user_role() as result;