-- بررسی وضعیت راه‌اندازی سیستم ادمین
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- بررسی وجود جدول auth-users
SELECT 
  'Table exists' as check_type,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'auth-users'
  ) as result;

-- بررسی فیلدهای مورد نیاز
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN ('role', 'is_admin') THEN 'Required'
    ELSE 'Optional'
  END as importance
FROM information_schema.columns 
WHERE table_name = 'auth-users' 
ORDER BY 
  CASE 
    WHEN column_name IN ('role', 'is_admin') THEN 1
    ELSE 2
  END,
  ordinal_position;

-- بررسی RLS
SELECT 
  'RLS enabled' as check_type,
  schemaname = 'public' AND tablename = 'auth-users' AND rowsecurity = true as result
FROM pg_tables 
WHERE tablename = 'auth-users';

-- بررسی policies موجود
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'Has condition'
    ELSE 'No condition'
  END as has_condition
FROM pg_policies 
WHERE tablename = 'auth-users'
ORDER BY policyname;

-- بررسی توابع موجود
SELECT 
  proname as function_name,
  proargtypes::regtype[] as argument_types,
  prorettype::regtype as return_type,
  CASE 
    WHEN proname IN ('is_admin', 'is_teacher', 'get_user_role') THEN 'Required'
    ELSE 'Optional'
  END as importance
FROM pg_proc 
WHERE proname IN ('is_admin', 'is_teacher', 'get_user_role')
ORDER BY proname;

-- بررسی کاربران ادمین
SELECT 
  email,
  role,
  is_admin,
  first_name,
  last_name,
  created_at,
  CASE 
    WHEN role = 'admin' OR is_admin = true THEN 'Admin'
    WHEN role = 'teacher' THEN 'Teacher'
    WHEN role = 'student' THEN 'Student'
    ELSE 'Unknown'
  END as role_display
FROM "auth-users" 
WHERE role = 'admin' OR is_admin = true
ORDER BY created_at DESC;

-- شمارش کاربران بر اساس نقش
SELECT 
  CASE 
    WHEN role = 'admin' OR is_admin = true THEN 'Admin'
    WHEN role = 'teacher' THEN 'Teacher'
    WHEN role = 'student' THEN 'Student'
    ELSE 'Unknown'
  END as role_type,
  COUNT(*) as user_count
FROM "auth-users" 
GROUP BY 
  CASE 
    WHEN role = 'admin' OR is_admin = true THEN 'Admin'
    WHEN role = 'teacher' THEN 'Teacher'
    WHEN role = 'student' THEN 'Student'
    ELSE 'Unknown'
  END
ORDER BY 
  CASE role_type
    WHEN 'Admin' THEN 1
    WHEN 'Teacher' THEN 2
    WHEN 'Student' THEN 3
    ELSE 4
  END;

-- تست توابع (اگر وجود دارند)
DO $$
BEGIN
  -- تست تابع is_admin
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
    RAISE NOTICE 'Function is_admin() exists and can be called';
  ELSE
    RAISE NOTICE 'Function is_admin() does not exist';
  END IF;

  -- تست تابع is_teacher
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_teacher') THEN
    RAISE NOTICE 'Function is_teacher() exists and can be called';
  ELSE
    RAISE NOTICE 'Function is_teacher() does not exist';
  END IF;

  -- تست تابع get_user_role
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_user_role') THEN
    RAISE NOTICE 'Function get_user_role() exists and can be called';
  ELSE
    RAISE NOTICE 'Function get_user_role() does not exist';
  END IF;
END $$;