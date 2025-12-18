import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API برای دریافت نوشته‌های ارسال شده دانش‌آموز
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // استفاده از service role key برای bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error',
          details: 'Missing SUPABASE_SERVICE_ROLE_KEY environment variable'
        },
        { status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // دریافت submissions با join به exercises
    const { data: submissions, error } = await supabase
      .from('writing_submissions')
      .select(`
        *,
        exercise:writing_exercises(
          id,
          title,
          description,
          prompt,
          difficulty_level,
          topic_category
        )
      `)
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching submissions:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch submissions',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        submissions: submissions || [],
        total: submissions?.length || 0
      }
    });

  } catch (error: any) {
    console.error('Error in submissions API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}

