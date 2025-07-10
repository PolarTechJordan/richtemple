import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import ClientOnlyVideo from '../components/ClientOnlyVideo'

export default function InitialPage() {
  const [videoEnded, setVideoEnded] = useState(false)
  const [ripples, setRipples] = useState([])
  const videoRef = useRef(null)
  const router = useRouter()
  const containerRef = useRef(null)

  useEffect(() => {
    // 3秒后自动结束视频（如果视频还没结束）
    const timer = setTimeout(() => {
      setVideoEnded(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleVideoEnd = () => {
    setVideoEnded(true)
  }

  const handleMouseMove = (e) => {
    if (!videoEnded) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // 创建涟漪效果
    const newRipple = {
      id: Date.now(),
      x: x - 50,
      y: y - 50,
    }
    
    setRipples(prev => [...prev, newRipple])
    
    // 1.5秒后移除涟漪
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 1500)
  }

  const handleNextStep = () => {
    router.push('/wish')
  }

  return (
    <>
      <Head>
        <title>Rich Temple - 财神殿</title>
        <meta name="description" content="财神殿 Web3 祈福上香平台" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div 
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden bg-ink"
        onMouseMove={handleMouseMove}
      >
        {/* 视频背景 - 客户端渲染组件 */}
        <ClientOnlyVideo
          src="/videos/1.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          onEnded={handleVideoEnd}
        />

        {/* 涟漪效果 */}
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '100px',
              height: '100px',
            }}
          />
        ))}

        {/* 视频结束后的交互层 */}
        {videoEnded && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <h1 className="responsive-title font-kai text-white mb-8 text-shadow-lg">
                财神殿
              </h1>
              <p className="responsive-text text-white/90 mb-12 font-kai">
                诚心祈福，神明护佑
              </p>
              <button
                onClick={handleNextStep}
                className="ink-button bg-red-temple/80 hover:bg-red-temple text-white px-12 py-4 text-xl font-kai rounded-lg shadow-temple animate-float"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* 加载指示器 */}
        {!videoEnded && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2 text-white/80">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span className="ml-4 font-kai text-sm">正在加载...</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
} 