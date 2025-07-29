-- بررسی تنظیمات پروژه Supabase
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- بررسی وجود جداول اصلی
SELECT 
  'Database Tables Check' as check_type,
  schemaname,
  tablename,
  CASE 
    WHEN schemaname = 'public' AND tablename = 'auth-users' THEN '✅ Found'
    WHEN schemaname = 'public' AND tablename = 'admins' THEN '✅ Found'
    WHEN schemaname = 'public' AND tablename = 'teachers' THEN '✅ Found'
    WHEN schemaname = 'public' AND tablename = 'students' THEN '✅ Found'
    ELSE '❌ Missing'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('auth-users', 'admins', 'teachers', 'students')
ORDER BY tablename;

-- بررسی تنظیمات احراز هویت
SELECT 
  'Auth Configuration' as config_type,
  'Check these settings in Supabase Dashboard:' as description
UNION ALL
SELECT 
  '1. Authentication > Settings' as config_type,
  'Site URL and Redirect URLs' as description
UNION ALL
SELECT 
  '2. Authentication > Providers' as config_type,
  'Enable Email provider' as description
UNION ALL
SELECT 
  '3. Authentication > Email Templates' as config_type,
  'Enable Email Confirmations' as description
UNION ALL
SELECT 
  '4. Settings > API' as config_type,
  'Copy Project URL and anon key' as description;

-- راهنمای تنظیم Environment Variables
SELECT 
  'Environment Setup Guide' as step_type,
  'Follow these steps to fix the issue:' as step
UNION ALL
SELECT 
  '1. Create .env.local file' as step_type,
  'Create .env.local in your project root' as step
UNION ALL
SELECT 
  '2. Add Supabase URL' as step_type,
  'NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co' as step
UNION ALL
SELECT 
  '3. Add Supabase Key' as step_type,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key' as step
UNION ALL
SELECT 
  '4. Restart server' as step_type,
  'npm run dev or yarn dev' as step
UNION ALL
SELECT 
  '5. Test connection' as step_type,
  'Go to /test-supabase page' as step;

-- بررسی تنظیمات Site URL
SELECT 
  'Site URL Configuration' as setting_type,
  'Required settings for your domain:' as description
UNION ALL
SELECT 
  'Site URL' as setting_type,
  'https://www.se1a.org' as description
UNION ALL
SELECT 
  'Redirect URLs' as setting_type,
  'https://www.se1a.org/auth/callback' as description
UNION ALL
SELECT 
  'Additional Redirects' as setting_type,
  'https://www.se1a.org/verify-email, https://www.se1a.org/reset-password' as description;

-- بررسی مشکلات احتمالی
SELECT 
  'Common Issues' as issue_type,
  'Potential problems and solutions:' as description
UNION ALL
SELECT 
  '1. Environment Variables' as issue_type,
  'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set' as description
UNION ALL
SELECT 
  '2. Site URL' as issue_type,
  'Site URL not configured in Supabase Dashboard' as description
UNION ALL
SELECT 
  '3. Email Provider' as issue_type,
  'Email provider not enabled in Authentication settings' as description
UNION ALL
SELECT 
  '4. Redirect URLs' as issue_type,
  'Redirect URLs not added to allowed list' as description
UNION ALL
SELECT 
  '5. Rate Limiting' as issue_type,
  'Too many email requests (10 per hour limit)' as description;

-- راهنمای تست
SELECT 
  'Testing Steps' as test_type,
  'How to test the configuration:' as test
UNION ALL
SELECT 
  '1. Check Environment' as test_type,
  'Go to /test-supabase page' as test
UNION ALL
SELECT 
  '2. Test Connection' as test_type,
  'Click "Test Supabase Connection" button' as test
UNION ALL
SELECT 
  '3. Test Sign Up' as test_type,
  'Click "Test Sign Up" button' as test
UNION ALL
SELECT 
  '4. Check Console' as test_type,
  'Open browser console (F12) and check logs' as test
UNION ALL
SELECT 
  '5. Check Network' as test_type,
  'Check Network tab for failed requests' as test;

-- نمایش اطلاعات پروژه
SELECT 
  'Project Information' as info_type,
  'Your Supabase project details:' as description
UNION ALL
SELECT 
  'Project URL' as info_type,
  'Copy from Settings > API > Project URL' as description
UNION ALL
SELECT 
  'Anon Key' as info_type,
  'Copy from Settings > API > anon public' as description
UNION ALL
SELECT 
  'Service Role Key' as info_type,
  'Keep secret - only for server-side operations' as description;

-- راهنمای نهایی
DO $$
BEGIN
  RAISE NOTICE '=== راهنمای نهایی ===';
  RAISE NOTICE '';
  RAISE NOTICE '1. فایل .env.local ایجاد کنید:';
  RAISE NOTICE '   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co';
  RAISE NOTICE '   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key';
  RAISE NOTICE '';
  RAISE NOTICE '2. سرور را restart کنید:';
  RAISE NOTICE '   npm run dev';
  RAISE NOTICE '';
  RAISE NOTICE '3. صفحه تست را باز کنید:';
  RAISE NOTICE '   http://localhost:3000/test-supabase';
  RAISE NOTICE '';
  RAISE NOTICE '4. تنظیمات Supabase Dashboard را بررسی کنید';
  RAISE NOTICE '';
END $$;