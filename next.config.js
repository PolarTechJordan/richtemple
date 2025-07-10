/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Cloudflare Pages 优化
  trailingSlash: true,
  output: 'standalone', // 优化输出大小
  
  // 禁用缓存以避免大文件
  webpack: (config, { dev, isServer }) => {
    // 禁用持久缓存
    config.cache = false
    
    // 视频文件处理优化
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/media/',
          outputPath: 'static/media/',
          name: '[name].[ext]', // 移除 hash 减少复杂度
        },
      },
    })

    // 优化分包
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -10,
            maxSize: 244000, // 限制单个包大小为 ~240KB
          },
        },
      }
    }

    return config
  },
  
  // 图片优化
  images: {
    domains: ['localhost', 'imagedelivery.net'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // 在 Cloudflare Pages 上禁用 Next.js 图片优化
  },
  
  // 环境变量
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
  },
  
  // 页面扩展名
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // 实验性功能 - Next.js 14 中不再需要 appDir 配置

  // 压缩配置
  compress: true,
  poweredByHeader: false,
  
  // 优化构建
  swcMinify: true,
  
  // 禁用一些可能导致大文件的功能
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 