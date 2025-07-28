-- Test article with video for testing the video display functionality
INSERT INTO public.blog_posts (
  title,
  content,
  slug,
  image_url,
  author,
  published_at,
  status,
  tags,
  video_url,
  has_video,
  chart_data,
  has_chart,
  table_data,
  has_table
) VALUES (
  'آموزش زبان انگلیسی با ویدیو - تست',
  '<h2>مقدمه</h2><p>این یک مقاله تست برای بررسی عملکرد نمایش ویدیو در مقالات است.</p><h3>مزایای یادگیری با ویدیو</h3><ul><li>یادگیری بصری بهتر</li><li>درک عمیق‌تر مفاهیم</li><li>تجربه یادگیری جذاب‌تر</li></ul><p>در ادامه می‌توانید ویدیوی آموزشی را مشاهده کنید.</p>',
  'test-video-article',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
  'مدیر سیستم',
  NOW(),
  'published',
  ARRAY['آموزش', 'زبان انگلیسی', 'ویدیو', 'تست'],
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  true,
  '{"type": "bar", "data": {"labels": ["خواندن", "نوشتن", "گوش دادن", "صحبت کردن"], "datasets": [{"label": "مهارت‌های زبان", "data": [85, 70, 90, 75], "backgroundColor": ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]}]}}',
  true,
  '{"headers": ["مهارت", "سطح", "توضیحات"], "rows": [["گرامر", "متوسط", "درک خوب از ساختارهای پایه"], ["واژگان", "پیشرفته", "دایره لغات گسترده"], ["تلفظ", "متوسط", "نیاز به بهبود"], ["مکالمه", "پیشرفته", "توانایی ارتباط موثر"]]}',
  true
); 