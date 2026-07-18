/** @type {import('next').NextConfig} */
const { securityHeaders } = require('./config/security-headers');

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  env: {
    SANITY_API_WRITE_TOKEN: process.env.SANITY_API_WRITE_TOKEN,
  },
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
