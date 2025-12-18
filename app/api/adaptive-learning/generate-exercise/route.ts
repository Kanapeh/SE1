import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای تولید تمرین خودکار بر اساس نقاط ضعف
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, skillType, difficultyLevel } = body;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // دریافت مهارت دانش‌آموز
    const { data: skill, error: skillError } = await supabase
      .from('student_skills')
      .select('*')
      .eq('student_id', studentId)
      .eq('skill_type', skillType || 'grammar')
      .single();

    if (skillError && skillError.code !== 'PGRST116') {
      console.error('Error fetching skill:', skillError);
    }

    const currentScore = skill?.current_score || 0;
    const targetDifficulty = difficultyLevel || calculateDifficultyLevel(currentScore);

    // تولید تمرین بر اساس نوع مهارت
    const exercise = generateExerciseBySkillType(
      skillType || 'grammar',
      targetDifficulty,
      currentScore
    );

    // ذخیره تمرین در دیتابیس
    const { data: savedExercise, error: exerciseError } = await supabase
      .from('auto_exercises')
      .insert({
        student_id: studentId,
        exercise_type: skillType || 'grammar',
        difficulty_level: targetDifficulty,
        target_skill: skillType || 'grammar',
        content: exercise.content,
        correct_answer: exercise.correctAnswer
      })
      .select()
      .single();

    if (exerciseError) {
      console.error('Error saving exercise:', exerciseError);
      return NextResponse.json(
        { success: false, error: 'Failed to save exercise' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        exercise_id: savedExercise.id,
        exercise: {
          ...exercise.content,
          correct_answer: undefined // نباید پاسخ صحیح به دانش‌آموز داده شود
        },
        difficulty_level: targetDifficulty,
        estimated_time: exercise.estimatedTime
      }
    });

  } catch (error) {
    console.error('Error in generate-exercise API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * محاسبه سطح دشواری بر اساس نمره فعلی
 */
function calculateDifficultyLevel(score: number): 'easy' | 'medium' | 'hard' {
  if (score < 40) return 'easy';
  if (score < 70) return 'medium';
  return 'hard';
}

/**
 * تولید تمرین بر اساس نوع مهارت
 */
function generateExerciseBySkillType(
  skillType: string,
  difficulty: 'easy' | 'medium' | 'hard',
  currentScore: number
): { content: any; correctAnswer: any; estimatedTime: number } {
  switch (skillType) {
    case 'grammar':
      return generateGrammarExercise(difficulty);
    case 'vocabulary':
      return generateVocabularyExercise(difficulty);
    case 'reading':
      return generateReadingExercise(difficulty);
    case 'writing':
      return generateWritingExercise(difficulty);
    case 'listening':
      return generateListeningExercise(difficulty);
    case 'speaking':
      return generateSpeakingExercise(difficulty);
    default:
      return generateGrammarExercise(difficulty);
  }
}

/**
 * تولید تمرین گرامر
 */
function generateGrammarExercise(difficulty: string): { content: any; correctAnswer: any; estimatedTime: number } {
  const exercises: Record<string, any> = {
    easy: {
      question: "Choose the correct form: I ___ to school every day.",
      options: ["go", "goes", "going", "went"],
      correct_answer: "go",
      explanation: "We use 'go' with 'I' in present simple tense."
    },
    medium: {
      question: "Choose the correct form: If I ___ rich, I would travel the world.",
      options: ["am", "was", "were", "be"],
      correct_answer: "were",
      explanation: "In second conditional, we use 'were' for all subjects."
    },
    hard: {
      question: "Choose the correct form: The book ___ by millions of people has been translated into many languages.",
      options: ["which read", "which is read", "which was read", "which has been read"],
      correct_answer: "which has been read",
      explanation: "We use present perfect passive to show an action that started in the past and continues to the present."
    }
  };

  return {
    content: exercises[difficulty] || exercises.easy,
    correctAnswer: exercises[difficulty]?.correct_answer || exercises.easy.correct_answer,
    estimatedTime: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 5
  };
}

/**
 * تولید تمرین واژگان
 */
function generateVocabularyExercise(difficulty: string): { content: any; correctAnswer: any; estimatedTime: number } {
  const exercises: Record<string, any> = {
    easy: {
      question: "What is the meaning of 'happy'?",
      options: ["غمگین", "خوشحال", "عصبانی", "خسته"],
      correct_answer: "خوشحال",
      explanation: "'Happy' means feeling or showing pleasure or contentment."
    },
    medium: {
      question: "Choose the synonym of 'enormous':",
      options: ["small", "tiny", "huge", "little"],
      correct_answer: "huge",
      explanation: "'Enormous' and 'huge' both mean very large in size."
    },
    hard: {
      question: "What does 'ubiquitous' mean?",
      options: ["rare", "present everywhere", "invisible", "expensive"],
      correct_answer: "present everywhere",
      explanation: "'Ubiquitous' means present, appearing, or found everywhere."
    }
  };

  return {
    content: exercises[difficulty] || exercises.easy,
    correctAnswer: exercises[difficulty]?.correct_answer || exercises.easy.correct_answer,
    estimatedTime: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 5
  };
}

/**
 * تولید تمرین خواندن
 */
function generateReadingExercise(difficulty: string): { content: any; correctAnswer: any; estimatedTime: number } {
  const exercises: Record<string, any> = {
    easy: {
      passage: "Tom is a student. He goes to school every day. He likes math and science.",
      questions: [
        {
          question: "What does Tom do?",
          options: ["He is a teacher", "He is a student", "He is a doctor", "He is a driver"],
          correct_answer: "He is a student"
        }
      ]
    },
    medium: {
      passage: "Climate change is one of the most pressing issues of our time. It affects every aspect of our lives, from the food we eat to the air we breathe.",
      questions: [
        {
          question: "What is the main topic of this passage?",
          options: ["Food", "Climate change", "Air quality", "Time"],
          correct_answer: "Climate change"
        }
      ]
    },
    hard: {
      passage: "The quantum mechanics revolution of the early 20th century fundamentally altered our understanding of the physical world, introducing concepts such as wave-particle duality and uncertainty principle.",
      questions: [
        {
          question: "What did quantum mechanics introduce?",
          options: ["New planets", "Wave-particle duality", "Classical physics", "Newton's laws"],
          correct_answer: "Wave-particle duality"
        }
      ]
    }
  };

  return {
    content: exercises[difficulty] || exercises.easy,
    correctAnswer: exercises[difficulty]?.questions[0]?.correct_answer || exercises.easy.questions[0].correct_answer,
    estimatedTime: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12
  };
}

/**
 * تولید تمرین نوشتن
 */
function generateWritingExercise(difficulty: string): { content: any; correctAnswer: any; estimatedTime: number } {
  const exercises: Record<string, any> = {
    easy: {
      prompt: "Write 3 sentences about your daily routine.",
      word_limit: 30,
      criteria: ["Use present simple tense", "Include time expressions", "Write complete sentences"]
    },
    medium: {
      prompt: "Write a paragraph describing your favorite place. Explain why you like it.",
      word_limit: 100,
      criteria: ["Use descriptive adjectives", "Include reasons", "Write 4-5 sentences"]
    },
    hard: {
      prompt: "Write an essay discussing the advantages and disadvantages of social media. Include examples and your opinion.",
      word_limit: 250,
      criteria: ["Use formal language", "Include both sides", "Provide examples", "State your opinion clearly"]
    }
  };

  return {
    content: exercises[difficulty] || exercises.easy,
    correctAnswer: null, // نوشتن نیاز به ارزیابی دستی دارد
    estimatedTime: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30
  };
}

/**
 * تولید تمرین شنیداری
 */
function generateListeningExercise(difficulty: string): { content: any; correctAnswer: any; estimatedTime: number } {
  return {
    content: {
      audio_url: `/audio/listening-${difficulty}-${Date.now()}.mp3`,
      transcript: "This is a sample listening exercise.",
      questions: [
        {
          question: "What is the main topic?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct_answer: "Option A"
        }
      ]
    },
    correctAnswer: "Option A",
    estimatedTime: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12
  };
}

/**
 * تولید تمرین مکالمه
 */
function generateSpeakingExercise(difficulty: string): { content: any; correctAnswer: any; estimatedTime: number } {
  return {
    content: {
      prompt: "Describe your favorite hobby in 2 minutes.",
      criteria: ["Clear pronunciation", "Use appropriate vocabulary", "Speak fluently", "Use correct grammar"],
      recording_time_limit: 120
    },
    correctAnswer: null, // نیاز به ارزیابی دستی
    estimatedTime: 5
  };
}

