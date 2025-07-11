import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import ClientOnlyWalletConnect from '../components/ClientOnlyWalletConnect'

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
      
      // 启动DeepSeek API调用并等待结果
      const deepseekService = (await import('../services/deepseekService')).default
      const result = await deepseekService.performDivination(
        wish, 
        numbers.map(num => parseInt(num))
      )
      
      // 存储占卜结果
      localStorage.setItem('divinationResult', JSON.stringify(result))
      
      // 跳转到结果页面
      router.push('/result')
      
    } catch (error) {
      console.error('算命失败:', error)
      // 即使失败也跳转，在result页面会使用默认结果
      router.push('/result')
    }
  }

  const handleModifyWish = () => {
    router.push('/wish')
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* 全屏播放 2.mp4 视频 */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          loop
        >
          <source src="/videos/2.mp4" type="video/mp4" />
          您的浏览器不支持视频播放
        </video>
        
        {/* 加载提示覆盖层 */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white font-kai text-xl mb-4 drop-shadow-lg">
              神明正在计算您的运势...
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-lg"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-lg" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-lg" style={{ animationDelay: '0.2s' }}></div>
            </div>
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
        {/* 装饰图片 */}
        {/* 左上角装饰 */}
        <img src="/assets/images/p2/p2_left_top.png" alt="" className="decoration-img decoration-left-top" />
        
        {/* 左下角装饰 */}
        <img src="/assets/images/p2/p2_left_btm.png" alt="" className="decoration-img decoration-left-btm scale-75 origin-bottom-left" />

        {/* 左中下角装饰 */}
        <img src="/assets/images/p2/p2_mid_btm.png" alt="" className="decoration-img decoration-mid-btm" />
        
        {/* 右下角装饰 */}
        <img src="/assets/images/p2/p2_right_btm.png" alt="" className="decoration-img decoration-right-btm" />

        {/* 右上角装饰和钱包连接按钮 */}
        <img src="/assets/images/p2/p2_right_top.png" alt="" className="decoration-img decoration-right-top" />
        <div className="absolute top-4 right-4 z-10">
          <ClientOnlyWalletConnect />
        </div>

        <div className="container mx-auto px-4 py-8 md:py-16 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* 主内容区 */}
            <main className="max-w-2xl mx-auto">
            {/* 显示用户愿望 - 居中放大 */}
            <div className="text-center mb-8">
              <div className="bg-ink/5 rounded-lg p-6 mx-auto max-w-xl">
                <p className="text-ink font-kai leading-relaxed text-lg md:text-xl font-medium">
                  {wish}
                </p>
              </div>
            </div>

            {/* 中间装饰图片 */}
            <div className="text-center mb-8">
              <img src="/assets/images/p2/p2_mid.png" alt="" className="inline-block " />
            </div>

            {/* 数字输入区 */}
            <div className="floating-card mb-8">
              <p className="text-ink-light font-kai mb-6 text-center">
                请凭直觉输入3个1-99之间的数字，神明将根据这些数字为您指点迷津
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {numbers.map((number, index) => (
                  <div key={index} className="text-center">
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

            </div>

            {/* 操作按钮区域 */}
            <div className="flex justify-center items-center mb-4">
              <button
                onClick={handleCalculate}
                disabled={numbers.some(num => num === '')}
                className="ink-button disabled:opacity-50 disabled:cursor-not-allowed w-40"
              >
                下一步
              </button>
            </div>
            
            <div className="flex justify-center items-center mb-8">
              <button
                onClick={handleModifyWish}
                className="ink-button bg-transparent border-ink text-ink hover:bg-ink hover:text-white w-40"
              >
                修改愿望
              </button>
            </div>

          </main>
        </div>
        </div>

       </div>
    </>
  )
} 