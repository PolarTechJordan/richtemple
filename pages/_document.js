import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        {/* Ethereum对象保护脚本 - 必须在所有其他脚本之前加载 */}
        <script src="/ethereum-protection.js" defer={false} />
        
        {/* 网站图标 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        
        {/* 预加载重要资源 */}
        <link rel="preload" href="/videos/1.mp4" as="video" type="video/mp4" />
        
        {/* 字体预加载 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Meta标签 */}
        <meta name="theme-color" content="#8B4513" />
        <meta name="description" content="财神殿 Web3 祈福上香平台" />
        <meta name="keywords" content="财神殿,Web3,祈福,上香,区块链,加密货币" />
        
        {/* 移动端优化 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="财神殿" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 