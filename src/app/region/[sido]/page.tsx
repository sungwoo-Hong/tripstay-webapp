import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/components/Breadcrumb'
import { getAllBenefitParams, getBenefitsBySido } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ sido: string }>
}

export async function generateStaticParams() {
  const params = await getAllBenefitParams()
  const uniqueSido = [...new Set(params.map((p) => p.sido))]
  return uniqueSido.map((sido) => ({ sido }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sido } = await params
  const sidoDecoded = decodeURIComponent(sido)
  return {
    title: `${sidoDecoded} 복지혜택 지역별 정보 | 복지다모아`,
    description: `${sidoDecoded} 시/군/구별 출산지원금, 부모급여, 아동수당 등 복지혜택을 확인하세요.`,
  }
}

export default async function RegionPage({ params }: PageProps) {
  const { sido } = await params
  const sidoDecoded = decodeURIComponent(sido)

  const benefits = await getBenefitsBySido(sidoDecoded)
  const cities = [...new Set(benefits.map((b) => b.city_name))]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb items={[{ label: '홈', href: '/' }, { label: sidoDecoded }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {sidoDecoded} 복지혜택
        </h1>
        <p className="mt-2 text-gray-500">
          시/군/구를 선택하면 해당 지역의 복지혜택을 확인할 수 있습니다
        </p>
      </div>

      {cities.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-500">등록된 지역 정보가 없습니다</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
          >
            홈으로 돌아가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/${sido}/${encodeURIComponent(city)}`}
              className="group rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
            >
              <p className="font-bold text-gray-900 group-hover:text-[#1f1bc4]">{city}</p>
              <p className="mt-1 text-xs text-gray-400">{sidoDecoded}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
