/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost', 'https://www.se1a.org/'], // دامنه‌های مجاز برای تصاویر
  },
  // تنظیمات SSR
  serverExternalPackages: ['@supabase/ssr'],
  // تنظیمات برای deployment
  output: 'standalone',
  // تنظیمات برای performance
  compress: true,
  poweredByHeader: false,
  // تنظیمات برای security
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
