import '../styles/globals.css'
import { useEffect } from 'react'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '../utils/wagmiConfig'
import { setupEthereumProtection } from '../utils/ethereumProtection'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // 设置页面标题
    document.title = 'Rich Temple - 财神殿'
    
    // 设置meta标签
    const meta = document.createElement('meta')
    meta.name = 'viewport'
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    document.head.appendChild(meta)
    
    // 预加载字体
    const fontLink = document.createElement('link')
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=ZCOOL+QingKe+HuangYou&display=swap'
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)
    
    // 设置ethereum对象保护
    const cleanup = setupEthereumProtection()
    
    return () => {
      document.head.removeChild(meta)
      document.head.removeChild(fontLink)
      // 清理ethereum保护
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 