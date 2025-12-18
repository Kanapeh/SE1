import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای تمرین لهجه و ارزیابی تطابق
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, exerciseId, audioUrl, recognizedText } = body;

    if (!studentId || !exerciseId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // دریافت اطلاعات تمرین
    const { data: exercise, error: exerciseError } = await supabase
      .from('accent_practice_exercises')
      .select('*')
      .eq('id', exerciseId)
      .single();

    if (exerciseError) {
      throw exerciseError;
    }

    // در اینجا می‌توان از API های تشخیص لهجه استفاده کرد
    // برای نمونه، یک ارزیابی ساده انجام می‌دهیم
    const accentMatchScore = evaluateAccentMatch(exercise.target_accent, recognizedText || '');
    const pronunciationAccuracy = accentMatchScore * 0.9; // فرض می‌کنیم تلفظ خوب است
    const rhythmScore = 75; // نمره ریتم (می‌توان از تحلیل صوتی استفاده کرد)
    const intonationScore = 80; // نمره آهنگ

    const feedback = generateAccentFeedback(exercise.target_accent, accentMatchScore, exercise.accent_features);

    // ذخیره submission
    const { data: submission, error: submissionError } = await supabase
      .from('accent_practice_submissions')
      .insert({
        student_id: studentId,
        exercise_id: exerciseId,
        student_audio_url: audioUrl || null,
        target_accent: exercise.target_accent,
        accent_match_score: accentMatchScore,
        pronunciation_accuracy: pronunciationAccuracy,
        rhythm_score: rhythmScore,
        intonation_score: intonationScore,
        feedback: feedback
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error creating submission:', submissionError);
    }

    return NextResponse.json({
      success: true,
      data: {
        submission_id: submission?.id,
        accent_match_score: accentMatchScore,
        pronunciation_accuracy: pronunciationAccuracy,
        rhythm_score: rhythmScore,
        intonation_score: intonationScore,
        feedback: feedback
      }
    });

  } catch (error) {
    console.error('Error in accent-practice API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * ارزیابی تطابق لهجه (نمونه - در واقعیت نیاز به API پیشرفته دارد)
 */
function evaluateAccentMatch(targetAccent: string, text: string): number {
  // این یک نمونه ساده است
  // در واقعیت باید از API های تشخیص لهجه استفاده شود
  
  const accentFeatures: Record<string, string[]> = {
    american: ['r-colored', 'flat a', 'rhotic'],
    british: ['non-rhotic', 'rounded o', 'long a'],
    australian: ['rising intonation', 'short i'],
    canadian: ['canadian raising', 'about'],
    irish: ['rolled r', 'dental t']
  };

  // بررسی ساده بر اساس ویژگی‌های لهجه
  let score = 70; // نمره پایه

  // در اینجا می‌توان تحلیل پیشرفته‌تری انجام داد
  // برای نمونه، بررسی الگوهای صوتی خاص

  return Math.min(100, score);
}

/**
 * تولید بازخورد لهجه
 */
function generateAccentFeedback(targetAccent: string, matchScore: number, features: any): any {
  const accentNames: Record<string, string> = {
    american: 'آمریکایی',
    british: 'بریتانیایی',
    australian: 'استرالیایی',
    canadian: 'کانادایی',
    irish: 'ایرلندی'
  };

  const feedback: any = {
    overall: '',
    strengths: [],
    improvements: [],
    tips: []
  };

  if (matchScore >= 80) {
    feedback.overall = `عالی! لهجه ${accentNames[targetAccent]} شما بسیار خوب است.`;
    feedback.strengths.push('تلفظ صحیح');
    feedback.strengths.push('ریتم طبیعی');
  } else if (matchScore >= 60) {
    feedback.overall = `خوب است، اما می‌توانید لهجه ${accentNames[targetAccent]} را بهتر کنید.`;
    feedback.improvements.push('تمرین بیشتر روی تلفظ');
  } else {
    feedback.overall = `نیاز به تمرین بیشتر برای لهجه ${accentNames[targetAccent]}.`;
    feedback.improvements.push('گوش دادن بیشتر به نمونه‌های صوتی');
    feedback.improvements.push('تمرین تلفظ');
  }

  if (targetAccent === 'american') {
    feedback.tips.push('روی تلفظ "r" تمرین کنید');
    feedback.tips.push('از ریتم stress-timed استفاده کنید');
  } else if (targetAccent === 'british') {
    feedback.tips.push('"r" را در انتهای کلمات تلفظ نکنید');
    feedback.tips.push('روی واکه‌های بریتانیایی تمرین کنید');
  }

  return feedback;
}

