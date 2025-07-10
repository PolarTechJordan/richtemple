import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function CalculatePage() {
  const [wish, setWish] = useState('')
  const [numbers, setNumbers] = useState(['', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 从localStorage获取用户愿望
    const userWish = localStorage.getItem('userWish')
    if (userWish) {
      setWish(userWish)
    } else {
      // 如果没有愿望，返回许愿页面
      router.push('/wish')
    }
  }, [router])

  const handleNumberChange = (index, value) => {
    // 只允许输入1-99的数字
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 99)) {
      const newNumbers = [...numbers]
      newNumbers[index] = value
      setNumbers(newNumbers)
    }
  }

  const handleCalculate = async () => {
    // 验证输入
    const validNumbers = numbers.filter(num => num !== '' && parseInt(num) >= 1 && parseInt(num) <= 99)
    if (validNumbers.length !== 3) {
      alert('请输入3个1-99之间的数字')
      return
    }

    setIsLoading(true)
    
    try {
      // 存储数字到localStorage
      localStorage.setItem('divinationNumbers', JSON.stringify(numbers.map(num => parseInt(num))))
      
      // 模拟加载2.mp4动画的时间
      setTimeout(() => {
        router.push('/result')
      }, 3000)
      
    } catch (error) {
      console.error('算命失败:', error)
      alert('算命失败，请重试')
      setIsLoading(false)
    }
  }

  const handleModifyWish = () => {
    router.push('/wish')
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-ink flex items-center justify-center z-50">
        <div className="text-center">
          <video
            className="w-full max-w-md mx-auto mb-8"
            autoPlay
            muted
            playsInline
            loop
          >
            <source src="/videos/2.mp4" type="video/mp4" />
          </video>
          <div className="text-white font-kai text-xl mb-4">
            神明正在计算您的运势...
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>小六壬神算 - Rich Temple</title>
        <meta name="description" content="小六壬神算，预测您的运势" />
      </Head>

      <div className="min-h-screen bg-rice ink-wash-bg cloud-pattern">
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* 页面头部 */}
          <header className="text-center mb-12 md:mb-20">
            <h1 className="responsive-title font-kai font-light tracking-wider mb-4 text-ink">
              小六壬神算
            </h1>
            <p className="responsive-text text-ink-lighter mt-6 max-w-2xl mx-auto leading-relaxed">
              古法占卜，神明指引，为您解读天机
            </p>
          </header>

          {/* 主内容区 */}
          <main className="max-w-2xl mx-auto">
            {/* 显示用户愿望 */}
            <div className="floating-card mb-8">
              <h2 className="text-xl font-kai text-ink mb-4">您的心愿</h2>
              <div className="bg-ink/5 rounded-lg p-4 border-l-4 border-red-temple">
                <p className="text-ink font-kai leading-relaxed">
                  {wish}
                </p>
              </div>
            </div>

            {/* 数字输入区 */}
            <div className="floating-card mb-8">
              <h2 className="text-xl font-kai text-ink mb-6">神选数字</h2>
              <p className="text-ink-light font-kai mb-6">
                请凭直觉输入3个1-99之间的数字，神明将根据这些数字为您占卜
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {numbers.map((number, index) => (
                  <div key={index} className="text-center">
                    <label className="block text-ink-light font-kai mb-2">
                      第{index + 1}个数字
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={number}
                      onChange={(e) => handleNumberChange(index, e.target.value)}
                      className="w-full text-center text-2xl font-kai ink-input"
                      placeholder="1-99"
                    />
                  </div>
                ))}
              </div>

              <div className="text-center text-sm text-ink-lighter font-kai mb-6">
                请输入您心中所想的数字，让神明感受您的诚意
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCalculate}
                  disabled={numbers.some(num => num === '')}
                  className="ink-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  开始算命
                </button>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="text-center">
              <button
                onClick={handleModifyWish}
                className="px-6 py-3 text-ink-light hover:text-ink transition-colors duration-300 font-kai border border-ink-light rounded hover:border-ink"
              >
                修改愿望
              </button>
            </div>

            {/* 装饰元素 */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-4 text-ink-lighter">
                <div className="w-12 h-px bg-ink-lighter"></div>
                <span className="font-kai text-sm">天机不可泄露</span>
                <div className="w-12 h-px bg-ink-lighter"></div>
              </div>
            </div>
          </main>
        </div>

        {/* 底部装饰 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-ink/5 to-transparent pointer-events-none"></div>
      </div>
    </>
  )
} 