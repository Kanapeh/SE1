import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting migration of posts to Supabase...');

    // Sample blog post data to migrate
    const samplePosts = [
      {
        title: 'بهترین راهکارهای علمی برای یادگیری زبان انگلیسی سریع‌تر و مؤثرتر',
        content: `
          <h1>بهترین راهکارهای علمی برای یادگیری زبان انگلیسی</h1>
          <p>یادگیری زبان انگلیسی یکی از مهم‌ترین مهارت‌های امروزی است که می‌تواند فرصت‌های شغلی و تحصیلی بسیاری را برای شما فراهم کند.</p>
          
          <h2>۱. روش‌های علمی اثبات‌شده</h2>
          <p>مطالعات نشان داده‌اند که روش‌های مختلف یادگیری برای افراد مختلف مؤثر است. با این حال، برخی اصول کلی وجود دارد که می‌تواند به همه کمک کند.</p>
          
          <h3>الف) یادگیری تدریجی</h3>
          <p>به جای مطالعه فشرده، بهتر است هر روز مدت زمان کوتاهی را به یادگیری اختصاص دهید. این روش به مغز فرصت پردازش و ذخیره اطلاعات را می‌دهد.</p>
          
          <h3>ب) استفاده از چندین حس</h3>
          <p>برای یادگیری مؤثرتر، از گوش دادن، خواندن، نوشتن و صحبت کردن استفاده کنید. این روش به تقویت حافظه کمک می‌کند.</p>
          
          <h2>۲. تکنیک‌های عملی</h2>
          <p>در ادامه، چند تکنیک عملی برای یادگیری سریع‌تر زبان انگلیسی ارائه می‌شود:</p>
          
          <ul>
            <li><strong>فلش کارت:</strong> برای یادگیری واژگان جدید</li>
            <li><strong>فیلم و سریال:</strong> برای تقویت مهارت شنیداری</li>
            <li><strong>مکالمه با بومی‌زبانان:</strong> برای بهبود تلفظ</li>
            <li><strong>خواندن روزنامه:</strong> برای آشنایی با زبان رسمی</li>
          </ul>
          
          <h2>۳. نتیجه‌گیری</h2>
          <p>یادگیری زبان انگلیسی نیاز به صبر و پشتکار دارد. با استفاده از روش‌های علمی و تکنیک‌های عملی، می‌توانید در مدت زمان کوتاه‌تری به نتیجه مطلوب برسید.</p>
        `,
        excerpt: 'راهکارهای علمی و اثبات‌شده برای یادگیری سریع‌تر زبان انگلیسی',
        slug: '2025-best-scientific-solutions-for-learning-english-faster-and-more-effectively',
        image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
        author: 'آکادمی زبان سِ وان',
        status: 'published',
        published_at: new Date().toISOString(),
        tags: ['آموزش زبان', 'یادگیری سریع', 'روش‌های علمی', 'انگلیسی'],
        views: 0,
        likes: 0,
        read_time: 8
      },
      {
        title: 'راهنمای کامل آمادگی برای آزمون آیلتس',
        content: `
          <h1>راهنمای کامل آمادگی برای آزمون آیلتس</h1>
          <p>آزمون آیلتس یکی از معتبرترین آزمون‌های زبان انگلیسی در جهان است که برای مهاجرت، تحصیل و کار در کشورهای انگلیسی‌زبان ضروری است.</p>
          
          <h2>بخش‌های آزمون آیلتس</h2>
          <p>آزمون آیلتس شامل چهار بخش اصلی است:</p>
          
          <h3>۱. Listening (شنیداری)</h3>
          <p>این بخش شامل ۴۰ سؤال است که در ۳۰ دقیقه پاسخ داده می‌شود. برای موفقیت در این بخش، باید مهارت شنیداری خود را تقویت کنید.</p>
          
          <h3>۲. Reading (خواندن)</h3>
          <p>بخش خواندن شامل ۴۰ سؤال است که در ۶۰ دقیقه پاسخ داده می‌شود. این بخش مهارت درک مطلب شما را می‌سنجد.</p>
          
          <h3>۳. Writing (نوشتن)</h3>
          <p>بخش نوشتن شامل دو تسک است که در ۶۰ دقیقه تکمیل می‌شود. تسک اول گزارش نمودار و تسک دوم مقاله است.</p>
          
          <h3>۴. Speaking (صحبت کردن)</h3>
          <p>بخش صحبت کردن شامل مصاحبه با ممتحن است که ۱۱-۱۴ دقیقه طول می‌کشد.</p>
          
          <h2>نکات مهم برای موفقیت</h2>
          <ul>
            <li>برنامه‌ریزی منظم برای مطالعه</li>
            <li>تمرین مداوم با نمونه سؤالات</li>
            <li>شرکت در کلاس‌های آمادگی</li>
            <li>استفاده از منابع معتبر</li>
          </ul>
        `,
        excerpt: 'راهنمای کامل و جامع برای آمادگی در آزمون آیلتس',
        slug: 'complete-ielts-preparation-guide',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        author: 'آکادمی زبان سِ وان',
        status: 'published',
        published_at: new Date().toISOString(),
        tags: ['آیلتس', 'آمادگی آزمون', 'زبان انگلیسی', 'مهاجرت'],
        views: 0,
        likes: 0,
        read_time: 6
      }
    ];

    // Check if table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('❌ Table does not exist or error:', tableError);
      return NextResponse.json({ 
        error: 'Table blog_posts does not exist. Please run the database migration first.',
        details: tableError.message 
      }, { status: 500 });
    }

    // Insert sample posts
    const { data: insertedPosts, error: insertError } = await supabase
      .from('blog_posts')
      .insert(samplePosts)
      .select();

    if (insertError) {
      console.error('❌ Error inserting posts:', insertError);
      return NextResponse.json({ 
        error: 'Failed to insert posts',
        details: insertError.message 
      }, { status: 500 });
    }

    // Verify insertion
    const { data: allPosts, error: verifyError } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('✅ Migration completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Posts migrated successfully to Supabase',
      insertedCount: insertedPosts?.length || 0,
      totalPosts: allPosts?.length || 0,
      posts: allPosts || [],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
