-- Reset wallet data to correct values
-- This script ensures all wallet balances are 0 if no real payments have been made

-- 1. Check current wallet data
SELECT 
    'Before Reset' as status,
    COUNT(*) as total_wallets,
    SUM(balance) as total_balance,
    SUM(total_earned) as total_earned
FROM teacher_wallets;

-- 2. Reset all teacher wallets to 0 (since no real payments have been made)
UPDATE teacher_wallets 
SET 
    balance = 0.00,
    total_earned = 0.00,
    total_withdrawn = 0.00,
    updated_at = NOW()
WHERE balance > 0 OR total_earned > 0;

-- 3. Reset all student wallets to 0
UPDATE student_wallets 
SET 
    balance = 0.00,
    total_deposited = 0.00,
    total_spent = 0.00,
    updated_at = NOW()
WHERE balance > 0 OR total_deposited > 0;

-- 4. Reset academy wallet to 0
UPDATE academy_wallet 
SET 
    balance = 0.00,
    total_commission = 0.00,
    updated_at = NOW()
WHERE balance > 0 OR total_commission > 0;

-- 5. Delete all wallet transactions (since they're not real)
DELETE FROM wallet_transactions;

-- 6. Check wallet data after reset
SELECT 
    'After Reset' as status,
    COUNT(*) as total_wallets,
    SUM(balance) as total_balance,
    SUM(total_earned) as total_earned
FROM teacher_wallets;

-- 7. Verify all wallets are now 0
SELECT 
    'teacher_wallets' as table_name,
    COUNT(*) as total_wallets,
    SUM(balance) as total_balance,
    SUM(total_earned) as total_earned
FROM teacher_wallets
UNION ALL
SELECT 
    'student_wallets' as table_name,
    COUNT(*) as total_wallets,
    SUM(balance) as total_balance,
    SUM(total_deposited) as total_deposited
FROM student_wallets
UNION ALL
SELECT 
    'academy_wallet' as table_name,
    COUNT(*) as total_wallets,
    SUM(balance) as total_balance,
    SUM(total_commission) as total_commission
FROM academy_wallet;

-- 8. Check if there are any remaining transactions
SELECT COUNT(*) as remaining_transactions FROM wallet_transactions;
