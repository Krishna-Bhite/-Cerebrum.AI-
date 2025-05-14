import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  typescript:{
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [{
      hostname: "logo.clearbit.com",
    }
  ]
  }
};

export default nextConfig;
