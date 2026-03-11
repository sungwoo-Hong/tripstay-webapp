import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POLICIES } from '@/lib/constants'
import { getBenefitsByPolicy, getNationalBenefits } from '@/lib/supabase'
import Breadcrumb from '@/components/Breadcrumb'
import NationalBenefitsTable from '@/components/NationalBenefitsTable'
import AdBanner from '@/components/AdBanner'

interface PageProps {
  params: Promise<{ policyId: string }>
}

export async function generateStaticParams() {
  return POLICIES.map((policy) => ({ policyId: policy.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { policyId } = await params
  const policy = POLICIES.find((p) => p.id === policyId)
  if (!policy) return {}
  return {
    title: `전국 ${policy.name} 지역별 정보 모음`,
    description: `전국 시/군/구별 ${policy.name} 지원금액과 신청방법을 확인하세요. ${policy.description}`,
  }
}

export default async function PolicyListPage({ params }: PageProps) {
  const { policyId } = await params
  const policy = POLICIES.find((p) => p.id === policyId)
  if (!policy) notFound()

  const [{ data: benefits }, nationalBenefits] = await Promise.all([
    getBenefitsByPolicy(policyId),
    getNationalBenefits(policyId),
  ])

  const otherPolicies = POLICIES.filter((p) => p.id !== policyId)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* 브레드크럼 */}
      <Breadcrumb items={[{ label: '홈', href: '/' }, { label: policy.name }]} />

      {/* 헤더 */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <span className="text-4xl">{policy.icon}</span>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            전국 {policy.name} 정보
          </h1>
        </div>
        <p className="text-gray-500">{policy.description}</p>
      </div>

      {/* 전국 공통 혜택 */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-gray-800">전국 공통 혜택</h2>
        <NationalBenefitsTable benefits={nationalBenefits} />
      </section>

      {/* 광고 */}
      <AdBanner className="mb-8" />

      {/* 지역별 카드 */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">지역별 {policy.name} 보기</h2>
          <span className="text-sm text-gray-400">{benefits.length}개 지역</span>
        </div>

        {benefits.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            콘텐츠가 준비 중입니다. 곧 업데이트될 예정입니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {benefits.map((region) => (
              <Link
                key={`${region.sido}-${region.city_name}`}
                href={`/${encodeURIComponent(region.sido)}/${encodeURIComponent(region.city_name)}/${policyId}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
              >
                <p className="font-bold text-gray-900 group-hover:text-[#1f1bc4]">
                  {region.city_name}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{region.sido}</p>
                <p className="mt-2 text-xs text-[#1f1bc4] opacity-0 transition-opacity group-hover:opacity-100">
                  자세히 보기 →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 다른 정책 바로가기 */}
      <section className="mt-12">
        <h2 className="mb-4 text-sm font-bold text-gray-600">다른 복지정책 보기</h2>
        <div className="flex flex-wrap gap-2">
          {otherPolicies.map((p) => (
            <Link
              key={p.id}
              href={`/policy/${p.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
            >
              {p.icon} {p.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
