import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import FloatingSidebar from '../components/FloatingSidebar'

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const router = useRouter()

  const products = [
    {
      id: 1,
      name: '开光平安符',
      category: 'physical',
      price: '0.01 ETH',
      image: '🧿',
      description: '传统开光平安符，护身辟邪，保平安健康'
    },
    {
      id: 2,
      name: '招财符',
      category: 'physical',
      price: '0.02 ETH',
      image: '💰',
      description: '招财进宝符，助您财运亨通，事业顺利'
    },
    {
      id: 3,
      name: 'NFT护身符',
      category: 'digital',
      price: '0.005 ETH',
      image: '💎',
      description: '数字护身符NFT，区块链永久保存，随身携带'
    },
    {
      id: 4,
      name: '功德证书',
      category: 'digital',
      price: '0.003 ETH',
      image: '📜',
      description: '上香功德证书，记录您的善行，功德无量'
    },
    {
      id: 5,
      name: '文昌符',
      category: 'physical',
      price: '0.015 ETH',
      image: '📚',
      description: '文昌帝君加持，助学业有成，智慧开启'
    },
    {
      id: 6,
      name: '数字符咒',
      category: 'digital',
      price: '0.008 ETH',
      image: '🔮',
      description: '数字化符咒，AI生成，个性化定制'
    }
  ]

  const categories = [
    { id: 'all', name: '全部', icon: '🏪' },
    { id: 'physical', name: '实体法物', icon: '🧿' },
    { id: 'digital', name: '数字法物', icon: '💎' }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const handlePurchase = (product) => {
    alert(`购买 ${product.name} 功能开发中...`)
  }

  const handleSidebarNavigate = (section) => {
    if (section === 'wish') {
      router.push('/wish')
    } else {
      router.push('/merit')
    }
  }

  return (
    <>
      <Head>
        <title>法物流通 - Rich Temple</title>
        <meta name="description" content="购买开光法物和数字符咒" />
      </Head>

      <div className="min-h-screen bg-rice ink-wash-bg cloud-pattern">
        {/* 隐藏式浮动侧边栏 */}
        <FloatingSidebar 
          isVisible={false} 
          onNavigate={handleSidebarNavigate}
        />

        {/* 主内容区 */}
        <main className="container mx-auto px-4 py-8">
          {/* 页面头部 */}
          <header className="text-center mb-12">
            <h1 className="responsive-title font-kai font-light tracking-wider mb-4 text-ink">
              法物流通
            </h1>
            <p className="responsive-text text-ink-lighter max-w-2xl mx-auto leading-relaxed">
              开光法物，数字符咒，助您趋吉避凶，心想事成
            </p>
          </header>

          {/* 分类筛选 */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4 bg-white/70 backdrop-blur-sm rounded-lg p-2 shadow-ink">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-kai transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-ink text-white shadow-ink'
                      : 'text-ink hover:bg-ink/10'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 商品网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProducts.map((product) => (
              <div key={product.id} className="floating-card group hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4 group-hover:animate-bounce">
                    {product.image}
                  </div>
                  <h3 className="text-xl font-kai text-ink mb-2">
                    {product.name}
                  </h3>
                  <p className="text-ink-light font-kai text-sm mb-4 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-lg font-kai text-red-temple">
                    {product.price}
                  </div>
                  <button
                    onClick={() => handlePurchase(product)}
                    className="ink-button px-6 py-2 text-sm"
                  >
                    购买
                  </button>
                </div>

                {/* 商品标签 */}
                <div className="mt-4 flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-kai ${
                    product.category === 'physical' 
                      ? 'bg-jade/20 text-jade' 
                      : 'bg-gold-temple/20 text-gold-temple'
                  }`}>
                    {product.category === 'physical' ? '实体法物' : '数字法物'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 购买须知 */}
          <div className="max-w-4xl mx-auto">
            <div className="floating-card">
              <h2 className="text-2xl font-kai text-ink mb-6 text-center">
                购买须知
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-kai text-lg text-ink mb-3">实体法物</h3>
                  <ul className="space-y-2 text-ink-light font-kai text-sm">
                    <li>• 所有法物均经过开光加持</li>
                    <li>• 支持全球邮寄，7-15个工作日到达</li>
                    <li>• 购买后将获得数字证书</li>
                    <li>• 支持ETH/USDT支付</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-kai text-lg text-ink mb-3">数字法物</h3>
                  <ul className="space-y-2 text-ink-light font-kai text-sm">
                    <li>• NFT形式，区块链永久保存</li>
                    <li>• 购买后立即到账钱包</li>
                    <li>• 可在OpenSea等平台交易</li>
                    <li>• 包含智能合约加持功能</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 返回按钮 */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/merit')}
              className="px-6 py-3 text-ink-light hover:text-ink transition-colors duration-300 font-kai border border-ink-light rounded hover:border-ink"
            >
              返回功德页面
            </button>
          </div>
        </main>

        {/* 底部装饰 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-ink/5 to-transparent pointer-events-none"></div>
      </div>
    </>
  )
} 