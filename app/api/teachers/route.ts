import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Use anon key temporarily
);

export async function GET() {
  try {
    console.log('🔍 API: Fetching all teachers first for debugging...');
    
    // Check environment variables
    console.log('🔧 Environment check:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Not set');
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
      return NextResponse.json({ 
        error: 'Service role key not configured' 
      }, { status: 500 });
    }
    
    // First, fetch ALL teachers to see what's in the database
    const { data: allTeachers, error: allError } = await supabase
      .from('teachers')
      .select('*');

    if (allError) {
      console.error('❌ API: Error fetching all teachers:', allError);
      return NextResponse.json({ error: allError.message }, { status: 500 });
    }

    console.log('📋 All teachers in database:', allTeachers?.length || 0);
    console.log('📊 All teachers data:', allTeachers);

    // Now filter for approved teachers
    const approvedTeachers = allTeachers?.filter(teacher => 
      ['active', 'Approved', 'approved'].includes(teacher.status)
    ) || [];

    console.log('✅ Filtered approved teachers:', approvedTeachers?.length || 0);
    console.log('📊 Approved teachers data:', approvedTeachers);

    // Log status breakdown
    if (allTeachers && allTeachers.length > 0) {
      const statusCount = allTeachers.reduce((acc, teacher) => {
        acc[teacher.status] = (acc[teacher.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('📊 Status breakdown:', statusCount);
    }
    
    return NextResponse.json({ 
      teachers: approvedTeachers,
      count: approvedTeachers?.length || 0,
      allCount: allTeachers?.length || 0,
      success: true 
    });

  } catch (error) {
    console.error('💥 API: Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
