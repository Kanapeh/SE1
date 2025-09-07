import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Listing all blog posts...');

    // Get all blog posts
    const { data: allPosts, error: allError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, status, created_at, published_at, author')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Error fetching all posts:', allError);
      return NextResponse.json({ error: allError.message }, { status: 500 });
    }

    console.log('✅ All posts fetched:', allPosts?.length || 0);

    // Group by status
    const statusGroups = allPosts?.reduce((acc, post) => {
      if (!acc[post.status]) {
        acc[post.status] = [];
      }
      acc[post.status].push(post);
      return acc;
    }, {} as Record<string, any[]>) || {};

    // Get unique slugs
    const uniqueSlugs = [...new Set(allPosts?.map(post => post.slug) || [])];

    // Check for duplicate slugs
    const duplicateSlugs = uniqueSlugs.filter(slug => {
      const postsWithSlug = allPosts?.filter(post => post.slug === slug) || [];
      return postsWithSlug.length > 1;
    });

    return NextResponse.json({
      totalPosts: allPosts?.length || 0,
      uniqueSlugs: uniqueSlugs.length,
      duplicateSlugs: duplicateSlugs,
      statusGroups,
      allPosts: allPosts || [],
      duplicateDetails: duplicateSlugs.map(slug => ({
        slug,
        posts: allPosts?.filter(post => post.slug === slug) || []
      }))
    });

  } catch (error: any) {
    console.error('❌ Error in list-all:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
