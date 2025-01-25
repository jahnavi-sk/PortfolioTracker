import { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://16.171.133.9:8080/api/:path*', // Proxy to your Spring Boot backend
      },
    ];
  },
};

export default nextConfig;
