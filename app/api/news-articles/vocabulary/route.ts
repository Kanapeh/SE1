import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای مدیریت واژگان تخصصی
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const articleId = searchParams.get('articleId');
    const studentId = searchParams.get('studentId');
    const masteryLevel = searchParams.get('masteryLevel');

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('article_vocabulary')
      .select('*')
      .eq('article_id', articleId)
      .order('frequency', { ascending: false });

    const { data: vocabulary, error } = await query;

    if (error) {
      throw error;
    }

    // اگر studentId داده شده، اطلاعات یادگیری را اضافه کن
    if (studentId && vocabulary) {
      const { data: learningData } = await supabase
        .from('vocabulary_learning')
        .select('*')
        .eq('student_id', studentId)
        .in('vocabulary_id', vocabulary.map(v => v.id));

      const learningMap = new Map(
        learningData?.map(item => [item.vocabulary_id, item]) || []
      );

      vocabulary.forEach(vocab => {
        (vocab as any).learning = learningMap.get(vocab.id) || null;
      });
    }

    // فیلتر بر اساس mastery level
    let filteredVocabulary = vocabulary;
    if (masteryLevel && studentId) {
      filteredVocabulary = vocabulary?.filter(v => {
        const learning = (v as any).learning;
        return learning?.mastery_level === masteryLevel;
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        vocabulary: filteredVocabulary || [],
        total: filteredVocabulary?.length || 0
      }
    });

  } catch (error) {
    console.error('Error in vocabulary API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API برای به‌روزرسانی وضعیت یادگیری واژگان
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, vocabularyId, articleId, masteryLevel, isCorrect } = body;

    if (!studentId || !vocabularyId) {
      return NextResponse.json(
        { success: false, error: 'Student ID and Vocabulary ID are required' },
        { status: 400 }
      );
    }

    // دریافت یا ایجاد رکورد یادگیری
    const { data: existing, error: fetchError } = await supabase
      .from('vocabulary_learning')
      .select('*')
      .eq('student_id', studentId)
      .eq('vocabulary_id', vocabularyId)
      .single();

    let learningData: any = {
      student_id: studentId,
      vocabulary_id: vocabularyId,
      article_id: articleId || null,
      mastery_level: masteryLevel || 'new',
      review_count: 0,
      correct_count: 0,
      incorrect_count: 0
    };

    if (existing) {
      learningData = {
        ...existing,
        review_count: existing.review_count + 1,
        correct_count: isCorrect ? existing.correct_count + 1 : existing.correct_count,
        incorrect_count: !isCorrect ? existing.incorrect_count + 1 : existing.incorrect_count,
        mastery_level: masteryLevel || existing.mastery_level,
        last_reviewed_at: new Date().toISOString()
      };

      // محاسبه mastery level بر اساس عملکرد
      const accuracy = learningData.correct_count / learningData.review_count;
      if (accuracy >= 0.8 && learningData.review_count >= 3) {
        learningData.mastery_level = 'mastered';
      } else if (accuracy >= 0.6 && learningData.review_count >= 2) {
        learningData.mastery_level = 'familiar';
      } else if (learningData.review_count >= 1) {
        learningData.mastery_level = 'learning';
      }

      // محاسبه زمان مرور بعدی (spaced repetition)
      const daysUntilNextReview = calculateNextReview(learningData.mastery_level, learningData.review_count);
      learningData.next_review_at = new Date(
        Date.now() + daysUntilNextReview * 24 * 60 * 60 * 1000
      ).toISOString();

      const { data: updated, error: updateError } = await supabase
        .from('vocabulary_learning')
        .update(learningData)
        .eq('id', existing.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return NextResponse.json({ success: true, data: updated });
    } else {
      learningData.next_review_at = new Date(
        Date.now() + 1 * 24 * 60 * 60 * 1000
      ).toISOString();

      const { data: created, error: createError } = await supabase
        .from('vocabulary_learning')
        .insert(learningData)
        .select()
        .single();

      if (createError) throw createError;
      return NextResponse.json({ success: true, data: created });
    }

  } catch (error) {
    console.error('Error in POST vocabulary API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * محاسبه زمان مرور بعدی بر اساس spaced repetition
 */
function calculateNextReview(masteryLevel: string, reviewCount: number): number {
  // الگوریتم spaced repetition ساده
  switch (masteryLevel) {
    case 'mastered':
      return Math.min(30, 7 * Math.pow(2, Math.floor(reviewCount / 3)));
    case 'familiar':
      return Math.min(14, 3 * Math.pow(2, Math.floor(reviewCount / 2)));
    case 'learning':
      return Math.min(7, 1 + reviewCount);
    default:
      return 1;
  }
}

