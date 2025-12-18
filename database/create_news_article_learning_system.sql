-- ============================================
-- سیستم یادگیری از طریق اخبار و مقالات (News & Article Learning System)
-- ============================================

-- 1. جدول مقالات و اخبار (Articles & News)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_translation TEXT, -- ترجمه عنوان
    content TEXT NOT NULL, -- محتوای اصلی
    content_translation TEXT, -- ترجمه کامل محتوا
    summary TEXT, -- خلاصه مقاله
    summary_translation TEXT, -- ترجمه خلاصه
    source_url TEXT, -- لینک منبع
    source_name TEXT, -- نام منبع
    category TEXT NOT NULL CHECK (category IN ('news', 'technology', 'science', 'business', 'health', 'sports', 'entertainment', 'politics', 'education', 'culture')),
    language TEXT NOT NULL DEFAULT 'English',
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    reading_time INTEGER, -- زمان خواندن به دقیقه
    word_count INTEGER DEFAULT 0,
    image_url TEXT, -- تصویر مقاله
    published_date TIMESTAMP WITH TIME ZONE,
    author TEXT,
    tags TEXT[], -- برچسب‌ها
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول ترجمه‌های جمله به جمله (Sentence Translations)
CREATE TABLE IF NOT EXISTS public.article_sentences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL, -- جمله اصلی
    translation TEXT NOT NULL, -- ترجمه جمله
    sentence_index INTEGER NOT NULL, -- ترتیب جمله در مقاله
    difficulty_score INTEGER CHECK (difficulty_score BETWEEN 0 AND 100),
    vocabulary_complexity TEXT CHECK (vocabulary_complexity IN ('simple', 'moderate', 'complex')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول واژگان تخصصی (Specialized Vocabulary)
CREATE TABLE IF NOT EXISTS public.article_vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    word TEXT NOT NULL, -- کلمه
    word_type TEXT CHECK (word_type IN ('noun', 'verb', 'adjective', 'adverb', 'phrase', 'idiom')),
    definition TEXT NOT NULL, -- تعریف
    definition_translation TEXT, -- ترجمه تعریف
    example_sentence TEXT, -- جمله مثال
    example_translation TEXT, -- ترجمه جمله مثال
    pronunciation TEXT, -- تلفظ
    frequency INTEGER DEFAULT 1, -- تعداد تکرار در مقاله
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    is_important BOOLEAN DEFAULT FALSE, -- کلمه مهم
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. جدول پیشرفت خواندن (Reading Progress)
CREATE TABLE IF NOT EXISTS public.article_reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    reading_status TEXT NOT NULL DEFAULT 'not_started' CHECK (reading_status IN ('not_started', 'reading', 'completed', 'abandoned')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    time_spent INTEGER DEFAULT 0, -- زمان صرف شده به ثانیه
    last_read_position INTEGER DEFAULT 0, -- آخرین موقعیت خوانده شده (sentence_index)
    completed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    comprehension_score INTEGER CHECK (comprehension_score BETWEEN 0 AND 100), -- نمره درک مطلب
    notes TEXT, -- یادداشت‌های دانش‌آموز
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, article_id)
);

-- 5. جدول یادگیری واژگان (Vocabulary Learning)
CREATE TABLE IF NOT EXISTS public.vocabulary_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL REFERENCES public.article_vocabulary(id) ON DELETE CASCADE,
    article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
    mastery_level TEXT NOT NULL DEFAULT 'new' CHECK (mastery_level IN ('new', 'learning', 'familiar', 'mastered')),
    review_count INTEGER DEFAULT 0, -- تعداد مرور
    correct_count INTEGER DEFAULT 0, -- تعداد پاسخ صحیح
    incorrect_count INTEGER DEFAULT 0, -- تعداد پاسخ غلط
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    next_review_at TIMESTAMP WITH TIME ZONE, -- زمان مرور بعدی (spaced repetition)
    is_bookmarked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, vocabulary_id)
);

-- 6. جدول تمرین‌های مرتبط با مقالات (Article Exercises)
CREATE TABLE IF NOT EXISTS public.article_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    exercise_type TEXT NOT NULL CHECK (exercise_type IN ('comprehension', 'vocabulary', 'grammar', 'summary', 'discussion')),
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank', 'short_answer', 'essay')),
    options JSONB, -- گزینه‌های سوال
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 10,
    related_sentence_ids INTEGER[], -- ID جملات مرتبط
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. جدول پاسخ‌های تمرین (Exercise Answers)
CREATE TABLE IF NOT EXISTS public.article_exercise_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.article_exercises(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    student_answer TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    points_earned INTEGER DEFAULT 0,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. جدول یادداشت‌های دانش‌آموز (Student Notes)
CREATE TABLE IF NOT EXISTS public.article_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    sentence_id UUID REFERENCES public.article_sentences(id) ON DELETE SET NULL,
    note_text TEXT NOT NULL,
    note_type TEXT CHECK (note_type IN ('translation', 'explanation', 'question', 'reminder')),
    is_public BOOLEAN DEFAULT FALSE, -- قابل اشتراک با دیگران
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. جدول آمار خواندن (Reading Statistics)
CREATE TABLE IF NOT EXISTS public.reading_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    total_articles_read INTEGER DEFAULT 0,
    total_words_read INTEGER DEFAULT 0,
    total_reading_time INTEGER DEFAULT 0, -- مجموع زمان خواندن به ثانیه
    average_comprehension_score NUMERIC(5,2) DEFAULT 0,
    vocabulary_learned INTEGER DEFAULT 0, -- تعداد واژگان یاد گرفته شده
    favorite_categories TEXT[], -- دسته‌بندی‌های مورد علاقه
    reading_streak INTEGER DEFAULT 0, -- روزهای متوالی خواندن
    last_read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id)
);

-- Indexes برای بهبود عملکرد
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_difficulty ON public.articles(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published_date);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_sentences_article ON public.article_sentences(article_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_article ON public.article_vocabulary(article_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_word ON public.article_vocabulary(word);
CREATE INDEX IF NOT EXISTS idx_reading_progress_student ON public.article_reading_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_article ON public.article_reading_progress(article_id);
CREATE INDEX IF NOT EXISTS idx_vocab_learning_student ON public.vocabulary_learning(student_id);
CREATE INDEX IF NOT EXISTS idx_vocab_learning_vocab ON public.vocabulary_learning(vocabulary_id);
CREATE INDEX IF NOT EXISTS idx_vocab_learning_next_review ON public.vocabulary_learning(next_review_at);
CREATE INDEX IF NOT EXISTS idx_article_exercises_article ON public.article_exercises(article_id);
CREATE INDEX IF NOT EXISTS idx_exercise_answers_student ON public.article_exercise_answers(student_id);
CREATE INDEX IF NOT EXISTS idx_article_notes_student ON public.article_notes(student_id);
CREATE INDEX IF NOT EXISTS idx_reading_stats_student ON public.reading_statistics(student_id);

-- RLS Policies
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_sentences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_exercise_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_statistics ENABLE ROW LEVEL SECURITY;

-- Policies برای articles - همه می‌توانند بخوانند
CREATE POLICY "Anyone can view active articles" ON public.articles
    FOR SELECT USING (is_active = TRUE);

-- Policies برای article_sentences - همه می‌توانند بخوانند
CREATE POLICY "Anyone can view article sentences" ON public.article_sentences
    FOR SELECT USING (TRUE);

-- Policies برای article_vocabulary - همه می‌توانند بخوانند
CREATE POLICY "Anyone can view article vocabulary" ON public.article_vocabulary
    FOR SELECT USING (TRUE);

-- Policies برای article_reading_progress
CREATE POLICY "Students can view their own reading progress" ON public.article_reading_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = article_reading_progress.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own reading progress" ON public.article_reading_progress
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = article_reading_progress.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own reading progress" ON public.article_reading_progress
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = article_reading_progress.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای vocabulary_learning
CREATE POLICY "Students can view their own vocabulary learning" ON public.vocabulary_learning
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = vocabulary_learning.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own vocabulary learning" ON public.vocabulary_learning
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = vocabulary_learning.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own vocabulary learning" ON public.vocabulary_learning
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = vocabulary_learning.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای article_exercises - همه می‌توانند بخوانند
CREATE POLICY "Anyone can view article exercises" ON public.article_exercises
    FOR SELECT USING (TRUE);

-- Policies برای article_exercise_answers
CREATE POLICY "Students can view their own exercise answers" ON public.article_exercise_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = article_exercise_answers.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own exercise answers" ON public.article_exercise_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = article_exercise_answers.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای article_notes
CREATE POLICY "Students can view their own notes" ON public.article_notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = article_notes.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can insert their own notes" ON public.article_notes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = article_notes.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own notes" ON public.article_notes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = article_notes.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Policies برای reading_statistics
CREATE POLICY "Students can view their own reading statistics" ON public.reading_statistics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = reading_statistics.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

CREATE POLICY "Students can update their own reading statistics" ON public.reading_statistics
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = reading_statistics.student_id
            AND (
                (s.user_id IS NOT NULL AND s.user_id = auth.uid())
                OR (s.user_id IS NULL AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
            )
        )
    );

-- Triggers برای به‌روزرسانی updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON public.article_reading_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vocab_learning_updated_at BEFORE UPDATE ON public.vocabulary_learning
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_notes_updated_at BEFORE UPDATE ON public.article_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_stats_updated_at BEFORE UPDATE ON public.reading_statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function برای محاسبه تعداد کلمات
CREATE OR REPLACE FUNCTION calculate_article_word_count(article_content TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN array_length(string_to_array(trim(article_content), ' '), 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function برای به‌روزرسانی آمار خواندن
CREATE OR REPLACE FUNCTION update_reading_statistics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.reading_statistics (
        student_id,
        total_articles_read,
        total_words_read,
        total_reading_time,
        average_comprehension_score,
        last_read_at
    )
    VALUES (
        NEW.student_id,
        1,
        (SELECT word_count FROM public.articles WHERE id = NEW.article_id),
        COALESCE(NEW.time_spent, 0),
        COALESCE(NEW.comprehension_score, 0),
        NOW()
    )
    ON CONFLICT (student_id) DO UPDATE SET
        total_articles_read = reading_statistics.total_articles_read + CASE WHEN NEW.reading_status = 'completed' THEN 1 ELSE 0 END,
        total_words_read = reading_statistics.total_words_read + CASE WHEN NEW.reading_status = 'completed' THEN (SELECT word_count FROM public.articles WHERE id = NEW.article_id) ELSE 0 END,
        total_reading_time = reading_statistics.total_reading_time + COALESCE(NEW.time_spent, 0),
        average_comprehension_score = CASE 
            WHEN NEW.comprehension_score IS NOT NULL THEN
                (reading_statistics.average_comprehension_score * reading_statistics.total_articles_read + NEW.comprehension_score) 
                / (reading_statistics.total_articles_read + 1)
            ELSE reading_statistics.average_comprehension_score
        END,
        last_read_at = NOW(),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger برای به‌روزرسانی خودکار آمار
CREATE TRIGGER update_stats_on_reading_progress
    AFTER INSERT OR UPDATE ON public.article_reading_progress
    FOR EACH ROW
    WHEN (NEW.reading_status = 'completed')
    EXECUTE FUNCTION update_reading_statistics();

-- Insert sample articles
INSERT INTO public.articles (title, title_translation, content, content_translation, summary, summary_translation, category, difficulty_level, language, reading_time, word_count, published_date, tags)
VALUES
    ('Technology Advances in 2024', 'پیشرفت‌های فناوری در سال 2024', 
     'Artificial intelligence continues to revolutionize various industries. Machine learning algorithms are becoming more sophisticated, enabling computers to perform complex tasks with remarkable accuracy.',
     'هوش مصنوعی همچنان در حال انقلاب در صنایع مختلف است. الگوریتم‌های یادگیری ماشین در حال پیچیده‌تر شدن هستند و به کامپیوترها امکان انجام کارهای پیچیده با دقت قابل توجه را می‌دهند.',
     'AI and machine learning are transforming industries.',
     'هوش مصنوعی و یادگیری ماشین در حال دگرگون کردن صنایع هستند.',
     'technology', 'intermediate', 'English', 3, 30, NOW(), ARRAY['AI', 'technology', 'innovation']),
    
    ('Health Benefits of Exercise', 'فواید ورزش برای سلامتی',
     'Regular exercise is essential for maintaining good health. It helps improve cardiovascular health, strengthens muscles, and boosts mental well-being.',
     'ورزش منظم برای حفظ سلامتی ضروری است. به بهبود سلامت قلب و عروق کمک می‌کند، عضلات را تقویت می‌کند و سلامت روان را افزایش می‌دهد.',
     'Exercise is crucial for physical and mental health.',
     'ورزش برای سلامت جسمی و روانی ضروری است.',
     'health', 'beginner', 'English', 2, 25, NOW(), ARRAY['health', 'exercise', 'wellness'])
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE public.articles IS 'مقالات و اخبار برای یادگیری';
COMMENT ON TABLE public.article_sentences IS 'ترجمه‌های جمله به جمله';
COMMENT ON TABLE public.article_vocabulary IS 'واژگان تخصصی مقالات';
COMMENT ON TABLE public.article_reading_progress IS 'پیشرفت خواندن دانش‌آموزان';
COMMENT ON TABLE public.vocabulary_learning IS 'یادگیری واژگان';
COMMENT ON TABLE public.article_exercises IS 'تمرین‌های مرتبط با مقالات';
COMMENT ON TABLE public.article_exercise_answers IS 'پاسخ‌های تمرین‌ها';
COMMENT ON TABLE public.article_notes IS 'یادداشت‌های دانش‌آموز';
COMMENT ON TABLE public.reading_statistics IS 'آمار خواندن دانش‌آموزان';

