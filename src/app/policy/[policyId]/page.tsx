import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POLICIES } from '@/lib/constants'
import { getNationalBenefits } from '@/lib/supabase'
import Breadcrumb from '@/components/Breadcrumb'
import NationalBenefitsTable from '@/components/NationalBenefitsTable'
import AdBanner from '@/components/AdBanner'
import RegionSearchDropdown from '@/components/RegionSearchDropdown'

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

  const nationalBenefits = await getNationalBenefits(policyId)

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

      {/* 정책 핵심 안내 */}
      {policy.keyPoints && policy.keyPoints.length > 0 && (
        <section className="mb-8 rounded-xl border border-[#1f1bc4]/20 bg-blue-50 p-5">
          <h2 className="mb-3 text-sm font-bold text-[#1f1bc4]">
            💡 {policy.name} 주요 안내
          </h2>
          <ul className="space-y-2">
            {policy.keyPoints.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-0.5 text-[#1f1bc4]">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-400">
            ※ 지원 금액·대상·신청 기간은 지자체마다 다릅니다. 아래 지역을 선택해 정확한 정보를 확인하세요.
          </p>
        </section>
      )}

      {/* 전국 공통 혜택 */}
      {nationalBenefits.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-gray-800">전국 공통 혜택</h2>
          <NationalBenefitsTable benefits={nationalBenefits} />
        </section>
      )}

      {/* 광고 */}
      <AdBanner className="mb-8" />

      {/* 우리 지역 혜택 확인 */}
      <section className="mb-8">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <p className="mb-4 text-center text-base font-bold text-gray-800">
            우리 지역 <span className="text-[#1f1bc4]">{policy.name}</span> 확인해보세요
          </p>
          <RegionSearchDropdown targetPolicy={policyId} />
        </div>
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
