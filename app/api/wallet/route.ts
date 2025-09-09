import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('type'); // 'teacher' or 'student'
    const userId = searchParams.get('user_id');

    if (!userType || !userId) {
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    if (userType === 'teacher') {
      // Get teacher wallet (create if doesn't exist)
      let { data: wallet, error: walletError } = await supabase
        .from('teacher_wallets')
        .select('*')
        .eq('teacher_id', userId)
        .single();

      if (walletError && walletError.code === 'PGRST116') {
        // Teacher wallet doesn't exist, create it
        console.log('🔍 Creating teacher wallet for:', userId);
        const { data: newWallet, error: createError } = await supabase
          .from('teacher_wallets')
          .insert({
            teacher_id: userId,
            balance: 0.00,
            total_earned: 0.00,
            total_withdrawn: 0.00
          })
          .select('*')
          .single();

        if (createError) {
          console.error('Error creating teacher wallet:', createError);
          return NextResponse.json({ 
            error: 'Failed to create teacher wallet' 
          }, { status: 500 });
        }
        wallet = newWallet;
      } else if (walletError) {
        console.error('Error fetching teacher wallet:', walletError);
        return NextResponse.json({ 
          error: walletError.message 
        }, { status: 500 });
      }

      // Get recent transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', wallet?.id)
        .eq('wallet_type', 'teacher')
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('✅ Teacher wallet data:', {
        teacherId: userId,
        walletId: wallet?.id,
        balance: wallet?.balance,
        totalEarned: wallet?.total_earned,
        transactionsCount: transactions?.length || 0,
        note: 'This should be 0 if no payments have been made'
      });

      return NextResponse.json({
        success: true,
        wallet: wallet || {
          balance: 0,
          total_earned: 0,
          total_withdrawn: 0
        },
        transactions: transactions || []
      });

    } else if (userType === 'student') {
      // Get student wallet
      const { data: wallet, error: walletError } = await supabase
        .from('student_wallets')
        .select('*')
        .eq('student_id', userId)
        .single();

      if (walletError && walletError.code !== 'PGRST116') {
        console.error('Error fetching student wallet:', walletError);
        return NextResponse.json({ 
          error: walletError.message 
        }, { status: 500 });
      }

      // Get recent transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', wallet?.id)
        .eq('wallet_type', 'student')
        .order('created_at', { ascending: false })
        .limit(10);

      return NextResponse.json({
        success: true,
        wallet: wallet || {
          balance: 0,
          total_deposited: 0,
          total_spent: 0
        },
        transactions: transactions || []
      });
    }

    return NextResponse.json({ 
      error: 'Invalid user type' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error in wallet API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
