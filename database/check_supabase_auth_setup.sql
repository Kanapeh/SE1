-- بررسی تنظیمات احراز هویت Supabase
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- بررسی تنظیمات احراز هویت
SELECT 
  'Auth Settings Check' as check_type,
  'Check Supabase Dashboard > Authentication > Settings' as description;

-- بررسی وجود کاربران در auth.users
SELECT 
  'User Count' as check_type,
  COUNT(*) as user_count
FROM auth.users;

-- بررسی کاربران اخیر
SELECT 
  'Recent Users' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN 'Unconfirmed'
    ELSE 'Confirmed'
  END as status
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- بررسی تنظیمات RLS برای جدول auth-users
SELECT 
  'RLS Status for auth-users' as check_type,
  schemaname = 'public' AND tablename = 'auth-users' AND rowsecurity = true as rls_enabled
FROM pg_tables 
WHERE tablename = 'auth-users';

-- بررسی policies برای جدول auth-users
SELECT 
  'Policies for auth-users' as check_type,
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

-- بررسی تنظیمات احراز هویت
DO $$
BEGIN
  RAISE NOTICE 'برای بررسی تنظیمات احراز هویت، به Supabase Dashboard بروید:';
  RAISE NOTICE '1. Authentication > Settings';
  RAISE NOTICE '2. Authentication > Providers';
  RAISE NOTICE '3. Authentication > Email Templates';
  RAISE NOTICE '4. Authentication > URL Configuration';
END $$;

-- بررسی مشکلات احتمالی
SELECT 
  'Potential Issues' as issue_type,
  'Check the following:' as description
UNION ALL
SELECT 
  '1. Email Provider' as issue_type,
  'Make sure Email provider is enabled' as description
UNION ALL
SELECT 
  '2. Email Templates' as issue_type,
  'Enable Email Confirmations and Password Reset' as description
UNION ALL
SELECT 
  '3. Site URL' as issue_type,
  'Set correct Site URL in Authentication > Settings' as description
UNION ALL
SELECT 
  '4. Redirect URLs' as issue_type,
  'Add your domain to Redirect URLs' as description
UNION ALL
SELECT 
  '5. Environment Variables' as issue_type,
  'Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY' as description;

-- بررسی تنظیمات محیطی مورد نیاز
SELECT 
  'Environment Variables' as config_type,
  'Required for registration:' as description
UNION ALL
SELECT 
  'NEXT_PUBLIC_SUPABASE_URL' as config_type,
  'Should be set in .env.local' as description
UNION ALL
SELECT 
  'NEXT_PUBLIC_SUPABASE_ANON_KEY' as config_type,
  'Should be set in .env.local' as description;

-- نمایش نمونه تنظیمات برای .env.local
SELECT 
  'Sample .env.local' as config_type,
  'Add these to your .env.local file:' as description
UNION ALL
SELECT 
  'NEXT_PUBLIC_SUPABASE_URL' as config_type,
  'https://your-project.supabase.co' as description
UNION ALL
SELECT 
  'NEXT_PUBLIC_SUPABASE_ANON_KEY' as config_type,
  'your-anon-key-here' as description;

-- بررسی تنظیمات احراز هویت پیشرفته
SELECT 
  'Advanced Auth Settings' as check_type,
  'Check these settings in Supabase Dashboard:' as description
UNION ALL
SELECT 
  'Enable Email Confirmations' as check_type,
  'Should be enabled for registration' as description
UNION ALL
SELECT 
  'Enable Password Reset' as check_type,
  'Should be enabled for password recovery' as description
UNION ALL
SELECT 
  'Enable Email Change' as check_type,
  'Optional: for email change functionality' as description
UNION ALL
SELECT 
  'Enable Phone Confirmations' as check_type,
  'Optional: for phone verification' as description;

-- راهنمای عیب‌یابی
SELECT 
  'Troubleshooting Steps' as step_type,
  'Follow these steps to fix registration issues:' as step
UNION ALL
SELECT 
  '1. Check Environment Variables' as step_type,
  'Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set' as step
UNION ALL
SELECT 
  '2. Enable Email Provider' as step_type,
  'Go to Authentication > Providers > Email and enable it' as step
UNION ALL
SELECT 
  '3. Configure Email Templates' as step_type,
  'Go to Authentication > Email Templates and enable required templates' as step
UNION ALL
SELECT 
  '4. Set Site URL' as step_type,
  'Go to Authentication > Settings and set correct Site URL' as step
UNION ALL
SELECT 
  '5. Add Redirect URLs' as step_type,
  'Add your domain URLs to Redirect URLs list' as step
UNION ALL
SELECT 
  '6. Test Registration' as step_type,
  'Try registering a new user and check console logs' as step;