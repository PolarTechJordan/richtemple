import { useState, useEffect } from 'react'
import Head from 'next/head'
import WishPageClient from '../components/WishPageClient'

export default function WishPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <Head>
        <title>许愿池 - Rich Temple</title>
        <meta name="description" content="在财神殿许下您的心愿" />
      </Head>

      {isClient ? (
        <WishPageClient />
      ) : (
        // 服务器端渲染占位符
        <div className="min-h-screen bg-rice ink-wash-bg cloud-pattern flex items-center justify-center">
          <div className="text-center">
            <h1 className="responsive-title font-kai font-light tracking-wider mb-4 text-ink sr-only">
              许愿池
            </h1>
            <p className="responsive-text text-ink-lighter">
              正在加载...
            </p>
          </div>
        </div>
      )}
    </>
  )
} 