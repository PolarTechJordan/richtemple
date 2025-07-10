/**
 * Ethereum对象保护工具
 * 防止多个钱包扩展冲突导致的ethereum对象重定义错误
 */

// 全局错误处理器
export const setupEthereumProtection = () => {
  if (typeof window === 'undefined') return

  // 1. 早期ethereum对象保护
  const protectEthereumEarly = () => {
    if (window.ethereum) {
      try {
        // 保存原始的ethereum对象
        const originalEthereum = window.ethereum
        
        // 创建一个代理对象来拦截重定义尝试
        const ethereumProxy = new Proxy(originalEthereum, {
          set(target, prop, value) {
            // 允许正常的属性设置，但记录尝试
            console.log(`Setting ethereum.${prop}:`, value)
            return Reflect.set(target, prop, value)
          },
          defineProperty(target, prop, descriptor) {
            // 允许属性定义，但记录尝试
            console.log(`Defining ethereum.${prop}:`, descriptor)
            return Reflect.defineProperty(target, prop, descriptor)
          }
        })

        // 尝试保护window.ethereum属性
        try {
          Object.defineProperty(window, 'ethereum', {
            value: ethereumProxy,
            writable: false,
            configurable: false,
            enumerable: true
          })
        } catch (error) {
          console.warn('无法完全保护ethereum对象:', error)
        }
      } catch (error) {
        console.warn('ethereum对象保护失败:', error)
      }
    }
  }

  // 2. 增强的错误处理
  const enhancedErrorHandler = (error) => {
    if (!error) return false

    const errorMessage = error.message || error.toString()
    
    // 检查是否是ethereum相关错误
    if (errorMessage.includes('Cannot redefine property: ethereum') ||
        errorMessage.includes('ethereum') && errorMessage.includes('redefine')) {
      console.warn('检测到ethereum对象重定义错误，已忽略:', errorMessage)
      return true // 阻止错误冒泡
    }

    // 检查是否是钱包扩展相关错误
    if (errorMessage.includes('chrome-extension://') && 
        (errorMessage.includes('ethereum') || errorMessage.includes('web3'))) {
      console.warn('检测到钱包扩展相关错误，已忽略:', errorMessage)
      return true
    }

    return false
  }

  // 3. 设置全局错误监听器
  const setupErrorListeners = () => {
    // 处理运行时错误
    window.addEventListener('error', (event) => {
      if (enhancedErrorHandler(event.error)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }, true) // 使用捕获阶段

    // 处理Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      if (enhancedErrorHandler(event.reason)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }, true)

    // 处理资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window && enhancedErrorHandler(event.error)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }, true)
  }

  // 4. 监听ethereum对象变化
  const monitorEthereumChanges = () => {
    if (window.ethereum) {
      // 使用MutationObserver监听DOM变化
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'ethereum') {
            console.log('检测到ethereum对象变化')
          }
        })
      })

      // 定期检查ethereum对象
      let lastEthereumCheck = window.ethereum
      const checkInterval = setInterval(() => {
        if (window.ethereum !== lastEthereumCheck) {
          console.log('ethereum对象已更改')
          lastEthereumCheck = window.ethereum
        }
      }, 1000)

      // 清理函数
      return () => {
        observer.disconnect()
        clearInterval(checkInterval)
      }
    }
  }

  // 5. 延迟保护策略
  const delayedProtection = () => {
    // 立即保护
    protectEthereumEarly()
    
    // 延迟保护（等待钱包扩展加载）
    setTimeout(() => {
      protectEthereumEarly()
    }, 100)
    
    // 再次延迟保护
    setTimeout(() => {
      protectEthereumEarly()
    }, 500)
    
    // 最后一次保护
    setTimeout(() => {
      protectEthereumEarly()
    }, 1000)
  }

  // 执行保护
  setupErrorListeners()
  delayedProtection()
  const cleanup = monitorEthereumChanges()

  return cleanup
}

// 简化的错误处理器，用于组件中
export const handleEthereumError = (error) => {
  if (!error) return false

  const errorMessage = error.message || error.toString()
  
  if (errorMessage.includes('Cannot redefine property: ethereum') ||
      errorMessage.includes('chrome-extension://') ||
      (errorMessage.includes('ethereum') && errorMessage.includes('redefine'))) {
    console.warn('Ethereum相关错误已被忽略:', errorMessage)
    return true
  }

  return false
} 