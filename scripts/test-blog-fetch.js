/**
 * اسکریپت تست برای بررسی fetch کردن بلاگ‌ها از Supabase
 * 
 * نحوه اجرا:
 * node scripts/test-blog-fetch.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Starting blog fetch test...\n');

// بررسی environment variables
console.log('1️⃣ Checking environment variables:');
console.log(`   SUPABASE_URL: ${SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`   SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}\n`);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('   Please check your .env.local file');
  process.exit(1);
}

// ایجاد client
console.log('2️⃣ Creating Supabase client...');
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('   ✅ Client created successfully\n');

async function testBlogFetch() {
  try {
    // Test 1: بررسی اتصال به دیتابیس
    console.log('3️⃣ Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('   ❌ Connection failed:', connectionError.message);
      throw connectionError;
    }
    console.log('   ✅ Database connection successful\n');

    // Test 2: شمارش تمام مقالات
    console.log('4️⃣ Counting all blog posts...');
    const { count: totalCount, error: countError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('   ❌ Count failed:', countError.message);
      throw countError;
    }
    console.log(`   ✅ Total blog posts: ${totalCount}\n`);

    // Test 3: شمارش مقالات published
    console.log('5️⃣ Counting published blog posts...');
    const { count: publishedCount, error: publishedCountError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    if (publishedCountError) {
      console.error('   ❌ Published count failed:', publishedCountError.message);
      throw publishedCountError;
    }
    console.log(`   ✅ Published blog posts: ${publishedCount}\n`);

    // Test 4: دریافت مقالات published (مثل صفحه بلاگ)
    console.log('6️⃣ Fetching published blog posts (as blog page does)...');
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (postsError) {
      console.error('   ❌ Fetch failed:', postsError.message);
      throw postsError;
    }

    console.log(`   ✅ Successfully fetched ${posts?.length || 0} published posts\n`);

    // نمایش لیست مقالات
    if (posts && posts.length > 0) {
      console.log('📝 Published blog posts:');
      console.log('   ' + '─'.repeat(80));
      posts.forEach((post, index) => {
        const title = post.title.replace(/<[^>]*>/g, '').substring(0, 50);
        const publishedAt = new Date(post.published_at).toLocaleDateString('fa-IR');
        console.log(`   ${index + 1}. ${title}`);
        console.log(`      Slug: ${post.slug}`);
        console.log(`      Published: ${publishedAt}`);
        console.log(`      Status: ${post.status}`);
        if (post.tags && post.tags.length > 0) {
          console.log(`      Tags: ${post.tags.join(', ')}`);
        }
        console.log('   ' + '─'.repeat(80));
      });
    } else {
      console.log('⚠️  No published blog posts found');
      console.log('   This means either:');
      console.log('   - No posts exist in database');
      console.log('   - All posts have status = "draft"');
      console.log('   - RLS policies are blocking access\n');
    }

    // Test 5: بررسی مقالات draft
    console.log('\n7️⃣ Checking draft posts...');
    const { count: draftCount, error: draftCountError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft');

    if (!draftCountError) {
      console.log(`   ℹ️  Draft posts: ${draftCount}`);
      if (draftCount && draftCount > 0) {
        console.log('   💡 Tip: Change status to "published" to make them visible');
      }
    }

    // Test 6: بررسی RLS policies
    console.log('\n8️⃣ Testing RLS policies...');
    const { data: rlsTest, error: rlsError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);

    if (rlsError) {
      console.error('   ❌ RLS policies might be blocking access');
      console.error('   Error:', rlsError.message);
      console.log('\n   💡 Solution: Run the RLS setup script in Supabase:');
      console.log('      database/setup_blog_rls_policies.sql');
    } else {
      console.log('   ✅ RLS policies are working correctly');
    }

    // خلاصه نتایج
    console.log('\n' + '='.repeat(80));
    console.log('📊 Test Summary:');
    console.log('='.repeat(80));
    console.log(`Total posts:      ${totalCount || 0}`);
    console.log(`Published posts:  ${publishedCount || 0}`);
    console.log(`Draft posts:      ${draftCount || 0}`);
    console.log(`Fetched posts:    ${posts?.length || 0}`);
    console.log('='.repeat(80));

    if (publishedCount === 0) {
      console.log('\n⚠️  WARNING: No published posts found!');
      console.log('\nTo add a published post, run this SQL in Supabase:');
      console.log(`
UPDATE blog_posts 
SET status = 'published', 
    published_at = NOW() 
WHERE id = 'your-post-id';
      `);
    } else if (posts && posts.length > 0) {
      console.log('\n✅ Everything looks good! Your blog should display these posts.');
    }

    console.log('\n✅ Test completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error('   ', error.message);
    console.error('\nStack trace:');
    console.error(error);
    process.exit(1);
  }
}

// اجرای تست
testBlogFetch();

