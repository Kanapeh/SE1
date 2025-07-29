-- تایید ایمیل کاربر برای تست
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- تایید ایمیل کاربر
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'kanapehlife@gmail.com';

-- بررسی نتیجه
SELECT 
  'Email Confirmation Result' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'kanapehlife@gmail.com';

-- نمایش پیام موفقیت
SELECT 
  'Success' as status,
  'Email confirmed successfully. User can now login.' as message;