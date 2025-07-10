import { useState, useEffect } from 'react'
import WalletConnectButton from './WalletConnectButton'

export default function ClientOnlyWalletConnect() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    // 服务器端渲染时显示占位符
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-ink flex items-center justify-center">
        <span className="text-ink/60 text-sm font-kai">加载中...</span>
      </div>
    )
  }

  // 客户端渲染时显示真实的钱包连接按钮
  return <WalletConnectButton />
} 