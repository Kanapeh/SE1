-- به‌روزرسانی جدول auth-users برای کنترل دسترسی ادمین
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- بررسی وجود فیلدهای مورد نیاز
DO $$
BEGIN
    -- اضافه کردن فیلد role اگر وجود ندارد
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'auth-users' AND column_name = 'role') THEN
        ALTER TABLE "auth-users" ADD COLUMN role TEXT DEFAULT 'student';
    END IF;

    -- اضافه کردن فیلد is_admin اگر وجود ندارد
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'auth-users' AND column_name = 'is_admin') THEN
        ALTER TABLE "auth-users" ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- اضافه کردن constraint برای role
ALTER TABLE "auth-users" 
DROP CONSTRAINT IF EXISTS auth_users_role_check;

ALTER TABLE "auth-users" 
ADD CONSTRAINT auth_users_role_check 
CHECK (role IN ('student', 'teacher', 'admin'));

-- ایجاد index برای بهبود عملکرد
CREATE INDEX IF NOT EXISTS idx_auth_users_role ON "auth-users"(role);
CREATE INDEX IF NOT EXISTS idx_auth_users_is_admin ON "auth-users"(is_admin);
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON "auth-users"(email);

-- فعال کردن RLS (Row Level Security)
ALTER TABLE "auth-users" ENABLE ROW LEVEL SECURITY;

-- حذف policies موجود (اگر وجود دارند)
DROP POLICY IF EXISTS "Users can view own profile" ON "auth-users";
DROP POLICY IF EXISTS "Users can update own profile" ON "auth-users";
DROP POLICY IF EXISTS "Only admins can insert users" ON "auth-users";
DROP POLICY IF EXISTS "Admins can view all users" ON "auth-users";
DROP POLICY IF EXISTS "Only admins can delete users" ON "auth-users";
DROP POLICY IF EXISTS "Only admins can update user roles" ON "auth-users";

-- Policy: کاربران فقط می‌توانند پروفایل خود را ببینند
CREATE POLICY "Users can view own profile" ON "auth-users"
  FOR SELECT USING (auth.uid() = id);

-- Policy: کاربران فقط می‌توانند پروفایل خود را به‌روزرسانی کنند (به جز role و is_admin)
CREATE POLICY "Users can update own profile" ON "auth-users"
  FOR UPDATE USING (auth.uid() = id);

-- Policy: فقط ادمین‌ها می‌توانند کاربران جدید ایجاد کنند
CREATE POLICY "Only admins can insert users" ON "auth-users"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "auth-users" 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- Policy: فقط ادمین‌ها می‌توانند تمام کاربران را ببینند
CREATE POLICY "Admins can view all users" ON "auth-users"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "auth-users" 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- Policy: فقط ادمین‌ها می‌توانند کاربران را حذف کنند
CREATE POLICY "Only admins can delete users" ON "auth-users"
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM "auth-users" 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- Policy: فقط ادمین‌ها می‌توانند نقش کاربران را تغییر دهند
CREATE POLICY "Only admins can update user roles" ON "auth-users"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "auth-users" 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- حذف توابع موجود (اگر وجود دارند)
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS is_teacher(UUID);
DROP FUNCTION IF EXISTS get_user_role(UUID);

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

-- اضافه کردن کامنت‌های توضیحی
COMMENT ON TABLE "auth-users" IS 'جدول کاربران با کنترل دسترسی بر اساس نقش';
COMMENT ON COLUMN "auth-users".role IS 'نقش کاربر: student, teacher, admin';
COMMENT ON COLUMN "auth-users".is_admin IS 'آیا کاربر ادمین است (boolean)';
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
WHERE table_name = 'auth-users' 
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
WHERE tablename = 'auth-users';

-- نمایش توابع ایجاد شده
SELECT 
  proname as function_name,
  prosrc as function_source
FROM pg_proc 
WHERE proname IN ('is_admin', 'is_teacher', 'get_user_role');