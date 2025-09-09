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
    const teacher_id = searchParams.get('teacher_id');
    const student_id = searchParams.get('student_id');

    console.log('🔍 Fetching students:', { teacher_id, student_id });

    if (teacher_id) {
      // Get students for a specific teacher (from bookings)
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('student_id')
        .eq('teacher_id', teacher_id);

      if (bookingsError) {
        console.error('❌ Error fetching bookings:', bookingsError);
        return NextResponse.json({ 
          error: bookingsError.message 
        }, { status: 500 });
      }

      // Get unique student IDs
      const studentIds = [...new Set(bookings?.map(b => b.student_id).filter(Boolean))];
      
      if (studentIds.length === 0) {
        return NextResponse.json({ 
          students: [],
          success: true 
        });
      }

      // Fetch student details
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, first_name, last_name, email, avatar, current_language_level, preferred_languages')
        .in('id', studentIds);

      if (studentsError) {
        console.error('❌ Error fetching students:', studentsError);
        return NextResponse.json({ 
          error: studentsError.message 
        }, { status: 500 });
      }

      console.log('✅ Students fetched successfully:', students?.length || 0);

      return NextResponse.json({ 
        students: students || [],
        success: true 
      });

    } else if (student_id) {
      // Get specific student
      const { data: students, error } = await supabase
        .from('students')
        .select('id, first_name, last_name, email, avatar, current_language_level, preferred_languages')
        .eq('id', student_id);

      if (error) {
        console.error('❌ Error fetching student:', error);
        return NextResponse.json({ 
          error: error.message 
        }, { status: 500 });
      }

      if (!students || students.length === 0) {
        return NextResponse.json({ 
          error: 'Student not found' 
        }, { status: 404 });
      }

      if (students.length > 1) {
        console.warn('⚠️ Multiple students found with same ID, using first one');
      }

      return NextResponse.json({ 
        student: students[0],
        success: true 
      });

    } else {
      return NextResponse.json({ 
        error: 'teacher_id or student_id is required' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
