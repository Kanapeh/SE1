import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای دریافت تمرین‌های شنیداری
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const difficulty = searchParams.get('difficulty');
    const accent = searchParams.get('accent');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabase
      .from('listening_exercises')
      .select(`
        *,
        questions:listening_questions(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (difficulty) {
      query = query.eq('difficulty_level', difficulty);
    }

    if (accent) {
      query = query.eq('accent_type', accent);
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

