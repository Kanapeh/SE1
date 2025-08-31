import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, approved, adminNotes } = body;

    if (!bookingId || approved === undefined) {
      return NextResponse.json({ 
        error: 'Booking ID and approval status are required' 
      }, { status: 400 });
    }

    // Initialize Supabase client with service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase environment variables for payment approval');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    // Update booking status
    const updateData: any = {
      payment_status: approved ? 'approved' : 'rejected',
      status: approved ? 'confirmed' : 'cancelled',
      admin_notes: adminNotes || null,
      approved_at: approved ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating booking payment status:', error);
      return NextResponse.json({ 
        error: 'Failed to update payment status' 
      }, { status: 500 });
    }

    console.log(`✅ Payment ${approved ? 'approved' : 'rejected'} for booking:`, bookingId);

    // TODO: Send notification to student
    // You can add notification logic here

    return NextResponse.json({ 
      success: true, 
      booking: data,
      message: `Payment ${approved ? 'approved' : 'rejected'} successfully`
    });

  } catch (error: any) {
    console.error('Unexpected error in payment approval:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
