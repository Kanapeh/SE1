import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacher_id');

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false
      }
    });

    console.log('🔍 Fetching teacher earnings for:', teacherId);

    // Get teacher wallet ID (create if doesn't exist)
    let { data: teacherWallet, error: walletError } = await supabase
      .from('teacher_wallets')
      .select('id, balance, total_earned')
      .eq('teacher_id', teacherId)
      .single();

    if (walletError && walletError.code === 'PGRST116') {
      // Teacher wallet doesn't exist, create it
      console.log('🔍 Creating teacher wallet for:', teacherId);
      const { data: newWallet, error: createError } = await supabase
        .from('teacher_wallets')
        .insert({
          teacher_id: teacherId,
          balance: 0.00,
          total_earned: 0.00
        })
        .select('id, balance, total_earned')
        .single();

      if (createError) {
        console.error('❌ Error creating teacher wallet:', createError);
        return NextResponse.json(
          { error: 'Failed to create teacher wallet' },
          { status: 500 }
        );
      }
      teacherWallet = newWallet;
    } else if (walletError) {
      console.error('❌ Error fetching teacher wallet:', walletError);
      return NextResponse.json(
        { error: 'Teacher wallet not found' },
        { status: 404 }
      );
    }

    // Get current month earnings from wallet_transactions
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const { data: monthlyTransactions, error: transactionsError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', teacherWallet.id)
      .eq('wallet_type', 'teacher')
      .eq('transaction_type', 'commission')
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString())
      .order('created_at', { ascending: false });

    if (transactionsError) {
      console.error('❌ Error fetching monthly transactions:', transactionsError);
      return NextResponse.json(
        { error: 'Failed to fetch earnings data' },
        { status: 500 }
      );
    }

    // Get all-time earnings
    const { data: allTimeTransactions, error: allTimeError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', teacherWallet.id)
      .eq('wallet_type', 'teacher')
      .eq('transaction_type', 'commission')
      .order('created_at', { ascending: false });

    if (allTimeError) {
      console.error('❌ Error fetching all-time transactions:', allTimeError);
      return NextResponse.json(
        { error: 'Failed to fetch all-time earnings data' },
        { status: 500 }
      );
    }

    // Calculate earnings from transactions
    const monthlyEarnings = monthlyTransactions?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;
    const totalEarnings = allTimeTransactions?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;
    const currentBalance = Number(teacherWallet.balance);

    // If no transactions exist, earnings should be 0
    const finalMonthlyEarnings = monthlyTransactions && monthlyTransactions.length > 0 ? monthlyEarnings : 0;
    const finalTotalEarnings = allTimeTransactions && allTimeTransactions.length > 0 ? totalEarnings : 0;

    console.log('✅ Teacher earnings calculated:', {
      teacherId,
      monthlyEarnings,
      totalEarnings,
      currentBalance,
      monthlyTransactionsCount: monthlyTransactions?.length || 0,
      walletId: teacherWallet.id,
      walletBalance: teacherWallet.balance,
      walletTotalEarned: teacherWallet.total_earned
    });

    return NextResponse.json({
      teacherId,
      monthlyEarnings: finalMonthlyEarnings,
      totalEarnings: finalTotalEarnings,
      currentBalance,
      monthlyTransactions: monthlyTransactions || [],
      allTimeTransactions: allTimeTransactions || []
    });

  } catch (error: any) {
    console.error('Teacher earnings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
