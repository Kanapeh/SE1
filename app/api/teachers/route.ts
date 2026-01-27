import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create server-side Supabase client with proper service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true'; // For admin dashboard
    
    console.log('🔍 API: Fetching teachers...', { all });
    
    // Check environment variables
    console.log('🔧 Environment check:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Not set');
    
    // Log environment status but don't fail completely if service key is missing
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is not set, using anon key (limited access)');
    }
    
    // Fetch ALL teachers from database
    const { data: allTeachers, error: allError } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ API: Error fetching all teachers:', allError);
      console.error('Error code:', allError.code);
      console.error('Error details:', allError.details);
      console.error('Error hint:', allError.hint);
      
      // Return fallback response instead of error
      console.warn('⚠️ Returning empty teachers array due to database error');
      return NextResponse.json({ 
        teachers: [],
        count: 0,
        allCount: 0,
        success: true,
        warning: 'Database connection issue - using fallback'
      });
    }

    console.log('📋 All teachers in database:', allTeachers?.length || 0);
    // Log teachers data without avatar to avoid cluttering console
    if (allTeachers && allTeachers.length > 0) {
      const teachersSummary = allTeachers.map(teacher => {
        const { avatar, ...teacherWithoutAvatar } = teacher;
        return {
          ...teacherWithoutAvatar,
          avatar: avatar ? `[Avatar: ${avatar.substring(0, 50)}... (${avatar.length} chars)]` : 'No avatar'
        };
      });
      console.log('📊 All teachers data:', teachersSummary);
    }

    // If 'all=true' parameter is provided (for admin), return all teachers
    // Otherwise, return only approved teachers (for public/homepage)
    let teachersToReturn = allTeachers || [];
    
    if (!all) {
      // Filter for approved teachers only (for public use)
      teachersToReturn = allTeachers?.filter(teacher => 
        ['active', 'Approved', 'approved'].includes(teacher.status)
      ) || [];
      console.log('✅ Filtered approved teachers:', teachersToReturn?.length || 0);
    } else {
      console.log('✅ Returning all teachers for admin:', teachersToReturn?.length || 0);
    }

    // Log status breakdown
    if (allTeachers && allTeachers.length > 0) {
      const statusCount = allTeachers.reduce((acc, teacher) => {
        acc[teacher.status] = (acc[teacher.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('📊 Status breakdown:', statusCount);
    }
    
    return NextResponse.json({ 
      teachers: teachersToReturn,
      count: teachersToReturn?.length || 0,
      allCount: allTeachers?.length || 0,
      success: true 
    });

  } catch (error) {
    console.error('💥 API: Unexpected error:', error);
    console.error('Error type:', typeof error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown');
    console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown');
    
    // Return fallback response instead of failing
    return NextResponse.json({ 
      teachers: [],
      count: 0,
      allCount: 0,
      success: true,
      error: 'API temporarily unavailable - using fallback',
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
