import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get academy wallet
    const { data: wallet, error: walletError } = await supabase
      .from('academy_wallet')
      .select('*')
      .single();

    if (walletError && walletError.code !== 'PGRST116') {
      console.error('Error fetching academy wallet:', walletError);
      return NextResponse.json({ 
        error: walletError.message 
      }, { status: 500 });
    }

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet?.id)
      .eq('wallet_type', 'academy')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      wallet: wallet || {
        balance: 0,
        total_commission: 0
      },
      transactions: transactions || []
    });

  } catch (error) {
    console.error('Error in academy wallet API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
