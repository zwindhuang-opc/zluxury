/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'cdn.luxury.com', 'api.zluxury.com', 'sothebys.com', 'christies.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: '**.sothebys.com' },
      { protocol: 'https', hostname: '**.christies.com' },
      { protocol: 'https', hostname: '**.farfetch.com' },
    ],
  },
}

module.exports = nextConfig