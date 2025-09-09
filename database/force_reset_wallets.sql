-- Force reset all wallet data to 0
-- This script will reset all wallet balances to 0

-- 1. Show current state
SELECT 'BEFORE RESET' as status, 
       COUNT(*) as teacher_wallets,
       SUM(balance) as total_balance,
       SUM(total_earned) as total_earned
FROM teacher_wallets;

-- 2. Reset all teacher wallets to 0
UPDATE teacher_wallets 
SET 
    balance = 0.00,
    total_earned = 0.00,
    total_withdrawn = 0.00,
    updated_at = NOW();

-- 3. Reset all student wallets to 0
UPDATE student_wallets 
SET 
    balance = 0.00,
    total_deposited = 0.00,
    total_spent = 0.00,
    updated_at = NOW();

-- 4. Reset academy wallet to 0
UPDATE academy_wallet 
SET 
    balance = 0.00,
    total_commission = 0.00,
    updated_at = NOW();

-- 5. Delete all transactions
DELETE FROM wallet_transactions;

-- 6. Show after state
SELECT 'AFTER RESET' as status, 
       COUNT(*) as teacher_wallets,
       SUM(balance) as total_balance,
       SUM(total_earned) as total_earned
FROM teacher_wallets;

-- 7. Verify all are 0
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
