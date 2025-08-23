import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { checkAdminAccessAPI } from '@/lib/api-utils';

export async function GET() {
  try {
    // Check admin access first
    const { error: adminError } = await checkAdminAccessAPI();
    if (adminError) {
      return adminError;
    }

    const supabase = createAdminClient();

    // Test 1: Get all comments without join
    const { data: allComments, error: allCommentsError } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (allCommentsError) {
      console.error('Error getting all comments:', allCommentsError);
    }

    // Test 2: Get comments with blog_posts join
    const { data: commentsWithPosts, error: joinError } = await supabase
      .from('comments')
      .select(`
        *,
        blog_posts(
          id,
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (joinError) {
      console.error('Error getting comments with posts:', joinError);
    }

    // Test 3: Get blog_posts table info
    const { data: blogPosts, error: blogPostsError } = await supabase
      .from('blog_posts')
      .select('id, title')
      .limit(5);

    if (blogPostsError) {
      console.error('Error getting blog posts:', blogPostsError);
    }

    // Test 4: Count comments by status
    const { data: statusCounts, error: statusError } = await supabase
      .from('comments')
      .select('status');

    if (statusError) {
      console.error('Error getting status counts:', statusError);
    }

    const statusSummary = statusCounts?.reduce((acc: any, comment: any) => {
      acc[comment.status] = (acc[comment.status] || 0) + 1;
      return acc;
    }, {}) || {};

    return NextResponse.json({
      message: 'Comments table test completed',
      results: {
        totalComments: allComments?.length || 0,
        commentsWithPosts: commentsWithPosts?.length || 0,
        blogPostsCount: blogPosts?.length || 0,
        statusSummary,
        // Don't expose actual data for security
        sampleComments: [],
        sampleCommentsWithPosts: [],
        sampleBlogPosts: []
      },
      errors: {
        allComments: allCommentsError?.message || null,
        join: joinError?.message || null,
        blogPosts: blogPostsError?.message || null,
        status: statusError?.message || null
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error in test comments API:', error);
    return NextResponse.json(
      { error: 'خطا در تست جدول نظرات', details: error.message },
      { status: 500 }
    );
  }
}
