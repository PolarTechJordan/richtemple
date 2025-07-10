import '../styles/globals.css'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // 设置页面标题
    document.title = 'Rich Temple - 财神殿'
    
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
    
    // 全局错误处理
    const handleError = (error) => {
      console.error('全局错误:', error)
      
      // 处理ethereum对象重定义错误
      if (error.message && error.message.includes('Cannot redefine property: ethereum')) {
        console.warn('检测到ethereum对象重定义错误，已忽略')
        return true // 阻止错误冒泡
      }
      
      return false
    }
    
    // 监听全局错误
    window.addEventListener('error', (event) => {
      if (handleError(event.error)) {
        event.preventDefault()
      }
    })
    
    // 监听Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      if (handleError(event.reason)) {
        event.preventDefault()
      }
    })
    
    // 保护ethereum对象
    const protectEthereumObject = () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // 尝试冻结ethereum对象的某些属性以防止重定义
          if (Object.getOwnPropertyDescriptor(window, 'ethereum')) {
            const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum')
            if (descriptor.configurable) {
              Object.defineProperty(window, 'ethereum', {
                ...descriptor,
                configurable: false
              })
            }
          }
        } catch (error) {
          // 如果保护失败，记录但不阻止应用运行
          console.warn('无法保护ethereum对象:', error)
        }
      }
    }
    
    // 延迟执行保护，确保钱包扩展已加载
    setTimeout(protectEthereumObject, 100)
    
    return () => {
      document.head.removeChild(meta)
      document.head.removeChild(fontLink)
    }
  }, [])

  return <Component {...pageProps} />
} 