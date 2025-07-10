import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function WishPage() {
  const [wish, setWish] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const router = useRouter()

  useEffect(() => {
    // 检查是否已连接钱包
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setIsConnected(true)
            setWalletAddress(accounts[0])
          }
        })
        .catch(console.error)
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        setIsConnected(true)
        setWalletAddress(accounts[0])
      } catch (error) {
        console.error('连接钱包失败:', error)
        alert('连接钱包失败，请重试')
      }
    } else {
      alert('请安装MetaMask钱包')
    }
  }

  const handleWishChange = (e) => {
    setWish(e.target.value)
    // 自动调整文本域高度
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const handleNextStep = () => {
    if (!wish.trim()) {
      alert('请输入您的心愿')
      return
    }
    
    // 将愿望存储到localStorage
    localStorage.setItem('userWish', wish)
    router.push('/calculate')
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <>
      <Head>
        <title>许愿池 - Rich Temple</title>
        <meta name="description" content="在财神庙许下您的心愿" />
      </Head>

      <div className="min-h-screen bg-rice ink-wash-bg cloud-pattern">
        {/* 钱包连接按钮 */}
        <div className="absolute top-4 right-4 z-10">
          {isConnected ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-ink">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-kai text-sm text-ink">
                  {formatAddress(walletAddress)}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-ink hover:shadow-ink-lg transition-all duration-300 font-kai text-ink"
            >
              连接钱包
            </button>
          )}
        </div>

        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* 页面头部 */}
          <header className="text-center mb-12 md:mb-20">
            <h1 className="responsive-title font-kai font-light tracking-wider mb-4 text-ink">
              许愿池
            </h1>
            <p className="responsive-text text-ink-lighter mt-6 max-w-2xl mx-auto leading-relaxed">
              愿您的每一个心愿，都如墨入宣纸，在时光中留下深刻印记
            </p>
          </header>

          {/* 主内容区 */}
          <main className="max-w-2xl mx-auto">
            <div className="floating-card">
              <div className="mb-8">
                <label htmlFor="wish" className="block text-ink-light text-lg mb-3 font-kai">
                  写下您的心愿
                </label>
                <textarea 
                  id="wish"
                  value={wish}
                  onChange={handleWishChange}
                  className="w-full h-40 ink-input font-kai resize-none"
                  placeholder="请写下您的心愿..."
                  maxLength={500}
                />
                <div className="text-right text-sm text-ink-lighter mt-2">
                  {wish.length}/500
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 text-ink-light hover:text-ink transition-colors duration-300 font-kai"
                >
                  返回
                </button>
                <button
                  onClick={handleNextStep}
                  className="ink-button"
                >
                  下一步
                </button>
              </div>
            </div>

            {/* 装饰元素 */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-4 text-ink-lighter">
                <div className="w-12 h-px bg-ink-lighter"></div>
                <span className="font-kai text-sm">诚心祈福</span>
                <div className="w-12 h-px bg-ink-lighter"></div>
              </div>
            </div>
          </main>
        </div>

        {/* 底部装饰 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-ink/5 to-transparent pointer-events-none"></div>
      </div>
    </>
  )
} 