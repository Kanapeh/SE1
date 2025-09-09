-- Check current wallet status
-- This script shows the current state of all wallets

-- 1. Show all teacher wallets
SELECT 
    'Teacher Wallets' as section,
    tw.id as wallet_id,
    tw.teacher_id,
    t.first_name,
    t.last_name,
    tw.balance,
    tw.total_earned,
    tw.total_withdrawn,
    tw.created_at,
    tw.updated_at
FROM teacher_wallets tw
LEFT JOIN teachers t ON tw.teacher_id = t.id
ORDER BY tw.created_at DESC;

-- 2. Show all student wallets
SELECT 
    'Student Wallets' as section,
    sw.id as wallet_id,
    sw.student_id,
    sw.balance,
    sw.total_deposited,
    sw.total_spent,
    sw.created_at,
    sw.updated_at
FROM student_wallets sw
ORDER BY sw.created_at DESC;

-- 3. Show academy wallet
SELECT 
    'Academy Wallet' as section,
    aw.id as wallet_id,
    aw.balance,
    aw.total_commission,
    aw.created_at,
    aw.updated_at
FROM academy_wallet aw;

-- 4. Show all wallet transactions
SELECT 
    'Wallet Transactions' as section,
    wt.id as transaction_id,
    wt.wallet_type,
    wt.transaction_type,
    wt.amount,
    wt.balance_before,
    wt.balance_after,
    wt.description,
    wt.booking_id,
    wt.created_at
FROM wallet_transactions wt
ORDER BY wt.created_at DESC;

-- 5. Summary
SELECT 
    'Summary' as section,
    'teacher_wallets' as table_name,
    COUNT(*) as count,
    SUM(balance) as total_balance,
    SUM(total_earned) as total_earned
FROM teacher_wallets
UNION ALL
SELECT 
    'Summary' as section,
    'student_wallets' as table_name,
    COUNT(*) as count,
    SUM(balance) as total_balance,
    SUM(total_deposited) as total_deposited
FROM student_wallets
UNION ALL
SELECT 
    'Summary' as section,
    'academy_wallet' as table_name,
    COUNT(*) as count,
    SUM(balance) as total_balance,
    SUM(total_commission) as total_commission
FROM academy_wallet
UNION ALL
SELECT 
    'Summary' as section,
    'wallet_transactions' as table_name,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    0 as other
FROM wallet_transactions;
