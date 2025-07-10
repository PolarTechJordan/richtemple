/**
 * 早期Ethereum对象保护脚本
 * 在页面加载早期就开始保护，防止钱包扩展冲突
 */

(function() {
  'use strict';
  
  // 早期错误处理
  const handleEthereumError = (error) => {
    if (!error) return false;
    
    const errorMessage = error.message || error.toString();
    
    if (errorMessage.includes('Cannot redefine property: ethereum') ||
        errorMessage.includes('chrome-extension://') ||
        (errorMessage.includes('ethereum') && errorMessage.includes('redefine'))) {
      console.warn('[Rich Temple] Ethereum相关错误已被忽略:', errorMessage);
      return true;
    }
    
    return false;
  };
  
  // 设置早期错误监听器
  window.addEventListener('error', (event) => {
    if (handleEthereumError(event.error)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  
  window.addEventListener('unhandledrejection', (event) => {
    if (handleEthereumError(event.reason)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  
  // 保护ethereum对象的函数
  const protectEthereum = () => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    
    try {
      const originalEthereum = window.ethereum;
      
      // 创建一个更宽松的保护策略
      const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
      if (descriptor && descriptor.configurable) {
        // 不完全锁定，但添加监控
        Object.defineProperty(window, 'ethereum', {
          get() {
            return originalEthereum;
          },
          set(value) {
            console.log('[Rich Temple] 检测到ethereum对象变更尝试');
            // 允许设置，但记录
            return value;
          },
          configurable: true,
          enumerable: true
        });
      }
    } catch (error) {
      console.warn('[Rich Temple] ethereum对象保护失败:', error);
    }
  };
  
  // 监听ethereum对象出现
  let ethereumCheckInterval;
  const startEthereumMonitoring = () => {
    ethereumCheckInterval = setInterval(() => {
      if (window.ethereum) {
        console.log('[Rich Temple] 检测到ethereum对象');
        protectEthereum();
        clearInterval(ethereumCheckInterval);
      }
    }, 50);
    
    // 5秒后停止监听
    setTimeout(() => {
      if (ethereumCheckInterval) {
        clearInterval(ethereumCheckInterval);
      }
    }, 5000);
  };
  
  // 立即开始监听
  startEthereumMonitoring();
  
  // 在DOM Ready时也尝试保护
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', protectEthereum);
  } else {
    protectEthereum();
  }
  
  // 在window load时再次保护
  window.addEventListener('load', protectEthereum);
  
  console.log('[Rich Temple] Ethereum保护脚本已加载');
})(); 