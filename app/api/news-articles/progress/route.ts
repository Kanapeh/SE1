import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای مدیریت پیشرفت خواندن
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, articleId, readingStatus, progressPercentage, timeSpent, lastReadPosition, comprehensionScore, notes } = body;

    if (!studentId || !articleId) {
      return NextResponse.json(
        { success: false, error: 'Student ID and Article ID are required' },
        { status: 400 }
      );
    }

    // بررسی وجود رکورد قبلی
    const { data: existing, error: fetchError } = await supabase
      .from('article_reading_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('article_id', articleId)
      .single();

    const progressData: any = {
      student_id: studentId,
      article_id: articleId,
      reading_status: readingStatus || 'reading',
      progress_percentage: progressPercentage || 0,
      time_spent: timeSpent || 0,
      last_read_position: lastReadPosition || 0,
      comprehension_score: comprehensionScore || null,
      notes: notes || null
    };

    if (readingStatus === 'completed') {
      progressData.completed_at = new Date().toISOString();
    }

    if (!existing && readingStatus !== 'not_started') {
      progressData.started_at = new Date().toISOString();
    }

    let result;
    if (existing) {
      const { data: updated, error: updateError } = await supabase
        .from('article_reading_progress')
        .update(progressData)
        .eq('id', existing.id)
        .select()
        .single();

      if (updateError) throw updateError;
      result = updated;
    } else {
      const { data: created, error: createError } = await supabase
        .from('article_reading_progress')
        .insert(progressData)
        .select()
        .single();

      if (createError) throw createError;
      result = created;
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in progress API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API برای دریافت پیشرفت خواندن
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const articleId = searchParams.get('articleId');

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('article_reading_progress')
      .select(`
        *,
        article:articles(*)
      `)
      .eq('student_id', studentId);

    if (articleId) {
      query = query.eq('article_id', articleId);
    }

    query = query.order('updated_at', { ascending: false });

    const { data: progress, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: {
        progress: progress || [],
        total: progress?.length || 0
      }
    });

  } catch (error) {
    console.error('Error in GET progress API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

