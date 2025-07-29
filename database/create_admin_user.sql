-- ایجاد کاربر ادمین نمونه
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- ابتدا کاربر را در auth.users ایجاد کنید (از طریق Supabase Auth)
-- سپس این اسکریپت را اجرا کنید تا پروفایل کاربر در جدول auth-users ایجاد شود

-- مثال: ایجاد پروفایل ادمین برای کاربر موجود
-- UUID زیر را با UUID واقعی کاربر از auth.users جایگزین کنید

-- روش 1: اگر کاربر از قبل در auth.users وجود دارد
INSERT INTO "auth-users" (
  id,
  email,
  role,
  is_admin,
  first_name,
  last_name,
  phone,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_UUID_HERE', -- UUID کاربر از auth.users
  'admin@example.com',
  'admin',
  true,
  'ادمین',
  'سیستم',
  '+989123456789',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_admin = true,
  first_name = 'ادمین',
  last_name = 'سیستم',
  phone = '+989123456789',
  updated_at = NOW();

-- روش 2: به‌روزرسانی کاربر موجود به ادمین
UPDATE "auth-users" 
SET 
  role = 'admin',
  is_admin = true,
  updated_at = NOW()
WHERE email = 'admin@example.com';

-- روش 3: بررسی کاربران ادمین موجود
SELECT 
  id,
  email,
  role,
  is_admin,
  first_name,
  last_name,
  created_at
FROM "auth-users" 
WHERE role = 'admin' OR is_admin = true
ORDER BY created_at DESC;

-- روش 4: حذف دسترسی ادمین از کاربر
-- UPDATE "auth-users" 
-- SET 
--   role = 'student',
--   is_admin = false,
--   updated_at = NOW()
-- WHERE email = 'user@example.com';

-- نمایش تمام کاربران با نقش‌های مختلف
SELECT 
  email,
  role,
  is_admin,
  first_name,
  last_name,
  created_at,
  CASE 
    WHEN role = 'admin' OR is_admin = true THEN 'ادمین'
    WHEN role = 'teacher' THEN 'معلم'
    WHEN role = 'student' THEN 'دانشجو'
    ELSE 'نامشخص'
  END as role_display
FROM "auth-users" 
ORDER BY 
  CASE 
    WHEN role = 'admin' OR is_admin = true THEN 1
    WHEN role = 'teacher' THEN 2
    WHEN role = 'student' THEN 3
    ELSE 4
  END,
  created_at DESC;