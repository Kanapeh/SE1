-- رفع مشکل توابع ادمین
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- حذف توابع موجود (اگر وجود دارند) برای جلوگیری از خطا
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_teacher(UUID);
DROP FUNCTION IF EXISTS is_teacher();
DROP FUNCTION IF EXISTS get_user_role(UUID);
DROP FUNCTION IF EXISTS get_user_role();

-- ایجاد تابع برای بررسی نقش ادمین
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "auth-users" 
    WHERE id = user_id AND (role = 'admin' OR is_admin = true)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ایجاد تابع برای بررسی نقش معلم
CREATE OR REPLACE FUNCTION is_teacher(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "auth-users" 
    WHERE id = user_id AND role IN ('teacher', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ایجاد تابع برای دریافت نقش کاربر
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
  user_is_admin BOOLEAN;
BEGIN
  SELECT role, is_admin INTO user_role, user_is_admin FROM "auth-users" WHERE id = user_id;
  
  IF user_is_admin = true THEN
    RETURN 'admin';
  END IF;
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تست توابع
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

-- نمایش توابع ایجاد شده
SELECT 
  proname as function_name,
  proargtypes::regtype[] as argument_types,
  prorettype::regtype as return_type
FROM pg_proc 
WHERE proname IN ('is_admin', 'is_teacher', 'get_user_role')
ORDER BY proname;