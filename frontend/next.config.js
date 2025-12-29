/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Vercel handles SSR/ISR automatically - no need for static export
  images: {
    unoptimized: false, // Vercel optimizes images automatically
    remotePatterns: [],
  },
  // Only use basePath for GitHub Pages (when GITHUB_PAGES env var is set)
  basePath: process.env.GITHUB_PAGES ? '/Everest' : '',
  assetPrefix: process.env.GITHUB_PAGES ? '/Everest' : '',
}

module.exports = nextConfig

