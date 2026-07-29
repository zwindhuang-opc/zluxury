/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'trae-api-cn.mchost.guru' }
    ]
  },
  basePath: process.env.NODE_ENV === 'production' ? '/zluxury' : '',
  trailingSlash: true,
  reactStrictMode: true
};
module.exports = nextConfig;