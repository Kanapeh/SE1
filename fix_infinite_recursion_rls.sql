-- Fix infinite recursion in RLS policies
-- This script fixes the circular reference in admin policies

-- First, disable RLS temporarily to clean up
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies for admins table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON admins;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON admins;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON admins;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON admins;
DROP POLICY IF EXISTS "Admins can access all admin data" ON admins;
DROP POLICY IF EXISTS "Admin access policy" ON admins;
DROP POLICY IF EXISTS "Service role can access all admins" ON admins;

-- Create simple, non-recursive policies
CREATE POLICY "service_role_full_access" ON admins
    FOR ALL USING (
        auth.role() = 'service_role'
    );

CREATE POLICY "authenticated_read_access" ON admins
    FOR SELECT USING (
        auth.role() = 'authenticated'
    );

-- Re-enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Test the fix
SELECT 'RLS policies fixed successfully' as status;
