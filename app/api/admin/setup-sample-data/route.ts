import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { checkAdminAccessAPI } from '@/lib/api-utils';

export async function POST() {
  try {
    // Check admin access first
    const { error: adminError } = await checkAdminAccessAPI();
    if (adminError) {
      return adminError;
    }

    const supabase = createAdminClient();

    // Sample blog posts
    const samplePosts = [
      {
        title: 'راهنمای کامل یادگیری زبان انگلیسی',
        content: 'در این مقاله به شما روش‌های موثر یادگیری زبان انگلیسی را آموزش می‌دهیم. از تکنیک‌های روز دنیا گرفته تا منابع مفید، همه چیز را پوشش داده‌ایم.',
        excerpt: 'یادگیری زبان انگلیسی با روش‌های مدرن و کاربردی',
        status: 'published',
        published_at: new Date().toISOString(),
        slug: 'english-learning-guide',
        author: 'مدیر سیستم',
        tags: ['زبان انگلیسی', 'آموزش', 'یادگیری']
      },
      {
        title: 'نکات مهم برای تدریس آنلاین',
        content: 'تدریس آنلاین چالش‌های خاص خود را دارد. در این مقاله تجربیات و نکات مهم برای معلمان آنلاین را به اشتراک گذاشته‌ایم.',
        excerpt: 'چگونه معلم آنلاین موفقی باشیم',
        status: 'published',
        published_at: new Date().toISOString(),
        slug: 'online-teaching-tips',
        author: 'مدیر سیستم',
        tags: ['تدریس آنلاین', 'معلم', 'آموزش']
      },
      {
        title: 'مزایای یادگیری زبان در سنین مختلف',
        content: 'یادگیری زبان در هر سنی امکان‌پذیر است. در این مقاله مزایای یادگیری زبان در سنین مختلف را بررسی کرده‌ایم.',
        excerpt: 'یادگیری زبان در هر سنی',
        status: 'published',
        published_at: new Date().toISOString(),
        slug: 'language-learning-ages',
        author: 'مدیر سیستم',
        tags: ['یادگیری', 'سن', 'زبان']
      }
    ];

    // Insert sample blog posts
    const { data: insertedPosts, error: postsError } = await supabase
      .from('blog_posts')
      .insert(samplePosts)
      .select('id, title, slug');

    if (postsError) {
      console.error('Error inserting blog posts:', postsError);
      return NextResponse.json(
        { error: 'خطا در ایجاد مقالات نمونه', details: postsError.message },
        { status: 500 }
      );
    }

    // Sample comments
    const sampleComments = [
      {
        post_id: insertedPosts[0].id,
        name: 'علی احمدی',
        email: 'ali.ahmadi@example.com',
        content: 'مقاله بسیار مفیدی بود. ممنون از اشتراک‌گذاری این اطلاعات ارزشمند.',
        status: 'pending',
        ip_address: '192.168.1.1'
      },
      {
        post_id: insertedPosts[0].id,
        name: 'فاطمه محمدی',
        email: 'fateme.mohammadi@example.com',
        content: 'من هم همین روش‌ها را امتحان کردم و نتیجه گرفتم. پیشنهاد می‌کنم همه امتحان کنند.',
        status: 'approved',
        ip_address: '192.168.1.2'
      },
      {
        post_id: insertedPosts[1].id,
        name: 'محمد رضایی',
        email: 'mohammad.rezaei@example.com',
        content: 'به عنوان معلم آنلاین، این نکات خیلی به درد من خورد. ممنون.',
        status: 'pending',
        ip_address: '192.168.1.3'
      },
      {
        post_id: insertedPosts[2].id,
        name: 'زهرا کریمی',
        email: 'zahra.karimi@example.com',
        content: 'من در سن ۴۰ سالگی شروع به یادگیری زبان کردم و خیلی راضی هستم.',
        status: 'approved',
        ip_address: '192.168.1.4'
      },
      {
        post_id: insertedPosts[2].id,
        name: 'حسن نوری',
        email: 'hasan.nouri@example.com',
        content: 'مقاله عالی بود. من هم فکر می‌کنم سن مهم نیست، مهم انگیزه است.',
        status: 'pending',
        ip_address: '192.168.1.5'
      }
    ];

    // Insert sample comments
    const { data: insertedComments, error: commentsError } = await supabase
      .from('comments')
      .insert(sampleComments)
      .select('id, name, content, status');

    if (commentsError) {
      console.error('Error inserting comments:', commentsError);
      return NextResponse.json(
        { error: 'خطا در ایجاد نظرات نمونه', details: commentsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'داده‌های نمونه با موفقیت ایجاد شدند',
      results: {
        blogPosts: {
          count: insertedPosts.length,
          posts: insertedPosts
        },
        comments: {
          count: insertedComments.length,
          comments: insertedComments
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error in setup sample data:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد داده‌های نمونه', details: error.message },
      { status: 500 }
    );
  }
}
