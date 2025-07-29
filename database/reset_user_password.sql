-- تنظیم مجدد رمز عبور کاربر
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- نمایش اطلاعات کاربر قبل از تغییر
SELECT 
  'User Before Reset' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'kanapehlife@gmail.com';

-- راهنمای تنظیم مجدد رمز عبور
SELECT 
  'Password Reset Instructions' as instruction_type,
  'To reset password, use Supabase Dashboard or the forgot password feature' as instruction
UNION ALL
SELECT 
  'Option 1: Supabase Dashboard' as instruction_type,
  'Go to Authentication > Users > Find user > Reset password' as instruction
UNION ALL
SELECT 
  'Option 2: Forgot Password' as instruction_type,
  'Use the forgot password feature on the login page' as instruction
UNION ALL
SELECT 
  'Option 3: Manual Reset' as instruction_type,
  'Use Supabase CLI or API to reset password' as instruction;

-- بررسی تنظیمات احراز هویت
SELECT 
  'Auth Settings Check' as check_type,
  'Make sure email confirmation is not required for login' as note;

-- نمایش تمام کاربران برای بررسی
SELECT 
  'All Users' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;