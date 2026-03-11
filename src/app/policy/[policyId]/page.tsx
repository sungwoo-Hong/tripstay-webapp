import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POLICIES, DUMMY_NATIONAL_BENEFITS } from '@/lib/constants'
import Breadcrumb from '@/components/Breadcrumb'
import NationalBenefitsTable from '@/components/NationalBenefitsTable'
import AdBanner from '@/components/AdBanner'

interface PageProps {
  params: Promise<{ policyId: string }>
}

// 더미 지역 목록 — Phase 4에서 Supabase로 교체
const DUMMY_CITIES_BY_POLICY = [
  { city_name: '고양시',  sido: '경기도' },
  { city_name: '수원시',  sido: '경기도' },
  { city_name: '성남시',  sido: '경기도' },
  { city_name: '용인시',  sido: '경기도' },
  { city_name: '부천시',  sido: '경기도' },
  { city_name: '안양시',  sido: '경기도' },
  { city_name: '남양주시', sido: '경기도' },
  { city_name: '화성시',  sido: '경기도' },
  { city_name: '강남구',  sido: '서울특별시' },
  { city_name: '강서구',  sido: '서울특별시' },
  { city_name: '노원구',  sido: '서울특별시' },
  { city_name: '송파구',  sido: '서울특별시' },
  { city_name: '해운대구', sido: '부산광역시' },
  { city_name: '연수구',  sido: '인천광역시' },
  { city_name: '유성구',  sido: '대전광역시' },
  { city_name: '북구',   sido: '광주광역시' },
]

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

  const nationalBenefits = DUMMY_NATIONAL_BENEFITS.filter((b) => b.policy_id === policyId)
  const otherPolicies    = POLICIES.filter((p) => p.id !== policyId)

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
          <span className="text-sm text-gray-400">
            {DUMMY_CITIES_BY_POLICY.length}개 지역 (Phase 4: 250개로 확장)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {DUMMY_CITIES_BY_POLICY.map((region) => (
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
