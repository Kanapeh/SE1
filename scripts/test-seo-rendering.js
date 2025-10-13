/**
 * اسکریپت تست SEO و Rendering
 * این اسکریپت بررسی می‌کند که آیا محتوای بلاگ در HTML موجود است یا نه
 * (شبیه به کاری که Googlebot انجام می‌دهد)
 * 
 * نحوه اجرا:
 * node scripts/test-seo-rendering.js
 */

const http = require('http');
const https = require('https');

// رنگ‌ها برای console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}🔍 Starting SEO & Rendering Test...${colors.reset}\n`);

// تست در localhost (development)
const testLocalhost = () => {
  return new Promise((resolve) => {
    console.log(`${colors.blue}1️⃣ Testing localhost (development mode)...${colors.reset}`);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/blog',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`   Status Code: ${res.statusCode}`);
        
        // بررسی محتوا
        const hasContent = data.includes('چطور زبان انگلیسی') || 
                          data.includes('بهترین روش‌های یادگیری') ||
                          data.includes('blog_posts');
        
        const hasTitle = data.includes('<title>');
        const hasDescription = data.includes('description');
        
        console.log(`   ${hasContent ? colors.green + '✅' : colors.red + '❌'} Blog content in HTML: ${hasContent}${colors.reset}`);
        console.log(`   ${hasTitle ? colors.green + '✅' : colors.red + '❌'} Title tag present: ${hasTitle}${colors.reset}`);
        console.log(`   ${hasDescription ? colors.green + '✅' : colors.red + '❌'} Meta description present: ${hasDescription}${colors.reset}`);
        
        if (hasContent) {
          console.log(`\n   ${colors.green}✅ SUCCESS: Content is server-rendered!${colors.reset}`);
          console.log(`   ${colors.green}✅ Google will be able to see the blog posts!${colors.reset}\n`);
        } else {
          console.log(`\n   ${colors.yellow}⚠️  WARNING: Content might not be visible to Google${colors.reset}`);
          console.log(`   ${colors.yellow}   Make sure the server is running: npm run dev${colors.reset}\n`);
        }
        
        resolve(hasContent);
      });
    });

    req.on('error', (error) => {
      console.log(`   ${colors.yellow}⚠️  Localhost not running (this is OK if not in dev mode)${colors.reset}`);
      console.log(`   Error: ${error.message}\n`);
      resolve(false);
    });

    req.end();
  });
};

// تست build output
const testBuildOutput = () => {
  const fs = require('fs');
  const path = require('path');
  
  console.log(`${colors.blue}2️⃣ Checking build configuration...${colors.reset}`);
  
  try {
    // بررسی app/blog/page.tsx
    const blogPagePath = path.join(__dirname, '../app/blog/page.tsx');
    const blogPageContent = fs.readFileSync(blogPagePath, 'utf8');
    
    const hasServerClient = blogPageContent.includes('supabase-server');
    const hasRevalidate = blogPageContent.includes('revalidate');
    const hasUseClient = blogPageContent.includes('"use client"') || blogPageContent.includes("'use client'");
    
    console.log(`   ${hasServerClient ? colors.green + '✅' : colors.red + '❌'} Uses Server Client: ${hasServerClient}${colors.reset}`);
    console.log(`   ${hasRevalidate ? colors.green + '✅' : colors.red + '❌'} Has revalidate (ISR): ${hasRevalidate}${colors.reset}`);
    console.log(`   ${!hasUseClient ? colors.green + '✅' : colors.red + '❌'} Server Component (not client): ${!hasUseClient}${colors.reset}`);
    
    if (hasRevalidate) {
      const revalidateMatch = blogPageContent.match(/revalidate\s*=\s*(\d+)/);
      if (revalidateMatch) {
        const seconds = parseInt(revalidateMatch[1]);
        console.log(`   ${colors.cyan}ℹ️  Revalidate interval: ${seconds} seconds${colors.reset}`);
      }
    }
    
    console.log();
    
    return hasServerClient && hasRevalidate && !hasUseClient;
  } catch (error) {
    console.log(`   ${colors.red}❌ Error reading file: ${error.message}${colors.reset}\n`);
    return false;
  }
};

// تست sitemap
const testSitemap = () => {
  const fs = require('fs');
  const path = require('path');
  
  console.log(`${colors.blue}3️⃣ Checking sitemap configuration...${colors.reset}`);
  
  try {
    const sitemapPath = path.join(__dirname, '../app/sitemap.ts');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    const hasServerClient = sitemapContent.includes('supabase-server');
    const hasBlogPosts = sitemapContent.includes('blog_posts');
    const hasTeachers = sitemapContent.includes('teachers');
    
    console.log(`   ${hasServerClient ? colors.green + '✅' : colors.red + '❌'} Uses Server Client: ${hasServerClient}${colors.reset}`);
    console.log(`   ${hasBlogPosts ? colors.green + '✅' : colors.red + '❌'} Includes blog posts: ${hasBlogPosts}${colors.reset}`);
    console.log(`   ${hasTeachers ? colors.green + '✅' : colors.red + '❌'} Includes teachers: ${hasTeachers}${colors.reset}`);
    
    console.log();
    
    return hasServerClient && hasBlogPosts;
  } catch (error) {
    console.log(`   ${colors.red}❌ Error reading sitemap: ${error.message}${colors.reset}\n`);
    return false;
  }
};

// تست metadata
const testMetadata = () => {
  const fs = require('fs');
  const path = require('path');
  
  console.log(`${colors.blue}4️⃣ Checking metadata configuration...${colors.reset}`);
  
  try {
    const blogPagePath = path.join(__dirname, '../app/blog/page.tsx');
    const blogPageContent = fs.readFileSync(blogPagePath, 'utf8');
    
    const hasMetadata = blogPageContent.includes('export const metadata');
    const hasTitle = blogPageContent.includes('title:');
    const hasDescription = blogPageContent.includes('description:');
    const hasOpenGraph = blogPageContent.includes('openGraph:');
    const hasCanonical = blogPageContent.includes('canonical:');
    
    console.log(`   ${hasMetadata ? colors.green + '✅' : colors.red + '❌'} Exports metadata: ${hasMetadata}${colors.reset}`);
    console.log(`   ${hasTitle ? colors.green + '✅' : colors.red + '❌'} Has title: ${hasTitle}${colors.reset}`);
    console.log(`   ${hasDescription ? colors.green + '✅' : colors.red + '❌'} Has description: ${hasDescription}${colors.reset}`);
    console.log(`   ${hasOpenGraph ? colors.green + '✅' : colors.red + '❌'} Has Open Graph: ${hasOpenGraph}${colors.reset}`);
    console.log(`   ${hasCanonical ? colors.green + '✅' : colors.red + '❌'} Has canonical URL: ${hasCanonical}${colors.reset}`);
    
    console.log();
    
    return hasMetadata && hasTitle && hasDescription;
  } catch (error) {
    console.log(`   ${colors.red}❌ Error checking metadata: ${error.message}${colors.reset}\n`);
    return false;
  }
};

// اجرای تمام تست‌ها
async function runAllTests() {
  const localhostResult = await testLocalhost();
  const buildResult = testBuildOutput();
  const sitemapResult = testSitemap();
  const metadataResult = testMetadata();
  
  // خلاصه نتایج
  console.log('='.repeat(80));
  console.log(`${colors.cyan}📊 Test Summary${colors.reset}`);
  console.log('='.repeat(80));
  
  const tests = [
    { name: 'Localhost Rendering', result: localhostResult },
    { name: 'Build Configuration', result: buildResult },
    { name: 'Sitemap Configuration', result: sitemapResult },
    { name: 'Metadata Configuration', result: metadataResult },
  ];
  
  tests.forEach(test => {
    const icon = test.result ? colors.green + '✅' : colors.red + '❌';
    const status = test.result ? 'PASS' : 'FAIL';
    console.log(`${icon} ${test.name}: ${status}${colors.reset}`);
  });
  
  console.log('='.repeat(80));
  
  const allPassed = tests.every(test => test.result);
  
  if (allPassed) {
    console.log(`\n${colors.green}✅ All tests passed! Your SEO configuration is correct!${colors.reset}`);
    console.log(`${colors.green}✅ Google will be able to index your blog posts!${colors.reset}\n`);
  } else {
    console.log(`\n${colors.yellow}⚠️  Some tests failed. Please check the configuration.${colors.reset}\n`);
  }
  
  // نکات اضافی
  console.log(`${colors.cyan}💡 Next Steps:${colors.reset}`);
  console.log('   1. Run the server: npm run dev');
  console.log('   2. Visit: http://localhost:3000/blog');
  console.log('   3. View page source (Ctrl+U) and search for blog titles');
  console.log('   4. Deploy to production and test with:');
  console.log('      - Google Search Console URL Inspection');
  console.log('      - Rich Results Test');
  console.log('      - PageSpeed Insights\n');
  
  console.log(`${colors.cyan}📚 Documentation:${colors.reset}`);
  console.log('   - See: SEO_AND_INDEXING_IMPACT.md');
  console.log('   - See: QUICK_BLOG_FIX_GUIDE.md\n');
}

// اجرا
runAllTests();

