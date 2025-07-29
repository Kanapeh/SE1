-- راه‌حل مشکل Email Rate Limit Exceeded
-- این اسکریپت باید در Supabase SQL Editor اجرا شود

-- بررسی کاربران اخیر که درخواست ایمیل داشته‌اند
SELECT 
  'Recent Email Requests' as check_type,
  id,
  email,
  created_at,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN 'Unconfirmed'
    ELSE 'Confirmed'
  END as status,
  EXTRACT(EPOCH FROM (NOW() - created_at))/60 as minutes_ago
FROM auth.users 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- بررسی تعداد درخواست‌های ایمیل در ساعت گذشته
SELECT 
  'Email Requests in Last Hour' as check_type,
  COUNT(*) as total_requests,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed
FROM auth.users 
WHERE created_at > NOW() - INTERVAL '1 hour';

-- بررسی کاربران با ایمیل‌های تکراری
SELECT 
  'Duplicate Email Check' as check_type,
  email,
  COUNT(*) as count,
  array_agg(id) as user_ids,
  array_agg(created_at) as created_dates
FROM auth.users 
GROUP BY email 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- راهنمای حل مشکل Rate Limit
DO $$
BEGIN
  RAISE NOTICE '=== راه‌حل مشکل Email Rate Limit ===';
  RAISE NOTICE '';
  RAISE NOTICE '1. صبر کنید:';
  RAISE NOTICE '   - Supabase محدودیت 10 درخواست ایمیل در ساعت دارد';
  RAISE NOTICE '   - 60 دقیقه صبر کنید';
  RAISE NOTICE '';
  RAISE NOTICE '2. تنظیمات Supabase Dashboard:';
  RAISE NOTICE '   - Authentication > Settings > Rate Limiting';
  RAISE NOTICE '   - Email rate limits را بررسی کنید';
  RAISE NOTICE '';
  RAISE NOTICE '3. تنظیمات SMTP:';
  RAISE NOTICE '   - Authentication > Email Templates > SMTP Settings';
  RAISE NOTICE '   - از SMTP خود استفاده کنید';
  RAISE NOTICE '';
  RAISE NOTICE '4. تست با ایمیل‌های مختلف:';
  RAISE NOTICE '   - از ایمیل‌های مختلف استفاده کنید';
  RAISE NOTICE '   - از سرویس‌های موقت استفاده کنید';
END $$;

-- بررسی تنظیمات Rate Limiting
SELECT 
  'Rate Limiting Info' as info_type,
  'Supabase Default Limits:' as description
UNION ALL
SELECT 
  'Email Confirmations' as info_type,
  '10 requests per hour per email' as description
UNION ALL
SELECT 
  'Password Reset' as info_type,
  '10 requests per hour per email' as description
UNION ALL
SELECT 
  'Sign Up' as info_type,
  '10 requests per hour per email' as description;

-- راهنمای تنظیمات SMTP
SELECT 
  'SMTP Configuration' as config_type,
  'Steps to configure custom SMTP:' as description
UNION ALL
SELECT 
  '1. Go to Supabase Dashboard' as config_type,
  'Authentication > Email Templates > SMTP Settings' as description
UNION ALL
SELECT 
  '2. Enable Custom SMTP' as config_type,
  'Toggle "Enable Custom SMTP"' as description
UNION ALL
SELECT 
  '3. Configure SMTP Settings' as config_type,
  'Host, Port, Username, Password' as description
UNION ALL
SELECT 
  '4. Test SMTP Connection' as config_type,
  'Click "Test Connection" button' as description;

-- نمونه تنظیمات SMTP برای Gmail
SELECT 
  'Gmail SMTP Settings' as provider,
  'Configuration example:' as description
UNION ALL
SELECT 
  'Host' as provider,
  'smtp.gmail.com' as description
UNION ALL
SELECT 
  'Port' as provider,
  '587' as description
UNION ALL
SELECT 
  'Security' as provider,
  'TLS' as description
UNION ALL
SELECT 
  'Username' as provider,
  'your-email@gmail.com' as description
UNION ALL
SELECT 
  'Password' as provider,
  'your-app-password' as description;

-- راهنمای ایجاد App Password برای Gmail
SELECT 
  'Gmail App Password Setup' as step_type,
  'How to create app password:' as step
UNION ALL
SELECT 
  '1. Enable 2FA' as step_type,
  'Go to Google Account > Security > 2-Step Verification' as step
UNION ALL
SELECT 
  '2. Create App Password' as step_type,
  'Go to Google Account > Security > App Passwords' as step
UNION ALL
SELECT 
  '3. Select App' as step_type,
  'Choose "Mail" and "Other (Custom name)"' as step
UNION ALL
SELECT 
  '4. Generate Password' as step_type,
  'Copy the 16-character password' as step
UNION ALL
SELECT 
  '5. Use in Supabase' as step_type,
  'Paste in SMTP Password field' as step;

-- بررسی کاربران مشکوک
SELECT 
  'Suspicious Users' as check_type,
  id,
  email,
  created_at,
  CASE 
    WHEN email LIKE '%@temp%' OR email LIKE '%@test%' THEN 'Test Email'
    WHEN email LIKE '%@example%' THEN 'Example Email'
    ELSE 'Regular Email'
  END as email_type
FROM auth.users 
WHERE email LIKE '%@temp%' 
   OR email LIKE '%@test%' 
   OR email LIKE '%@example%'
ORDER BY created_at DESC;

-- راهنمای تست ایمیل
SELECT 
  'Email Testing Guide' as guide_type,
  'Safe ways to test email functionality:' as guide
UNION ALL
SELECT 
  '1. Use Real Email' as guide_type,
  'Use your own email address for testing' as guide
UNION ALL
SELECT 
  '2. Wait Between Tests' as guide_type,
  'Wait at least 6 minutes between email requests' as guide
UNION ALL
SELECT 
  '3. Use Different Emails' as guide_type,
  'Use different email addresses for each test' as guide
UNION ALL
SELECT 
  '4. Check Spam Folder' as guide_type,
  'Check spam/junk folder for confirmation emails' as guide
UNION ALL
SELECT 
  '5. Verify Email Manually' as guide_type,
  'Manually confirm email in database if needed' as guide;

-- اسکریپت تایید دستی ایمیل (برای تست)
-- این اسکریپت را فقط برای تست استفاده کنید
SELECT 
  'Manual Email Confirmation' as action_type,
  'To manually confirm an email, run:' as sql_command
UNION ALL
SELECT 
  'UPDATE auth.users' as action_type,
  'SET email_confirmed_at = NOW()' as sql_command
UNION ALL
SELECT 
  'WHERE email = ''your-email@example.com'';' as action_type,
  'Replace with actual email address' as sql_command;