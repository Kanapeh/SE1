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
      teacher_name,
      student_name,
      student_email,
      student_phone,
      selected_days,
      selected_hours,
      session_type,
      duration,
      payment_amount,
      number_of_sessions = 1,
      notes = ''
    } = body;

    console.log('🔍 Processing real payment:', {
      teacher_name,
      student_name,
      student_email,
      payment_amount
    });

    // Validate required fields
    if (!teacher_name || !student_name || !student_email || !payment_amount) {
      return NextResponse.json({ 
        error: 'Missing required fields: teacher_name, student_name, student_email, payment_amount' 
      }, { status: 400 });
    }

    // Find teacher by name
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id, first_name, last_name')
      .or(`first_name.ilike.%${teacher_name}%,last_name.ilike.%${teacher_name}%`)
      .limit(1)
      .single();

    if (teacherError || !teacher) {
      console.log('Teacher not found, creating new teacher...');
      // Create teacher if not found
      const { data: newTeacher, error: createTeacherError } = await supabase
        .from('teachers')
        .insert({
          first_name: teacher_name.split(' ')[0] || teacher_name,
          last_name: teacher_name.split(' ').slice(1).join(' ') || '',
          email: 'teacher@example.com',
          phone: '+989123456789',
          languages: ['انگلیسی', 'فارسی'],
          hourly_rate: payment_amount,
          bio: 'معلم زبان',
          status: 'active'
        })
        .select()
        .single();

      if (createTeacherError) {
        console.error('Error creating teacher:', createTeacherError);
        return NextResponse.json({ 
          error: 'Failed to create teacher' 
        }, { status: 500 });
      }
      
      teacher = newTeacher;
    }

    // Find or create student
    let { data: student, error: studentError } = await supabase.auth.admin.getUserByEmail(student_email);
    
    if (studentError || !student) {
      console.log('Student not found, creating new student...');
      // Create student if not found
      const { data: newStudent, error: createStudentError } = await supabase.auth.admin.createUser({
        email: student_email,
        user_metadata: {
          role: 'student',
          first_name: student_name.split(' ')[0] || student_name,
          last_name: student_name.split(' ').slice(1).join(' ') || ''
        },
        email_confirm: true
      });

      if (createStudentError) {
        console.error('Error creating student:', createStudentError);
        return NextResponse.json({ 
          error: 'Failed to create student' 
        }, { status: 500 });
      }
      
      student = newStudent;
    }

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        teacher_id: teacher.id,
        student_id: student.user.id,
        student_name,
        student_email,
        student_phone: student_phone || '+92',
        selected_days: selected_days || ['monday'],
        selected_hours: selected_hours || ['morning'],
        session_type: session_type || 'ترکیبی',
        duration: duration || 60,
        total_price: payment_amount,
        number_of_sessions,
        notes: notes || 'پرداخت واقعی',
        payment_status: 'paid',
        status: 'confirmed'
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json({ 
        error: 'Failed to create booking' 
      }, { status: 500 });
    }

    console.log('✅ Booking created successfully:', booking.id);

    // Process payment and update wallets
    const { data: paymentResult, error: paymentError } = await supabase.rpc(
      'process_booking_payment',
      {
        p_booking_id: booking.id,
        p_payment_amount: payment_amount,
        p_commission_rate: 0.10 // 10% commission
      }
    );

    if (paymentError) {
      console.error('❌ Error processing payment:', paymentError);
      return NextResponse.json({ 
        error: 'Payment processing failed',
        details: paymentError.message 
      }, { status: 500 });
    }

    console.log('✅ Payment processed successfully:', paymentResult);

    return NextResponse.json({ 
      success: true,
      message: 'Real payment processed successfully',
      booking,
      payment_result: paymentResult,
      teacher: {
        id: teacher.id,
        name: `${teacher.first_name} ${teacher.last_name}`
      },
      student: {
        id: student.user.id,
        name: student_name,
        email: student_email
      }
    });

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
