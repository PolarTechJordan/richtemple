import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAccount } from 'wagmi'
import ClientOnlyWalletConnect from '../components/ClientOnlyWalletConnect'
import deepseekService from '../services/deepseekService'

export default function ResultPage() {
  const [wish, setWish] = useState('')
  const [numbers, setNumbers] = useState([])
  const [divinationResult, setDivinationResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState('ETH')
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const router = useRouter()
  const { address, isConnected } = useAccount()

  useEffect(() => {
    const initializePage = async () => {
      // 获取存储的数据
      const userWish = localStorage.getItem('userWish')
      const divinationNumbers = localStorage.getItem('divinationNumbers')
      const storedResult = localStorage.getItem('divinationResult')
      
      if (!userWish || !divinationNumbers) {
        router.push('/wish')
        return
      }

      setWish(userWish)
      setNumbers(JSON.parse(divinationNumbers))

      // 如果已有占卜结果，直接使用
      if (storedResult) {
        try {
          const result = JSON.parse(storedResult)
          setDivinationResult(result)
          setLoading(false)
          return
        } catch (error) {
          console.error('解析存储的结果失败:', error)
        }
      }

      // 如果没有存储的结果，调用DeepSeek API进行占卜
      try {
        const result = await deepseekService.performDivination(
          userWish, 
          JSON.parse(divinationNumbers)
        )
        setDivinationResult(result)
        // 存储结果
        localStorage.setItem('divinationResult', JSON.stringify(result))
      } catch (error) {
        console.error('占卜失败:', error)
        // 使用默认结果
        const defaultResult = deepseekService.getDefaultDivination(
          userWish, 
          JSON.parse(divinationNumbers)
        )
        setDivinationResult(defaultResult)
        localStorage.setItem('divinationResult', JSON.stringify(defaultResult))
      } finally {
        setLoading(false)
      }
    }

    initializePage()
  }, [router])

  const handlePayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('请输入有效的香火数量')
      return
    }

    setIsPaymentLoading(true)

    try {
      // 检查钱包连接
      if (!isConnected || !address) {
        alert('请先连接钱包')
        return
      }

      // 存储支付信息
      localStorage.setItem('paymentInfo', JSON.stringify({
        amount: paymentAmount,
        currency: paymentCurrency,
        timestamp: Date.now()
      }))

      // 模拟支付流程 - 这里应该集成真实的支付逻辑
      setTimeout(() => {
        // 跳转到上香动画页面
        router.push('/payment-animation')
      }, 1000)

    } catch (error) {
      console.error('支付失败:', error)
      alert('支付失败，请重试')
      setIsPaymentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-rice flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink mx-auto mb-4"></div>
          <p className="font-kai text-ink">正在解读天机...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>神算结果 - Rich Temple</title>
        <meta name="description" content="查看您的小六壬神算结果" />
      </Head>

      <div className="min-h-screen bg-rice ink-wash-bg cloud-pattern">
        {/* 装饰图片 */}
        {/* 左上角装饰 */}
        <img src="/assets/images/p2/p2_left_top.png" alt="" className="decoration-img decoration-left-top" />
        
        {/* 左下角装饰 - 固定在页面左下角 */}
        <img src="/assets/images/p2/p2_left_btm.png" alt="" className="fixed bottom-0 left-0 z-0 pointer-events-none scale-75 origin-bottom-left object-contain opacity-60" />
        
        {/* 右上角装饰和钱包连接按钮 */}
        <img src="/assets/images/p2/p2_right_top.png" alt="" className="decoration-img decoration-right-top" />
        <div className="absolute top-4 right-4 z-10">
          <ClientOnlyWalletConnect />
        </div>

        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* 页面头部 */}
          <header className="text-center mb-12">
            <h1 className="responsive-title font-kai font-light tracking-wider mb-4 text-ink">
            &#8203;
            </h1>
          </header>

          {/* 占卜结果区域 */}
          <main className="max-w-4xl mx-auto">
            {divinationResult && (
              <div className="floating-card mb-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-kai text-ink mb-4 text-center">
                    神算结果
                  </h2>
                  <div className="bg-ink/5 rounded-lg p-4 border-l-4 border-red-temple mb-4">
                    <p className="text-ink font-kai text-sm">
                      我的心愿：{wish}
                    </p>
                    <p className="text-ink-light font-kai text-sm mt-2">
                      神选数字：{numbers.join('、')}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* 卦象解析 */}
                  {divinationResult.divination && (
                    <div className="border-l-4 border-gold-temple pl-4">
                      <h3 className="font-kai text-lg text-ink mb-2">卦象解析</h3>
                      <p className="font-kai text-ink-light leading-relaxed">
                        {divinationResult.divination}
                      </p>
                    </div>
                  )}

                  {/* 运势预测 */}
                  {divinationResult.prediction && (
                    <div className="border-l-4 border-jade pl-4">
                      <h3 className="font-kai text-lg text-ink mb-2">运势预测</h3>
                      <p className="font-kai text-ink-light leading-relaxed">
                        {divinationResult.prediction}
                      </p>
                    </div>
                  )}

                  {/* 神明指引 */}
                  {divinationResult.advice && (
                    <div className="border-l-4 border-red-temple pl-4">
                      <h3 className="font-kai text-lg text-ink mb-2">神明指引</h3>
                      <p className="font-kai text-ink-light leading-relaxed">
                        {divinationResult.advice}
                      </p>
                    </div>
                  )}

                  {/* 运势评分 */}
                  {divinationResult.luck && (
                    <div className="text-center bg-gradient-to-r from-gold-temple/20 to-red-temple/20 rounded-lg p-4">
                      <h3 className="font-kai text-lg text-ink mb-2">运势评分</h3>
                      <div className="flex justify-center items-center space-x-2">
                        <span className="text-3xl font-kai text-red-temple">
                          {divinationResult.luck}
                        </span>
                        <span className="text-ink-light font-kai">/10</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 香火支付区域 */}
            <div className="floating-card">
              <h2 className="text-2xl font-kai text-ink mb-6 text-center">
                香火支付
              </h2>
              <p className="text-center text-ink-light font-kai mb-8">
                诚心上香，功德无量，神明将护佑您的愿望实现
              </p>

              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <label className="block text-ink-light font-kai mb-2">
                    香火金额
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.001"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full ink-input font-kai pr-20"
                      placeholder="输入香火金额..."
                    />
                    <select
                      value={paymentCurrency}
                      onChange={(e) => {
                        setPaymentCurrency(e.target.value)
                        setPaymentAmount('') // 切换币种时清空金额
                      }}
                      className="absolute right-0 top-0 h-full w-16 bg-transparent border-0 font-kai text-center text-ink focus:outline-none focus:ring-0 cursor-pointer"
                    >
                      <option value="ETH">ETH</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>

                {/* 快速选择金额 */}
                <div className="mb-6">
                  <label className="block text-ink-light font-kai mb-2 text-sm">
                    快速选择
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {paymentCurrency === 'ETH' ? (
                      <>
                        <button
                          onClick={() => setPaymentAmount('0.01')}
                          className="px-3 py-2 border border-ink-light rounded hover:bg-ink hover:text-white transition-colors duration-300 font-kai text-sm"
                        >
                          0.01 ETH
                        </button>
                        <button
                          onClick={() => setPaymentAmount('0.1')}
                          className="px-3 py-2 border border-ink-light rounded hover:bg-ink hover:text-white transition-colors duration-300 font-kai text-sm"
                        >
                          0.1 ETH
                        </button>
                        <button
                          onClick={() => setPaymentAmount('1')}
                          className="px-3 py-2 border border-ink-light rounded hover:bg-ink hover:text-white transition-colors duration-300 font-kai text-sm"
                        >
                          1 ETH
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setPaymentAmount('5')}
                          className="px-3 py-2 border border-ink-light rounded hover:bg-ink hover:text-white transition-colors duration-300 font-kai text-sm"
                        >
                          5 USDT
                        </button>
                        <button
                          onClick={() => setPaymentAmount('10')}
                          className="px-3 py-2 border border-ink-light rounded hover:bg-ink hover:text-white transition-colors duration-300 font-kai text-sm"
                        >
                          10 USDT
                        </button>
                        <button
                          onClick={() => setPaymentAmount('20')}
                          className="px-3 py-2 border border-ink-light rounded hover:bg-ink hover:text-white transition-colors duration-300 font-kai text-sm"
                        >
                          20 USDT
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={handlePayment}
                    disabled={isPaymentLoading}
                    className="ink-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPaymentLoading ? '正在支付...' : '立即支付'}
                  </button>
                </div>

                <div className="mt-6 text-center text-sm text-ink-lighter font-kai">
                  <p>支付完成后将自动进行上香仪式</p>
                  <p>您的功德将被记录在区块链上</p>
                </div>
              </div>
            </div>
          </main>
        </div>

      </div>
    </>
  )
} 