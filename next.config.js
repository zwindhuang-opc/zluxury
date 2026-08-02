/**
 * Next.js Configuration for ZLuxury
 *
 * Supports both local development (no basePath) and GitHub Pages deployment
 * (basePath=/zluxury). The NEXT_PUBLIC_BASE_PATH env var is set in the
 * GitHub Actions workflow to enable static export with correct asset paths.
 *
 * @type {import('next').NextConfig}
 */

/** Base path for GitHub Pages (empty in dev, "/zluxury" in production build). @type {string} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages — only affects `next build`, not `next dev`
  output: 'export',

  // basePath/assetPrefix for GitHub Pages subpath hosting
  // GitHub Pages serves at https://<user>.github.io/zluxury/
  basePath: basePath || undefined,
  assetPrefix: basePath ? basePath + '/' : undefined,

  // Images: unoptimized for static export (no server-side optimization)
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'trae-api-cn.mchost.guru' }
    ]
  },

  // Trailing slash for GitHub Pages compatibility (serves /path/index.html)
  trailingSlash: true,

  reactStrictMode: true,
};

module.exports = nextConfig;