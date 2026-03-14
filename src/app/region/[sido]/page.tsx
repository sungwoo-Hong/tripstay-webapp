import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBenefitParams, getBenefitsBySido } from '@/lib/supabase'
import Breadcrumb from '@/components/Breadcrumb'

interface PageProps {
  params: Promise<{ sido: string }>
}

export async function generateStaticParams() {
  const params = await getAllBenefitParams()
  const uniqueSido = [...new Set(params.map((p) => p.sido))]
  return uniqueSido.map((sido) => ({ sido: encodeURIComponent(sido) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sido } = await params
  const sidoDecoded = decodeURIComponent(sido)
  return {
    title: `${sidoDecoded} 복지혜택 지역별 정보 | 복지다모아`,
    description: `${sidoDecoded} 시/군/구별 출산지원금, 부모급여, 아동수당 등 복지혜택을 확인하세요.`,
  }
}

export default async function RegionSidoPage({ params }: PageProps) {
  const { sido } = await params
  const sidoDecoded = decodeURIComponent(sido)

  const benefits = await getBenefitsBySido(sidoDecoded)

  const cities = [...new Set(benefits.map((b) => b.city_name))].sort()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* 브레드크럼 */}
      <Breadcrumb items={[{ label: '홈', href: '/' }, { label: sidoDecoded }]} />

      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          {sidoDecoded} 복지혜택
        </h1>
        <p className="text-gray-500">
          시/군/구를 선택하면 해당 지역의 복지혜택을 확인할 수 있습니다
        </p>
      </div>

      {/* 시/군/구 그리드 */}
      {cities.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="mb-4 text-sm text-gray-500">등록된 지역 정보가 없습니다</p>
          <Link
            href="/"
            className="inline-block rounded-lg border border-[#1f1bc4] px-4 py-2 text-sm text-[#1f1bc4] transition-colors hover:bg-[#1f1bc4] hover:text-white"
          >
            홈으로 돌아가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/${sido}/${encodeURIComponent(city)}`}
              className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-colors hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
            >
              <span className="font-medium text-gray-900 hover:text-[#1f1bc4]">{city}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
