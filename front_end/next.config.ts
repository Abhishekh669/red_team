import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.edgestore.dev',
        pathname: '/**',
      },
      {
        protocol : 'https',
        hostname : 'utfs.io',
        pathname : '/**'
      }
    ],
  },
};

export default nextConfig;
