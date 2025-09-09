-- Check notifications table and data
-- This script shows the current state of notifications

-- 1. Check if notifications table exists
SELECT 
    'Table Check' as section,
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- 2. Check notifications data
SELECT 
    'Notifications Data' as section,
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN read = false THEN 1 END) as unread_notifications,
    COUNT(CASE WHEN read = true THEN 1 END) as read_notifications
FROM notifications;

-- 3. Show recent notifications
SELECT 
    'Recent Notifications' as section,
    id,
    teacher_id,
    type,
    title,
    message,
    read,
    created_at
FROM notifications 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Check if there are any notifications for specific teacher
SELECT 
    'Teacher Notifications' as section,
    teacher_id,
    COUNT(*) as notification_count,
    COUNT(CASE WHEN read = false THEN 1 END) as unread_count
FROM notifications 
GROUP BY teacher_id 
ORDER BY notification_count DESC;
