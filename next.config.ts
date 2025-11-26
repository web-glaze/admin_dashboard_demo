import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bluechip-gulf.ae",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  experimental: {
    turbo: {
      rules: {},
    },
  },
};

export default nextConfig;
