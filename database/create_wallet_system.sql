-- Create wallet system for teachers and students
-- This system handles payments, commissions, and wallet balances

-- Create teacher_wallets table
CREATE TABLE IF NOT EXISTS teacher_wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  balance DECIMAL(12,2) DEFAULT 0.00,
  total_earned DECIMAL(12,2) DEFAULT 0.00,
  total_withdrawn DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id)
);

-- Create student_wallets table
CREATE TABLE IF NOT EXISTS student_wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(12,2) DEFAULT 0.00,
  total_deposited DECIMAL(12,2) DEFAULT 0.00,
  total_spent DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id)
);

-- Create academy_wallet table
CREATE TABLE IF NOT EXISTS academy_wallet (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  balance DECIMAL(12,2) DEFAULT 0.00,
  total_commission DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet_transactions table for tracking all transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL,
  wallet_type VARCHAR(10) NOT NULL CHECK (wallet_type IN ('teacher', 'student', 'academy')),
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'payment', 'commission', 'refund')),
  amount DECIMAL(12,2) NOT NULL,
  balance_before DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  description TEXT,
  booking_id UUID REFERENCES bookings(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teacher_wallets_teacher_id ON teacher_wallets(teacher_id);
CREATE INDEX IF NOT EXISTS idx_student_wallets_student_id ON student_wallets(student_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_booking_id ON wallet_transactions(booking_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_wallet_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_teacher_wallets_updated_at 
    BEFORE UPDATE ON teacher_wallets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_wallet_updated_at();

CREATE TRIGGER update_student_wallets_updated_at 
    BEFORE UPDATE ON student_wallets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_wallet_updated_at();

-- Enable RLS
ALTER TABLE teacher_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for teacher_wallets
CREATE POLICY "Teachers can view their own wallet" ON teacher_wallets
    FOR SELECT USING (teacher_id IN (
        SELECT id FROM teachers WHERE id = teacher_id
    ));

CREATE POLICY "Teachers can update their own wallet" ON teacher_wallets
    FOR UPDATE USING (teacher_id IN (
        SELECT id FROM teachers WHERE id = teacher_id
    ));

-- Create RLS policies for student_wallets
CREATE POLICY "Students can view their own wallet" ON student_wallets
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can update their own wallet" ON student_wallets
    FOR UPDATE USING (auth.uid() = student_id);

-- Create RLS policies for wallet_transactions
CREATE POLICY "Users can view their own transactions" ON wallet_transactions
    FOR SELECT USING (
        (wallet_type = 'teacher' AND wallet_id IN (
            SELECT id FROM teacher_wallets WHERE teacher_id IN (
                SELECT id FROM teachers WHERE id = teacher_id
            )
        )) OR
        (wallet_type = 'student' AND wallet_id IN (
            SELECT id FROM student_wallets WHERE student_id = auth.uid()
        )) OR
        (wallet_type = 'academy' AND auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        ))
    );

-- Add policy for admins to manage all wallets
CREATE POLICY "Admins can manage all wallets" ON teacher_wallets
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can manage all student wallets" ON student_wallets
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create RLS policies for academy_wallet
CREATE POLICY "Admins can manage academy wallet" ON academy_wallet
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can manage all transactions" ON wallet_transactions
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create function to process payment and update wallets
CREATE OR REPLACE FUNCTION process_booking_payment(
  p_booking_id UUID,
  p_payment_amount DECIMAL(12,2),
  p_commission_rate DECIMAL(5,4) DEFAULT 0.10
)
RETURNS JSON AS $$
DECLARE
  v_booking RECORD;
  v_teacher_wallet_id UUID;
  v_student_wallet_id UUID;
  v_teacher_commission DECIMAL(12,2);
  v_teacher_balance_before DECIMAL(12,2);
  v_teacher_balance_after DECIMAL(12,2);
  v_student_balance_before DECIMAL(12,2);
  v_student_balance_after DECIMAL(12,2);
BEGIN
  -- Get booking details
  SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Booking not found');
  END IF;

  -- Get or create teacher wallet
  SELECT id INTO v_teacher_wallet_id FROM teacher_wallets WHERE teacher_id = v_booking.teacher_id;
  IF NOT FOUND THEN
    INSERT INTO teacher_wallets (teacher_id, balance) 
    VALUES (v_booking.teacher_id, 0.00) 
    RETURNING id INTO v_teacher_wallet_id;
  END IF;

  -- Get or create student wallet
  SELECT id INTO v_student_wallet_id FROM student_wallets WHERE student_id = v_booking.student_id;
  IF NOT FOUND THEN
    INSERT INTO student_wallets (student_id, balance) 
    VALUES (v_booking.student_id, 0.00) 
    RETURNING id INTO v_student_wallet_id;
  END IF;

  -- Get or create academy wallet
  DECLARE
    v_academy_wallet_id UUID;
    v_academy_balance_before DECIMAL(12,2);
    v_academy_balance_after DECIMAL(12,2);
  BEGIN
    SELECT id INTO v_academy_wallet_id FROM academy_wallet LIMIT 1;
    IF NOT FOUND THEN
      INSERT INTO academy_wallet (balance, total_commission) 
      VALUES (0.00, 0.00) 
      RETURNING id INTO v_academy_wallet_id;
    END IF;

  -- Calculate commission (10% by default) - this goes to academy
  v_teacher_commission := p_payment_amount * p_commission_rate;

    -- Get current balances
    SELECT balance INTO v_teacher_balance_before FROM teacher_wallets WHERE id = v_teacher_wallet_id;
    SELECT balance INTO v_student_balance_before FROM student_wallets WHERE id = v_student_wallet_id;
    SELECT balance INTO v_academy_balance_before FROM academy_wallet WHERE id = v_academy_wallet_id;

  -- Calculate teacher earnings (90% of payment amount)
  DECLARE
    v_teacher_earnings DECIMAL(12,2);
  BEGIN
    v_teacher_earnings := p_payment_amount - v_teacher_commission;
    
    -- Update teacher wallet (add 90% of payment)
    v_teacher_balance_after := v_teacher_balance_before + v_teacher_earnings;
    UPDATE teacher_wallets 
    SET balance = v_teacher_balance_after,
        total_earned = total_earned + v_teacher_earnings
    WHERE id = v_teacher_wallet_id;

    -- Update student wallet (add full payment amount)
    v_student_balance_after := v_student_balance_before + p_payment_amount;
    UPDATE student_wallets 
    SET balance = v_student_balance_after,
        total_deposited = total_deposited + p_payment_amount
    WHERE id = v_student_wallet_id;

    -- Update academy wallet (add commission)
    v_academy_balance_after := v_academy_balance_before + v_teacher_commission;
    UPDATE academy_wallet 
    SET balance = v_academy_balance_after,
        total_commission = total_commission + v_teacher_commission
    WHERE id = v_academy_wallet_id;

    -- Record teacher earnings transaction
    INSERT INTO wallet_transactions (
      wallet_id, wallet_type, transaction_type, amount, 
      balance_before, balance_after, description, booking_id
    ) VALUES (
      v_teacher_wallet_id, 'teacher', 'commission', v_teacher_earnings,
      v_teacher_balance_before, v_teacher_balance_after, 
      'درآمد از رزرو کلاس (90%)', p_booking_id
    );

    -- Record student payment transaction
    INSERT INTO wallet_transactions (
      wallet_id, wallet_type, transaction_type, amount, 
      balance_before, balance_after, description, booking_id
    ) VALUES (
      v_student_wallet_id, 'student', 'deposit', p_payment_amount,
      v_student_balance_before, v_student_balance_after, 
      'شارژ حساب از پرداخت رزرو', p_booking_id
    );

    -- Record academy commission transaction
    INSERT INTO wallet_transactions (
      wallet_id, wallet_type, transaction_type, amount, 
      balance_before, balance_after, description, booking_id
    ) VALUES (
      v_academy_wallet_id, 'academy', 'commission', v_teacher_commission,
      v_academy_balance_before, v_academy_balance_after, 
      'کمیسیون آکادمی (10%)', p_booking_id
    );

  -- Update booking status
  UPDATE bookings 
  SET payment_status = 'paid', status = 'confirmed'
  WHERE id = p_booking_id;

    RETURN json_build_object(
      'success', true,
      'academy_commission', v_teacher_commission,
      'teacher_earnings', v_teacher_earnings,
      'teacher_balance', v_teacher_balance_after,
      'student_balance', v_student_balance_after,
      'academy_balance', v_academy_balance_after
    );
  END;
END;
$$ LANGUAGE plpgsql;
