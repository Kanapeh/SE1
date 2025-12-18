import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای تشخیص گفتار و ارزیابی تلفظ
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, exerciseId, audioUrl, recognizedText } = body;

    if (!studentId || !exerciseId || !recognizedText) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // دریافت متن هدف
    const { data: exercise, error: exerciseError } = await supabase
      .from('speech_recognition_exercises')
      .select('target_text')
      .eq('id', exerciseId)
      .single();

    if (exerciseError) {
      throw exerciseError;
    }

    const targetText = exercise.target_text.toLowerCase().trim();
    const studentText = recognizedText.toLowerCase().trim();

    // محاسبه دقت
    const accuracy = calculateAccuracy(targetText, studentText);

    // شناسایی خطاهای کلمه‌ای
    const wordErrors = findWordErrors(targetText, studentText);

    // محاسبه نمرات
    const pronunciationScore = Math.round(accuracy * 100);
    const fluencyScore = calculateFluencyScore(recognizedText);
    const overallScore = Math.round((pronunciationScore * 0.7) + (fluencyScore * 0.3));

    // تولید بازخورد
    const feedback = generateSpeechFeedback(accuracy, wordErrors, pronunciationScore);

    // ذخیره submission
    const { data: submission, error: submissionError } = await supabase
      .from('speech_recognition_submissions')
      .insert({
        student_id: studentId,
        exercise_id: exerciseId,
        audio_recording_url: audioUrl || null,
        recognized_text: recognizedText,
        target_text: exercise.target_text,
        accuracy_score: accuracy * 100,
        pronunciation_score: pronunciationScore,
        fluency_score: fluencyScore,
        word_errors: wordErrors,
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
        accuracy: accuracy * 100,
        pronunciation_score: pronunciationScore,
        fluency_score: fluencyScore,
        overall_score: overallScore,
        word_errors: wordErrors,
        feedback: feedback
      }
    });

  } catch (error) {
    console.error('Error in speech-recognition API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * محاسبه دقت تشخیص گفتار
 */
function calculateAccuracy(target: string, student: string): number {
  const targetWords = target.split(/\s+/).filter(w => w.length > 0);
  const studentWords = student.split(/\s+/).filter(w => w.length > 0);

  if (targetWords.length === 0) return 0;

  let matches = 0;
  const minLength = Math.min(targetWords.length, studentWords.length);

  for (let i = 0; i < minLength; i++) {
    if (targetWords[i] === studentWords[i]) {
      matches++;
    }
  }

  return matches / targetWords.length;
}

/**
 * شناسایی خطاهای کلمه‌ای
 */
function findWordErrors(target: string, student: string): any[] {
  const targetWords = target.split(/\s+/).filter(w => w.length > 0);
  const studentWords = student.split(/\s+/).filter(w => w.length > 0);
  const errors: any[] = [];

  const maxLength = Math.max(targetWords.length, studentWords.length);

  for (let i = 0; i < maxLength; i++) {
    const targetWord = targetWords[i];
    const studentWord = studentWords[i];

    if (!targetWord) {
      errors.push({
        type: 'extra',
        position: i,
        word: studentWord,
        expected: null
      });
    } else if (!studentWord) {
      errors.push({
        type: 'missing',
        position: i,
        word: null,
        expected: targetWord
      });
    } else if (targetWord !== studentWord) {
      errors.push({
        type: 'incorrect',
        position: i,
        word: studentWord,
        expected: targetWord
      });
    }
  }

  return errors;
}

/**
 * محاسبه نمره روانی
 */
function calculateFluencyScore(text: string): number {
  // بر اساس طول جمله و تعداد کلمات
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);

  if (sentences.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;
  
  // نمره بر اساس طول متوسط جمله (10-20 کلمه ایده‌آل است)
  if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 20) {
    return 90;
  } else if (avgWordsPerSentence >= 5 && avgWordsPerSentence < 10) {
    return 70;
  } else if (avgWordsPerSentence > 20) {
    return 60;
  } else {
    return 50;
  }
}

/**
 * تولید بازخورد
 */
function generateSpeechFeedback(accuracy: number, errors: any[], pronunciationScore: number): string {
  const feedbacks: string[] = [];

  if (accuracy >= 0.9) {
    feedbacks.push('عالی! تلفظ شما بسیار خوب است.');
  } else if (accuracy >= 0.7) {
    feedbacks.push('خوب است، اما می‌توانید بهتر کنید.');
  } else {
    feedbacks.push('نیاز به تمرین بیشتر دارید.');
  }

  if (errors.length > 0) {
    const incorrectErrors = errors.filter(e => e.type === 'incorrect').length;
    if (incorrectErrors > 0) {
      feedbacks.push(`${incorrectErrors} کلمه اشتباه تلفظ شده است.`);
    }

    const missingErrors = errors.filter(e => e.type === 'missing').length;
    if (missingErrors > 0) {
      feedbacks.push(`${missingErrors} کلمه جا افتاده است.`);
    }
  }

  if (pronunciationScore >= 80) {
    feedbacks.push('تلفظ شما واضح و قابل فهم است.');
  } else if (pronunciationScore < 60) {
    feedbacks.push('سعی کنید واضح‌تر و آرام‌تر صحبت کنید.');
  }

  return feedbacks.join(' ');
}

