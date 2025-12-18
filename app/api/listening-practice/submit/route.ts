import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای ارسال پاسخ‌های تمرین شنیداری
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, exerciseId, answers, timeTaken, listeningAttempts } = body;

    if (!studentId || !exerciseId || !answers) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // دریافت سوالات تمرین
    const { data: questions, error: questionsError } = await supabase
      .from('listening_questions')
      .select('*')
      .eq('exercise_id', exerciseId)
      .order('order_index', { ascending: true });

    if (questionsError) {
      throw questionsError;
    }

    // محاسبه نمره
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    const answerDetails: any[] = [];

    questions.forEach((question: any) => {
      totalPoints += question.points || 10;
      const studentAnswer = answers[question.id];
      const isCorrect = studentAnswer && 
        studentAnswer.toString().toLowerCase().trim() === question.correct_answer.toString().toLowerCase().trim();

      if (isCorrect) {
        correctCount++;
        earnedPoints += question.points || 10;
      }

      answerDetails.push({
        question_id: question.id,
        student_answer: studentAnswer || '',
        is_correct: isCorrect,
        points_earned: isCorrect ? (question.points || 10) : 0
      });
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);

    // ایجاد submission
    const { data: submission, error: submissionError } = await supabase
      .from('listening_submissions')
      .insert({
        student_id: studentId,
        exercise_id: exerciseId,
        total_questions: questions.length,
        correct_answers: correctCount,
        score: score,
        time_taken: timeTaken || null,
        listening_attempts: listeningAttempts || 1,
        is_completed: true
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error creating submission:', submissionError);
      return NextResponse.json(
        { success: false, error: 'Failed to create submission' },
        { status: 500 }
      );
    }

    // ذخیره پاسخ‌های جزئی
    const answersData = answerDetails.map(answer => ({
      submission_id: submission.id,
      question_id: answer.question_id,
      student_answer: answer.student_answer,
      is_correct: answer.is_correct,
      points_earned: answer.points_earned
    }));

    const { error: answersError } = await supabase
      .from('listening_answers')
      .insert(answersData);

    if (answersError) {
      console.error('Error saving answers:', answersError);
    }

    return NextResponse.json({
      success: true,
      data: {
        submission_id: submission.id,
        score: score,
        correct_answers: correctCount,
        total_questions: questions.length,
        answers: answerDetails
      }
    });

  } catch (error) {
    console.error('Error in submit API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

