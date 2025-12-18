-- ============================================
-- سیستم یادگیری تطبیقی (Adaptive Learning System)
-- ============================================

-- 1. جدول محتوای آموزشی (Learning Content)
CREATE TABLE IF NOT EXISTS public.learning_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL CHECK (content_type IN ('lesson', 'exercise', 'quiz', 'video', 'article', 'game')),
    language TEXT NOT NULL DEFAULT 'English',
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    skill_type TEXT NOT NULL CHECK (skill_type IN ('grammar', 'vocabulary', 'reading', 'writing', 'listening', 'speaking', 'pronunciation')),
    difficulty_score INTEGER NOT NULL DEFAULT 50 CHECK (difficulty_score BETWEEN 0 AND 100),
    estimated_duration INTEGER NOT NULL DEFAULT 10, -- minutes
    content_data JSONB, -- محتوای اصلی (متن، سوالات، ویدیو URL، ...)
    prerequisites UUID[], -- محتوای پیش‌نیاز
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول مسیرهای یادگیری (Learning Paths)
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    language TEXT NOT NULL DEFAULT 'English',
    target_level TEXT NOT NULL CHECK (target_level IN ('beginner', 'intermediate', 'advanced')),
    total_duration INTEGER, -- total minutes
    content_sequence UUID[] NOT NULL, -- ترتیب محتواها
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول پیشرفت دانش‌آموز (Student Progress)
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES public.learning_content(id) ON DELETE CASCADE,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    attempts INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- seconds
    completed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, content_id)
);

-- 4. جدول ارزیابی سطح (Level Assessments)
CREATE TABLE IF NOT EXISTS public.level_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL CHECK (assessment_type IN ('initial', 'periodic', 'final', 'skill_specific')),
    skill_type TEXT CHECK (skill_type IN ('grammar', 'vocabulary', 'reading', 'writing', 'listening', 'speaking', 'pronunciation', 'overall')),
    overall_level TEXT CHECK (overall_level IN ('beginner', 'intermediate', 'advanced')),
    skill_scores JSONB NOT NULL, -- {grammar: 75, vocabulary: 80, reading: 70, ...}
    total_score INTEGER CHECK (total_score BETWEEN 0 AND 100),
    questions_answered JSONB, -- سوالات و پاسخ‌ها
    recommendations JSONB, -- پیشنهادات سیستم
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. جدول نقاط ضعف و قوت (Strengths & Weaknesses)
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    skill_type TEXT NOT NULL CHECK (skill_type IN ('grammar', 'vocabulary', 'reading', 'writing', 'listening', 'speaking', 'pronunciation')),
    current_score INTEGER NOT NULL DEFAULT 0 CHECK (current_score BETWEEN 0 AND 100),
    mastery_level TEXT NOT NULL DEFAULT 'beginner' CHECK (mastery_level IN ('beginner', 'intermediate', 'advanced')),
    total_practice_time INTEGER DEFAULT 0, -- seconds
    exercises_completed INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMP WITH TIME ZONE,
    improvement_trend TEXT CHECK (improvement_trend IN ('improving', 'stable', 'declining')),
    weak_areas JSONB, -- لیست موضوعات ضعیف
    strong_areas JSONB, -- لیست موضوعات قوی
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, skill_type)
);

-- 6. جدول پیشنهادات محتوا (Content Recommendations)
CREATE TABLE IF NOT EXISTS public.content_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES public.learning_content(id) ON DELETE CASCADE,
    recommendation_reason TEXT NOT NULL, -- چرا این محتوا پیشنهاد شده
    priority INTEGER NOT NULL DEFAULT 50 CHECK (priority BETWEEN 0 AND 100), -- اولویت پیشنهاد
    algorithm_version TEXT, -- نسخه الگوریتم استفاده شده
    is_viewed BOOLEAN DEFAULT FALSE,
    is_accepted BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 7. جدول مسیر یادگیری شخصی‌سازی شده (Personalized Learning Paths)
CREATE TABLE IF NOT EXISTS public.personalized_learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    base_path_id UUID REFERENCES public.learning_paths(id) ON DELETE SET NULL,
    custom_sequence UUID[] NOT NULL, -- ترتیب شخصی‌سازی شده
    current_position INTEGER DEFAULT 0, -- موقعیت فعلی در مسیر
    target_completion_date DATE,
    estimated_completion_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. جدول تمرین‌های خودکار (Auto-Generated Exercises)
CREATE TABLE IF NOT EXISTS public.auto_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    exercise_type TEXT NOT NULL CHECK (exercise_type IN ('grammar', 'vocabulary', 'reading', 'writing', 'listening', 'speaking')),
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    target_skill TEXT, -- مهارت هدف
    content JSONB NOT NULL, -- محتوای تمرین
    correct_answer JSONB,
    student_answer JSONB,
    is_completed BOOLEAN DEFAULT FALSE,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    time_taken INTEGER, -- seconds
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes برای بهبود عملکرد
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON public.student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_content_id ON public.student_progress(content_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_status ON public.student_progress(status);
CREATE INDEX IF NOT EXISTS idx_learning_content_type ON public.learning_content(content_type);
CREATE INDEX IF NOT EXISTS idx_learning_content_level ON public.learning_content(level);
CREATE INDEX IF NOT EXISTS idx_learning_content_skill ON public.learning_content(skill_type);
CREATE INDEX IF NOT EXISTS idx_student_skills_student_id ON public.student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_skill_type ON public.student_skills(skill_type);
CREATE INDEX IF NOT EXISTS idx_level_assessments_student_id ON public.level_assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_student_id ON public.content_recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_personalized_paths_student_id ON public.personalized_learning_paths(student_id);

-- Unique index برای اطمینان از اینکه فقط یک مسیر فعال برای هر دانش‌آموز وجود دارد
CREATE UNIQUE INDEX IF NOT EXISTS idx_personalized_paths_one_active_per_student 
    ON public.personalized_learning_paths(student_id) 
    WHERE is_active = TRUE;

-- اضافه کردن user_id به جدول students در صورت عدم وجود
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'students' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.students 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- پر کردن user_id از id در صورت وجود
        UPDATE public.students 
        SET user_id = id::uuid 
        WHERE user_id IS NULL AND id IS NOT NULL;
    END IF;
END $$;

-- RLS Policies
ALTER TABLE public.learning_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalized_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_exercises ENABLE ROW LEVEL SECURITY;

-- Policies برای learning_content - همه می‌توانند بخوانند
CREATE POLICY "Anyone can view learning content" ON public.learning_content
    FOR SELECT USING (is_active = TRUE);

-- Policies برای learning_paths - همه می‌توانند بخوانند
CREATE POLICY "Anyone can view learning paths" ON public.learning_paths
    FOR SELECT USING (TRUE);

-- Policies برای student_progress - فقط دانش‌آموز خودش
-- استفاده از user_id اگر وجود دارد، در غیر این صورت از email
CREATE POLICY "Students can view their own progress" ON public.student_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_progress.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own progress" ON public.student_progress
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_progress.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own progress" ON public.student_progress
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_progress.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای level_assessments
CREATE POLICY "Students can view their own assessments" ON public.level_assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = level_assessments.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own assessments" ON public.level_assessments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = level_assessments.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای student_skills
CREATE POLICY "Students can view their own skills" ON public.student_skills
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_skills.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own skills" ON public.student_skills
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_skills.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own skills" ON public.student_skills
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_skills.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای content_recommendations
CREATE POLICY "Students can view their own recommendations" ON public.content_recommendations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = content_recommendations.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own recommendations" ON public.content_recommendations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = content_recommendations.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای personalized_learning_paths
CREATE POLICY "Students can view their own paths" ON public.personalized_learning_paths
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = personalized_learning_paths.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own paths" ON public.personalized_learning_paths
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = personalized_learning_paths.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own paths" ON public.personalized_learning_paths
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = personalized_learning_paths.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای auto_exercises
CREATE POLICY "Students can view their own exercises" ON public.auto_exercises
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = auto_exercises.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own exercises" ON public.auto_exercises
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = auto_exercises.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own exercises" ON public.auto_exercises
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = auto_exercises.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Functions برای به‌روزرسانی خودکار
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers برای به‌روزرسانی updated_at
CREATE TRIGGER update_learning_content_updated_at BEFORE UPDATE ON public.learning_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON public.student_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_skills_updated_at BEFORE UPDATE ON public.student_skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personalized_paths_updated_at BEFORE UPDATE ON public.personalized_learning_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function برای محاسبه سطح کلی دانش‌آموز
CREATE OR REPLACE FUNCTION calculate_student_overall_level(student_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    avg_score NUMERIC;
BEGIN
    SELECT AVG(current_score) INTO avg_score
    FROM public.student_skills
    WHERE student_id = student_uuid;
    
    IF avg_score IS NULL THEN
        RETURN 'beginner';
    ELSIF avg_score >= 70 THEN
        RETURN 'advanced';
    ELSIF avg_score >= 40 THEN
        RETURN 'intermediate';
    ELSE
        RETURN 'beginner';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Insert sample learning content
INSERT INTO public.learning_content (title, description, content_type, language, level, skill_type, difficulty_score, estimated_duration, content_data, tags)
VALUES
    ('مقدمه‌ای بر گرامر انگلیسی', 'آموزش اصول اولیه گرامر انگلیسی', 'lesson', 'English', 'beginner', 'grammar', 30, 20, '{"text": "در این درس با اصول اولیه گرامر انگلیسی آشنا می‌شوید...", "type": "lesson"}'::jsonb, ARRAY['grammar', 'beginner']),
    ('تمرین واژگان روزمره', 'تمرین واژگان مورد استفاده در زندگی روزمره', 'exercise', 'English', 'beginner', 'vocabulary', 25, 15, '{"questions": [], "type": "exercise"}'::jsonb, ARRAY['vocabulary', 'beginner']),
    ('خواندن متن ساده', 'متن ساده برای تمرین خواندن', 'article', 'English', 'beginner', 'reading', 35, 10, '{"text": "این یک متن نمونه برای تمرین خواندن است.", "questions": [], "type": "article"}'::jsonb, ARRAY['reading', 'beginner'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample learning path
INSERT INTO public.learning_paths (name, description, language, target_level, content_sequence, is_default)
VALUES
    ('مسیر یادگیری مبتدی', 'مسیر کامل برای یادگیری زبان انگلیسی از صفر', 'English', 'beginner', 
     (SELECT ARRAY_AGG(id) FROM public.learning_content WHERE level = 'beginner' LIMIT 10), TRUE)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.learning_content IS 'محتوای آموزشی سیستم';
COMMENT ON TABLE public.learning_paths IS 'مسیرهای یادگیری پیش‌فرض';
COMMENT ON TABLE public.student_progress IS 'پیشرفت دانش‌آموزان در محتواها';
COMMENT ON TABLE public.level_assessments IS 'ارزیابی‌های سطح دانش‌آموزان';
COMMENT ON TABLE public.student_skills IS 'نقاط قوت و ضعف دانش‌آموزان';
COMMENT ON TABLE public.content_recommendations IS 'پیشنهادات محتوا برای دانش‌آموزان';
COMMENT ON TABLE public.personalized_learning_paths IS 'مسیرهای یادگیری شخصی‌سازی شده';
COMMENT ON TABLE public.auto_exercises IS 'تمرین‌های خودکار تولید شده';

