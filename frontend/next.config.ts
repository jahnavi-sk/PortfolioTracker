import { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://portfoliobackend.zapto.org/api/:path*', // Proxy to your Spring Boot backend
      },
    ];
  },
};

export default nextConfig;
