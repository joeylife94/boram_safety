/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    // 이미지 최적화를 위한 도메인 설정
    domains: ['localhost', '127.0.0.1'],
    // 외부 이미지 패턴 허용
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/images/**',
      },
    ],
  // 이미지 형식 설정
  formats: ['image/webp', 'image/avif'],
  // 배포 환경에서 Next 이미지 최적화를 비활성화하여
  // standalone 모드에서 'sharp' 미설치로 인한 런타임 에러를 방지합니다.
  // 개발(또는 별도 빌드 파이프라인에서 sharp 설치) 환경에서는 이 옵션을 제거하세요.
  unoptimized: true,
    // 이미지 크기 설정
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { dev, isServer }) => {
    // Modify minimizer in production builds for both client and server bundles.
    // Note: removing console from server bundles will also remove server-side logs.
    if (!dev) {
      try {
        const TerserPlugin = require('terser-webpack-plugin');
        config.optimization = config.optimization || {};
        config.optimization.minimize = true;
        config.optimization.minimizer = [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              compress: {
                // drop console.* calls
                drop_console: true,
              },
              format: {
                comments: false,
              },
            },
            extractComments: false,
          }),
        ];
      } catch (e) {
        // If package not installed or something else fails, swallow and continue
        // eslint-disable-next-line no-console
        console.warn('Terser plugin not configured:', e && e.message ? e.message : e);
      }
    }

    return config;
  },
};

module.exports = nextConfig; 