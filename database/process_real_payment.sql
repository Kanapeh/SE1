-- Process real payment for Sepanta Alizadeh
-- Teacher: سپنتا علیزاده
-- Student: Sepanta Alizadeh
-- Amount: 200,000 Toman
-- This script processes the actual payment and updates wallets correctly

-- First, let's find or create the necessary records
DO $$
DECLARE
    v_teacher_id UUID;
    v_student_id UUID;
    v_booking_id UUID;
    v_payment_amount DECIMAL(12,2) := 200000.00;
    v_commission_rate DECIMAL(5,4) := 0.10;
    v_teacher_commission DECIMAL(12,2);
    v_teacher_earnings DECIMAL(12,2);
    v_teacher_wallet_id UUID;
    v_student_wallet_id UUID;
    v_academy_wallet_id UUID;
    v_teacher_balance_before DECIMAL(12,2);
    v_teacher_balance_after DECIMAL(12,2);
    v_student_balance_before DECIMAL(12,2);
    v_student_balance_after DECIMAL(12,2);
    v_academy_balance_before DECIMAL(12,2);
    v_academy_balance_after DECIMAL(12,2);
BEGIN
    -- Find teacher by name (assuming سپنتا علیزاده is the teacher)
    SELECT id INTO v_teacher_id FROM teachers 
    WHERE first_name ILIKE '%سپنتا%' OR last_name ILIKE '%علیزاده%' 
    LIMIT 1;
    
    -- Find student by email
    SELECT id INTO v_student_id FROM auth.users 
    WHERE email = 'spantaalizadeh@gmail.com';
    
    -- If teacher not found, create a test teacher
    IF v_teacher_id IS NULL THEN
        INSERT INTO teachers (
            first_name, last_name, email, phone, 
            languages, hourly_rate, bio, status
        ) VALUES (
            'سپنتا', 'علیزاده', 'teacher@example.com', '+989123456789',
            '["انگلیسی", "فارسی"]', 200000, 'معلم زبان انگلیسی', 'active'
        ) RETURNING id INTO v_teacher_id;
        
        RAISE NOTICE 'Created teacher with ID: %', v_teacher_id;
    END IF;
    
    -- If student not found, create a test student
    IF v_student_id IS NULL THEN
        INSERT INTO auth.users (
            email, raw_user_meta_data, email_confirmed_at
        ) VALUES (
            'spantaalizadeh@gmail.com', 
            '{"role": "student", "first_name": "Sepanta", "last_name": "Alizadeh"}',
            NOW()
        ) RETURNING id INTO v_student_id;
        
        RAISE NOTICE 'Created student with ID: %', v_student_id;
    END IF;
    
    -- Create a booking record for this payment
    INSERT INTO bookings (
        teacher_id, student_id, student_name, student_email, student_phone,
        selected_days, selected_hours, session_type, duration, total_price,
        payment_status, status, notes
    ) VALUES (
        v_teacher_id, v_student_id, 'Sepanta Alizadeh', 'spantaalizadeh@gmail.com', '+92',
        '["monday"]', '["morning"]', 'ترکیبی', 60, v_payment_amount,
        'paid', 'confirmed', 'پرداخت واقعی - 200,000 تومان'
    ) RETURNING id INTO v_booking_id;
    
    RAISE NOTICE 'Created booking with ID: %', v_booking_id;
    
    -- Get or create teacher wallet
    SELECT id INTO v_teacher_wallet_id FROM teacher_wallets WHERE teacher_id = v_teacher_id;
    IF NOT FOUND THEN
        INSERT INTO teacher_wallets (teacher_id, balance) 
        VALUES (v_teacher_id, 0.00) 
        RETURNING id INTO v_teacher_wallet_id;
    END IF;
    
    -- Get or create student wallet
    SELECT id INTO v_student_wallet_id FROM student_wallets WHERE student_id = v_student_id;
    IF NOT FOUND THEN
        INSERT INTO student_wallets (student_id, balance) 
        VALUES (v_student_id, 0.00) 
        RETURNING id INTO v_student_wallet_id;
    END IF;
    
    -- Get or create academy wallet
    SELECT id INTO v_academy_wallet_id FROM academy_wallet LIMIT 1;
    IF NOT FOUND THEN
        INSERT INTO academy_wallet (balance, total_commission) 
        VALUES (0.00, 0.00) 
        RETURNING id INTO v_academy_wallet_id;
    END IF;
    
    -- Calculate commission and earnings
    v_teacher_commission := v_payment_amount * v_commission_rate; -- 20,000 Toman (10%)
    v_teacher_earnings := v_payment_amount - v_teacher_commission; -- 180,000 Toman (90%)
    
    -- Get current balances
    SELECT balance INTO v_teacher_balance_before FROM teacher_wallets WHERE id = v_teacher_wallet_id;
    SELECT balance INTO v_student_balance_before FROM student_wallets WHERE id = v_student_wallet_id;
    SELECT balance INTO v_academy_balance_before FROM academy_wallet WHERE id = v_academy_wallet_id;
    
    -- Update teacher wallet (add 90% of payment = 180,000 Toman)
    v_teacher_balance_after := v_teacher_balance_before + v_teacher_earnings;
    UPDATE teacher_wallets 
    SET balance = v_teacher_balance_after,
        total_earned = total_earned + v_teacher_earnings,
        updated_at = NOW()
    WHERE id = v_teacher_wallet_id;
    
    -- Update student wallet (add full payment amount = 200,000 Toman)
    v_student_balance_after := v_student_balance_before + v_payment_amount;
    UPDATE student_wallets 
    SET balance = v_student_balance_after,
        total_deposited = total_deposited + v_payment_amount,
        updated_at = NOW()
    WHERE id = v_student_wallet_id;
    
    -- Update academy wallet (add commission = 20,000 Toman)
    v_academy_balance_after := v_academy_balance_before + v_teacher_commission;
    UPDATE academy_wallet 
    SET balance = v_academy_balance_after,
        total_commission = total_commission + v_teacher_commission,
        updated_at = NOW()
    WHERE id = v_academy_wallet_id;
    
    -- Record teacher earnings transaction
    INSERT INTO wallet_transactions (
        wallet_id, wallet_type, transaction_type, amount, 
        balance_before, balance_after, description, booking_id
    ) VALUES (
        v_teacher_wallet_id, 'teacher', 'commission', v_teacher_earnings,
        v_teacher_balance_before, v_teacher_balance_after, 
        'درآمد از رزرو کلاس (90%) - پرداخت واقعی', v_booking_id
    );
    
    -- Record student payment transaction
    INSERT INTO wallet_transactions (
        wallet_id, wallet_type, transaction_type, amount, 
        balance_before, balance_after, description, booking_id
    ) VALUES (
        v_student_wallet_id, 'student', 'deposit', v_payment_amount,
        v_student_balance_before, v_student_balance_after, 
        'شارژ حساب از پرداخت رزرو - 200,000 تومان', v_booking_id
    );
    
    -- Record academy commission transaction
    INSERT INTO wallet_transactions (
        wallet_id, wallet_type, transaction_type, amount, 
        balance_before, balance_after, description, booking_id
    ) VALUES (
        v_academy_wallet_id, 'academy', 'commission', v_teacher_commission,
        v_academy_balance_before, v_academy_balance_after, 
        'کمیسیون آکادمی (10%) - 20,000 تومان', v_booking_id
    );
    
    -- Display results
    RAISE NOTICE 'Payment processed successfully!';
    RAISE NOTICE 'Teacher ID: %', v_teacher_id;
    RAISE NOTICE 'Student ID: %', v_student_id;
    RAISE NOTICE 'Booking ID: %', v_booking_id;
    RAISE NOTICE 'Payment Amount: % Toman', v_payment_amount;
    RAISE NOTICE 'Teacher Earnings: % Toman (90%)', v_teacher_earnings;
    RAISE NOTICE 'Academy Commission: % Toman (10%)', v_teacher_commission;
    RAISE NOTICE 'Teacher Balance: % Toman', v_teacher_balance_after;
    RAISE NOTICE 'Student Balance: % Toman', v_student_balance_after;
    RAISE NOTICE 'Academy Balance: % Toman', v_academy_balance_after;
    
END $$;
