import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function FloatingSidebar({ isVisible = true, onNavigate }) {
  const [isOpen, setIsOpen] = useState(isVisible)
  const [hovering, setHovering] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsOpen(isVisible)
  }, [isVisible])

  const handleMouseEnter = () => {
    if (!isVisible) {
      setHovering(true)
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isVisible) {
      setHovering(false)
      setTimeout(() => {
        if (!hovering) {
          setIsOpen(false)
        }
      }, 300)
    }
  }

  const handleNavigation = (path, section = null) => {
    if (onNavigate) {
      onNavigate(section)
    } else {
      router.push(path)
    }
  }

  const menuItems = [
    {
      id: 'wish',
      label: '祈愿上香',
      icon: '🙏',
      action: () => handleNavigation('/wish')
    },
    {
      id: 'fortune',
      label: '每日运势',
      icon: '🔮',
      action: () => handleNavigation('/merit', 'fortune')
    },
    {
      id: 'store',
      label: '法物流通',
      icon: '🏪',
      action: () => handleNavigation('/merit', 'store')
    },
    {
      id: 'contact',
      label: '联系我们',
      icon: '📞',
      action: () => handleNavigation('/merit', 'contact')
    }
  ]

  return (
    <>
      {/* 触发区域 */}
      {!isVisible && (
        <div
          className="fixed left-0 top-0 w-8 h-full z-40 bg-transparent"
          onMouseEnter={handleMouseEnter}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={`sidebar ${isOpen ? '' : 'hidden'} md:w-64 w-full`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 头部 */}
        <div className="p-6 border-b border-ink/10">
          <h2 className="text-xl font-kai text-ink text-center">
            财神庙
          </h2>
          <p className="text-sm text-ink-lighter font-kai text-center mt-2">
            Rich Temple
          </p>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="sidebar-item w-full flex items-center space-x-3"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* 底部信息 */}
        <div className="p-6 border-t border-ink/10">
          <div className="text-center text-xs text-ink-lighter font-kai">
            <p>诚心祈福</p>
            <p>功德无量</p>
          </div>
        </div>
      </div>

      {/* 遮罩层 (移动端) */}
      {isOpen && !isVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 