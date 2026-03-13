import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { POLICIES } from '@/lib/constants'
import { getAllBenefitParams, getBenefitsByCity } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ sido: string; city: string }>
}

export async function generateStaticParams() {
  const params = await getAllBenefitParams()
  const unique = Array.from(
    new Map(
      params.map((p) => [`${p.sido}-${p.city_name}`, { sido: p.sido, city: p.city_name }]),
    ).values(),
  )
  return unique.map(({ sido, city }) => ({ sido, city }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params
  const cityDecoded = decodeURIComponent(city)
  return {
    title: `${cityDecoded} 복지혜택 총정리 | 복지다모아`,
    description: `${cityDecoded}의 출산지원금, 부모급여, 아동수당 등 복지혜택을 한눈에 확인하세요.`,
  }
}

export default async function CityBenefitsPage({ params }: PageProps) {
  const { sido, city } = await params
  const sidoDecoded = decodeURIComponent(sido)
  const cityDecoded = decodeURIComponent(city)

  const benefits = await getBenefitsByCity(sidoDecoded, cityDecoded)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: '홈', href: '/' },
          { label: sidoDecoded, href: `/region/${sido}` },
          { label: cityDecoded },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {cityDecoded} 복지혜택
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {sidoDecoded} · {benefits.length}개 정책
        </p>
      </div>

      {benefits.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center text-gray-500">
          <p>아직 등록된 정책 정보가 없습니다.</p>
          <Link
            href="/"
            className="rounded-lg bg-[#1f1bc4] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a17a0]"
          >
            홈으로 돌아가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {benefits.map((benefit) => {
            const policyObj = POLICIES.find((p) => p.id === benefit.policy_id)
            return (
              <Link
                key={`${benefit.policy_id}-${benefit.slug}`}
                href={`/${sido}/${city}/${benefit.policy_id}`}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#1f1bc4] hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{policyObj?.icon ?? '📋'}</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {benefit.policy_name}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs text-gray-600">{benefit.title}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
