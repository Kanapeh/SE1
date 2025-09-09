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
        // number_of_sessions: number_of_sessions || 1, // Temporarily disabled until column is added
        notes: notes || '',
        payment_status: payment_status || 'pending',
        // payment_method: 'card_to_card', // Temporarily disabled until column is added
        transaction_id: transaction_id || null,
        // receipt_image: receipt_image || null, // Temporarily disabled until column is added
        // payment_notes: payment_notes || null, // Temporarily disabled until column is added
        status: 'pending' // Changed from 'pending_payment' to 'pending' until constraint is updated
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

    // Create notification for teacher
    try {
      console.log('🔔 Creating notification for teacher:', teacher_id);
      
      const { data: notification, error: notificationError } = await supabase
        .from('notifications')
        .insert({
          teacher_id: teacher_id,
          user_id: teacher_id, // Use teacher_id as user_id
          type: 'success',
          title: 'کلاس جدید رزرو شد',
          message: `${student_name} کلاس ${session_type} سطح ${selected_days} را برای ${selected_hours} رزرو کرد`,
          read: false
        })
        .select()
        .single();

      if (notificationError) {
        console.error('❌ Error creating notification:', notificationError);
      } else {
        console.log('✅ Notification created successfully:', notification);
      }
    } catch (error) {
      console.error('❌ Error in notification creation:', error);
    }

    // Create notification for student (if student_id exists)
    if (student_id) {
      try {
        console.log('🔔 Creating notification for student:', student_id);
        
        const { data: studentNotification, error: studentNotificationError } = await supabase
          .from('notifications')
          .insert({
            teacher_id: teacher_id,
            user_id: student_id,
            type: 'success',
            title: 'کلاس با موفقیت رزرو شد',
            message: `کلاس ${session_type} شما برای ${selected_days} در ساعت ${selected_hours} رزرو شد`,
            read: false
          })
          .select()
          .single();

        if (studentNotificationError) {
          console.error('❌ Error creating student notification:', studentNotificationError);
        } else {
          console.log('✅ Student notification created successfully:', studentNotification);
        }
      } catch (error) {
        console.error('❌ Error in student notification creation:', error);
      }
    }

    // Process payment and update wallets
    try {
      console.log('🔄 Processing payment for booking:', booking.id, 'amount:', total_price);
      
      const { data: paymentResult, error: paymentError } = await supabase.rpc(
        'process_booking_payment',
        {
          p_booking_id: booking.id,
          p_payment_amount: total_price,
          p_commission_rate: 0.10 // 10% commission
        }
      );

      if (paymentError) {
        console.error('❌ Error processing payment:', paymentError);
        console.error('❌ Payment error details:', JSON.stringify(paymentError, null, 2));
        // Don't fail the booking, just log the error
      } else {
        console.log('✅ Payment processed successfully:', paymentResult);
      }
    } catch (error) {
      console.error('❌ Error in payment processing:', error);
      console.error('❌ Payment processing error details:', JSON.stringify(error, null, 2));
      // Don't fail the booking, just log the error
    }

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
