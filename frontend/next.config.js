/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
    domains: [],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  },
  // Only use basePath for GitHub Pages, not for Docker deployment
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES ? '/Everest' : ''),
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES ? '/Everest' : ''),
}

module.exports = nextConfig

