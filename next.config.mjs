/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
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
