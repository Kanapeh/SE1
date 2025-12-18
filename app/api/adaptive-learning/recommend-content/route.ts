import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای پیشنهاد محتوا به دانش‌آموز
 * این endpoint بر اساس سطح، پیشرفت و نقاط ضعف دانش‌آموز محتوا پیشنهاد می‌دهد
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, limit = 10 } = body;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // دریافت مهارت‌های دانش‌آموز
    const { data: skills, error: skillsError } = await supabase
      .from('student_skills')
      .select('*')
      .eq('student_id', studentId);

    if (skillsError) {
      console.error('Error fetching skills:', skillsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch student skills' },
        { status: 500 }
      );
    }

    // دریافت پیشرفت دانش‌آموز
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select('content_id, status, score')
      .eq('student_id', studentId);

    if (progressError) {
      console.error('Error fetching progress:', progressError);
    }

    const completedContentIds = new Set(
      progress?.filter(p => p.status === 'completed').map(p => p.content_id) || []
    );

    // محاسبه سطح کلی
    const overallLevel = calculateOverallLevel(skills || []);

    // شناسایی مهارت‌های ضعیف (نیاز به تمرین بیشتر)
    const weakSkills = (skills || [])
      .filter(s => s.current_score < 50)
      .map(s => s.skill_type);

    // شناسایی مهارت‌های متوسط (نیاز به پیشرفت)
    const mediumSkills = (skills || [])
      .filter(s => s.current_score >= 50 && s.current_score < 70)
      .map(s => s.skill_type);

    // ساخت query برای محتوا
    let query = supabase
      .from('learning_content')
      .select('*')
      .eq('is_active', true)
      .eq('language', 'English') // می‌تواند از پروفایل دانش‌آموز گرفته شود
      .not('id', 'in', `(${Array.from(completedContentIds).join(',')})`);

    // اولویت: محتوا برای مهارت‌های ضعیف
    if (weakSkills.length > 0) {
      query = query.in('skill_type', weakSkills);
    } else if (mediumSkills.length > 0) {
      query = query.in('skill_type', mediumSkills);
    }

    // فیلتر بر اساس سطح
    query = query.eq('level', overallLevel);

    const { data: recommendedContent, error: contentError } = await query
      .order('difficulty_score', { ascending: true })
      .limit(limit);

    if (contentError) {
      console.error('Error fetching content:', contentError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch content' },
        { status: 500 }
      );
    }

    // محاسبه اولویت برای هر محتوا
    const prioritizedContent = (recommendedContent || []).map(content => {
      const priority = calculateContentPriority(content, skills || [], weakSkills);
      
      // ذخیره پیشنهاد در دیتابیس
      supabase
        .from('content_recommendations')
        .insert({
          student_id: studentId,
          content_id: content.id,
          recommendation_reason: generateRecommendationReason(content, weakSkills),
          priority: priority,
          algorithm_version: '1.0',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .catch(err => console.error('Error saving recommendation:', err));

      return {
        ...content,
        priority,
        recommendation_reason: generateRecommendationReason(content, weakSkills)
      };
    });

    // مرتب‌سازی بر اساس اولویت
    prioritizedContent.sort((a, b) => b.priority - a.priority);

    return NextResponse.json({
      success: true,
      data: {
        recommendations: prioritizedContent,
        overall_level: overallLevel,
        weak_skills: weakSkills,
        total_recommendations: prioritizedContent.length
      }
    });

  } catch (error) {
    console.error('Error in recommend-content API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * محاسبه سطح کلی بر اساس مهارت‌ها
 */
function calculateOverallLevel(skills: any[]): 'beginner' | 'intermediate' | 'advanced' {
  if (skills.length === 0) return 'beginner';

  const avgScore = skills.reduce((sum, s) => sum + s.current_score, 0) / skills.length;

  if (avgScore >= 70) return 'advanced';
  if (avgScore >= 40) return 'intermediate';
  return 'beginner';
}

/**
 * محاسبه اولویت محتوا
 */
function calculateContentPriority(
  content: any,
  skills: any[],
  weakSkills: string[]
): number {
  let priority = 50; // اولویت پایه

  // اگر محتوا برای مهارت ضعیف است، اولویت بالاتر
  if (weakSkills.includes(content.skill_type)) {
    priority += 30;
  }

  // تطابق سطح
  const studentSkill = skills.find(s => s.skill_type === content.skill_type);
  if (studentSkill) {
    const scoreDiff = content.difficulty_score - studentSkill.current_score;
    // اگر محتوا کمی سخت‌تر از سطح فعلی باشد، اولویت بالاتر
    if (scoreDiff > 0 && scoreDiff < 20) {
      priority += 20;
    }
    // اگر خیلی سخت باشد، اولویت کمتر
    if (scoreDiff > 30) {
      priority -= 20;
    }
  }

  // نوع محتوا
  const contentTypePriority: Record<string, number> = {
    'lesson': 10,
    'exercise': 15,
    'quiz': 5,
    'video': 8,
    'game': 12
  };
  priority += contentTypePriority[content.content_type] || 0;

  return Math.max(0, Math.min(100, priority));
}

/**
 * تولید دلیل پیشنهاد
 */
function generateRecommendationReason(content: any, weakSkills: string[]): string {
  const skillNames: Record<string, string> = {
    grammar: 'گرامر',
    vocabulary: 'واژگان',
    reading: 'خواندن',
    writing: 'نوشتن',
    listening: 'شنیداری',
    speaking: 'مکالمه'
  };

  if (weakSkills.includes(content.skill_type)) {
    return `این محتوا برای بهبود ${skillNames[content.skill_type]} شما پیشنهاد شده است.`;
  }

  return `این محتوا برای پیشرفت در ${skillNames[content.skill_type]} مناسب است.`;
}

