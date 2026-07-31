/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'trae-api-cn.mchost.guru' }
    ]
  },
  trailingSlash: true,
  reactStrictMode: true
};
module.exports = nextConfig;