-- ============================================
-- سیستم تمرین نوشتن (Writing Practice System)
-- ============================================

-- 1. جدول تمرین‌های نوشتن (Writing Exercises)
CREATE TABLE IF NOT EXISTS public.writing_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    prompt TEXT NOT NULL, -- موضوع یا سوال تمرین
    topic_category TEXT, -- دسته‌بندی موضوع (daily_life, academic, business, creative, etc.)
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    language TEXT NOT NULL DEFAULT 'English',
    word_limit_min INTEGER DEFAULT 50,
    word_limit_max INTEGER DEFAULT 500,
    estimated_time INTEGER DEFAULT 15, -- minutes
    example_text TEXT, -- نمونه نوشته خوب
    evaluation_criteria JSONB, -- معیارهای ارزیابی
    tips TEXT[], -- نکات و راهنمایی‌ها
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول پاسخ‌های دانش‌آموز (Student Writing Submissions)
CREATE TABLE IF NOT EXISTS public.writing_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.writing_exercises(id) ON DELETE CASCADE,
    content TEXT NOT NULL, -- نوشته دانش‌آموز
    word_count INTEGER DEFAULT 0,
    character_count INTEGER DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_graded BOOLEAN DEFAULT FALSE,
    auto_correction_data JSONB, -- نتایج تصحیح خودکار
    improvement_suggestions JSONB, -- پیشنهادات بهبود
    overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
    grammar_score INTEGER CHECK (grammar_score BETWEEN 0 AND 100),
    vocabulary_score INTEGER CHECK (vocabulary_score BETWEEN 0 AND 100),
    coherence_score INTEGER CHECK (coherence_score BETWEEN 0 AND 100),
    creativity_score INTEGER CHECK (creativity_score BETWEEN 0 AND 100),
    teacher_feedback TEXT, -- بازخورد معلم (اختیاری)
    teacher_score INTEGER CHECK (teacher_score BETWEEN 0 AND 100),
    is_revised BOOLEAN DEFAULT FALSE, -- آیا بازنویسی شده
    revised_content TEXT, -- محتوای بازنویسی شده
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول خطاهای گرامری شناسایی شده (Grammar Errors)
CREATE TABLE IF NOT EXISTS public.writing_grammar_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.writing_submissions(id) ON DELETE CASCADE,
    error_type TEXT NOT NULL, -- نوع خطا (tense, subject_verb, articles, prepositions, etc.)
    error_text TEXT NOT NULL, -- متن اشتباه
    correct_text TEXT NOT NULL, -- متن صحیح
    position_start INTEGER, -- موقعیت شروع خطا در متن
    position_end INTEGER, -- موقعیت پایان خطا در متن
    explanation TEXT, -- توضیح خطا
    severity TEXT CHECK (severity IN ('critical', 'major', 'minor')),
    is_corrected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. جدول پیشنهادات بهبود (Improvement Suggestions)
CREATE TABLE IF NOT EXISTS public.writing_improvements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.writing_submissions(id) ON DELETE CASCADE,
    suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('grammar', 'vocabulary', 'structure', 'style', 'coherence', 'creativity')),
    original_text TEXT, -- متن اصلی
    suggested_text TEXT, -- متن پیشنهادی
    explanation TEXT NOT NULL, -- توضیح پیشنهاد
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
    is_applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. جدول آمار نوشتن دانش‌آموز (Writing Statistics)
CREATE TABLE IF NOT EXISTS public.writing_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    total_submissions INTEGER DEFAULT 0,
    total_words_written INTEGER DEFAULT 0,
    average_score NUMERIC(5,2) DEFAULT 0,
    grammar_accuracy NUMERIC(5,2) DEFAULT 0, -- درصد صحت گرامر
    vocabulary_diversity NUMERIC(5,2) DEFAULT 0, -- تنوع واژگان
    improvement_rate NUMERIC(5,2) DEFAULT 0, -- نرخ بهبود
    favorite_topics TEXT[], -- موضوعات مورد علاقه
    weak_areas JSONB, -- نقاط ضعف
    strong_areas JSONB, -- نقاط قوت
    last_practiced_at TIMESTAMP WITH TIME ZONE,
    streak_days INTEGER DEFAULT 0, -- روزهای متوالی تمرین
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id)
);

-- 6. جدول الگوهای نوشتن (Writing Templates)
CREATE TABLE IF NOT EXISTS public.writing_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL CHECK (template_type IN ('essay', 'letter', 'email', 'story', 'report', 'review', 'article')),
    structure JSONB NOT NULL, -- ساختار الگو (introduction, body, conclusion, etc.)
    example_content TEXT, -- نمونه محتوا
    tips TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes برای بهبود عملکرد
CREATE INDEX IF NOT EXISTS idx_writing_exercises_difficulty ON public.writing_exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_writing_exercises_topic ON public.writing_exercises(topic_category);
CREATE INDEX IF NOT EXISTS idx_writing_submissions_student ON public.writing_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_writing_submissions_exercise ON public.writing_submissions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_writing_submissions_submitted ON public.writing_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_grammar_errors_submission ON public.writing_grammar_errors(submission_id);
CREATE INDEX IF NOT EXISTS idx_improvements_submission ON public.writing_improvements(submission_id);
CREATE INDEX IF NOT EXISTS idx_writing_stats_student ON public.writing_statistics(student_id);

-- RLS Policies
ALTER TABLE public.writing_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_grammar_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_templates ENABLE ROW LEVEL SECURITY;

-- Policies برای writing_exercises - همه می‌توانند بخوانند
CREATE POLICY "Anyone can view active writing exercises" ON public.writing_exercises
    FOR SELECT USING (is_active = TRUE);

-- Policies برای writing_submissions
CREATE POLICY "Students can view their own submissions" ON public.writing_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = writing_submissions.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own submissions" ON public.writing_submissions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = writing_submissions.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own submissions" ON public.writing_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = writing_submissions.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای writing_grammar_errors
CREATE POLICY "Students can view their own grammar errors" ON public.writing_grammar_errors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.writing_submissions ws
            JOIN public.students s ON s.id = ws.student_id
            WHERE ws.id = writing_grammar_errors.submission_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای writing_improvements
CREATE POLICY "Students can view their own improvements" ON public.writing_improvements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.writing_submissions ws
            JOIN public.students s ON s.id = ws.student_id
            WHERE ws.id = writing_improvements.submission_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای writing_statistics
CREATE POLICY "Students can view their own statistics" ON public.writing_statistics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = writing_statistics.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own statistics" ON public.writing_statistics
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = writing_statistics.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای writing_templates - همه می‌توانند بخوانند
CREATE POLICY "Anyone can view active writing templates" ON public.writing_templates
    FOR SELECT USING (is_active = TRUE);

-- Triggers برای به‌روزرسانی updated_at
CREATE TRIGGER update_writing_exercises_updated_at BEFORE UPDATE ON public.writing_exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_writing_submissions_updated_at BEFORE UPDATE ON public.writing_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_writing_statistics_updated_at BEFORE UPDATE ON public.writing_statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_writing_templates_updated_at BEFORE UPDATE ON public.writing_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function برای محاسبه تعداد کلمات
CREATE OR REPLACE FUNCTION calculate_word_count(text_content TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN array_length(string_to_array(trim(text_content), ' '), 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function برای به‌روزرسانی آمار نوشتن
CREATE OR REPLACE FUNCTION update_writing_statistics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.writing_statistics (student_id, total_submissions, total_words_written, average_score, last_practiced_at)
    VALUES (
        NEW.student_id,
        1,
        NEW.word_count,
        COALESCE(NEW.overall_score, 0),
        NOW()
    )
    ON CONFLICT (student_id) DO UPDATE SET
        total_submissions = writing_statistics.total_submissions + 1,
        total_words_written = writing_statistics.total_words_written + NEW.word_count,
        average_score = (
            (writing_statistics.average_score * writing_statistics.total_submissions + COALESCE(NEW.overall_score, 0)) 
            / (writing_statistics.total_submissions + 1)
        ),
        last_practiced_at = NOW(),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger برای به‌روزرسانی خودکار آمار
CREATE TRIGGER update_stats_on_submission
    AFTER INSERT ON public.writing_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_writing_statistics();

-- Insert sample writing exercises
INSERT INTO public.writing_exercises (title, description, prompt, topic_category, difficulty_level, language, word_limit_min, word_limit_max, estimated_time, evaluation_criteria, tips)
VALUES
    ('روز من', 'در مورد یک روز معمولی خود بنویسید', 'Describe a typical day in your life. What do you do from morning to night?', 'daily_life', 'beginner', 'English', 50, 150, 15, 
     '{"grammar": 30, "vocabulary": 25, "coherence": 25, "creativity": 20}'::jsonb,
     ARRAY['Use present simple tense', 'Include time expressions', 'Write complete sentences']),
    
    ('نامه به دوست', 'یک نامه به دوست خود بنویسید', 'Write a letter to a friend telling them about your recent vacation or trip.', 'personal', 'intermediate', 'English', 100, 250, 20,
     '{"grammar": 30, "vocabulary": 25, "structure": 25, "style": 20}'::jsonb,
     ARRAY['Use appropriate greeting', 'Organize your ideas', 'Use past tense']),
    
    ('مقاله نظر', 'نظر خود را در مورد یک موضوع بیان کنید', 'Write an essay expressing your opinion on social media. Discuss both advantages and disadvantages.', 'academic', 'advanced', 'English', 200, 400, 30,
     '{"grammar": 25, "vocabulary": 25, "structure": 25, "coherence": 25}'::jsonb,
     ARRAY['Use formal language', 'Include both sides', 'Provide examples', 'State your opinion clearly'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample writing templates
INSERT INTO public.writing_templates (name, description, template_type, structure, example_content, tips)
VALUES
    ('الگوی مقاله', 'ساختار استاندارد یک مقاله', 'essay',
     '{"introduction": "مقدمه و بیان موضوع", "body": "بدنه با پاراگراف‌های جداگانه", "conclusion": "نتیجه‌گیری"}'::jsonb,
     'Introduction: In today''s world...\n\nBody Paragraph 1: First, ...\nBody Paragraph 2: Second, ...\n\nConclusion: In conclusion...',
     ARRAY['Start with a hook', 'Use topic sentences', 'Provide evidence', 'Summarize main points']),
    
    ('الگوی نامه', 'ساختار نامه رسمی', 'letter',
     '{"greeting": "سلام و احوال‌پرسی", "body": "متن اصلی", "closing": "خداحافظی و امضا"}'::jsonb,
     'Dear [Name],\n\nI hope this letter finds you well...\n\nBest regards,\n[Your Name]',
     ARRAY['Use appropriate greeting', 'Be clear and concise', 'End politely'])
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE public.writing_exercises IS 'تمرین‌های نوشتن';
COMMENT ON TABLE public.writing_submissions IS 'نوشته‌های ارسال شده توسط دانش‌آموزان';
COMMENT ON TABLE public.writing_grammar_errors IS 'خطاهای گرامری شناسایی شده';
COMMENT ON TABLE public.writing_improvements IS 'پیشنهادات بهبود نوشته';
COMMENT ON TABLE public.writing_statistics IS 'آمار نوشتن دانش‌آموزان';
COMMENT ON TABLE public.writing_templates IS 'الگوهای نوشتن';

