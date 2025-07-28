import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, name, email, content } = body;

    if (!postId || !name || !email || !content) {
      return NextResponse.json(
        { error: 'همه فیلدها الزامی هستند' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'فرمت ایمیل صحیح نیست' },
        { status: 400 }
      );
    }

    // Check if post exists
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('id', postId)
      .eq('status', 'published')
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: 'مقاله یافت نشد' },
        { status: 404 }
      );
    }

    // Insert comment
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: postId,
          name: name.trim(),
          email: email.trim(),
          content: content.trim(),
          status: 'pending', // نیاز به تایید ادمین
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد',
      comment: data
    });

  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت نظر. لطفا دوباره تلاش کنید.' },
      { status: 500 }
    );
  }
} 