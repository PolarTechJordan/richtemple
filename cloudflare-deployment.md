# Rich Temple - Cloudflare Pages 部署指南

## 📋 部署前准备

### 1. 项目配置检查

#### ✅ 当前配置状态
- ✅ Next.js 14 项目结构正常
- ✅ 支持视频文件处理
- ✅ 环境变量配置就绪
- ✅ 依赖包完整

#### 🔧 需要优化的配置

为了更好地适配 Cloudflare Pages，我们需要对 `next.config.js` 进行一些调整：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Cloudflare Pages 优化
  trailingSlash: true,
  assetPrefix: '',
  
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
  
  // 图片优化 - 添加 Cloudflare Images 支持
  images: {
    domains: ['localhost', 'imagedelivery.net'], // Cloudflare Images
    formats: ['image/webp', 'image/avif'],
    unoptimized: false, // Cloudflare Pages 支持图片优化
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
```

## 🚀 Cloudflare Pages 部署步骤

### 步骤 1: 准备 Git 仓库

1. **确保代码已推送到 GitHub**
   ```bash
   git add .
   git commit -m "准备 Cloudflare Pages 部署"
   git push origin main
   ```

2. **检查仓库结构**
   - 确保 `package.json` 在根目录
   - 确保 `next.config.js` 配置正确
   - 确保 `public/` 目录包含所有静态资源

### 步骤 2: 创建 Cloudflare Pages 项目

1. **登录 Cloudflare Dashboard**
   - 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 登录您的账户

2. **创建 Pages 项目**
   - 在左侧菜单中选择 **"Pages"**
   - 点击 **"Create a project"**
   - 选择 **"Connect to Git"**

3. **连接 GitHub 仓库**
   - 授权 Cloudflare 访问您的 GitHub
   - 选择 `richtemple` 仓库
   - 点击 **"Begin setup"**

### 步骤 3: 配置构建设置

在 Cloudflare Pages 配置页面设置以下参数：

#### 🔧 构建配置
```
项目名称: rich-temple (或您喜欢的名称)
生产分支: main
构建命令: npm run build:cloudflare
构建输出目录: .next
根目录: / (保持为根目录)
```

> **重要**: 使用 `npm run build:cloudflare` 而不是 `npm run build`，这个命令会自动清理缓存并优化构建过程。

#### 📦 高级构建设置
```
Node.js 版本: 18.x (推荐)
环境变量: (见下一步)
```

### 步骤 4: 配置环境变量

在 **Settings** > **Environment variables** 中添加：

#### 🔑 必需的环境变量
```
DEEPSEEK_API_KEY = sk-b3ffcd0b8841461783dcc82759746fec
DEEPSEEK_API_URL = https://api.deepseek.com/v1
NEXT_PUBLIC_APP_URL = https://your-domain.pages.dev
```

#### 🌐 可选的环境变量
```
WALLET_CONNECT_PROJECT_ID = your_wallet_connect_project_id
NODE_ENV = production
```

### 步骤 5: 部署和测试

1. **触发部署**
   - 点击 **"Save and Deploy"**
   - 等待构建完成（通常 2-5 分钟）

2. **监控构建过程**
   - 在 **Deployments** 标签查看构建日志
   - 确保没有错误或警告

3. **测试部署**
   - 部署完成后，您会获得一个 `.pages.dev` 域名
   - 访问网站测试所有功能

## 🔍 常见问题和解决方案

### 问题 1: 构建文件过大 (超过 25MB 限制)
**症状**: `Error: Pages only supports files up to 25 MiB in size`
**解决方案**:

1. **使用优化后的构建命令**:
   ```bash
   # 在 Cloudflare Pages 设置中使用
   npm run build:cloudflare
   ```

2. **清理本地缓存后重新推送**:
   ```bash
   npm run clean
   git add .
   git commit -m "优化构建配置，解决大文件问题"
   git push origin main
   ```

3. **检查 next.config.js 配置**:
   ```javascript
   module.exports = {
     // 禁用缓存
     webpack: (config) => {
       config.cache = false; // 关键配置
       return config;
     },
     
     // 优化输出
     output: 'standalone',
   };
   ```

4. **如果仍有问题，检查视频文件大小**:
   ```bash
   # 检查视频文件大小
   ls -lh public/videos/
   
   # 如果视频过大，可以压缩
   # 建议每个视频文件不超过 10MB
   ```

### 问题 2: 环境变量未生效
**症状**: API 调用失败，环境变量为 undefined
**解决方案**:
1. 确保在 Cloudflare Pages 设置中添加了环境变量
2. 重新部署项目
3. 检查变量名称是否正确

### 问题 3: 钱包连接问题
**症状**: Web3 钱包连接失败
**解决方案**:
1. 确保 `WALLET_CONNECT_PROJECT_ID` 已配置
2. 检查 WalletConnect 项目设置中的域名白名单

### 问题 4: 农历库加载失败
**症状**: 每日运势功能报错
**解决方案**:
```javascript
// 在组件中使用动态导入
const loadLunarLibrary = async () => {
  try {
    const { Lunar } = await import('lunar-javascript');
    return Lunar;
  } catch (error) {
    console.error('Failed to load lunar library:', error);
    return null;
  }
};
```

## 🌐 自定义域名配置

### 步骤 1: 添加自定义域名
1. 在 Cloudflare Pages 项目中，转到 **Custom domains**
2. 点击 **"Set up a custom domain"**
3. 输入您的域名（例如：richtemple.com）

### 步骤 2: DNS 配置
如果您的域名也在 Cloudflare 管理：
1. DNS 记录会自动配置
2. SSL 证书会自动颁发

如果域名在其他服务商：
1. 添加 CNAME 记录：`your-domain.com` -> `your-project.pages.dev`
2. 等待 DNS 传播（通常 24 小时内）

## 📈 性能优化建议

### 1. 静态资源优化
```javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  
  // 启用静态优化
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  },
};
```

### 2. 缓存策略
```javascript
// 在 pages/_app.js 中添加
export default function MyApp({ Component, pageProps }) {
  // 添加缓存头
  useEffect(() => {
    // 设置静态资源缓存
    if (typeof window !== 'undefined') {
      // 客户端缓存策略
    }
  }, []);
  
  return <Component {...pageProps} />;
}
```

### 3. 图片压缩
- 使用 WebP 格式
- 启用 Cloudflare Images 优化
- 压缩视频文件大小

## 🔒 安全配置

### 1. 环境变量安全
- 确保敏感信息只在服务器端使用
- 使用 `NEXT_PUBLIC_` 前缀的变量才会暴露给客户端

### 2. CSP 配置
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ],
      },
    ];
  },
};
```

## ✅ 部署检查清单

- [ ] GitHub 仓库已更新
- [ ] next.config.js 已优化
- [ ] Cloudflare Pages 项目已创建
- [ ] 构建设置已配置
- [ ] 环境变量已添加
- [ ] 首次部署成功
- [ ] 所有页面可正常访问
- [ ] 视频播放正常
- [ ] 钱包连接功能正常
- [ ] DeepSeek API 调用正常
- [ ] 每日运势功能正常
- [ ] 自定义域名已配置（可选）

## 🆘 获取帮助

如果遇到问题：
1. 查看 Cloudflare Pages 构建日志
2. 检查浏览器控制台错误
3. 参考 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
4. 联系 Cloudflare 支持

---

**部署完成后，您的 Rich Temple 就可以通过 Cloudflare Pages 全球 CDN 为用户提供快速、稳定的服务了！** 🎉 