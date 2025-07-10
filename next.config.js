/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 支持视频文件
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/media/',
          outputPath: 'static/media/',
          name: '[name].[hash].[ext]',
        },
      },
    });
    return config;
  },
  
  // 图片优化
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 环境变量
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
  },
  
  // 页面扩展名
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // 实验性功能
  experimental: {
    appDir: false, // 使用传统的pages目录
  },
};

module.exports = nextConfig; 