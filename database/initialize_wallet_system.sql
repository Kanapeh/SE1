-- Initialize wallet system for existing teachers
-- This script creates wallets for all existing teachers and students

-- 1. Create teacher wallets for all existing teachers
INSERT INTO teacher_wallets (teacher_id, balance, total_earned)
SELECT 
    id as teacher_id,
    0.00 as balance,
    0.00 as total_earned
FROM teachers
WHERE id NOT IN (SELECT teacher_id FROM teacher_wallets)
ON CONFLICT (teacher_id) DO NOTHING;

-- 2. Create student wallets for all existing students
INSERT INTO student_wallets (student_id, balance, total_deposited)
SELECT 
    id as student_id,
    0.00 as balance,
    0.00 as total_deposited
FROM auth.users
WHERE id NOT IN (SELECT student_id FROM student_wallets)
ON CONFLICT (student_id) DO NOTHING;

-- 3. Create academy wallet if it doesn't exist
INSERT INTO academy_wallet (balance, total_commission)
VALUES (0.00, 0.00)
ON CONFLICT DO NOTHING;

-- 4. Check current wallet status
SELECT 
    'teacher_wallets' as table_name,
    COUNT(*) as count,
    SUM(balance) as total_balance,
    SUM(total_earned) as total_earned
FROM teacher_wallets
UNION ALL
SELECT 
    'student_wallets' as table_name,
    COUNT(*) as count,
    SUM(balance) as total_balance,
    SUM(total_deposited) as total_deposited
FROM student_wallets
UNION ALL
SELECT 
    'academy_wallet' as table_name,
    COUNT(*) as count,
    SUM(balance) as total_balance,
    SUM(total_commission) as total_commission
FROM academy_wallet;

-- 5. Check if there are any transactions
SELECT 
    'wallet_transactions' as table_name,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM wallet_transactions;

-- 6. Show recent transactions
SELECT 
    wt.*,
    tw.teacher_id,
    sw.student_id
FROM wallet_transactions wt
LEFT JOIN teacher_wallets tw ON wt.wallet_id = tw.id AND wt.wallet_type = 'teacher'
LEFT JOIN student_wallets sw ON wt.wallet_id = sw.id AND wt.wallet_type = 'student'
ORDER BY wt.created_at DESC
LIMIT 10;
