import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SIDO_LIST, POLICIES } from '@/lib/constants'
import { getBenefitsBySido } from '@/lib/supabase'
import Breadcrumb from '@/components/Breadcrumb'
import AdBanner from '@/components/AdBanner'

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
    title: `${sidoDecoded} 복지정책 정보`,
    description: `${sidoDecoded} 시/군/구별 출산지원금·아동수당·보육료 등 8개 복지정책 정보를 확인하세요.`,
  }
}

export default async function RegionPage({ params }: PageProps) {
  const { sido } = await params
  const sidoDecoded = decodeURIComponent(sido)

  if (!SIDO_LIST.includes(sidoDecoded)) notFound()

  const benefits = await getBenefitsBySido(sidoDecoded)

  // city_name 기준으로 그룹화 (중복 제거)
  const cityMap = new Map<string, string[]>()
  for (const b of benefits) {
    if (!cityMap.has(b.city_name)) cityMap.set(b.city_name, [])
    cityMap.get(b.city_name)!.push(b.policy_id)
  }
  const cities = [...cityMap.keys()].sort()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* 브레드크럼 */}
      <Breadcrumb items={[{ label: '홈', href: '/' }, { label: sidoDecoded }]} />

      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          {sidoDecoded} 복지정책
        </h1>
        <p className="text-gray-500">
          시/군/구를 선택해 정책별 지원금액과 신청방법을 확인하세요.
        </p>
      </div>

      {/* 광고 */}
      <AdBanner className="mb-8" />

      {/* 정책 카드 빠른 이동 */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-bold text-gray-600">정책별 빠른 이동</h2>
        <div className="flex flex-wrap gap-2">
          {POLICIES.map((policy) => (
            <Link
              key={policy.id}
              href={`/policy/${policy.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 transition-colors hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
            >
              {policy.icon} {policy.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 시/군/구별 목록 */}
      <section>
        <h2 className="mb-5 text-lg font-bold text-gray-800">
          {sidoDecoded} 시/군/구 목록
          <span className="ml-2 text-sm font-normal text-gray-400">({cities.length}개)</span>
        </h2>

        {cities.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            콘텐츠가 준비 중입니다. 곧 업데이트될 예정입니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cities.map((city) => {
              const availablePolicies = cityMap.get(city) ?? []
              return (
                <div
                  key={city}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{city}</h3>
                    <span className="text-xs text-gray-400">{sidoDecoded}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POLICIES.map((policy) => {
                      const hasData = availablePolicies.includes(policy.id)
                      return hasData ? (
                        <Link
                          key={policy.id}
                          href={`/${encodeURIComponent(sidoDecoded)}/${encodeURIComponent(city)}/${policy.id}`}
                          className="inline-flex items-center gap-0.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:border-[#1f1bc4] hover:bg-blue-50 hover:text-[#1f1bc4]"
                        >
                          {policy.icon} {policy.name}
                        </Link>
                      ) : (
                        <span
                          key={policy.id}
                          className="inline-flex items-center gap-0.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-400"
                        >
                          {policy.icon} {policy.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* 다른 지역 바로가기 */}
      <section className="mt-12">
        <h2 className="mb-4 text-sm font-bold text-gray-600">다른 지역 보기</h2>
        <div className="flex flex-wrap gap-2">
          {SIDO_LIST.filter((s) => s !== sidoDecoded).map((s) => (
            <Link
              key={s}
              href={`/region/${encodeURIComponent(s)}`}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 transition-colors hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
