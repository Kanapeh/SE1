module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Performance optimizations (simplified)
    ...(process.env.NODE_ENV === 'production' ? {
      // Add production optimizations here when dependencies are resolved
    } : {}),
  },
};
