-- Add an unread notification for testing
-- This script adds a new unread notification to test the recent activities section

-- 1. Add a new unread notification
INSERT INTO public.notifications (
    teacher_id,
    type,
    title,
    message,
    read,
    created_at
) VALUES (
    '5b60e402-ebc9-4424-bc28-a79b95853cd2',
    'booking',
    'کلاس جدید رزرو شد',
    'احمد رضایی کلاس فرانسوی سطح پیشرفته را برای دوشنبه عصر رزرو کرد',
    false,
    NOW()
);

-- 2. Add another unread notification
INSERT INTO public.notifications (
    teacher_id,
    type,
    title,
    message,
    read,
    created_at
) VALUES (
    '5b60e402-ebc9-4424-bc28-a79b95853cd2',
    'payment',
    'پرداخت جدید دریافت شد',
    'پرداخت کلاس آلمانی سطح متوسط با مبلغ 200,000 تومان دریافت شد',
    false,
    NOW() - INTERVAL '30 minutes'
);

-- 3. Show current notifications for this teacher
SELECT 
    'Current Notifications' as status,
    id,
    type,
    title,
    message,
    read,
    created_at
FROM public.notifications 
WHERE teacher_id = '5b60e402-ebc9-4424-bc28-a79b95853cd2'
ORDER BY created_at DESC;

-- 4. Show summary
SELECT 
    'Summary' as status,
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN read = false THEN 1 END) as unread_notifications,
    COUNT(CASE WHEN read = true THEN 1 END) as read_notifications
FROM public.notifications 
WHERE teacher_id = '5b60e402-ebc9-4424-bc28-a79b95853cd2';
