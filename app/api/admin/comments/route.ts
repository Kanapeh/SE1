import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAccessAPI } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    // Check admin access first
    const { error: adminError } = await checkAdminAccessAPI();
    if (adminError) {
      return adminError;
    }

    // Get all comments with post information
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        blog_posts!inner(
          id,
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data to include post title
    const transformedData = data?.map(comment => ({
      ...comment,
      post_title: comment.blog_posts?.title || 'مقاله حذف شده'
    })) || [];

    return NextResponse.json(transformedData);
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'خطا در بارگذاری نظرات' },
      { status: 500 }
    );
  }
} 