import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { formatAddress } from '../utils/walletUtils'
import { handleEthereumError } from '../utils/ethereumProtection'

export default function WalletConnectButton() {
  const { address, isConnected, status } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  // 获取第一个可用的连接器（通常是MetaMask）
  const connector = connectors[0]

  const handleConnect = async () => {
    if (connector) {
      try {
        await connect({ connector })
      } catch (err) {
        if (!handleEthereumError(err)) {
          console.error('连接钱包失败:', err)
          // 可以在这里显示用户友好的错误消息
        }
      }
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (err) {
      if (!handleEthereumError(err)) {
        console.error('断开连接失败:', err)
        // 可以在这里显示用户友好的错误消息
      }
    }
  }

  if (isPending) {
    return (
      <button
        disabled
        className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-ink cursor-not-allowed font-kai text-ink opacity-50"
      >
        连接中...
      </button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="relative group">
        <button
          className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-ink hover:shadow-ink-lg transition-all duration-300 font-kai text-ink"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">
              {formatAddress(address)}
            </span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {/* 下拉菜单 */}
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-ink/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-sm text-ink-light font-kai border-b border-ink/10">
              {formatAddress(address)}
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded font-kai transition-colors duration-200"
            >
              断开连接
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-ink hover:shadow-ink-lg transition-all duration-300 font-kai text-ink"
    >
      连接钱包
    </button>
  )
} 