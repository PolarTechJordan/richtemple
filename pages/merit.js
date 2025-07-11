import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import FloatingSidebar from '../components/FloatingSidebar'
import ClientOnlyWalletConnect from '../components/ClientOnlyWalletConnect'
import AudioControl from '../components/AudioControl'
import deepseekService from '../services/deepseekService'

export default function MeritPage() {
  const [currentSection, setCurrentSection] = useState('success')
  const [dailyFortune, setDailyFortune] = useState('')
  const [loadingFortune, setLoadingFortune] = useState(false)
  const [fortuneLoaded, setFortuneLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 检查是否已完成支付
    const paymentVerified = localStorage.getItem('paymentVerified')
    if (!paymentVerified) {
      router.push('/wish')
      return
    }
    
    // 预先加载今日运势
    loadDailyFortune()
    
    // 检查URL参数，自动切换到对应section
    const { section } = router.query
    if (section && ['fortune', 'contact', 'store'].includes(section)) {
      setCurrentSection(section)
    }
  }, [router])

  // 预先加载每日运势
  const loadDailyFortune = async () => {
    if (fortuneLoaded) return // 避免重复加载
    
    try {
      // 检查今日缓存
      const cacheKey = getDailyFortuneCacheKey()
      const cachedFortune = localStorage.getItem(cacheKey)
      
      if (cachedFortune) {
        // 使用缓存数据
        const fortuneData = JSON.parse(cachedFortune)
        setDailyFortune(fortuneData.fortune)
        setFortuneLoaded(true)
        return
      }
      
      // 没有缓存，调用API
      setLoadingFortune(true)
      const result = await deepseekService.getDailyFortune()
      
      if (result.success) {
        setDailyFortune(result.fortune)
        // 缓存到localStorage
        localStorage.setItem(cacheKey, JSON.stringify({
          fortune: result.fortune,
          date: result.date,
          lunarDate: result.lunarDate,
          timestamp: Date.now()
        }))
      } else {
        setDailyFortune(result.fortune) // 使用默认运势
      }
      
      setFortuneLoaded(true)
    } catch (error) {
      console.error('预加载每日运势失败:', error)
      setDailyFortune('今日运势良好，诸事顺利。建议多行善事，保持善念，福运自然来临。')
      setFortuneLoaded(true)
    } finally {
      setLoadingFortune(false)
    }
  }

  // 生成缓存键（与deepseekService保持一致）
  const getDailyFortuneCacheKey = (date = null) => {
    const targetDate = date ? new Date(date) : new Date()
    return `dailyFortune_${targetDate.getFullYear()}_${targetDate.getMonth() + 1}_${targetDate.getDate()}`
  }

  const handleSectionChange = async (section) => {
    // 如果点击"祈愿上香"，直接跳转到wish页面
    if (section === 'wish') {
      router.push('/wish')
      return
    }
    
    // 如果是fortune section但还没加载，触发加载
    if (section === 'fortune' && !fortuneLoaded) {
      await loadDailyFortune()
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

  // 格式化运势内容
  const formatFortuneContent = (content) => {
    if (!content) return null
    
    const lines = content.split('\n').filter(line => line.trim())
    const sections = []
    let currentSection = null
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // 检查是否是标题行
      if (trimmedLine === '黄道吉日' || trimmedLine.includes('年') || trimmedLine.includes('月')) {
        if (trimmedLine === '黄道吉日') {
          currentSection = { type: 'header', title: trimmedLine, content: [] }
        } else if (trimmedLine.includes('年')) {
          if (currentSection) currentSection.content.push(trimmedLine)
        } else if (trimmedLine.includes('月') && (trimmedLine.includes('吉') || trimmedLine.includes('平') || trimmedLine.includes('凶'))) {
          if (currentSection) currentSection.content.push(trimmedLine)
        }
      }
      // 宜忌事项
      else if (trimmedLine.startsWith('宜 ') || trimmedLine.startsWith('忌 ')) {
        if (currentSection) {
          currentSection.content.push(trimmedLine)
        }
        if (trimmedLine.startsWith('忌 ')) {
          sections.push(currentSection)
          currentSection = null
        }
      }
      // 运势评级
      else if (trimmedLine.includes('★')) {
        const title = trimmedLine.split('★')[0]
        const stars = trimmedLine.match(/★/g)?.length || 0
        const nextLine = lines[index + 1]?.trim()
        currentSection = { 
          type: 'fortune', 
          title: title, 
          stars: stars,
          content: [nextLine || '']
        }
        sections.push(currentSection)
        currentSection = null
      }
      // 特殊部分标题
      else if (trimmedLine === '今日建议' || trimmedLine === '今日幸运') {
        currentSection = { type: 'advice', title: trimmedLine, content: [] }
      }
      // 内容行
      else if (currentSection && trimmedLine) {
        if (trimmedLine.startsWith('幸运') || trimmedLine.startsWith('吉时')) {
          currentSection.content.push(trimmedLine)
        } else if (currentSection.type === 'advice') {
          currentSection.content.push(trimmedLine)
        }
      }
    })
    
    if (currentSection) {
      sections.push(currentSection)
    }
    
    return sections.map((section, index) => {
      switch (section.type) {
        case 'header':
          return (
            <div key={index} className="text-center border-b border-ink/10 pb-4">
              <h3 className="text-2xl font-kai text-red-temple mb-2">{section.title}</h3>
              {section.content.map((line, i) => (
                <p key={i} className="font-kai text-ink text-lg">{line}</p>
              ))}
            </div>
          )
        
        case 'fortune':
          return (
            <div key={index} className="bg-gradient-to-r from-gold-temple/10 to-red-temple/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-kai text-lg text-ink font-semibold">{section.title}</h4>
                <div className="text-yellow-500">
                  {'★'.repeat(section.stars)}{'☆'.repeat(5 - section.stars)}
                </div>
              </div>
              {section.content.map((line, i) => (
                <p key={i} className="font-kai text-ink-light text-sm leading-relaxed">{line}</p>
              ))}
            </div>
          )
        
        case 'advice':
          return (
            <div key={index} className="border-l-4 border-jade pl-4">
              <h4 className="font-kai text-lg text-ink font-semibold mb-2">{section.title}</h4>
              {section.content.map((line, i) => (
                <p key={i} className="font-kai text-ink-light text-sm leading-relaxed mb-1">{line}</p>
              ))}
            </div>
          )
        
        default:
          return (
            <div key={index} className="font-kai text-ink-light leading-relaxed">
              <p>{section.content.join(' ')}</p>
            </div>
          )
      }
    })
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'success':
        return (
          <div className="text-center">
            <div className="mb-8">
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
                className="w-full ink-button duration-300"
              >
                分享至...
              </button>
              <button
                onClick={handlePrayAgain}
                className="w-full ink-button"
              >
                再次祈愿上香
              </button>
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
              <div className="space-y-6">
                {/* 主运势卡片 */}
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
                  
                  {/* 格式化显示运势内容 */}
                  <div className="space-y-4">
                    {formatFortuneContent(dailyFortune)}
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
        {/* 装饰图片 */}
        {/* 左下角装饰 */}
        {/* <img src="/assets/images/p2/p2_left_btm.png" alt="" className="decoration-img decoration-left-btm" /> */}
        
        {/* 右上角装饰和控制按钮 */}
        <img src="/assets/images/p2/p2_right_top.png" alt="" className="decoration-img decoration-right-top" />
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          <AudioControl />
          <ClientOnlyWalletConnect />
        </div>

        {/* 浮动侧边栏 */}
        <FloatingSidebar 
          isVisible={true} 
          onNavigate={handleSectionChange}
        />

        {/* 主内容区 */}
        <main className="ml-64 min-h-screen p-4 md:p-8 flex items-center justify-center">
          <div className="max-w-4xl w-full mx-auto">
            <div className="flex items-center justify-center min-h-[80vh]">
              <div className="w-full max-w-2xl">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
} 