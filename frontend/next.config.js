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
  basePath: process.env.NODE_ENV === 'production' ? '/Everest' : '', // GitHub Pages base path
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Everest' : '', // GitHub Pages asset prefix
}

module.exports = nextConfig

