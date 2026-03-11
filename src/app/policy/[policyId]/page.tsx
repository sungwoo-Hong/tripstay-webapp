import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POLICIES } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

interface PageProps {
  params: Promise<{ policyId: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  return POLICIES.map((policy) => ({ policyId: policy.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { policyId } = await params
  const policy = POLICIES.find((p) => p.id === policyId)
  if (!policy) return {}

  return {
    title: `전국 ${policy.name} 정보 모음`,
    description: `전국 시/군/구별 ${policy.name} 지원금액과 신청방법을 확인하세요.`,
  }
}

export default async function PolicyListPage({ params }: PageProps) {
  const { policyId } = await params
  const policy = POLICIES.find((p) => p.id === policyId)
  if (!policy) notFound()

  // Phase 1: 더미 지역 목록
  // Phase 4에서 getBenefitsByPolicy(policyId)로 교체
  const dummyRegions = [
    { city_name: '고양시', sido: '경기도' },
    { city_name: '수원시', sido: '경기도' },
    { city_name: '성남시', sido: '경기도' },
    { city_name: '강남구', sido: '서울특별시' },
    { city_name: '해운대구', sido: '부산광역시' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-2">{policy.icon} 정책별 보기</Badge>
        <h1 className="text-2xl font-bold text-gray-900">전국 {policy.name} 정보</h1>
        <p className="mt-1 text-gray-500">{policy.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {dummyRegions.map((region) => (
          <Link
            key={`${region.sido}-${region.city_name}`}
            href={`/${encodeURIComponent(region.sido)}/${encodeURIComponent(region.city_name)}/${policyId}`}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="font-semibold text-gray-800">{region.city_name}</p>
            <p className="text-xs text-gray-500">{region.sido}</p>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-gray-400">
        Phase 4에서 전국 250개 지역 데이터가 표시됩니다.
      </p>
    </div>
  )
}
