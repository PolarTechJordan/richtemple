import { useState, useEffect, useRef } from 'react'

export default function ClientOnlyVideo({ src, onEnded, className, ...props }) {
  const [isClient, setIsClient] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    // 服务器端渲染占位符
    return (
      <div className={`${className} bg-ink flex items-center justify-center`}>
        <div className="text-center">
          <h1 className="responsive-title font-kai text-white mb-8 text-shadow-lg">
            财神殿
          </h1>
          <div className="flex items-center space-x-2 text-white/80">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <span className="ml-4 font-kai text-sm">正在加载...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      className={className}
      onEnded={onEnded}
      {...props}
    >
      <source src={src} type="video/mp4" />
      您的浏览器不支持视频播放
    </video>
  )
} 