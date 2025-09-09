-- Check and fix booking notifications
-- This script ensures notifications are created when bookings are made

-- 1. Check if notifications table exists and has correct structure
SELECT 
    'Notifications Table Check' as section,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- 2. Check if there are any existing notifications
SELECT 
    'Existing Notifications' as section,
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN read = false THEN 1 END) as unread_notifications,
    COUNT(CASE WHEN read = true THEN 1 END) as read_notifications
FROM notifications;

-- 3. Check recent bookings
SELECT 
    'Recent Bookings' as section,
    id,
    teacher_id,
    student_name,
    session_type,
    status,
    created_at
FROM bookings 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Check if there are notifications for recent bookings
SELECT 
    'Notifications for Recent Bookings' as section,
    n.id,
    n.teacher_id,
    n.type,
    n.title,
    n.message,
    n.read,
    n.created_at
FROM notifications n
WHERE n.created_at >= NOW() - INTERVAL '1 day'
ORDER BY n.created_at DESC;

-- 5. Create a test notification to verify the system works
INSERT INTO notifications (
    teacher_id,
    user_id,
    type,
    title,
    message,
    read
) VALUES (
    (SELECT id FROM teachers LIMIT 1),
    (SELECT id FROM teachers LIMIT 1),
    'success',
    'تست اعلان',
    'این یک اعلان تستی است برای بررسی عملکرد سیستم',
    false
);

-- 6. Show the test notification
SELECT 
    'Test Notification Created' as section,
    id,
    teacher_id,
    type,
    title,
    message,
    read,
    created_at
FROM notifications 
WHERE title = 'تست اعلان'
ORDER BY created_at DESC 
LIMIT 1;
