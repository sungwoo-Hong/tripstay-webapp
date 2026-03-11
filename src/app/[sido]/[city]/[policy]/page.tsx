import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NationalBenefitsTable from '@/components/NationalBenefitsTable'
import InternalLinkButtons from '@/components/InternalLinkButtons'
import AdBanner from '@/components/AdBanner'
import { POLICIES, DUMMY_NATIONAL_BENEFITS } from '@/lib/constants'

interface PageProps {
  params: Promise<{
    sido: string
    city: string
    policy: string
  }>
}

// Phase 1: 더미 데이터로 소수의 경로만 정적 생성
// Phase 4에서 Supabase 연동으로 교체
export async function generateStaticParams() {
  return [
    { sido: encodeURIComponent('경기도'), city: encodeURIComponent('고양시'), policy: 'birth-support' },
    { sido: encodeURIComponent('경기도'), city: encodeURIComponent('수원시'), policy: 'birth-support' },
    { sido: encodeURIComponent('서울특별시'), city: encodeURIComponent('강남구'), policy: 'birth-support' },
  ]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sido, city, policy } = await params
  const sidoDecoded = decodeURIComponent(sido)
  const cityDecoded = decodeURIComponent(city)
  const policyObj = POLICIES.find((p) => p.id === policy)
  const policyName = policyObj?.name ?? policy

  const title = `${cityDecoded} ${policyName} 신청방법 및 지원금액 총정리`
  const description = `${sidoDecoded} ${cityDecoded}의 ${policyName} 지원대상, 신청방법, 지원금액을 한눈에 확인하세요.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function BenefitDetailPage({ params }: PageProps) {
  const { sido, city, policy } = await params
  const sidoDecoded = decodeURIComponent(sido)
  const cityDecoded = decodeURIComponent(city)
  const policyObj = POLICIES.find((p) => p.id === policy)

  if (!policyObj) notFound()

  // Phase 1: 더미 데이터 사용
  // Phase 4에서 getBenefit(sido, city, policy)로 교체
  const dummyContent = `
    <h2>${cityDecoded} ${policyObj.name} 지원 안내</h2>
    <p>${cityDecoded}에서 제공하는 ${policyObj.name} 정보입니다. Phase 4에서 실제 Gemini 생성 콘텐츠로 교체됩니다.</p>
    <h3>지원 대상</h3>
    <p>${cityDecoded} 거주 가정</p>
    <h3>신청 방법</h3>
    <p>주민센터 방문 또는 정부24 온라인 신청</p>
  `

  const nationalBenefits = DUMMY_NATIONAL_BENEFITS.filter((b) => b.policy_id === policy)

  const internalLinks = [
    { label: `${sidoDecoded} 전체 ${policyObj.name} 보기`, href: `/region/${sido}` },
    { label: `전국 ${policyObj.name} 모아보기`, href: `/policy/${policy}` },
    { label: '복지정책 전체보기', href: '/' },
  ]

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      {/* 제목 */}
      <h1 className="mb-2 text-2xl font-bold leading-snug text-gray-900">
        {cityDecoded} {policyObj.name} 신청방법 및 지원금액 총정리
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        {sidoDecoded} · {cityDecoded} · {policyObj.name}
      </p>

      {/* 전국 공통 혜택 표 */}
      <NationalBenefitsTable benefits={nationalBenefits} />

      {/* 광고 */}
      <AdBanner className="my-6" />

      {/* 본문 콘텐츠 */}
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: dummyContent }}
      />

      {/* 내부 링크 버튼 */}
      <InternalLinkButtons links={internalLinks} />

      {/* 외부 링크 */}
      <div className="mt-8 border-t pt-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-600">공식 사이트에서 신청하기</h3>
        <div className="flex flex-wrap gap-3">
          <a href="https://www.bokjiro.go.kr" target="_blank" rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-gray-500">
            복지로 안내 →
          </a>
          <a href="https://www.gov.kr" target="_blank" rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-gray-500">
            정부24 신청 →
          </a>
          <a href="https://www.childcare.go.kr" target="_blank" rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-gray-500">
            아이사랑 보육포털 →
          </a>
        </div>
      </div>
    </article>
  )
}
