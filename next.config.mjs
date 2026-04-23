/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Skip TS type-checking during build — 1GB production droplet OOMs on full type check.
  // CI (GitHub Actions) validates types on every PR instead.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Don't fail builds on prerender errors — many pages use client-side routing
  // (useSearchParams, useRouter) and can't be statically prerendered.
  // They'll be server-rendered at request time instead.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.getgroomgrid.com',
          },
        ],
        destination: 'https://getgroomgrid.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
