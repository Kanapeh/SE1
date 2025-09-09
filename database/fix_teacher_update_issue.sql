-- Fix teacher profile update issue
-- This script ensures the teachers table has the correct structure and RLS policies

-- 1. Check current table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'teachers'
AND column_name IN ('id', 'user_id')
ORDER BY column_name;

-- 2. Check current RLS policies
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
WHERE tablename = 'teachers'
ORDER BY policyname;

-- 3. Ensure teachers table has correct structure
-- The id column should be the primary key referencing auth.users(id)
-- The user_id column should also reference auth.users(id) for RLS policies

-- 4. Fix RLS policies for teachers table
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public can view approved teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public can view active teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON public.teachers;
DROP POLICY IF EXISTS "Admins can manage all teachers" ON public.teachers;

-- Create new policies
-- Public can view approved teachers
CREATE POLICY "Public can view approved teachers" ON public.teachers
    FOR SELECT USING (status IN ('Approved', 'active'));

-- Teachers can update their own profile (using id column)
CREATE POLICY "Teachers can update own profile" ON public.teachers
    FOR UPDATE USING (auth.uid() = id);

-- Teachers can insert their own profile
CREATE POLICY "Teachers can insert own profile" ON public.teachers
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can manage all teachers
CREATE POLICY "Admins can manage all teachers" ON public.teachers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- 5. Grant necessary permissions
GRANT ALL ON public.teachers TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 6. Test the policies
-- This will show if the current user can update their own profile
SELECT 
    auth.uid() as current_user_id,
    id,
    first_name,
    last_name,
    email,
    experience_years
FROM public.teachers 
WHERE id = auth.uid()
LIMIT 1;
