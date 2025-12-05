/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
      {
        protocol: 'https',
        hostname: 'freepik.es',
      },
      {
        protocol: 'https',
        hostname: 'freepik.es',
      },
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow images from all HTTPS domains
      },
      {
        protocol: "http",
        hostname: "**", // Allow images from all HTTP domains (dev only)
      },
    ],
  },
};

module.exports = nextConfig;