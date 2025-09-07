import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    console.log('Checking post with slug:', slug);

    // Get all posts with this slug
    const { data: allPosts, error: allError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .order('created_at', { ascending: false });

    if (allError) {
      return NextResponse.json({ error: allError.message }, { status: 500 });
    }

    console.log('All posts found:', allPosts);

    // Get published posts
    const publishedPosts = allPosts?.filter(post => post.status === 'published') || [];
    
    // Get all unique statuses
    const statuses = [...new Set(allPosts?.map(post => post.status) || [])];

    return NextResponse.json({
      slug,
      totalPosts: allPosts?.length || 0,
      publishedPosts: publishedPosts.length,
      statuses,
      allPosts: allPosts || [],
      publishedPosts: publishedPosts,
      latestPost: allPosts?.[0] || null,
      latestPublishedPost: publishedPosts[0] || null
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
