'use client'

import { useEffect } from 'react'

interface AdBannerProps {
  slot?: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

export default function AdBanner({ slot = '1234567890', format = 'auto', className = '' }: AdBannerProps) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).adsbygoogle.push({})
    } catch {
      // 개발 환경에서는 무시
    }
  }, [])

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`flex h-24 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400 ${className}`}>
        광고 영역 (개발 환경)
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
