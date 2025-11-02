import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false,
    globalNotFound: true,
    cssChunking: true,
  },
  turbopack: {
    root: '../../codebase/web-app/',
  },
};

export default nextConfig;
