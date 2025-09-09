import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { booking_id, payment_amount, commission_rate = 0.10 } = body;

    if (!booking_id || !payment_amount) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters: booking_id, payment_amount' 
      });
    }

    console.log('🔍 Testing payment processing...', { booking_id, payment_amount, commission_rate });

    // Test the process_booking_payment function
    const { data: result, error } = await supabase.rpc(
      'process_booking_payment',
      {
        p_booking_id: booking_id,
        p_payment_amount: payment_amount,
        p_commission_rate: commission_rate
      }
    );

    if (error) {
      console.error('❌ Payment processing error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Payment processing failed',
        details: error.message
      });
    }

    console.log('✅ Payment processing result:', result);

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      result: result
    });

  } catch (error) {
    console.error('💥 Error testing payment processing:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
