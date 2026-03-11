import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import NationalBenefitsTable from '@/components/NationalBenefitsTable'
import InternalLinkButtons from '@/components/InternalLinkButtons'
import AdBanner from '@/components/AdBanner'
import Breadcrumb from '@/components/Breadcrumb'
import { POLICIES, DUMMY_NATIONAL_BENEFITS, SITE_URL } from '@/lib/constants'
import { getDummyContent } from '@/lib/dummy-content'

interface PageProps {
  params: Promise<{ sido: string; city: string; policy: string }>
}

// Phase 3: 더미 경로. Phase 4에서 Supabase 전체 2,000개로 교체
export async function generateStaticParams() {
  return [
    { sido: encodeURIComponent('경기도'), city: encodeURIComponent('고양시'), policy: 'birth-support' },
    { sido: encodeURIComponent('경기도'), city: encodeURIComponent('수원시'), policy: 'birth-support' },
    { sido: encodeURIComponent('서울특별시'), city: encodeURIComponent('강남구'), policy: 'birth-support' },
    { sido: encodeURIComponent('경기도'), city: encodeURIComponent('고양시'), policy: 'first-voucher' },
    { sido: encodeURIComponent('서울특별시'), city: encodeURIComponent('강남구'), policy: 'parental-benefit' },
  ]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sido, city, policy } = await params
  const sidoDecoded = decodeURIComponent(sido)
  const cityDecoded = decodeURIComponent(city)
  const policyObj   = POLICIES.find((p) => p.id === policy)
  if (!policyObj) return {}

  const title       = `${cityDecoded} ${policyObj.name} 신청방법 및 지원금액 총정리`
  const description = `${sidoDecoded} ${cityDecoded}의 ${policyObj.name} 지원대상·신청방법·지원금액을 한눈에 확인하세요. 전국 공통 혜택부터 지역 추가 지원금까지 모두 정리했습니다.`
  const url         = `${SITE_URL}/${sido}/${city}/${policy}`

  return {
    title,
    description,
    keywords: [cityDecoded, policyObj.name, sidoDecoded, '복지정책', '신청방법', '지원금액'],
    openGraph: { title, description, url, type: 'article' },
    alternates: { canonical: url },
  }
}

/** JSON-LD 구조화 데이터 */
function JsonLd({ title, description, url }: { title: string; description: string; url: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    author: { '@type': 'Organization', name: '복지다모아' },
    publisher: { '@type': 'Organization', name: '복지다모아' },
    dateModified: new Date().toISOString().split('T')[0],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default async function BenefitDetailPage({ params }: PageProps) {
  const { sido, city, policy } = await params
  const sidoDecoded  = decodeURIComponent(sido)
  const cityDecoded  = decodeURIComponent(city)
  const policyObj    = POLICIES.find((p) => p.id === policy)

  if (!policyObj) notFound()

  // Phase 3: 더미 콘텐츠. Phase 4에서 Supabase getBenefit()으로 교체
  const htmlContent      = getDummyContent(sidoDecoded, cityDecoded, policy, policyObj.name)
  const nationalBenefits = DUMMY_NATIONAL_BENEFITS.filter((b) => b.policy_id === policy)
  const pageTitle        = `${cityDecoded} ${policyObj.name} 신청방법 및 지원금액 총정리`
  const pageUrl          = `${SITE_URL}/${sido}/${city}/${policy}`

  const internalLinks = [
    {
      label: `${sidoDecoded} 전체 ${policyObj.name} 보기`,
      href:  `/region/${sido}`,
    },
    {
      label: `전국 ${policyObj.name} 모아보기`,
      href:  `/policy/${policy}`,
    },
    { label: '복지정책 전체보기', href: '/' },
  ]

  // 다른 정책 바로가기 (현재 정책 제외)
  const relatedPolicies = POLICIES.filter((p) => p.id !== policy)

  return (
    <>
      <JsonLd
        title={pageTitle}
        description={`${sidoDecoded} ${cityDecoded}의 ${policyObj.name} 지원 정보`}
        url={pageUrl}
      />

      <article className="mx-auto max-w-3xl px-4 py-8">
        {/* 브레드크럼 */}
        <Breadcrumb
          items={[
            { label: '홈', href: '/' },
            { label: sidoDecoded, href: `/region/${sido}` },
            { label: cityDecoded, href: `/region/${sido}` },
            { label: policyObj.name },
          ]}
        />

        {/* 제목 + 메타 */}
        <h1 className="mb-3 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
          {pageTitle}
        </h1>
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span>{sidoDecoded}</span>
          <span>·</span>
          <span>{cityDecoded}</span>
          <span>·</span>
          <span>{policyObj.name}</span>
          <span>·</span>
          <span>2026년 기준</span>
        </div>

        {/* 전국 공통 혜택 표 */}
        <NationalBenefitsTable benefits={nationalBenefits} />

        {/* 광고 배너 (전국 공통 혜택 표 바로 아래) */}
        <AdBanner className="my-6" />

        {/* 본문 콘텐츠 */}
        <div
          className="prose prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:mt-10 prose-h2:text-xl prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
            prose-h3:mt-6 prose-h3:text-base prose-h3:text-[#1f1bc4]
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-li:text-gray-700
            prose-table:text-sm prose-th:bg-blue-50 prose-th:text-gray-700
            prose-a:text-[#1f1bc4] prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* 내부 링크 버튼 */}
        <InternalLinkButtons links={internalLinks} />

        {/* 공식 사이트 신청 */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="mb-4 text-sm font-bold text-gray-700">공식 사이트에서 신청하기</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: '복지로 신청하기', href: 'https://www.bokjiro.go.kr' },
              { label: '정부24 원스톱 신청', href: 'https://www.gov.kr' },
              { label: '아이사랑 보육포털', href: 'https://www.childcare.go.kr' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* 관련 정책 */}
        <div className="mt-10">
          <h2 className="mb-4 text-sm font-bold text-gray-700">
            {cityDecoded} 다른 복지정책 보기
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedPolicies.map((p) => (
              <Link
                key={p.id}
                href={`/${sido}/${city}/${p.id}`}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
              >
                {p.icon} {p.name}
              </Link>
            ))}
          </div>
        </div>
      </article>
    </>
  )
}
