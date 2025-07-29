-- بررسی تنظیمات ایمیل و احراز هویت Supabase
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- بررسی تنظیمات احراز هویت
SELECT 
  'Auth Settings' as check_type,
  'Check Supabase Dashboard > Authentication > Settings' as description;

-- بررسی وجود کاربران در auth.users
SELECT 
  'User Count' as check_type,
  COUNT(*) as user_count
FROM auth.users;

-- بررسی کاربران تایید نشده
SELECT 
  'Unconfirmed Users' as check_type,
  COUNT(*) as unconfirmed_count
FROM auth.users 
WHERE email_confirmed_at IS NULL;

-- بررسی کاربران تایید شده
SELECT 
  'Confirmed Users' as check_type,
  COUNT(*) as confirmed_count
FROM auth.users 
WHERE email_confirmed_at IS NOT NULL;

-- نمایش کاربران اخیر
SELECT 
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
  'RLS Status' as check_type,
  schemaname = 'public' AND tablename = 'auth-users' AND rowsecurity = true as rls_enabled
FROM pg_tables 
WHERE tablename = 'auth-users';

-- بررسی policies برای جدول auth-users
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

-- بررسی توابع احراز هویت
SELECT 
  proname as function_name,
  proargtypes::regtype[] as argument_types,
  prorettype::regtype as return_type
FROM pg_proc 
WHERE proname IN ('is_admin', 'is_teacher', 'get_user_role')
ORDER BY proname;

-- بررسی تنظیمات SMTP (اگر وجود دارد)
-- این بخش نیاز به دسترسی admin دارد
DO $$
BEGIN
  RAISE NOTICE 'برای بررسی تنظیمات SMTP، به Supabase Dashboard > Authentication > Email Templates بروید';
  RAISE NOTICE 'و موارد زیر را بررسی کنید:';
  RAISE NOTICE '1. Enable Email Confirmations';
  RAISE NOTICE '2. Enable Password Reset';
  RAISE NOTICE '3. SMTP Settings (اختیاری)';
  RAISE NOTICE '4. Site URL';
  RAISE NOTICE '5. Redirect URLs';
END $$;

-- نمایش اطلاعات مفید برای عیب‌یابی
SELECT 
  'Troubleshooting Info' as info_type,
  'Check the following in Supabase Dashboard:' as description
UNION ALL
SELECT 
  '1. Authentication > Settings' as info_type,
  'Verify Site URL and Redirect URLs' as description
UNION ALL
SELECT 
  '2. Authentication > Email Templates' as info_type,
  'Enable Password Reset template' as description
UNION ALL
SELECT 
  '3. Authentication > Providers' as info_type,
  'Verify Email provider is enabled' as description
UNION ALL
SELECT 
  '4. Project Settings > API' as info_type,
  'Check API keys and URLs' as description;

-- بررسی تنظیمات محیطی مورد نیاز
SELECT 
  'Environment Variables' as check_type,
  'Required for password reset:' as description
UNION ALL
SELECT 
  'NEXT_PUBLIC_SUPABASE_URL' as check_type,
  'Should be set in .env.local' as description
UNION ALL
SELECT 
  'NEXT_PUBLIC_SUPABASE_ANON_KEY' as check_type,
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