import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API برای حذف نوشته دانش‌آموز
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissionId = params.id;

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: 'Submission ID is required' },
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

    // بررسی وجود submission
    const { data: submission, error: checkError } = await supabase
      .from('writing_submissions')
      .select('id, exercise_id')
      .eq('id', submissionId)
      .single();

    if (checkError || !submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }

    // حذف submission
    const { error: deleteError } = await supabase
      .from('writing_submissions')
      .delete()
      .eq('id', submissionId);

    if (deleteError) {
      console.error('Error deleting submission:', deleteError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete submission',
          details: deleteError.message
        },
        { status: 500 }
      );
    }

    console.log('Submission deleted successfully:', submissionId);

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully',
      data: {
        submission_id: submissionId,
        exercise_id: submission.exercise_id
      }
    });

  } catch (error: any) {
    console.error('Error in DELETE submission API:', error);
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

