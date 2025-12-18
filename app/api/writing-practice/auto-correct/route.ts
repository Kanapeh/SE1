import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API برای تصحیح خودکار نوشته‌های دانش‌آموز
 * این endpoint نوشته را تحلیل می‌کند و خطاهای گرامری و پیشنهادات بهبود را ارائه می‌دهد
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, content, exerciseId } = body;

    if (!content || !exerciseId) {
      return NextResponse.json(
        { success: false, error: 'Content and exercise ID are required' },
        { status: 400 }
      );
    }

    // محاسبه تعداد کلمات و کاراکترها
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characterCount = content.length;

    // تحلیل نوشته و شناسایی خطاها
    const analysis = analyzeWriting(content);

    // محاسبه نمرات
    const scores = calculateScores(analysis, content);

    // تولید پیشنهادات بهبود
    const improvements = generateImprovements(content, analysis);

    // ذخیره نتایج در دیتابیس
    if (submissionId) {
      // به‌روزرسانی submission موجود
      const { error: updateError } = await supabase
        .from('writing_submissions')
        .update({
          content: content,
          word_count: wordCount,
          character_count: characterCount,
          auto_correction_data: analysis,
          improvement_suggestions: improvements,
          overall_score: scores.overall,
          grammar_score: scores.grammar,
          vocabulary_score: scores.vocabulary,
          coherence_score: scores.coherence,
          creativity_score: scores.creativity,
          is_graded: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (updateError) {
        console.error('Error updating submission:', updateError);
      } else {
        // ذخیره خطاهای گرامری
        if (analysis.grammarErrors && analysis.grammarErrors.length > 0) {
          const grammarErrorsData = analysis.grammarErrors.map((error: any) => ({
            submission_id: submissionId,
            error_type: error.type,
            error_text: error.original,
            correct_text: error.corrected,
            position_start: error.start,
            position_end: error.end,
            explanation: error.explanation,
            severity: error.severity || 'minor'
          }));

          await supabase
            .from('writing_grammar_errors')
            .insert(grammarErrorsData);
        }

        // ذخیره پیشنهادات بهبود
        if (improvements && improvements.length > 0) {
          const improvementsData = improvements.map((improvement: any) => ({
            submission_id: submissionId,
            suggestion_type: improvement.type,
            original_text: improvement.original,
            suggested_text: improvement.suggested,
            explanation: improvement.explanation,
            priority: improvement.priority || 'medium'
          }));

          await supabase
            .from('writing_improvements')
            .insert(improvementsData);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        word_count: wordCount,
        character_count: characterCount,
        scores: scores,
        grammar_errors: analysis.grammarErrors || [],
        improvements: improvements,
        feedback: generateFeedback(scores, analysis)
      }
    });

  } catch (error) {
    console.error('Error in auto-correct API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * تحلیل نوشته و شناسایی خطاها
 */
function analyzeWriting(content: string): any {
  const grammarErrors: any[] = [];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // بررسی خطاهای رایج گرامری
  const commonErrors = [
    {
      pattern: /\b(he|she|it)\s+(go|come|do|have)\b/gi,
      correction: (match: string) => {
        const words = match.split(' ');
        return `${words[0]} ${words[1]}s`;
      },
      type: 'subject_verb_agreement',
      explanation: 'Subject and verb must agree in number'
    },
    {
      // فقط "a" را قبل از کلمات صدادار پیدا می‌کند (نه "an")
      pattern: /\ba\s+(a|e|i|o|u)\w+/gi,
      correction: (match: string) => {
        return match.replace('a ', 'an ');
      },
      type: 'article',
      explanation: 'Use "an" before words starting with a vowel sound'
    },
    {
      // "an" را قبل از کلمات غیر صدادار پیدا می‌کند (خطا)
      pattern: /\ban\s+[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]\w+/gi,
      correction: (match: string) => {
        return match.replace('an ', 'a ');
      },
      type: 'article',
      explanation: 'Use "a" before words starting with a consonant sound'
    },
    {
      pattern: /\b(i|we|you|they)\s+(is|was)\b/gi,
      correction: (match: string) => match.replace(/\s+(is|was)\b/i, ' are'),
      type: 'verb_tense',
      explanation: 'Incorrect verb form'
    }
  ];

  commonErrors.forEach(errorPattern => {
    const regex = new RegExp(errorPattern.pattern);
    let match;
    // Reset lastIndex to avoid issues with global regex
    regex.lastIndex = 0;
    while ((match = regex.exec(content)) !== null) {
      // بررسی اینکه آیا این واقعاً یک خطا است یا نه
      const originalText = match[0];
      const correctedText = errorPattern.correction(originalText);
      
      // اگر original و corrected یکسان باشند، خطا نیست
      if (originalText.toLowerCase() === correctedText.toLowerCase()) {
        continue;
      }
      
      grammarErrors.push({
        type: errorPattern.type,
        original: originalText,
        corrected: correctedText,
        start: match.index,
        end: match.index + match[0].length,
        explanation: errorPattern.explanation,
        severity: 'minor'
      });
    }
  });

  // بررسی ساختار جمله
  const structureIssues: any[] = [];
  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim();
    if (trimmed.length < 10) {
      structureIssues.push({
        type: 'sentence_length',
        sentence: trimmed,
        suggestion: 'This sentence is too short. Try to add more details.',
        position: index
      });
    }
  });

  return {
    grammarErrors,
    structureIssues,
    sentenceCount: sentences.length,
    averageSentenceLength: content.length / sentences.length
  };
}

/**
 * محاسبه نمرات
 */
function calculateScores(analysis: any, content: string): any {
  const grammarErrors = analysis.grammarErrors || [];
  const wordCount = content.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
  
  // نمره گرامر (کاهش بر اساس تعداد خطاها)
  const grammarScore = Math.max(0, 100 - (grammarErrors.length * 10));
  
  // نمره واژگان (بر اساس تنوع کلمات)
  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);
  const vocabularyScore = Math.min(100, Math.round((uniqueWords.size / words.length) * 100));
  
  // نمره انسجام (بر اساس طول جملات و ساختار)
  const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? content.length / sentences.length : 0;
  const coherenceScore = avgSentenceLength > 50 && avgSentenceLength < 150 ? 80 : 60;
  
  // نمره خلاقیت (بر اساس استفاده از صفات و قیدها)
  const adjectives = (content.match(/\b\w+ly\b|\b\w+ful\b|\b\w+ous\b/gi) || []).length;
  const creativityScore = Math.min(100, Math.round((adjectives / wordCount) * 100 * 10));
  
  // نمره کلی
  const overallScore = Math.round(
    (grammarScore * 0.3) +
    (vocabularyScore * 0.25) +
    (coherenceScore * 0.25) +
    (creativityScore * 0.2)
  );

  return {
    overall: overallScore,
    grammar: grammarScore,
    vocabulary: vocabularyScore,
    coherence: coherenceScore,
    creativity: creativityScore
  };
}

/**
 * تولید پیشنهادات بهبود
 */
function generateImprovements(content: string, analysis: any): any[] {
  const improvements: any[] = [];
  
  // پیشنهادات گرامری
  analysis.grammarErrors?.forEach((error: any) => {
    improvements.push({
      type: 'grammar',
      original: error.original,
      suggested: error.corrected,
      explanation: error.explanation,
      priority: 'high'
    });
  });

  // پیشنهادات واژگان
  const simpleWords = ['good', 'bad', 'nice', 'big', 'small', 'very'];
  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  simpleWords.forEach(word => {
    if (words.includes(word)) {
      const alternatives: Record<string, string[]> = {
        'good': ['excellent', 'wonderful', 'great', 'fantastic'],
        'bad': ['terrible', 'awful', 'poor', 'horrible'],
        'nice': ['pleasant', 'delightful', 'charming', 'lovely'],
        'big': ['large', 'huge', 'enormous', 'massive'],
        'small': ['tiny', 'little', 'miniature', 'compact'],
        'very': ['extremely', 'incredibly', 'remarkably', 'particularly']
      };
      
      if (alternatives[word]) {
        improvements.push({
          type: 'vocabulary',
          original: word,
          suggested: alternatives[word][0],
          explanation: `Consider using "${alternatives[word][0]}" instead of "${word}" for more variety`,
          priority: 'medium'
        });
      }
    }
  });

  // پیشنهادات ساختار
  const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
  if (sentences.length < 3) {
    improvements.push({
      type: 'structure',
      original: '',
      suggested: 'Try to write more sentences to develop your ideas',
      explanation: 'Your text is too short. Add more sentences to provide more details.',
      priority: 'high'
    });
  }

  // پیشنهادات سبک
  if (!content.includes(',')) {
    improvements.push({
      type: 'style',
      original: '',
      suggested: 'Use commas to connect related ideas',
      explanation: 'Using commas can make your writing flow better',
      priority: 'low'
    });
  }

  return improvements;
}

/**
 * تولید بازخورد کلی
 */
function generateFeedback(scores: any, analysis: any): string {
  const feedbacks: string[] = [];
  
  if (scores.overall >= 80) {
    feedbacks.push('عالی! نوشته شما بسیار خوب است.');
  } else if (scores.overall >= 60) {
    feedbacks.push('خوب است، اما می‌توانید بهتر کنید.');
  } else {
    feedbacks.push('نیاز به تمرین بیشتر دارید.');
  }

  if (scores.grammar < 70) {
    feedbacks.push('توجه بیشتری به گرامر داشته باشید.');
  }

  if (scores.vocabulary < 70) {
    feedbacks.push('سعی کنید از واژگان متنوع‌تری استفاده کنید.');
  }

  if (analysis.grammarErrors && analysis.grammarErrors.length > 0) {
    feedbacks.push(`${analysis.grammarErrors.length} خطای گرامری شناسایی شد.`);
  }

  return feedbacks.join(' ');
}

