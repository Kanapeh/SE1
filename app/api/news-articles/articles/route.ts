import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای دریافت مقالات و اخبار
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured') === 'true';

    let query = supabase
      .from('articles')
      .select(`
        *,
        vocabulary:article_vocabulary(count),
        exercises:article_exercises(count)
      `)
      .eq('is_active', true)
      .order('published_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (difficulty) {
      query = query.eq('difficulty_level', difficulty);
    }

    if (featured) {
      query = query.eq('is_featured', true);
    }

    const { data: articles, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch articles' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        articles: articles || [],
        total: articles?.length || 0
      }
    });

  } catch (error) {
    console.error('Error in articles API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API برای دریافت یک مقاله خاص
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // دریافت مقاله با تمام اطلاعات مرتبط
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select(`
        *,
        sentences:article_sentences(*),
        vocabulary:article_vocabulary(*),
        exercises:article_exercises(*)
      `)
      .eq('id', articleId)
      .single();

    if (articleError) {
      throw articleError;
    }

    // افزایش تعداد بازدید
    await supabase
      .from('articles')
      .update({ view_count: (article.view_count || 0) + 1 })
      .eq('id', articleId);

    return NextResponse.json({
      success: true,
      data: article
    });

  } catch (error) {
    console.error('Error in POST articles API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

