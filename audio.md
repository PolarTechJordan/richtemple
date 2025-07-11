# 音频控制功能实现文档

## 已完成功能

### 1. 全局音频管理系统
- ✅ 创建了 `utils/audioManager.js` 全局音频管理器
- ✅ 实现了单例模式，确保整个应用只有一个音频实例
- ✅ 支持全局状态管理和监听器模式
- ✅ 在 `pages/_app.js` 中初始化全局音频管理器

### 2. 音频控制组件
- ✅ 重构了 `components/AudioControl.js` 组件
- ✅ 使用全局音频管理器，不再创建独立音频实例
- ✅ 实现了状态同步，所有控制按钮状态保持一致

### 3. 页面集成
音频控制按钮已添加到以下页面：
- ✅ wish 页面 (WishPageClient.js)
- ✅ calculate 页面 (pages/calculate.js)
- ✅ result 页面 (pages/result.js)
- ✅ merit 页面 (pages/merit.js)

### 4. 布局设计
- 位置：右上角，在装饰图片 decoration-right-top 的左侧
- 排列顺序：AudioControl → decoration-right-top → WalletConnectButton
- 使用 flex 布局，两个按钮之间有适当间距 (gap-3)

### 5. 功能特性
- 🎵 **全局播放**：音频在整个应用中全局播放，页面切换不会中断
- ⏯️ **断点续播**：暂停后再播放会从暂停位置继续
- 🔊 **音量控制**：音量设置为 70%
- 🎛️ **状态同步**：所有页面的控制按钮状态实时同步
- 🌐 **浏览器兼容**：处理了现代浏览器的自动播放策略
- 🎨 **视觉反馈**：按钮显示不同的播放/暂停状态

## 系统架构

### 1. 全局音频管理器 (`utils/audioManager.js`)

```jsx
class AudioManager {
  constructor() {
    this.audio = null
    this.isPlaying = false
    this.isMuted = false
    this.volume = 0.7
    this.listeners = new Set()
    this.initialized = false
  }

  // 初始化音频（单例模式）
  initialize() {
    if (this.initialized) return
    
    if (typeof window !== 'undefined') {
      this.audio = new Audio('/background.mp3')
      this.audio.loop = true
      this.audio.volume = this.volume
      
      // 监听音频事件并通知所有监听器
      this.audio.addEventListener('play', () => {
        this.isPlaying = true
        this.isMuted = false
        this.notifyListeners()
      })
      
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false
        this.isMuted = true
        this.notifyListeners()
      })
      
      this.audio.load()
      this.initialized = true
      this.tryAutoPlay()
    }
  }

  // 播放/暂停控制
  toggle() {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  // 添加/移除状态监听器
  addListener(callback) {
    this.listeners.add(callback)
    callback(this.getState())
  }

  removeListener(callback) {
    this.listeners.delete(callback)
  }
}

// 导出全局单例
export default new AudioManager()
```

### 2. 音频控制组件 (`components/AudioControl.js`)

```jsx
import { useState, useEffect } from 'react'
import audioManager from '../utils/audioManager'

export default function AudioControl() {
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // 监听全局音频状态变化
    const handleStateChange = (state) => {
      setIsPlaying(state.isPlaying)
      setIsMuted(state.isMuted)
    }

    audioManager.addListener(handleStateChange)

    return () => {
      audioManager.removeListener(handleStateChange)
    }
  }, [])

  const toggleAudio = () => {
    audioManager.toggle()
  }

  return (
    <div className="audio-control">
      <button 
        className="audio-btn" 
        onClick={toggleAudio} 
        title={isMuted ? '开启音乐' : '关闭音乐'}
      >
        {/* 音频图标和样式 */}
      </button>
    </div>
  )
}
```

### 3. 应用初始化 (`pages/_app.js`)

```jsx
import audioManager from '../utils/audioManager'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // 在应用启动时初始化全局音频管理器
    audioManager.initialize()
    
    return () => {
      // 应用卸载时清理资源
      audioManager.destroy()
    }
  }, [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

## CSS 样式

```css
.audio-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.audio-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.audio-icon {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.speaker {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 0 2px 2px 0;
  position: relative;
}

.wave {
  position: absolute;
  border: 2px solid white;
  border-radius: 50%;
  border-left: transparent;
  border-bottom: transparent;
  animation: wave-animation 2s infinite;
}

@keyframes wave-animation {
  0% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.4; transform: scale(0.8); }
}
```

## 使用方法

1. 在需要添加音频控制的页面中导入组件：
```jsx
import AudioControl from '../components/AudioControl'
```

2. 在页面的右上角区域添加组件：
```jsx
<div className="absolute top-4 right-4 z-10 flex items-center gap-3">
  <AudioControl />
  <ClientOnlyWalletConnect />
</div>
```

## 核心优势

### 1. 全局音频管理
- 🎵 **单例模式**：整个应用只有一个音频实例，避免资源浪费
- 🔄 **状态同步**：所有控制按钮状态实时同步，用户体验一致
- 📱 **页面切换**：音频在页面间无缝播放，不会中断或重新开始

### 2. 断点续播功能
- ⏯️ **暂停续播**：暂停后再播放会从暂停位置继续，而不是重新开始
- 🎯 **精确控制**：支持精确的播放位置控制和状态管理
- 💾 **状态保持**：音频状态在整个应用生命周期中保持

### 3. 监听器模式
- 👂 **事件驱动**：使用监听器模式实现状态变化的实时通知
- 🔗 **松耦合**：组件与音频管理器之间松耦合，便于维护和扩展
- 🧹 **自动清理**：组件卸载时自动清理监听器，避免内存泄漏

## 技术特点

- ✅ **浏览器兼容**：处理现代浏览器的自动播放策略
- ✅ **错误处理**：自动处理播放失败和各种异常情况
- ✅ **性能优化**：避免重复创建音频实例，节省系统资源
- ✅ **状态管理**：完整的音频状态管理和同步机制
- ✅ **生命周期**：完整的初始化和清理生命周期管理

## 使用说明

1. 音频文件放在 `public/background.mp3` 路径下
2. 应用启动时自动初始化并尝试播放
3. 在需要控制的页面添加 `<AudioControl />` 组件
4. 所有控制按钮状态自动同步
5. 页面切换时音频继续播放，不会中断

