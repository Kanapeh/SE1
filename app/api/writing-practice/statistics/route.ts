import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای دریافت آمار نوشتن دانش‌آموز
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // دریافت آمار از جدول statistics
    const { data: stats, error: statsError } = await supabase
      .from('writing_statistics')
      .select('*')
      .eq('student_id', studentId)
      .single();

    // اگر آمار وجود نداشت، ایجاد کن
    if (statsError && statsError.code === 'PGRST116') {
      const { data: newStats, error: createError } = await supabase
        .from('writing_statistics')
        .insert({
          student_id: studentId,
          total_submissions: 0,
          total_words_written: 0,
          average_score: 0
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      return NextResponse.json({
        success: true,
        data: newStats
      });
    }

    if (statsError) {
      throw statsError;
    }

    // دریافت اطلاعات بیشتر از submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('writing_submissions')
      .select('overall_score, word_count, submitted_at')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false })
      .limit(10);

    // محاسبه روند بهبود
    let improvementRate = 0;
    if (submissions && submissions.length >= 2) {
      const recentScores = submissions.slice(0, 5).map(s => s.overall_score || 0);
      const olderScores = submissions.slice(5, 10).map(s => s.overall_score || 0);
      
      if (olderScores.length > 0) {
        const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
        const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
        improvementRate = recentAvg - olderAvg;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        improvement_rate: improvementRate,
        recent_submissions: submissions || []
      }
    });

  } catch (error) {
    console.error('Error in statistics API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

