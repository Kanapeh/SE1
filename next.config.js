/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: { 
    unoptimized: false,
    domains: [
      'localhost', 
      '172.20.10.10', // Add local network IP
      'images.unsplash.com', 
      'via.placeholder.com',
      'res.cloudinary.com', // Cloudinary images
      'api.placeholder.com', // Placeholder API
      'picsum.photos', // Lorem Picsum
      'source.unsplash.com', // Unsplash source
      // Add your production domain here
      'www.se1a.org', // Production domain
      'se1a.org', // Production domain without www
      process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '').replace('http://', '') || 'localhost'
    ].filter(Boolean),
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components/ui', 'lucide-react', 'framer-motion'],
  },
  
  // Environment-based configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.se1a.org',
  },
  
  // Add headers for better security and OAuth support
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
          // Add CORS headers for OAuth
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? process.env.NEXT_PUBLIC_SITE_URL || 'https://www.se1a.org'
              : '*', // Allow all origins in development
          },
        ],
      },
    ];
  },
  
  // Add redirects for OAuth compatibility
  async redirects() {
    return [
      {
        source: '/auth/callback',
        destination: '/auth/complete',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
