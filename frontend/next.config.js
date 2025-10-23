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
    // 이미지 크기 설정
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    esmExternals: false,
  },
};

module.exports = nextConfig; 