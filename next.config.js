/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Build optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimizations
  images: { 
    unoptimized: true,
    domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com'],
  },
  
  // Bundle analyzer (optional - for debugging)
  // bundleAnalyzer: process.env.ANALYZE === 'true',
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components/ui', 'lucide-react', 'framer-motion'],
  },
  
  // Security headers
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
