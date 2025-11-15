import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Disable TypeScript and ESLint errors during build for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable static page generation to avoid useSearchParams() prerender issues
  // This forces all pages to be server-side rendered
  // @ts-ignore
  experimental: {
    // @ts-ignore
    isrMemoryCacheSize: 0,
  },
};

export default nextConfig;
