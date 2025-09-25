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

    console.log('🔍 Debugging blog post with slug:', slug);

    // Test 1: Check environment variables
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      nodeEnv: process.env.NODE_ENV || 'undefined'
    };

    // Test 2: Check if table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1);

    // Test 3: Get all posts to see what's in database
    const { data: allPosts, error: allPostsError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, status, created_at, published_at')
      .order('created_at', { ascending: false });

    // Test 4: Check specific slug
    const { data: specificPosts, error: specificError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug);

    // Test 5: Check published posts with this slug
    const { data: publishedPosts, error: publishedError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published');

    // Test 6: Try partial slug match
    const { data: partialMatch, error: partialError } = await supabase
      .from('blog_posts')
      .select('*')
      .ilike('slug', `%${slug.split('-')[0]}%`);

    // Test 7: Check RLS policies
    const { data: rlsTest, error: rlsError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .limit(5);

    return NextResponse.json({
      slug,
      timestamp: new Date().toISOString(),
      environment: envCheck,
      tableExists: tableError ? { error: tableError.message } : { success: true },
      allPosts: {
        count: allPosts?.length || 0,
        posts: allPosts || [],
        error: allPostsError?.message || null
      },
      specificSlug: {
        count: specificPosts?.length || 0,
        posts: specificPosts || [],
        error: specificError?.message || null
      },
      publishedSlug: {
        count: publishedPosts?.length || 0,
        posts: publishedPosts || [],
        error: publishedError?.message || null
      },
      partialMatch: {
        count: partialMatch?.length || 0,
        posts: partialMatch || [],
        error: partialError?.message || null
      },
      rlsTest: {
        count: rlsTest?.length || 0,
        posts: rlsTest || [],
        error: rlsError?.message || null
      },
      recommendations: [
        allPosts?.length === 0 ? '❌ No posts found in database - check if table exists' : '✅ Posts found in database',
        specificPosts?.length === 0 ? `❌ No posts found with slug "${slug}"` : `✅ Found ${specificPosts?.length} posts with this slug`,
        publishedPosts?.length === 0 ? `❌ No published posts found with slug "${slug}"` : `✅ Found ${publishedPosts?.length} published posts`,
        !process.env.NEXT_PUBLIC_SUPABASE_URL ? '❌ NEXT_PUBLIC_SUPABASE_URL not set' : '✅ NEXT_PUBLIC_SUPABASE_URL is set',
        !process.env.SUPABASE_SERVICE_ROLE_KEY ? '❌ SUPABASE_SERVICE_ROLE_KEY not set' : '✅ SUPABASE_SERVICE_ROLE_KEY is set'
      ]
    });

  } catch (error: any) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
