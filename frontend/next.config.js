/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
  images: {
    domains: ['localhost'],
  },
  experimental: {
    esmExternals: false,
  },
};

module.exports = nextConfig; 