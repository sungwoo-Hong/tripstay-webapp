import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
})

export const metadata: Metadata = {
  title: {
    default: '복지다모아 - 전국 복지정책 정보',
    template: '%s | 복지다모아',
  },
  description: '전국 250개 시/군/구의 출산지원금, 보육료, 아동수당 등 복지정책 정보를 한 곳에서 확인하세요.',
  keywords: ['복지정책', '출산지원금', '아동수당', '보육료', '부모급여', '양육수당'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '복지다모아',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${notoSansKr.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
