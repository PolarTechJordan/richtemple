import '../styles/globals.css'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // 设置页面标题
    document.title = 'Rich Temple - 财神庙'
    
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
    
    return () => {
      document.head.removeChild(meta)
      document.head.removeChild(fontLink)
    }
  }, [])

  return <Component {...pageProps} />
} 