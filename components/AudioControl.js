import { useState, useEffect } from 'react'
import audioManager from '../utils/audioManager'

export default function AudioControl() {
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // 状态更新回调
    const handleStateChange = (state) => {
      setIsPlaying(state.isPlaying)
      setIsMuted(state.isMuted)
    }

    // 添加监听器
    audioManager.addListener(handleStateChange)

    // 清理函数
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
        {isMuted ? (
          <div className="audio-icon muted">
            <div className="speaker"></div>
            <div className="mute-line"></div>
          </div>
        ) : (
          <div className="audio-icon">
            <div className="speaker"></div>
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
          </div>
        )}
      </button>
      
      <style jsx>{`
        .audio-control {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .audio-btn {
          background: rgba(13, 13, 13, 0.3);
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
          position: relative;
        }

        .audio-btn:hover {
          background: rgba(10, 10, 10, 0.5);
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

        .speaker::before {
          content: '';
          position: absolute;
          left: -4px;
          top: -2px;
          width: 4px;
          height: 12px;
          background: white;
          border-radius: 2px 0 0 2px;
        }

        .wave {
          position: absolute;
          border: 2px solid white;
          border-radius: 50%;
          border-left: transparent;
          border-bottom: transparent;
          animation: wave-animation 2s infinite;
        }

        .wave1 {
          width: 16px;
          height: 16px;
          left: 10px;
          top: 2px;
        }

        .wave2 {
          width: 20px;
          height: 20px;
          left: 8px;
          top: 0px;
          animation-delay: 0.5s;
        }

        .muted .mute-line {
          position: absolute;
          width: 24px;
          height: 2px;
          background: white;
          transform: rotate(45deg);
          top: 9px;
          left: -2px;
        }

        @keyframes wave-animation {
          0% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  )
} 