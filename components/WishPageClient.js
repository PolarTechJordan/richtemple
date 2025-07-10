import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import FloatingSidebar from './FloatingSidebar'
import WalletConnectButton from './WalletConnectButton'

export default function WishPageClient() {
  const [wish, setWish] = useState('')
  const [showConnectPrompt, setShowConnectPrompt] = useState(false)
  const router = useRouter()
  const { address, isConnected } = useAccount()

  const handleWishChange = (e) => {
    setWish(e.target.value)
  }

  const handleNextStep = () => {
    if (!wish.trim()) {
      alert('请输入您的心愿')
      return
    }
    
    // 检查钱包连接状态
    if (!isConnected || !address) {
      setShowConnectPrompt(true)
      return
    }
    
    // 将愿望存储到localStorage
    localStorage.setItem('userWish', wish)
    router.push('/calculate')
  }

  const handleSidebarNavigate = (section) => {
    if (section === 'wish') {
      // 当前已在wish页面，无需跳转
      return
    }
    
    if (section === 'store') {
      // 跳转到store页面
      router.push('/store')
    } else if (section === 'fortune' || section === 'contact') {
      // 跳转到merit页面并显示对应section
      router.push(`/merit?section=${section}`)
    } else {
      // 默认跳转到merit页面
      router.push('/merit')
    }
  }

  return (
    <div className="min-h-screen bg-rice ink-wash-bg cloud-pattern">
      {/* 装饰图片 */}
      {/* 左上角装饰 */}
      <img src="/assets/images/p1/p1_left_top.png" alt="" className="decoration-img decoration-left-top" />
      
      {/* 左下角装饰 */}
      <img src="/assets/images/p1/p1_left_btm.png" alt="" className="decoration-img decoration-left-btm scale-75 origin-bottom-left" />
      
      {/* 右上角装饰 */}
      <img src="/assets/images/p1/p1_right_top.png" alt="" className="decoration-img decoration-right-top" />
      
      {/* 中间左侧装饰 */}
      <img src="/assets/images/p1/p1_mid_left.png" alt="" className="decoration-img decoration-mid-left" />
      
      {/* 中间装饰 */}
      <img src="/assets/images/p1/p1_mid.png" alt="" className="decoration-img decoration-mid" />
      
      {/* 中间右侧装饰 */}
      <img src="/assets/images/p1/p1_mid_right.png" alt="" className="decoration-img decoration-mid-right" />

      {/* 浮动侧边栏 */}
      <FloatingSidebar 
        isVisible={false} 
        onNavigate={handleSidebarNavigate}
      />

      {/* 钱包连接按钮 */}
      <div className="absolute top-4 right-4 z-10">
        <WalletConnectButton />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* 页面头部 */}
        <header className="text-center mb-12 md:mb-20">
          <h1 className="responsive-title font-kai font-light tracking-wider mb-4 text-ink">
          &#8203;
          </h1>
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
                maxLength={300}
              />
              <div className="text-right text-sm text-ink-lighter mt-2">
                {wish.length}/300
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              <button
                onClick={handleNextStep}
                className="ink-button"
              >
                下一步
              </button>
            </div>
          </div>

        </main>
      </div>

      {/* 底部装饰 */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-ink/5 to-transparent pointer-events-none"></div> */}
      
      {/* 连接钱包提示弹窗 */}
      {showConnectPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6 animate-modalFadeIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-kai text-ink mb-2">需要连接钱包</h3>
              <p className="text-ink-light font-kai mb-6">
                请先连接您的钱包，才能进行下一步祈福操作
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConnectPrompt(false)}
                  className="flex-1 px-4 py-2 border border-ink/20 rounded-lg text-ink-light hover:bg-ink/5 transition-colors font-kai"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowConnectPrompt(false)
                    // 滚动到钱包连接按钮
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-kai"
                >
                  去连接
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 