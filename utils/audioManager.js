class AudioManager {
  constructor() {
    this.audio = null
    this.isPlaying = false
    this.isMuted = false
    this.volume = 0.3
    this.listeners = new Set()
    this.initialized = false
  }

  // 初始化音频
  initialize() {
    if (this.initialized) return
    
    if (typeof window !== 'undefined') {
      this.audio = new Audio('/background.mp3')
      this.audio.loop = true
      this.audio.volume = this.volume
      
      // 监听音频事件
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
      
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false
        this.notifyListeners()
      })
      
      // 预加载音频
      this.audio.load()
      this.initialized = true
      
      // 尝试自动播放
      this.tryAutoPlay()
    }
  }

  // 尝试自动播放
  async tryAutoPlay() {
    if (!this.audio) return
    
    try {
      await this.audio.play()
      this.isPlaying = true
      this.isMuted = false
      this.notifyListeners()
    } catch (error) {
      console.log('自动播放被浏览器阻止，需要用户交互')
      this.isMuted = true
      this.notifyListeners()
    }
  }

  // 播放音频
  async play() {
    if (!this.audio) return
    
    try {
      await this.audio.play()
      this.isPlaying = true
      this.isMuted = false
      this.notifyListeners()
    } catch (error) {
      console.error('播放失败:', error)
    }
  }

  // 暂停音频
  pause() {
    if (!this.audio) return
    
    this.audio.pause()
    this.isPlaying = false
    this.isMuted = true
    this.notifyListeners()
  }

  // 切换播放/暂停
  toggle() {
    if (!this.audio) return
    
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  // 设置音量
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.audio) {
      this.audio.volume = this.volume
    }
  }

  // 获取当前状态
  getState() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      currentTime: this.audio ? this.audio.currentTime : 0,
      duration: this.audio ? this.audio.duration : 0
    }
  }

  // 添加状态监听器
  addListener(callback) {
    this.listeners.add(callback)
    // 立即调用一次，传递当前状态
    callback(this.getState())
  }

  // 移除状态监听器
  removeListener(callback) {
    this.listeners.delete(callback)
  }

  // 通知所有监听器
  notifyListeners() {
    const state = this.getState()
    this.listeners.forEach(callback => callback(state))
  }

  // 清理资源
  destroy() {
    if (this.audio) {
      this.audio.pause()
      this.audio.src = ''
      this.audio = null
    }
    this.listeners.clear()
    this.initialized = false
  }
}

// 创建全局单例实例
const audioManager = new AudioManager()

// 在客户端环境下初始化
if (typeof window !== 'undefined') {
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      audioManager.initialize()
    })
  } else {
    audioManager.initialize()
  }
}

export default audioManager 