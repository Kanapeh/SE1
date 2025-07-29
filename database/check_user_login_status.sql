-- بررسی وضعیت ورود کاربر
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- بررسی کاربر در auth.users
SELECT 
  'User in auth.users' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN 'Email Not Confirmed'
    ELSE 'Email Confirmed'
  END as email_status
FROM auth.users 
WHERE email = 'kanapehlife@gmail.com';

-- بررسی کاربر در جدول auth-users
SELECT 
  'User in auth-users table' as check_type,
  id,
  email,
  role,
  is_admin,
  first_name,
  last_name,
  created_at,
  updated_at
FROM "auth-users" 
WHERE email = 'kanapehlife@gmail.com';

-- بررسی کاربر در جدول admins
SELECT 
  'User in admins table' as check_type,
  user_id,
  full_name,
  role,
  created_at
FROM admins 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'kanapehlife@gmail.com'
);

-- بررسی کامل وضعیت کاربر
SELECT 
  'Complete User Status' as check_type,
  au.id as auth_user_id,
  au.email,
  au.email_confirmed_at,
  au.last_sign_in_at,
  aru.role as auth_users_role,
  aru.is_admin as auth_users_is_admin,
  adm.user_id as admin_user_id,
  adm.role as admin_role,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN 'Email Not Confirmed'
    WHEN adm.user_id IS NOT NULL THEN 'Admin User'
    WHEN aru.role = 'admin' OR aru.is_admin = true THEN 'Admin by Role'
    ELSE 'Regular User'
  END as user_status
FROM auth.users au
LEFT JOIN "auth-users" aru ON au.id = aru.id
LEFT JOIN admins adm ON au.id = adm.user_id
WHERE au.email = 'kanapehlife@gmail.com';

-- بررسی مشکلات احتمالی
SELECT 
  'Potential Issues' as issue_type,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN 'Email not confirmed - user cannot login'
    WHEN adm.user_id IS NULL AND (aru.role != 'admin' AND aru.is_admin != true) THEN 'User not admin in any table'
    WHEN aru.id IS NULL THEN 'User missing from auth-users table'
    ELSE 'No obvious issues'
  END as issue_description
FROM auth.users au
LEFT JOIN "auth-users" aru ON au.id = aru.id
LEFT JOIN admins adm ON au.id = adm.user_id
WHERE au.email = 'kanapehlife@gmail.com';

-- نمایش تمام کاربران ادمین
SELECT 
  'All Admin Users' as check_type,
  au.email,
  au.email_confirmed_at,
  aru.role as auth_users_role,
  aru.is_admin as auth_users_is_admin,
  adm.role as admin_role,
  CASE 
    WHEN adm.user_id IS NOT NULL THEN 'Admin Table'
    WHEN aru.role = 'admin' OR aru.is_admin = true THEN 'Auth-Users Table'
    ELSE 'Not Admin'
  END as admin_source
FROM auth.users au
LEFT JOIN "auth-users" aru ON au.id = aru.id
LEFT JOIN admins adm ON au.id = adm.user_id
WHERE adm.user_id IS NOT NULL 
   OR aru.role = 'admin' 
   OR aru.is_admin = true
ORDER BY au.created_at DESC;

-- بررسی تنظیمات احراز هویت
SELECT 
  'Auth Settings Check' as check_type,
  'Make sure email confirmation is not required for login' as note;

-- راهنمای حل مشکل
SELECT 
  'Troubleshooting Steps' as step_type,
  '1. Check if email is confirmed in auth.users' as step
UNION ALL
SELECT 
  '2. Verify user exists in auth-users table' as step_type,
  '3. Confirm user is in admins table' as step
UNION ALL
SELECT 
  '4. Check password in auth.users' as step_type,
  '5. Try resetting password' as step
UNION ALL
SELECT 
  '6. Verify admin access functions' as step_type,
  '7. Check middleware and layout protection' as step;