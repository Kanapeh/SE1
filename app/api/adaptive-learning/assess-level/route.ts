import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای ارزیابی سطح دانش‌آموز
 * این endpoint یک تست تشخیص سطح انجام می‌دهد و سطح دانش‌آموز را مشخص می‌کند
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, questions, answers } = body;

    if (!studentId || !questions || !answers) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // محاسبه نمره برای هر مهارت
    const skillScores: Record<string, number> = {
      grammar: 0,
      vocabulary: 0,
      reading: 0,
      writing: 0,
      listening: 0,
      speaking: 0
    };

    const skillCounts: Record<string, number> = {
      grammar: 0,
      vocabulary: 0,
      reading: 0,
      writing: 0,
      listening: 0,
      speaking: 0
    };

    // محاسبه نمرات
    questions.forEach((question: any, index: number) => {
      const skill = question.skill_type || 'grammar';
      const isCorrect = question.correct_answer === answers[index];
      
      if (isCorrect) {
        skillScores[skill] += question.points || 1;
      }
      skillCounts[skill] += question.points || 1;
    });

    // محاسبه درصد برای هر مهارت
    const skillPercentages: Record<string, number> = {};
    Object.keys(skillScores).forEach(skill => {
      if (skillCounts[skill] > 0) {
        skillPercentages[skill] = Math.round((skillScores[skill] / skillCounts[skill]) * 100);
      } else {
        skillPercentages[skill] = 0;
      }
    });

    // محاسبه نمره کلی
    const totalScore = Math.round(
      Object.values(skillPercentages).reduce((sum, score) => sum + score, 0) / 
      Object.keys(skillPercentages).length
    );

    // تعیین سطح کلی
    let overallLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (totalScore >= 70) {
      overallLevel = 'advanced';
    } else if (totalScore >= 40) {
      overallLevel = 'intermediate';
    }

    // ذخیره ارزیابی در دیتابیس
    const { data: assessment, error: assessmentError } = await supabase
      .from('level_assessments')
      .insert({
        student_id: studentId,
        assessment_type: 'initial',
        overall_level: overallLevel,
        skill_scores: skillPercentages,
        total_score: totalScore,
        questions_answered: questions.map((q: any, i: number) => ({
          question_id: q.id,
          question: q.question,
          correct_answer: q.correct_answer,
          student_answer: answers[i],
          is_correct: q.correct_answer === answers[i]
        })),
        recommendations: generateRecommendations(skillPercentages, overallLevel)
      })
      .select()
      .single();

    if (assessmentError) {
      console.error('Error saving assessment:', assessmentError);
      return NextResponse.json(
        { success: false, error: 'Failed to save assessment' },
        { status: 500 }
      );
    }

    // به‌روزرسانی یا ایجاد مهارت‌های دانش‌آموز
    for (const [skill, score] of Object.entries(skillPercentages)) {
      const masteryLevel = score >= 70 ? 'advanced' : score >= 40 ? 'intermediate' : 'beginner';
      
      await supabase
        .from('student_skills')
        .upsert({
          student_id: studentId,
          skill_type: skill,
          current_score: score,
          mastery_level: masteryLevel,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'student_id,skill_type'
        });
    }

    return NextResponse.json({
      success: true,
      data: {
        assessment_id: assessment.id,
        overall_level: overallLevel,
        total_score: totalScore,
        skill_scores: skillPercentages,
        recommendations: assessment.recommendations
      }
    });

  } catch (error) {
    console.error('Error in assess-level API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * تولید پیشنهادات بر اساس نمرات مهارت‌ها
 */
function generateRecommendations(
  skillScores: Record<string, number>,
  overallLevel: string
): any {
  const recommendations: any[] = [];
  const weakSkills: string[] = [];
  const strongSkills: string[] = [];

  // شناسایی مهارت‌های ضعیف و قوی
  Object.entries(skillScores).forEach(([skill, score]) => {
    if (score < 40) {
      weakSkills.push(skill);
    } else if (score >= 70) {
      strongSkills.push(skill);
    }
  });

  // پیشنهادات برای مهارت‌های ضعیف
  weakSkills.forEach(skill => {
    recommendations.push({
      type: 'practice',
      priority: 'high',
      title: `تمرین ${getSkillName(skill)}`,
      description: `سطح ${getSkillName(skill)} شما نیاز به بهبود دارد. پیشنهاد می‌کنیم تمرینات بیشتری انجام دهید.`,
      skill_type: skill,
      estimated_time: 30
    });
  });

  // پیشنهادات برای مهارت‌های قوی
  strongSkills.forEach(skill => {
    recommendations.push({
      type: 'advance',
      priority: 'medium',
      title: `پیشرفت در ${getSkillName(skill)}`,
      description: `سطح ${getSkillName(skill)} شما خوب است. می‌توانید به سطح بالاتر بروید.`,
      skill_type: skill,
      estimated_time: 20
    });
  });

  // پیشنهاد کلی
  if (overallLevel === 'beginner') {
    recommendations.push({
      type: 'path',
      priority: 'high',
      title: 'شروع مسیر یادگیری مبتدی',
      description: 'پیشنهاد می‌کنیم از مسیر یادگیری مبتدی شروع کنید.',
      estimated_time: 120
    });
  }

  return recommendations;
}

function getSkillName(skill: string): string {
  const names: Record<string, string> = {
    grammar: 'گرامر',
    vocabulary: 'واژگان',
    reading: 'خواندن',
    writing: 'نوشتن',
    listening: 'شنیداری',
    speaking: 'مکالمه',
    pronunciation: 'تلفظ'
  };
  return names[skill] || skill;
}

