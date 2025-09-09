-- Test wallet system to ensure it's working correctly
-- This script checks the current state of the wallet system

-- 1. Check if teacher_wallets table exists and has data
SELECT 
    'teacher_wallets' as table_name,
    COUNT(*) as total_wallets,
    COUNT(CASE WHEN balance > 0 THEN 1 END) as wallets_with_balance,
    SUM(balance) as total_balance,
    SUM(total_earned) as total_earned
FROM teacher_wallets;

-- 2. Check if student_wallets table exists and has data
SELECT 
    'student_wallets' as table_name,
    COUNT(*) as total_wallets,
    COUNT(CASE WHEN balance > 0 THEN 1 END) as wallets_with_balance,
    SUM(balance) as total_balance,
    SUM(total_deposited) as total_deposited
FROM student_wallets;

-- 3. Check if academy_wallet table exists and has data
SELECT 
    'academy_wallet' as table_name,
    COUNT(*) as total_wallets,
    SUM(balance) as total_balance,
    SUM(total_commission) as total_commission
FROM academy_wallet;

-- 4. Check wallet_transactions table
SELECT 
    'wallet_transactions' as table_name,
    COUNT(*) as total_transactions,
    SUM(amount) as total_amount,
    COUNT(CASE WHEN wallet_type = 'teacher' THEN 1 END) as teacher_transactions,
    COUNT(CASE WHEN wallet_type = 'student' THEN 1 END) as student_transactions,
    COUNT(CASE WHEN wallet_type = 'academy' THEN 1 END) as academy_transactions
FROM wallet_transactions;

-- 5. Show recent transactions
SELECT 
    wt.id,
    wt.wallet_type,
    wt.transaction_type,
    wt.amount,
    wt.description,
    wt.created_at,
    CASE 
        WHEN wt.wallet_type = 'teacher' THEN tw.teacher_id::text
        WHEN wt.wallet_type = 'student' THEN sw.student_id::text
        ELSE 'academy'
    END as user_id
FROM wallet_transactions wt
LEFT JOIN teacher_wallets tw ON wt.wallet_id = tw.id AND wt.wallet_type = 'teacher'
LEFT JOIN student_wallets sw ON wt.wallet_id = sw.id AND wt.wallet_type = 'student'
ORDER BY wt.created_at DESC
LIMIT 10;

-- 6. Show all teacher wallets
SELECT 
    tw.id as wallet_id,
    tw.teacher_id,
    t.first_name,
    t.last_name,
    tw.balance,
    tw.total_earned,
    tw.total_withdrawn,
    tw.created_at
FROM teacher_wallets tw
LEFT JOIN teachers t ON tw.teacher_id = t.id
ORDER BY tw.created_at DESC;
