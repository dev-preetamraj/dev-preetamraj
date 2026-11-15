/** @type {import('next').NextConfig} */
const { securityHeaders } = require('./config/security-headers');

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return securityHeaders;
  },
};

module.exports = nextConfig;
