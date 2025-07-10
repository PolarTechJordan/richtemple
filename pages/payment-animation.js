import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function PaymentAnimationPage() {
  const [paymentVerified, setPaymentVerified] = useState(false)
  const [animationEnded, setAnimationEnded] = useState(false)
  const [videoElement, setVideoElement] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // 检查支付信息
    const paymentInfo = localStorage.getItem('paymentInfo')
    if (!paymentInfo) {
      router.push('/wish')
      return
    }

    // 模拟支付验证过程
    const verifyPayment = async () => {
      try {
        // 这里应该调用实际的支付验证逻辑
        // 模拟验证延迟 - 假设3.mp4大概5-6秒，我们在4秒后验证成功
        await new Promise(resolve => setTimeout(resolve, 4000))
        
        // 模拟支付成功
        setPaymentVerified(true)
        
        // 存储支付成功状态
        localStorage.setItem('paymentVerified', 'true')
        localStorage.setItem('paymentTime', Date.now().toString())
        
        // 支付验证成功后，等待当前视频循环结束再跳转
        // 移除循环属性，让视频播放完当前循环后结束
        if (videoElement) {
          videoElement.loop = false
        }
        
      } catch (error) {
        console.error('支付验证失败:', error)
        alert('支付验证失败，请重试')
        router.push('/result')
      }
    }

    verifyPayment()
  }, [router, videoElement])

  const handleAnimationEnd = () => {
    // 只有在支付验证成功后才能结束动画
    if (paymentVerified) {
      setAnimationEnded(true)
      // 动画结束后稍等一下再跳转，显示成功提示
      setTimeout(() => {
        router.push('/merit')
      }, 2000)
    }
  }

  const handleVideoLoad = (event) => {
    setVideoElement(event.target)
  }

  return (
    <>
      <Head>
        <title>上香祈福 - Rich Temple</title>
        <meta name="description" content="正在为您进行上香祈福仪式" />
      </Head>

      <div className="fixed inset-0 bg-ink overflow-hidden">
        {/* 上香动画视频 */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          onEnded={handleAnimationEnd}
          onLoadedData={handleVideoLoad}
        >
          <source src="/videos/3.mp4" type="video/mp4" />
          您的浏览器不支持视频播放
        </video>

        {/* 覆盖层 */}
        <div className="absolute inset-0 bg-black/20">
          {/* 状态指示器 */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-4 text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                {paymentVerified ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-white font-kai">支付验证成功</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-kai">正在验证支付...</span>
                  </>
                )}
              </div>
              <div className="text-white/80 font-kai text-sm">
                {paymentVerified ? '正在为您上香祈福' : '请稍候'}
              </div>
            </div>
          </div>

          {/* 中央文字 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="responsive-title font-kai text-white mb-4 animate-pulse">
                上香祈福
              </h1>
              <p className="responsive-text text-white/90 font-kai">
                诚心上香，功德无量
              </p>
            </div>
          </div>

          {/* 底部进度指示 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-white font-kai text-sm mb-2">
                祈福进行中...
              </div>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>

          {/* 装饰性元素 */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/6 w-16 h-16 border border-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* 动画结束提示 */}
          {animationEnded && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-kai text-white mb-2">
                  上香成功
                </h2>
                <p className="text-white/80 font-kai">
                  您的愿望已传达至神明
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 