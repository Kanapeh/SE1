import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { checkAdminAccessAPI } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    // Check admin access first
    const { error: adminError } = await checkAdminAccessAPI();
    if (adminError) {
      return adminError;
    }

    const supabase = createAdminClient();

    // Get all comments with post information - use left join to include all comments
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        blog_posts(
          id,
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Transform the data to include post title
    const transformedData = data?.map(comment => ({
      ...comment,
      post_title: comment.blog_posts?.title || 'مقاله حذف شده'
    })) || [];

    // Don't log sensitive comment data
    console.log(`Found ${transformedData.length} comments`);
    return NextResponse.json(transformedData);
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'خطا در بارگذاری نظرات', details: error.message },
      { status: 500 }
    );
  }
} 