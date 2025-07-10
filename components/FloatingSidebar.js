import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

export default function FloatingSidebar({ isVisible = true, onNavigate }) {
  const [isOpen, setIsOpen] = useState(isVisible)
  const hoveringRef = useRef(false)
  const router = useRouter()

  useEffect(() => {
    setIsOpen(isVisible)
  }, [isVisible])

  const handleMouseEnter = () => {
    if (!isVisible) {
      hoveringRef.current = true
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isVisible) {
      hoveringRef.current = false
      setTimeout(() => {
        if (!hoveringRef.current) {
          setIsOpen(false)
        }
      }, 300)
    }
  }

  const handleNavigation = (path, section = null) => {
    if (onNavigate) {
      onNavigate(section || path.replace('/', ''))
    } else {
      router.push(path)
    }
  }

  const menuItems = [
    {
      id: 'wish',
      label: '祈愿\n上香',
      action: () => handleNavigation('/wish', 'wish')
    },
    {
      id: 'fortune',
      label: '每日\n运势',
      action: () => handleNavigation('/merit', 'fortune')
    },
    {
      id: 'store',
      label: '法物\n流通',
      action: () => handleNavigation('/store', 'store')
    },
    {
      id: 'contact',
      label: '联系\n我们',
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
        className={`${isOpen ? '' : 'hidden'} fixed left-0 top-0 h-full bg-[#2D2D2D] w-48 z-30 flex flex-col`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 头部 */}
        <div className="p-4 border-b border-[#F9F4E2]/10">
          <div className="flex justify-center">
            <img 
              src="/assets/images/title_white.png" 
              alt="财神殿 Rich Temple" 
              className="h-10 object-contain"
            />
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 pt-3">
          {menuItems.map((item, index) => (
            <div key={item.id}>
                              <button
                  onClick={item.action}
                  className="w-full py-4 text-center hover:bg-[#F9F4E2]/10 transition-colors duration-200"
                >
                  <span 
                    className="text-[#F9F4E2] font-bold text-base leading-[1.2em] whitespace-pre-line"
                  >
                    {item.label}
                  </span>
                </button>
              {index < menuItems.length - 1 && (
                <div className="mx-4 my-3">
                  <hr className="border-[#F9F4E2] border-t-[1px] opacity-50" />
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 底部信息 */}
        <div className="mt-auto scale-150 origin-bottom-left">
          <img 
            src="/assets/images/nav_btm.png" 
            alt="" 
            className="w-full object-contain"
          />
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