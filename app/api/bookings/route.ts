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
    const { 
      teacher_id, 
      student_id, 
      student_name, 
      student_email, 
      student_phone, 
      selected_days, 
      selected_hours, 
      session_type, 
      duration, 
      total_price, 
      number_of_sessions,
      notes,
      transaction_id,
      receipt_image,
      payment_notes,
      payment_status
    } = body;

    console.log('🔍 Creating booking:', {
      teacher_id,
      student_id,
      student_name,
      student_email,
      selected_days,
      selected_hours,
      session_type,
      duration,
      total_price
    });

    // Validate required fields
    if (!teacher_id || !student_name || !student_email || !student_phone || !selected_days || !selected_hours || !session_type || !duration || !total_price) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        teacher_id,
        student_id: student_id || null,
        student_name,
        student_email,
        student_phone,
        selected_days,
        selected_hours,
        session_type,
        duration,
        total_price,
        number_of_sessions: number_of_sessions || 1,
        notes: notes || '',
        payment_status: payment_status || 'pending',
        payment_method: 'card_to_card',
        transaction_id: transaction_id || null,
        receipt_image: receipt_image || null,
        payment_notes: payment_notes || null,
        status: 'pending_payment'
      })
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Error creating booking:', bookingError);
      return NextResponse.json({ 
        error: bookingError.message 
      }, { status: 500 });
    }

    console.log('✅ Booking created successfully:', booking);

    // Send notification to teacher (you can implement this later)
    // await sendTeacherNotification(teacher_id, student_name, selected_days, selected_hours);

    return NextResponse.json({ 
      booking,
      success: true,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const teacher_id = searchParams.get('teacher_id');

    if (!student_id && !teacher_id) {
      return NextResponse.json({ 
        error: 'student_id or teacher_id is required' 
      }, { status: 400 });
    }

    let query = supabase.from('bookings').select('*');

    if (student_id) {
      query = query.eq('student_id', student_id);
    }

    if (teacher_id) {
      query = query.eq('teacher_id', teacher_id);
    }

    const { data: bookings, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching bookings:', error);
      return NextResponse.json({ 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      bookings: bookings || [],
      success: true 
    });

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
