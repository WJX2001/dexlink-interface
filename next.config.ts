import type { NextConfig } from 'next';

// eslint-disable-next-line
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const pageExtensions = ['page.tsx'];

const nextConfig: NextConfig = withBundleAnalyzer({
  /* config options here */
  // @ts-ignore
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    // config.resolve.fallback = { fs: false };
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: ['prefixIds'],
            },
          },
        },
      ],
    });
    config.experiments = { topLevelAwait: true };
    return config;
  },
  trailingSlash: true,
  pageExtensions,
  reactStrictMode: true,
})


export default nextConfig;
