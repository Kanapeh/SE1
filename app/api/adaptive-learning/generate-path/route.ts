import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای تولید مسیر یادگیری شخصی‌سازی شده
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, targetLevel, targetDate } = body;

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

    // محاسبه سطح فعلی
    const currentLevel = calculateOverallLevel(skills || []);
    const finalTargetLevel = targetLevel || getNextLevel(currentLevel);

    // دریافت محتواهای مناسب
    const { data: allContent, error: contentError } = await supabase
      .from('learning_content')
      .select('*')
      .eq('is_active', true)
      .eq('language', 'English')
      .order('difficulty_score', { ascending: true });

    if (contentError) {
      console.error('Error fetching content:', contentError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch content' },
        { status: 500 }
      );
    }

    // ساخت مسیر یادگیری
    const learningPath = buildPersonalizedPath(
      allContent || [],
      skills || [],
      currentLevel,
      finalTargetLevel
    );

    // محاسبه تاریخ تکمیل تخمینی
    const totalDuration = learningPath.reduce((sum, content) => 
      sum + (content.estimated_duration || 10), 0
    );
    
    const estimatedCompletionDate = targetDate 
      ? new Date(targetDate)
      : new Date(Date.now() + (totalDuration * 24 * 60 * 60 * 1000)); // تخمین بر اساس زمان

    // ذخیره مسیر شخصی‌سازی شده
    // غیرفعال کردن مسیرهای قبلی
    await supabase
      .from('personalized_learning_paths')
      .update({ is_active: false })
      .eq('student_id', studentId)
      .eq('is_active', true);

    // ایجاد مسیر جدید
    const { data: newPath, error: pathError } = await supabase
      .from('personalized_learning_paths')
      .insert({
        student_id: studentId,
        custom_sequence: learningPath.map(c => c.id),
        current_position: 0,
        target_completion_date: targetDate || null,
        estimated_completion_date: estimatedCompletionDate.toISOString().split('T')[0],
        is_active: true,
        progress_percentage: 0
      })
      .select()
      .single();

    if (pathError) {
      console.error('Error creating path:', pathError);
      return NextResponse.json(
        { success: false, error: 'Failed to create learning path' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        path_id: newPath.id,
        path: learningPath,
        current_level: currentLevel,
        target_level: finalTargetLevel,
        total_duration: totalDuration,
        estimated_completion_date: estimatedCompletionDate.toISOString().split('T')[0],
        total_content: learningPath.length
      }
    });

  } catch (error) {
    console.error('Error in generate-path API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * محاسبه سطح کلی
 */
function calculateOverallLevel(skills: any[]): 'beginner' | 'intermediate' | 'advanced' {
  if (skills.length === 0) return 'beginner';

  const avgScore = skills.reduce((sum, s) => sum + s.current_score, 0) / skills.length;

  if (avgScore >= 70) return 'advanced';
  if (avgScore >= 40) return 'intermediate';
  return 'beginner';
}

/**
 * دریافت سطح بعدی
 */
function getNextLevel(currentLevel: string): 'beginner' | 'intermediate' | 'advanced' {
  if (currentLevel === 'beginner') return 'intermediate';
  if (currentLevel === 'intermediate') return 'advanced';
  return 'advanced';
}

/**
 * ساخت مسیر یادگیری شخصی‌سازی شده
 */
function buildPersonalizedPath(
  allContent: any[],
  skills: any[],
  currentLevel: string,
  targetLevel: string
): any[] {
  const path: any[] = [];
  const skillPriorities = calculateSkillPriorities(skills);

  // محتواها را بر اساس اولویت مهارت‌ها مرتب می‌کنیم
  const contentBySkill: Record<string, any[]> = {};
  
  allContent.forEach(content => {
    if (!contentBySkill[content.skill_type]) {
      contentBySkill[content.skill_type] = [];
    }
    contentBySkill[content.skill_type].push(content);
  });

  // ساخت مسیر: ابتدا مهارت‌های ضعیف، سپس مهارت‌های متوسط
  skillPriorities.forEach(({ skill, priority }) => {
    const skillContent = contentBySkill[skill] || [];
    
    // فیلتر بر اساس سطح
    const levelContent = skillContent.filter(c => {
      if (currentLevel === 'beginner' && targetLevel === 'intermediate') {
        return c.level === 'beginner' || c.level === 'intermediate';
      }
      if (currentLevel === 'intermediate' && targetLevel === 'advanced') {
        return c.level === 'intermediate' || c.level === 'advanced';
      }
      return c.level === currentLevel || c.level === targetLevel;
    });

    // اضافه کردن محتوا به مسیر
    levelContent
      .sort((a, b) => a.difficulty_score - b.difficulty_score)
      .slice(0, 5) // حداکثر 5 محتوا برای هر مهارت
      .forEach(content => {
        if (!path.find(c => c.id === content.id)) {
          path.push(content);
        }
      });
  });

  // مرتب‌سازی نهایی بر اساس difficulty_score
  return path.sort((a, b) => a.difficulty_score - b.difficulty_score);
}

/**
 * محاسبه اولویت مهارت‌ها
 */
function calculateSkillPriorities(skills: any[]): Array<{ skill: string; priority: number }> {
  const priorities = skills.map(skill => ({
    skill: skill.skill_type,
    priority: 100 - skill.current_score // مهارت‌های ضعیف‌تر اولویت بالاتر دارند
  }));

  // اگر مهارتی وجود ندارد، اولویت بالایی می‌دهیم
  const allSkills = ['grammar', 'vocabulary', 'reading', 'writing', 'listening', 'speaking'];
  allSkills.forEach(skill => {
    if (!priorities.find(p => p.skill === skill)) {
      priorities.push({ skill, priority: 100 });
    }
  });

  return priorities.sort((a, b) => b.priority - a.priority);
}

