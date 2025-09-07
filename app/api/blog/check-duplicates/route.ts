import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Find duplicate slugs
    const { data: duplicates, error: duplicateError } = await supabase
      .from('blog_posts')
      .select('slug, count(*)')
      .group('slug')
      .having('count(*) > 1');

    if (duplicateError) {
      return NextResponse.json({ error: duplicateError.message }, { status: 500 });
    }

    // Get all posts with duplicate slugs
    const duplicateSlugs = duplicates?.map(d => d.slug) || [];
    
    if (duplicateSlugs.length === 0) {
      return NextResponse.json({ 
        message: 'No duplicate slugs found',
        duplicates: []
      });
    }

    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .in('slug', duplicateSlugs)
      .order('created_at', { ascending: false });

    if (postsError) {
      return NextResponse.json({ error: postsError.message }, { status: 500 });
    }

    // Group posts by slug
    const groupedPosts = posts?.reduce((acc, post) => {
      if (!acc[post.slug]) {
        acc[post.slug] = [];
      }
      acc[post.slug].push(post);
      return acc;
    }, {} as Record<string, any[]>) || {};

    return NextResponse.json({
      message: `Found ${duplicateSlugs.length} duplicate slugs`,
      duplicates: duplicateSlugs,
      groupedPosts
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Get all posts with this slug
    const { data: posts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .order('created_at', { ascending: false });

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!posts || posts.length <= 1) {
      return NextResponse.json({ 
        message: 'No duplicates found for this slug',
        posts: posts || []
      });
    }

    // Keep the latest post, delete others
    const latestPost = posts[0];
    const postsToDelete = posts.slice(1);

    const deleteIds = postsToDelete.map(post => post.id);
    
    const { error: deleteError } = await supabase
      .from('blog_posts')
      .delete()
      .in('id', deleteIds);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Removed ${postsToDelete.length} duplicate posts`,
      kept: latestPost,
      deleted: postsToDelete
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
