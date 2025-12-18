import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API برای ارسال نوشته دانش‌آموز
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, exerciseId, content } = body;

    console.log('Submit API called with:', { studentId, exerciseId, contentLength: content?.length });

    if (!studentId || !exerciseId || !content) {
      console.error('Missing required fields:', { studentId: !!studentId, exerciseId: !!exerciseId, content: !!content });
      return NextResponse.json(
        { success: false, error: 'Missing required fields', details: { studentId: !!studentId, exerciseId: !!exerciseId, content: !!content } },
        { status: 400 }
      );
    }

    // استفاده از service role key برای bypass RLS در API route
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration:', {
        url: !!supabaseUrl,
        serviceKey: !!supabaseServiceKey
      });
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

    // محاسبه تعداد کلمات
    const wordCount = content.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
    const characterCount = content.length;

    console.log('Attempting to insert submission:', {
      student_id: studentId,
      exercise_id: exerciseId,
      word_count: wordCount,
      character_count: characterCount
    });

    // بررسی وجود exercise
    const { data: exercise, error: exerciseError } = await supabase
      .from('writing_exercises')
      .select('id')
      .eq('id', exerciseId)
      .single();

    if (exerciseError || !exercise) {
      console.error('Exercise not found:', exerciseError);
      return NextResponse.json(
        { success: false, error: 'Exercise not found', details: exerciseError?.message },
        { status: 404 }
      );
    }

    // بررسی وجود student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      console.error('Student not found:', studentError);
      return NextResponse.json(
        { success: false, error: 'Student not found', details: studentError?.message },
        { status: 404 }
      );
    }

    // بررسی وجود submission قبلی برای این exercise و student
    const { data: existingSubmissions, error: checkError } = await supabase
      .from('writing_submissions')
      .select('id')
      .eq('student_id', studentId)
      .eq('exercise_id', exerciseId)
      .order('submitted_at', { ascending: false })
      .limit(1);
    
    const existingSubmission = existingSubmissions && existingSubmissions.length > 0 
      ? existingSubmissions[0] 
      : null;

    let submission;
    
    if (existingSubmission && !checkError) {
      // به‌روزرسانی submission موجود
      console.log('Updating existing submission:', existingSubmission.id);
      const { data: updatedSubmission, error: updateError } = await supabase
        .from('writing_submissions')
        .update({
          content: content,
          word_count: wordCount,
          character_count: characterCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubmission.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating submission:', {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code
        });
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to update submission',
            details: updateError.message,
            code: updateError.code
          },
          { status: 500 }
        );
      }

      submission = updatedSubmission;
      console.log('Submission updated successfully:', submission.id);
    } else {
      // ایجاد submission جدید
      console.log('Creating new submission');
      const { data: newSubmission, error: insertError } = await supabase
        .from('writing_submissions')
        .insert({
          student_id: studentId,
          exercise_id: exerciseId,
          content: content,
          word_count: wordCount,
          character_count: characterCount
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating submission:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to create submission',
            details: insertError.message,
            code: insertError.code
          },
          { status: 500 }
        );
      }

      submission = newSubmission;
      console.log('Submission created successfully:', submission.id);
    }

    // فراخوانی تصحیح خودکار
    let correctionData = null;
    try {
      const correctionResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/writing-practice/auto-correct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission.id,
          content: content,
          exerciseId: exerciseId
        })
      });

      if (correctionResponse.ok) {
        const correctionResult = await correctionResponse.json();
        if (correctionResult.success) {
          correctionData = correctionResult.data;
        } else {
          console.warn('Auto-correct returned success=false:', correctionResult.error);
        }
      } else {
        console.warn('Auto-correct API returned non-OK status:', correctionResponse.status);
      }
    } catch (correctionError) {
      console.error('Error calling auto-correct API:', correctionError);
      // Continue even if auto-correct fails - submission is still created
    }

    return NextResponse.json({
      success: true,
      data: {
        submission_id: submission.id,
        correction: correctionData
      }
    });

  } catch (error) {
    console.error('Error in submit API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

