import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import FloatingSidebar from '../components/FloatingSidebar'
import deepseekService from '../services/deepseekService'

export default function MeritPage() {
  const [currentSection, setCurrentSection] = useState('success')
  const [dailyFortune, setDailyFortune] = useState('')
  const [loadingFortune, setLoadingFortune] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 检查是否已完成支付
    const paymentVerified = localStorage.getItem('paymentVerified')
    if (!paymentVerified) {
      router.push('/wish')
      return
    }
    
    // 检查URL参数，自动切换到对应section
    const { section } = router.query
    if (section && ['fortune', 'contact', 'store'].includes(section)) {
      setCurrentSection(section)
      // 如果是fortune section，自动加载每日运势
      if (section === 'fortune' && !dailyFortune) {
        handleSectionChange('fortune')
      }
    }
  }, [router, dailyFortune])

  const handleSectionChange = async (section) => {
    // 如果点击"祈愿上香"，直接跳转到wish页面
    if (section === 'wish') {
      router.push('/wish')
      return
    }
    
    if (section === 'fortune' && !dailyFortune) {
      setLoadingFortune(true)
      try {
        const result = await deepseekService.getDailyFortune()
        setDailyFortune(result.fortune)
      } catch (error) {
        console.error('获取每日运势失败:', error)
        setDailyFortune('今日运势良好，诸事顺利。建议多行善事，保持善念，福运自然来临。')
      } finally {
        setLoadingFortune(false)
      }
    }
    setCurrentSection(section)
  }

  const handleTwitterShare = () => {
    const text = encodeURIComponent('我在财神殿完成了祈福上香，愿望已传达至神明！🙏 #RichTemple #财神殿 #Web3祈福')
    const url = encodeURIComponent(window.location.origin)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const handlePrayAgain = () => {
    // 清除之前的数据
    localStorage.removeItem('userWish')
    localStorage.removeItem('divinationNumbers')
    localStorage.removeItem('paymentInfo')
    localStorage.removeItem('paymentVerified')
    router.push('/wish')
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'success':
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-gold-temple to-red-temple rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🙏</span>
              </div>
              <h2 className="text-3xl font-kai text-ink mb-4">
                上香成功
              </h2>
              <p className="text-xl text-ink-light font-kai mb-8">
                您的愿望已传达至神明
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <button
                onClick={handleTwitterShare}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-kai py-3 px-6 rounded-lg transition-colors duration-300"
              >
                分享至 Twitter
              </button>
              <button
                onClick={handlePrayAgain}
                className="w-full ink-button"
              >
                再次祈愿上香
              </button>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-4 text-ink-lighter">
                <div className="w-12 h-px bg-ink-lighter"></div>
                <span className="font-kai text-sm">功德无量</span>
                <div className="w-12 h-px bg-ink-lighter"></div>
              </div>
            </div>
          </div>
        )

      case 'fortune':
        return (
          <div>
            <h2 className="text-2xl font-kai text-ink mb-6 text-center">
              每日运势
            </h2>
            {loadingFortune ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink mx-auto mb-4"></div>
                <p className="font-kai text-ink-light">正在为您推算今日运势...</p>
              </div>
            ) : (
              <div className="floating-card">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🔮</div>
                  <h3 className="text-xl font-kai text-ink mb-2">
                    {new Date().toLocaleDateString('zh-CN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                </div>
                <div className="prose max-w-none">
                  <div className="font-kai text-ink-light leading-relaxed whitespace-pre-line">
                    {dailyFortune}
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'store':
        return (
          <div>
            <h2 className="text-2xl font-kai text-ink mb-6 text-center">
              法物流通
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="floating-card">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🧿</div>
                  <h3 className="font-kai text-lg text-ink">实体法物</h3>
                </div>
                <p className="font-kai text-ink-light text-sm text-center">
                  开光护身符、平安符、招财符等传统法物
                </p>
              </div>
              <div className="floating-card">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">💎</div>
                  <h3 className="font-kai text-lg text-ink">数字法物</h3>
                </div>
                <p className="font-kai text-ink-light text-sm text-center">
                  NFT护身符、数字符咒、区块链功德证书
                </p>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => router.push('/store')}
                className="ink-button"
              >
                进入商城
              </button>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div>
            <h2 className="text-2xl font-kai text-ink mb-6 text-center">
              联系我们
            </h2>
            <div className="max-w-md mx-auto space-y-6">
              <div className="floating-card">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h3 className="font-kai text-ink mb-1">邮箱</h3>
                    <p className="font-kai text-ink-light text-sm">
                      contact@richtemple.com
                    </p>
                  </div>
                </div>
              </div>
              <div className="floating-card">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🐦</div>
                  <div>
                    <h3 className="font-kai text-ink mb-1">Twitter</h3>
                    <p className="font-kai text-ink-light text-sm">
                      @RichTemple
                    </p>
                  </div>
                </div>
              </div>
              <div className="floating-card">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">💬</div>
                  <div>
                    <h3 className="font-kai text-ink mb-1">Discord</h3>
                    <p className="font-kai text-ink-light text-sm">
                      Rich Temple Community
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Head>
        <title>功德页面 - Rich Temple</title>
        <meta name="description" content="查看您的功德记录和更多功能" />
      </Head>

      <div className="min-h-screen bg-rice ink-wash-bg cloud-pattern">
        {/* 浮动侧边栏 */}
        <FloatingSidebar 
          isVisible={true} 
          onNavigate={handleSectionChange}
        />

        {/* 主内容区 */}
        <main className="ml-0 md:ml-64 min-h-screen p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  )
} 