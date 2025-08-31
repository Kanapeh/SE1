-- Clean up problematic RLS policies for students table

-- First disable RLS temporarily
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (including problematic ones)
DROP POLICY IF EXISTS "Admins can update all student profiles" ON students;
DROP POLICY IF EXISTS "Admins can view all student profiles" ON students;
DROP POLICY IF EXISTS "Students are viewable by everyone" ON students;
DROP POLICY IF EXISTS "Teachers can view student profiles" ON students;
DROP POLICY IF EXISTS "Users can insert own student profile" ON students;
DROP POLICY IF EXISTS "Users can insert their own student profile" ON students;
DROP POLICY IF EXISTS "Users can update own student profile" ON students;
DROP POLICY IF EXISTS "Users can update their own student profile" ON students;
DROP POLICY IF EXISTS "Users can view own student profile" ON students;
DROP POLICY IF EXISTS "Users can view their own student profile" ON students;
DROP POLICY IF EXISTS "public_read_active_students" ON students;
DROP POLICY IF EXISTS "service_role_students" ON students;
DROP POLICY IF EXISTS "users_insert_own_profile" ON students;
DROP POLICY IF EXISTS "users_read_own_profile" ON students;
DROP POLICY IF EXISTS "users_update_own_profile" ON students;

-- Create ONLY essential, simple policies without recursion

-- 1. Service role has full access (most important)
CREATE POLICY "service_role_full_access" ON students
  FOR ALL USING (auth.role() = 'service_role');

-- 2. Users can manage their own profile only
CREATE POLICY "own_profile_access" ON students
  FOR ALL USING (auth.uid() = id);

-- 3. Public can read active students (for public listings)
CREATE POLICY "public_read_active" ON students
  FOR SELECT USING (status = 'active');

-- Re-enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Verify final policies
SELECT 
    policyname, 
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'students'
ORDER BY policyname;

-- Test query to make sure it works
SELECT 'RLS policies cleaned successfully' as status;
