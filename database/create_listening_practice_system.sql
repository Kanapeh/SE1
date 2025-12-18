-- ============================================
-- سیستم تمرین شنیداری پیشرفته (Advanced Listening Practice System)
-- ============================================

-- 1. جدول تمرین‌های شنیداری (Listening Exercises)
CREATE TABLE IF NOT EXISTS public.listening_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL, -- URL فایل صوتی
    transcript TEXT, -- متن کامل فایل صوتی
    accent_type TEXT CHECK (accent_type IN ('american', 'british', 'australian', 'canadian', 'irish', 'neutral')),
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    language TEXT NOT NULL DEFAULT 'English',
    duration INTEGER, -- مدت زمان به ثانیه
    topic_category TEXT, -- دسته‌بندی موضوع
    speed_rate NUMERIC(3,2) DEFAULT 1.0, -- سرعت پخش (1.0 = normal)
    vocabulary_level TEXT, -- سطح واژگان استفاده شده
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول سوالات تمرین شنیداری (Listening Questions)
CREATE TABLE IF NOT EXISTS public.listening_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID NOT NULL REFERENCES public.listening_exercises(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank', 'short_answer', 'matching')),
    options JSONB, -- گزینه‌های سوال (برای multiple choice)
    correct_answer TEXT NOT NULL, -- پاسخ صحیح
    explanation TEXT, -- توضیح پاسخ
    points INTEGER DEFAULT 10, -- امتیاز سوال
    audio_start_time INTEGER, -- زمان شروع سوال در فایل صوتی (ثانیه)
    audio_end_time INTEGER, -- زمان پایان سوال در فایل صوتی (ثانیه)
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    order_index INTEGER DEFAULT 0, -- ترتیب سوال
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول پاسخ‌های دانش‌آموز (Student Listening Answers)
CREATE TABLE IF NOT EXISTS public.listening_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.listening_exercises(id) ON DELETE CASCADE,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    time_taken INTEGER, -- زمان صرف شده به ثانیه
    listening_attempts INTEGER DEFAULT 1, -- تعداد دفعات گوش دادن
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. جدول پاسخ‌های جزئی (Individual Answers)
CREATE TABLE IF NOT EXISTS public.listening_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.listening_submissions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.listening_questions(id) ON DELETE CASCADE,
    student_answer TEXT, -- پاسخ دانش‌آموز
    is_correct BOOLEAN DEFAULT FALSE,
    points_earned INTEGER DEFAULT 0,
    time_to_answer INTEGER, -- زمان صرف شده برای پاسخ (ثانیه)
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. جدول تمرین تشخیص گفتار (Speech Recognition Practice)
CREATE TABLE IF NOT EXISTS public.speech_recognition_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    target_text TEXT NOT NULL, -- متن هدف که دانش‌آموز باید بگوید
    audio_example_url TEXT, -- نمونه صوتی (اختیاری)
    accent_type TEXT CHECK (accent_type IN ('american', 'british', 'australian', 'canadian', 'irish', 'neutral')),
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    language TEXT NOT NULL DEFAULT 'English',
    pronunciation_hints TEXT[], -- نکات تلفظ
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. جدول پاسخ‌های تشخیص گفتار (Speech Recognition Submissions)
CREATE TABLE IF NOT EXISTS public.speech_recognition_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.speech_recognition_exercises(id) ON DELETE CASCADE,
    audio_recording_url TEXT, -- URL ضبط صوتی دانش‌آموز
    recognized_text TEXT, -- متن تشخیص داده شده
    target_text TEXT NOT NULL, -- متن هدف
    accuracy_score NUMERIC(5,2) CHECK (accuracy_score BETWEEN 0 AND 100), -- درصد دقت
    pronunciation_score NUMERIC(5,2) CHECK (pronunciation_score BETWEEN 0 AND 100), -- نمره تلفظ
    fluency_score NUMERIC(5,2) CHECK (fluency_score BETWEEN 0 AND 100), -- نمره روانی
    word_errors JSONB, -- خطاهای کلمه‌ای
    phoneme_errors JSONB, -- خطاهای فونتیک
    feedback TEXT, -- بازخورد
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. جدول تمرین لهجه (Accent Practice)
CREATE TABLE IF NOT EXISTS public.accent_practice_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    target_accent TEXT NOT NULL CHECK (target_accent IN ('american', 'british', 'australian', 'canadian', 'irish')),
    audio_url TEXT NOT NULL, -- فایل صوتی با لهجه هدف
    transcript TEXT NOT NULL, -- متن
    comparison_audio_url TEXT, -- فایل صوتی برای مقایسه (اختیاری)
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    language TEXT NOT NULL DEFAULT 'English',
    accent_features JSONB, -- ویژگی‌های لهجه (تلفظ خاص، ریتم، etc.)
    practice_tips TEXT[], -- نکات تمرین
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. جدول پاسخ‌های تمرین لهجه (Accent Practice Submissions)
CREATE TABLE IF NOT EXISTS public.accent_practice_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.accent_practice_exercises(id) ON DELETE CASCADE,
    student_audio_url TEXT, -- ضبط صوتی دانش‌آموز
    target_accent TEXT NOT NULL,
    accent_match_score NUMERIC(5,2) CHECK (accent_match_score BETWEEN 0 AND 100), -- نمره تطابق لهجه
    pronunciation_accuracy NUMERIC(5,2) CHECK (pronunciation_accuracy BETWEEN 0 AND 100),
    rhythm_score NUMERIC(5,2) CHECK (rhythm_score BETWEEN 0 AND 100), -- نمره ریتم
    intonation_score NUMERIC(5,2) CHECK (intonation_score BETWEEN 0 AND 100), -- نمره آهنگ
    feedback JSONB, -- بازخورد تفصیلی
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. جدول آمار شنیداری (Listening Statistics)
CREATE TABLE IF NOT EXISTS public.listening_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    total_exercises_completed INTEGER DEFAULT 0,
    total_listening_time INTEGER DEFAULT 0, -- مجموع زمان گوش دادن (ثانیه)
    average_score NUMERIC(5,2) DEFAULT 0,
    comprehension_rate NUMERIC(5,2) DEFAULT 0, -- درصد درک مطلب
    accent_proficiency JSONB, -- تسلط بر لهجه‌های مختلف
    weak_areas JSONB, -- نقاط ضعف
    strong_areas JSONB, -- نقاط قوت
    favorite_accents TEXT[], -- لهجه‌های مورد علاقه
    last_practiced_at TIMESTAMP WITH TIME ZONE,
    streak_days INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id)
);

-- Indexes برای بهبود عملکرد
CREATE INDEX IF NOT EXISTS idx_listening_exercises_difficulty ON public.listening_exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_listening_exercises_accent ON public.listening_exercises(accent_type);
CREATE INDEX IF NOT EXISTS idx_listening_questions_exercise ON public.listening_questions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_listening_submissions_student ON public.listening_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_listening_submissions_exercise ON public.listening_submissions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_listening_answers_submission ON public.listening_answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_speech_exercises_difficulty ON public.speech_recognition_exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_speech_submissions_student ON public.speech_recognition_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_accent_exercises_accent ON public.accent_practice_exercises(target_accent);
CREATE INDEX IF NOT EXISTS idx_accent_submissions_student ON public.accent_practice_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_listening_stats_student ON public.listening_statistics(student_id);

-- RLS Policies
ALTER TABLE public.listening_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speech_recognition_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speech_recognition_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accent_practice_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accent_practice_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_statistics ENABLE ROW LEVEL SECURITY;

-- Policies برای listening_exercises - همه می‌توانند بخوانند
CREATE POLICY "Anyone can view active listening exercises" ON public.listening_exercises
    FOR SELECT USING (is_active = TRUE);

-- Policies برای listening_questions - همه می‌توانند بخوانند
CREATE POLICY "Anyone can view listening questions" ON public.listening_questions
    FOR SELECT USING (TRUE);

-- Policies برای listening_submissions
CREATE POLICY "Students can view their own listening submissions" ON public.listening_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = listening_submissions.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own listening submissions" ON public.listening_submissions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = listening_submissions.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own listening submissions" ON public.listening_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = listening_submissions.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای listening_answers
CREATE POLICY "Students can view their own listening answers" ON public.listening_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.listening_submissions ls
            JOIN public.students s ON s.id = ls.student_id
            WHERE ls.id = listening_answers.submission_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own listening answers" ON public.listening_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.listening_submissions ls
            JOIN public.students s ON s.id = ls.student_id
            WHERE ls.id = listening_answers.submission_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای speech_recognition_exercises
CREATE POLICY "Anyone can view active speech exercises" ON public.speech_recognition_exercises
    FOR SELECT USING (is_active = TRUE);

-- Policies برای speech_recognition_submissions
CREATE POLICY "Students can view their own speech submissions" ON public.speech_recognition_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = speech_recognition_submissions.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own speech submissions" ON public.speech_recognition_submissions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = speech_recognition_submissions.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای accent_practice_exercises
CREATE POLICY "Anyone can view active accent exercises" ON public.accent_practice_exercises
    FOR SELECT USING (is_active = TRUE);

-- Policies برای accent_practice_submissions
CREATE POLICY "Students can view their own accent submissions" ON public.accent_practice_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = accent_practice_submissions.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own accent submissions" ON public.accent_practice_submissions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = accent_practice_submissions.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای listening_statistics
CREATE POLICY "Students can view their own listening statistics" ON public.listening_statistics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = listening_statistics.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own listening statistics" ON public.listening_statistics
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = listening_statistics.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Triggers برای به‌روزرسانی updated_at
CREATE TRIGGER update_listening_exercises_updated_at BEFORE UPDATE ON public.listening_exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listening_submissions_updated_at BEFORE UPDATE ON public.listening_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_speech_exercises_updated_at BEFORE UPDATE ON public.speech_recognition_exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accent_exercises_updated_at BEFORE UPDATE ON public.accent_practice_exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listening_stats_updated_at BEFORE UPDATE ON public.listening_statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function برای به‌روزرسانی آمار شنیداری
CREATE OR REPLACE FUNCTION update_listening_statistics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.listening_statistics (
        student_id, 
        total_exercises_completed, 
        total_listening_time, 
        average_score, 
        last_practiced_at
    )
    VALUES (
        NEW.student_id,
        1,
        COALESCE(NEW.time_taken, 0),
        COALESCE(NEW.score, 0),
        NOW()
    )
    ON CONFLICT (student_id) DO UPDATE SET
        total_exercises_completed = listening_statistics.total_exercises_completed + 1,
        total_listening_time = listening_statistics.total_listening_time + COALESCE(NEW.time_taken, 0),
        average_score = (
            (listening_statistics.average_score * listening_statistics.total_exercises_completed + COALESCE(NEW.score, 0)) 
            / (listening_statistics.total_exercises_completed + 1)
        ),
        last_practiced_at = NOW(),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger برای به‌روزرسانی خودکار آمار
CREATE TRIGGER update_stats_on_listening_submission
    AFTER INSERT ON public.listening_submissions
    FOR EACH ROW
    WHEN (NEW.is_completed = TRUE)
    EXECUTE FUNCTION update_listening_statistics();

-- Insert sample listening exercises
INSERT INTO public.listening_exercises (title, description, audio_url, transcript, accent_type, difficulty_level, language, duration, topic_category)
VALUES
    ('مکالمه روزمره', 'گوش دادن به یک مکالمه ساده در کافه', '/audio/listening-beginner-1.mp3', 'Hello, how are you? I am fine, thank you. What would you like to order?', 'american', 'beginner', 'English', 30, 'daily_life'),
    ('اخبار کوتاه', 'گوش دادن به یک خبر کوتاه', '/audio/listening-intermediate-1.mp3', 'Breaking news: The weather today will be sunny with a high of 25 degrees.', 'british', 'intermediate', 'English', 45, 'news'),
    ('مصاحبه علمی', 'گوش دادن به یک مصاحبه علمی', '/audio/listening-advanced-1.mp3', 'Today we are discussing the latest developments in artificial intelligence...', 'american', 'advanced', 'English', 120, 'academic')
ON CONFLICT (id) DO NOTHING;

-- Insert sample listening questions
INSERT INTO public.listening_questions (exercise_id, question_text, question_type, options, correct_answer, explanation, points, order_index)
SELECT 
    e.id,
    'What did the person order?',
    'multiple_choice',
    '["Coffee", "Tea", "Water", "Juice"]'::jsonb,
    'Coffee',
    'The person ordered coffee in the conversation.',
    10,
    1
FROM public.listening_exercises e
WHERE e.title = 'مکالمه روزمره'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Insert sample speech recognition exercises
INSERT INTO public.speech_recognition_exercises (title, description, target_text, accent_type, difficulty_level, language, pronunciation_hints)
VALUES
    ('تلفظ اعداد', 'اعداد را با تلفظ صحیح بگویید', 'One, two, three, four, five', 'american', 'beginner', 'English', ARRAY['Focus on clear pronunciation', 'Speak slowly']),
    ('جملات روزمره', 'جملات روزمره را با تلفظ صحیح بگویید', 'How are you today? I am doing well, thank you.', 'british', 'intermediate', 'English', ARRAY['Pay attention to intonation', 'Use natural rhythm'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample accent practice exercises
INSERT INTO public.accent_practice_exercises (title, description, target_accent, audio_url, transcript, difficulty_level, language, accent_features, practice_tips)
VALUES
    ('لهجه آمریکایی', 'تمرین لهجه آمریکایی', 'american', '/audio/accent-american-1.mp3', 'Hello, how are you doing today?', 'beginner', 'English', 
     '{"rhythm": "stress-timed", "pronunciation": "r-colored vowels"}'::jsonb,
     ARRAY['Focus on the "r" sound', 'Practice stress patterns']),
    ('لهجه بریتانیایی', 'تمرین لهجه بریتانیایی', 'british', '/audio/accent-british-1.mp3', 'Hello, how are you doing today?', 'intermediate', 'English',
     '{"rhythm": "stress-timed", "pronunciation": "non-rhotic"}'::jsonb,
     ARRAY['Drop the "r" sound', 'Practice British vowel sounds'])
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE public.listening_exercises IS 'تمرین‌های شنیداری';
COMMENT ON TABLE public.listening_questions IS 'سوالات تمرین‌های شنیداری';
COMMENT ON TABLE public.listening_submissions IS 'پاسخ‌های دانش‌آموزان به تمرین‌های شنیداری';
COMMENT ON TABLE public.listening_answers IS 'پاسخ‌های جزئی به سوالات';
COMMENT ON TABLE public.speech_recognition_exercises IS 'تمرین‌های تشخیص گفتار';
COMMENT ON TABLE public.speech_recognition_submissions IS 'پاسخ‌های تشخیص گفتار';
COMMENT ON TABLE public.accent_practice_exercises IS 'تمرین‌های لهجه';
COMMENT ON TABLE public.accent_practice_submissions IS 'پاسخ‌های تمرین لهجه';
COMMENT ON TABLE public.listening_statistics IS 'آمار شنیداری دانش‌آموزان';

