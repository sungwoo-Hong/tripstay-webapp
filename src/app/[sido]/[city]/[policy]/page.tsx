import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import NationalBenefitsTable from '@/components/NationalBenefitsTable'
import InternalLinkButtons from '@/components/InternalLinkButtons'
import AdBanner from '@/components/AdBanner'
import Breadcrumb from '@/components/Breadcrumb'
import { POLICIES, SITE_URL } from '@/lib/constants'
import { getAllBenefitParams, getBenefit, getNationalBenefits } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ sido: string; city: string; policy: string }>
}

// ── 빌드 시 Supabase에서 전체 경로 생성 ─────────────────────
// benefits 테이블이 비어있으면 [] 반환 → 빌드 성공, 정적 페이지 0개
export async function generateStaticParams() {
  const params = await getAllBenefitParams()

  return params.map((item) => ({
    sido:   item.sido,
    city:   item.city_name,
    policy: item.policy_id,
  }))
}

// ── SEO 메타데이터 ────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sido, city, policy } = await params
  const sidoDecoded = decodeURIComponent(sido)
  const cityDecoded = decodeURIComponent(city)

  const benefit = await getBenefit(sidoDecoded, cityDecoded, policy)

  // Supabase에 데이터 없으면 기본 메타데이터
  if (!benefit) {
    const policyObj = POLICIES.find((p) => p.id === policy)
    const title     = `${cityDecoded} ${policyObj?.name ?? policy} 신청방법 및 지원금액`
    return { title }
  }

  const url = `${SITE_URL}/${encodeURIComponent(sido)}/${encodeURIComponent(city)}/${policy}`

  return {
    title:       benefit.title,
    description: benefit.meta_description ?? undefined,
    keywords:    [...(benefit.tags ?? []), sidoDecoded, cityDecoded],
    openGraph: {
      title:       benefit.title,
      description: benefit.meta_description ?? undefined,
      url,
      type: 'article',
    },
    alternates: { canonical: url },
  }
}

/** JSON-LD 구조화 데이터 */
function JsonLd({
  title,
  description,
  url,
}: {
  title: string
  description: string
  url: string
}) {
  const data = {
    '@context':  'https://schema.org',
    '@type':     'Article',
    headline:    title,
    description,
    url,
    author:    { '@type': 'Organization', name: '복지다모아' },
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

// ── 페이지 본문 ───────────────────────────────────────────
export default async function BenefitDetailPage({ params }: PageProps) {
  const { sido, city, policy } = await params
  const sidoDecoded = decodeURIComponent(sido)
  const cityDecoded = decodeURIComponent(city)

  // Supabase에서 해당 지역×정책 콘텐츠 조회
  const benefit          = await getBenefit(sidoDecoded, cityDecoded, policy)
  const nationalBenefits = await getNationalBenefits(policy)

  // 데이터 없으면 404
  if (!benefit) notFound()

  const policyObj = POLICIES.find((p) => p.id === policy)
  const pageUrl   = `${SITE_URL}/${encodeURIComponent(sido)}/${encodeURIComponent(city)}/${policy}`

  const internalLinks = [
    {
      label: `${sidoDecoded} 전체 ${benefit.policy_name} 보기`,
      href:  `/region/${sido}`,
    },
    {
      label: `전국 ${benefit.policy_name} 모아보기`,
      href:  `/policy/${policy}`,
    },
    { label: '복지정책 전체보기', href: '/' },
  ]

  const relatedPolicies = POLICIES.filter((p) => p.id !== policy)

  return (
    <>
      <JsonLd
        title={benefit.title}
        description={benefit.meta_description ?? benefit.title}
        url={pageUrl}
      />

      <article className="mx-auto max-w-3xl px-4 py-8">
        {/* 브레드크럼 */}
        <Breadcrumb
          items={[
            { label: '홈', href: '/' },
            { label: sidoDecoded, href: `/region/${sido}` },
            { label: cityDecoded, href: `/region/${sido}` },
            { label: benefit.policy_name },
          ]}
        />

        {/* 제목 + 메타 */}
        <h1 className="mb-3 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
          {benefit.title}
        </h1>
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span>{sidoDecoded}</span>
          <span>·</span>
          <span>{cityDecoded}</span>
          <span>·</span>
          <span>{benefit.policy_name}</span>
          <span>·</span>
          <time dateTime={benefit.created_at}>
            {new Date(benefit.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
            })} 기준
          </time>
        </div>

        {/* 태그 */}
        {benefit.tags && benefit.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-1.5">
            {benefit.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-[#1f1bc4]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 전국 공통 혜택 표 */}
        <NationalBenefitsTable benefits={nationalBenefits} />

        {/* 요약 카드 */}
        <div className="my-6 rounded-xl border border-[#1f1bc4]/20 bg-blue-50 p-5">
          <h2 className="mb-4 text-sm font-bold text-[#1f1bc4]">
            💡 {cityDecoded} {benefit.policy_name} 핵심 정보
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-gray-500">지원 대상</p>
              <p className="font-bold text-gray-900">{cityDecoded} 출생아</p>
            </div>
            <div>
              <p className="text-gray-500">신청 기간</p>
              <p className="font-bold text-gray-900">출생 후 60일 이내</p>
            </div>
            <div>
              <p className="text-gray-500">신청 방법</p>
              <p className="font-bold text-gray-900">방문 · 온라인</p>
            </div>
          </div>
        </div>

        {/* 광고 배너 */}
        <AdBanner className="my-6" />

        {/* 본문 콘텐츠 - h2[신청 방법 및 자격] 기준으로 분리 */}
        {(() => {
          const html = benefit.content
          const splitKeyword = '신청 방법 및 자격'
          const h2Regex = new RegExp(`(<h2[^>]*>[^<]*${splitKeyword}[^<]*</h2>)`)
          const match = html.match(h2Regex)

          const externalLinks = (
            <div className="my-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-4 text-sm font-bold text-gray-700">공식 사이트에서 신청하기</h2>
              <div className="flex flex-col gap-3 sm:flex-row">
                {[
                  { label: '복지로 신청하기',    href: 'https://www.bokjiro.go.kr', icon: '🏛' },
                  { label: '정부24 원스톱 신청', href: 'https://www.gov.kr',        icon: '🏢' },
                  { label: '아이사랑 보육포털',  href: 'https://www.childcare.go.kr', icon: '👶' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1f1bc4] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1a17a0] sm:w-auto sm:flex-1"
                  >
                    <span>{link.icon}</span>
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </div>
          )

          if (!match) {
            return (
              <>
                {externalLinks}
                <div
                  className="prose prose-gray max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900
                    prose-h2:mt-10 prose-h2:text-xl prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-a:text-[#1f1bc4] prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
                <InternalLinkButtons links={internalLinks} />
              </>
            )
          }

          const splitIndex = html.indexOf(match[1])
          const beforeHtml = html.slice(0, splitIndex)
          const afterHtml  = html.slice(splitIndex)

          const proseClass = `prose prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:mt-10 prose-h2:text-xl prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-[#1f1bc4] prose-a:no-underline hover:prose-a:underline`

          return (
            <>
              {externalLinks}
              <div className={proseClass} dangerouslySetInnerHTML={{ __html: beforeHtml }} />
              <InternalLinkButtons links={internalLinks} />
              <div className={proseClass} dangerouslySetInnerHTML={{ __html: afterHtml }} />
            </>
          )
        })()}

        {/* 관련 정책 */}
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-bold text-gray-700">
            {cityDecoded} 다른 복지정책 보기
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {relatedPolicies.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/${sido}/${city}/${p.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
              >
                <span className="text-2xl">{p.icon}</span>
                <p className="mt-2 text-sm font-bold text-gray-900 group-hover:text-[#1f1bc4]">
                  {p.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
        <AdBanner className="mt-6" />

        {/* 이전·다음 네비게이션 자리 (Phase 4+ 확장 가능) */}
        {policyObj && (
          <div className="mt-8 border-t pt-6 text-xs text-gray-400">
            이 페이지는{' '}
            <Link href={`/policy/${policy}`} className="text-[#1f1bc4] hover:underline">
              전국 {policyObj.name} 목록
            </Link>
            의 일부입니다.
          </div>
        )}
      </article>
    </>
  )
}
