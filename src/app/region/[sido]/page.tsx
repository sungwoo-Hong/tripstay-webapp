import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { SIDO_LIST, REGION_DATA } from '@/lib/constants'

interface PageProps {
  params: Promise<{ sido: string }>
}

export async function generateStaticParams() {
  return SIDO_LIST.map((sido) => ({ sido: encodeURIComponent(sido) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sido } = await params
  const sidoDecoded = decodeURIComponent(sido)
  return {
    title: `${sidoDecoded} 복지서비스 지역별 정보 | 복지다모아`,
    description: `${sidoDecoded} 시/군/구별 출산, 보육, 주거, 청년 등 모든 복지서비스를 확인하세요.`,
  }
}

export default async function RegionPage({ params }: PageProps) {
  const { sido } = await params
  const sidoDecoded = decodeURIComponent(sido)
  const cities = REGION_DATA[sidoDecoded] ?? []

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb items={[{ label: '홈', href: '/' }, { label: sidoDecoded }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {sidoDecoded} 복지서비스
        </h1>
        <p className="mt-2 text-gray-500">
          시/군/구를 선택하면 해당 지역의 모든 복지서비스를 확인할 수 있습니다
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cities.map((city) => (
          <Link
            key={city}
            href={`/${encodeURIComponent(sidoDecoded)}/${encodeURIComponent(city)}`}
            className="group rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
          >
            <p className="font-bold text-gray-900 group-hover:text-[#1f1bc4]">{city}</p>
            <p className="mt-1 text-xs text-gray-400">{sidoDecoded}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
