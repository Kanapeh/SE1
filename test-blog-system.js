// Test script for the new blog slug system
// Run this with: node test-blog-system.js

const testSlugs = [
  'best-english-learning-methods-2025',
  'ielts-preparation-guide',
  'english-grammar-tips',
  'conversation-skills-improvement',
  'test-article-123'
];

console.log('🧪 Testing Blog Slug System');
console.log('==========================');

testSlugs.forEach((slug, index) => {
  console.log(`\n${index + 1}. Testing slug: "${slug}"`);
  
  // Test URL generation
  const localhostUrl = `http://localhost:3000/blog/${slug}`;
  const productionUrl = `https://www.se1a.org/blog/${slug}`;
  
  console.log(`   Localhost: ${localhostUrl}`);
  console.log(`   Production: ${productionUrl}`);
  
  // Test slug validation
  const isValidSlug = /^[a-z0-9-]+$/.test(slug);
  console.log(`   Valid slug: ${isValidSlug ? '✅' : '❌'}`);
  
  // Test slug length
  const isReasonableLength = slug.length >= 5 && slug.length <= 100;
  console.log(`   Reasonable length: ${isReasonableLength ? '✅' : '❌'}`);
});

console.log('\n🎯 Expected Results:');
console.log('- All slugs should be valid (only lowercase letters, numbers, hyphens)');
console.log('- All slugs should have reasonable length (5-100 characters)');
console.log('- URLs should be clean and readable');
console.log('- System should work on both localhost and production');

console.log('\n📝 Next Steps:');
console.log('1. Run the database migration script');
console.log('2. Test creating a new blog post with English slug');
console.log('3. Verify the post appears at the correct URL');
console.log('4. Test on production environment');

console.log('\n✅ Blog slug system is ready for testing!');
