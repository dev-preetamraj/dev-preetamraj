/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dxgl4eyhq/image/upload/v1687987306/portfolio/me/**',
      },
    ],
  },
};

module.exports = nextConfig;
