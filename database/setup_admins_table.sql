-- راه‌اندازی جدول admins برای کنترل دسترسی ادمین
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- ایجاد جدول admins اگر وجود ندارد
CREATE TABLE IF NOT EXISTS public.admins (
  user_id uuid NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  full_name text NULL,
  role text NULL DEFAULT 'admin'::text,
  CONSTRAINT admins_pkey PRIMARY KEY (user_id),
  CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- ایجاد index برای بهبود عملکرد
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
CREATE INDEX IF NOT EXISTS idx_admins_created_at ON admins(created_at);

-- فعال کردن RLS (Row Level Security)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- حذف policies موجود (اگر وجود دارند)
DROP POLICY IF EXISTS "Admins can view all admins" ON admins;
DROP POLICY IF EXISTS "Only admins can insert admins" ON admins;
DROP POLICY IF EXISTS "Only admins can update admins" ON admins;
DROP POLICY IF EXISTS "Only admins can delete admins" ON admins;

-- Policy: فقط ادمین‌ها می‌توانند تمام ادمین‌ها را ببینند
CREATE POLICY "Admins can view all admins" ON admins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: فقط ادمین‌ها می‌توانند ادمین جدید اضافه کنند
CREATE POLICY "Only admins can insert admins" ON admins
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: فقط ادمین‌ها می‌توانند ادمین‌ها را به‌روزرسانی کنند
CREATE POLICY "Only admins can update admins" ON admins
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: فقط ادمین‌ها می‌توانند ادمین‌ها را حذف کنند
CREATE POLICY "Only admins can delete admins" ON admins
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- حذف توابع موجود (اگر وجود دارند)
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
    SELECT 1 FROM admins 
    WHERE user_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ایجاد تابع برای بررسی نقش معلم
CREATE OR REPLACE FUNCTION is_teacher(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is admin first
  IF EXISTS (SELECT 1 FROM admins WHERE user_id = user_id) THEN
    RETURN true;
  END IF;
  
  -- Check auth-users table for teacher role
  RETURN EXISTS (
    SELECT 1 FROM "auth-users" 
    WHERE id = user_id AND role = 'teacher'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ایجاد تابع برای دریافت نقش کاربر
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
BEGIN
  -- First check if user is admin
  IF EXISTS (SELECT 1 FROM admins WHERE user_id = user_id) THEN
    RETURN 'admin';
  END IF;
  
  -- Check auth-users table for other roles
  RETURN COALESCE(
    (SELECT role FROM "auth-users" WHERE id = user_id),
    'student'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- اضافه کردن کامنت‌های توضیحی
COMMENT ON TABLE admins IS 'جدول ادمین‌ها برای کنترل دسترسی';
COMMENT ON COLUMN admins.user_id IS 'شناسه کاربر از auth.users';
COMMENT ON COLUMN admins.role IS 'نقش ادمین (پیش‌فرض: admin)';
COMMENT ON COLUMN admins.full_name IS 'نام کامل ادمین';
COMMENT ON FUNCTION is_admin(UUID) IS 'بررسی اینکه آیا کاربر ادمین است';
COMMENT ON FUNCTION is_teacher(UUID) IS 'بررسی اینکه آیا کاربر معلم یا ادمین است';
COMMENT ON FUNCTION get_user_role(UUID) IS 'دریافت نقش کاربر فعلی';

-- نمایش اطلاعات جدول
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'admins' 
ORDER BY ordinal_position;

-- نمایش policies موجود
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
WHERE tablename = 'admins';

-- نمایش توابع ایجاد شده
SELECT 
  proname as function_name,
  proargtypes::regtype[] as argument_types,
  prorettype::regtype as return_type
FROM pg_proc 
WHERE proname IN ('is_admin', 'is_teacher', 'get_user_role')
ORDER BY proname;