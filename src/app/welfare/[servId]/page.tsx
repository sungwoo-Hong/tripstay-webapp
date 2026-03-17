import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/components/Breadcrumb'
import AdBanner from '@/components/AdBanner'
import { SITE_URL } from '@/lib/constants'
import { getAllRawServIds, getRawWelfareItem } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ servId: string }>
}

export async function generateStaticParams() {
  const servIds = await getAllRawServIds()
  return servIds.map((servId) => ({ servId }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { servId } = await params
  const item = await getRawWelfareItem(servId)
  if (!item) return { title: '복지 서비스 정보' }

  const city = item.sgg_nm ?? item.sido
  const title = `${item.serv_nm} | ${city} 복지서비스`
  const description = item.serv_dgst ?? `${city} ${item.serv_nm} 지원 대상, 신청 방법 안내`
  const url = `${SITE_URL}/welfare/${servId}`

  return {
    title,
    description,
    openGraph: { title, description, url, type: 'article' },
    alternates: { canonical: url },
  }
}

function InfoSection({ label, content }: { label: string; content: string | null }) {
  if (!content) return null
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-bold text-gray-700">{label}</h2>
      <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{content}</p>
    </section>
  )
}

function TagList({ value, label }: { value: string | null; label: string }) {
  if (!value) return null
  // comma-separated or JSON array
  let tags: string[] = []
  try {
    const parsed = JSON.parse(value)
    tags = Array.isArray(parsed) ? parsed : [value]
  } catch {
    tags = value.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
  }
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500">{label}:</span>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-[#1f1bc4]"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export default async function WelfareDetailPage({ params }: PageProps) {
  const { servId } = await params
  const item = await getRawWelfareItem(servId)

  if (!item) notFound()

  const city = item.sgg_nm ?? item.sido
  const sidoEncoded = encodeURIComponent(item.sido)
  const cityEncoded = item.sgg_nm ? encodeURIComponent(item.sgg_nm) : sidoEncoded
  const pageUrl = `${SITE_URL}/welfare/${servId}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: item.serv_nm,
    description: item.serv_dgst,
    url: pageUrl,
    provider: {
      '@type': 'GovernmentOrganization',
      name: item.dept_name ?? city,
    },
    areaServed: city,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: '홈', href: '/' },
            { label: item.sido, href: `/region/${sidoEncoded}` },
            ...(item.sgg_nm
              ? [{ label: item.sgg_nm, href: `/${sidoEncoded}/${cityEncoded}` }]
              : []),
            { label: item.serv_nm ?? '복지서비스' },
          ]}
        />

        {/* 제목 */}
        <h1 className="mb-3 mt-6 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
          {item.serv_nm}
        </h1>

        {/* 메타 정보 */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span>{item.sido}</span>
          {item.sgg_nm && (
            <>
              <span>·</span>
              <span>{item.sgg_nm}</span>
            </>
          )}
          {item.last_mod_ymd && (
            <>
              <span>·</span>
              <span>{item.last_mod_ymd.slice(0, 4)}년 기준</span>
            </>
          )}
        </div>

        {/* 태그 */}
        <div className="mb-6 flex flex-col gap-2">
          <TagList value={item.life_nm} label="생애주기" />
          <TagList value={item.intrs_thema_nm} label="관심테마" />
        </div>

        {/* 핵심 요약 카드 */}
        <div className="mb-6 rounded-xl border border-[#1f1bc4]/20 bg-blue-50 p-5">
          <h2 className="mb-4 text-sm font-bold text-[#1f1bc4]">핵심 정보 요약</h2>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            {item.sprt_cyc_nm && (
              <div className="text-center">
                <p className="text-gray-500">지원주기</p>
                <p className="font-bold text-gray-900">{item.sprt_cyc_nm}</p>
              </div>
            )}
            {item.srv_pvsn_nm && (
              <div className="text-center">
                <p className="text-gray-500">지원방식</p>
                <p className="font-bold text-gray-900">{item.srv_pvsn_nm}</p>
              </div>
            )}
            {item.aply_mtd_nm && (
              <div className="text-center">
                <p className="text-gray-500">신청방법</p>
                <p className="font-bold text-gray-900">{item.aply_mtd_nm}</p>
              </div>
            )}
            {item.dept_name && (
              <div className="text-center">
                <p className="text-gray-500">담당부서</p>
                <p className="font-bold text-gray-900">{item.dept_name}</p>
              </div>
            )}
          </div>
          {item.phone && (
            <p className="mt-4 text-center text-sm text-gray-600">
              문의: <span className="font-medium">{item.phone}</span>
            </p>
          )}
        </div>

        {/* 서비스 개요 */}
        {item.serv_dgst && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm leading-relaxed text-gray-700">{item.serv_dgst}</p>
          </div>
        )}

        {/* 신청 버튼 */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          {item.serv_dtl_link && (
            <a
              href={item.serv_dtl_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#1f1bc4] px-5 py-3 text-sm font-medium text-white hover:bg-[#1a17a0]"
            >
              복지로에서 신청하기 ↗
            </a>
          )}
          {item.basfm_link && (
            <a
              href={item.basfm_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
            >
              신청서식 다운로드 ↗
            </a>
          )}
        </div>

        {/* 상세 내용 섹션 */}
        <div className="flex flex-col gap-4">
          <InfoSection label="지원 대상" content={item.sprt_trgt_cn} />
          <InfoSection label="지원 내용" content={item.alw_serv_cn} />
          <InfoSection label="선정 기준" content={item.slct_crit_cn} />
          <InfoSection label="신청 방법" content={item.aply_mtd_cn} />
          {item.baslaw_nm && (
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-1 text-sm font-bold text-gray-700">근거 법령</h2>
              <p className="text-sm text-gray-600">{item.baslaw_nm}</p>
            </section>
          )}
        </div>

        {/* 하단 네비게이션 */}
        <section className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="mb-3 text-sm font-bold text-gray-700">관련 정보 더 보기</h2>
          <div className="flex flex-wrap gap-2">
            {item.sgg_nm && (
              <Link
                href={`/${sidoEncoded}/${cityEncoded}`}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
              >
                {item.sgg_nm} 복지 전체보기
              </Link>
            )}
            <Link
              href={`/region/${sidoEncoded}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
            >
              {item.sido} 지역별 복지
            </Link>
            <Link
              href="/"
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
            >
              홈으로
            </Link>
          </div>
        </section>

        <AdBanner className="mt-6 min-h-0" />
      </article>
    </>
  )
}
