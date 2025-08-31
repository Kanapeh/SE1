-- Fix RLS policies for students table to prevent redirect issues

-- First, check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'students';

-- Drop all existing problematic policies for students
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON students;
DROP POLICY IF EXISTS "Students can access own profile" ON students;
DROP POLICY IF EXISTS "Students can insert own profile" ON students;
DROP POLICY IF EXISTS "Students can update own profile" ON students;
DROP POLICY IF EXISTS "Public read access" ON students;
DROP POLICY IF EXISTS "Authenticated users can read" ON students;
DROP POLICY IF EXISTS "Users can manage own data" ON students;
DROP POLICY IF EXISTS "Service role access" ON students;

-- Temporarily disable RLS to clean up
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
-- 1. Service role has full access (for admin operations)
CREATE POLICY "service_role_students" ON students
  FOR ALL USING (auth.role() = 'service_role');

-- 2. Users can read their own student profile
CREATE POLICY "users_read_own_profile" ON students
  FOR SELECT USING (auth.uid() = id);

-- 3. Users can insert their own student profile  
CREATE POLICY "users_insert_own_profile" ON students
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Users can update their own student profile
CREATE POLICY "users_update_own_profile" ON students
  FOR UPDATE USING (auth.uid() = id);

-- 5. Allow public read access to active students (for admin/teacher view)
CREATE POLICY "public_read_active_students" ON students
  FOR SELECT USING (status = 'active');

-- Re-enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Verify the policies
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
WHERE tablename = 'students'
ORDER BY policyname;
