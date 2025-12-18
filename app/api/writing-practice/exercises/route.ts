import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای دریافت تمرین‌های نوشتن
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const difficulty = searchParams.get('difficulty');
    const topic = searchParams.get('topic');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabase
      .from('writing_exercises')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (difficulty) {
      query = query.eq('difficulty_level', difficulty);
    }

    if (topic) {
      query = query.eq('topic_category', topic);
    }

    const { data: exercises, error } = await query;

    if (error) {
      console.error('Error fetching exercises:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch exercises' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        exercises: exercises || [],
        total: exercises?.length || 0
      }
    });

  } catch (error) {
    console.error('Error in exercises API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API برای ایجاد تمرین جدید (برای ادمین)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, prompt, topic_category, difficulty_level, word_limit_min, word_limit_max, estimated_time, evaluation_criteria, tips } = body;

    if (!title || !prompt || !difficulty_level) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: exercise, error } = await supabase
      .from('writing_exercises')
      .insert({
        title,
        description,
        prompt,
        topic_category,
        difficulty_level,
        word_limit_min: word_limit_min || 50,
        word_limit_max: word_limit_max || 500,
        estimated_time: estimated_time || 15,
        evaluation_criteria: evaluation_criteria || { grammar: 30, vocabulary: 25, coherence: 25, creativity: 20 },
        tips: tips || []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating exercise:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create exercise' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: exercise
    });

  } catch (error) {
    console.error('Error in POST exercises API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

