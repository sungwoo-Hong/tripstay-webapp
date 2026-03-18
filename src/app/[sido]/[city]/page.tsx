import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import { REGION_DATA, POLICIES } from '@/lib/constants'
import { getRawWelfareItemsByCity, getBenefitsByCity } from '@/lib/supabase'
import type { RawWelfareItem } from '@/types'

interface PageProps {
  params: Promise<{ sido: string; city: string }>
  searchParams: Promise<{ theme?: string }>
}

// 테마 → 아이콘 매핑
const THEME_ICON_MAP: Record<string, string> = {
  '서민금융': '💰',
  '임신·출산': '🤱',
  '입양·위탁': '👨‍👩‍👧',
  '교육': '📚',
  '일자리': '💼',
  '안전·위기': '🛡️',
  '신체건강': '🏥',
  '보호·돌봄': '🤝',
  '주거': '🏠',
  '생활지원': '✨',
  '노년': '👴',
  '장애': '♿',
  '청년': '🧑',
  '여성': '👩',
  '다문화': '🌏',
  '임신': '🤰',
  '출산': '🤱',
  '보육': '🏫',
  '아동': '🧒',
}

function getThemeIcon(intrs_thema_nm: string | null): string {
  if (!intrs_thema_nm) return '📋'
  let themes: string[] = []
  try {
    const parsed = JSON.parse(intrs_thema_nm)
    themes = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)]
  } catch {
    themes = intrs_thema_nm.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
  }
  for (const theme of themes) {
    for (const [key, icon] of Object.entries(THEME_ICON_MAP)) {
      if (theme.includes(key)) return icon
    }
  }
  return '📋'
}

function shortenSido(sido: string): string {
  return sido
    .replace('특별자치시', '')
    .replace('특별자치도', '')
    .replace('특별시', '')
    .replace('광역시', '')
}

// React cache로 generateMetadata와 페이지 컴포넌트 간 DB 조회 공유
const fetchCityData = cache(async (sido: string, city: string) => {
  const [allRawItems, benefitPolicies] = await Promise.all([
    getRawWelfareItemsByCity(sido, city),
    getBenefitsByCity(sido, city),
  ])
  const uniquePolicies = benefitPolicies.filter(
    (b, i, arr) => arr.findIndex((x) => x.policy_id === b.policy_id) === i,
  )
  const isEmpty = allRawItems.length === 0 && uniquePolicies.length === 0
  return { allRawItems, uniquePolicies, isEmpty }
})

export function generateStaticParams() {
  const params: { sido: string; city: string }[] = []
  for (const [sido, cities] of Object.entries(REGION_DATA)) {
    for (const city of cities) {
      params.push({ sido, city })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sido, city } = await params
  const sidoDecoded = decodeURIComponent(sido)
  const cityDecoded = decodeURIComponent(city)
  const { isEmpty } = await fetchCityData(sidoDecoded, cityDecoded)

  if (isEmpty) {
    return {
      title: `${cityDecoded} 복지서비스 | 복지다모아`,
      description: `${cityDecoded} 복지서비스 정보를 준비 중입니다.`,
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `${cityDecoded} 혜택 정보 - 출산·보육·주거·청년 복지 총정리 | 복지다모아`,
    description: `${sidoDecoded} ${cityDecoded}의 출산지원금, 보육료, 주거지원, 청년 복지 등 모든 지역 복지서비스를 한눈에 확인하세요.`,
    openGraph: {
      title: `${cityDecoded} 혜택 정보 | 복지다모아`,
      description: `${cityDecoded} 복지서비스 총정리. 출산·보육·주거·청년 등 지역 맞춤 혜택을 확인하세요.`,
    },
  }
}

function matchesTheme(intrs_thema_nm: string | null | undefined, theme: string): boolean {
  if (!intrs_thema_nm) return false
  try {
    const parsed = JSON.parse(intrs_thema_nm)
    const arr = Array.isArray(parsed) ? parsed : [String(parsed)]
    return arr.some((t: string) => t.includes(theme))
  } catch {
    return intrs_thema_nm.includes(theme)
  }
}

function RawWelfareCard({ item, sidoShort }: { item: RawWelfareItem; sidoShort: string }) {
  return (
    <Link
      href={`/welfare/${item.serv_id}`}
      className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
    >
      <span className="text-3xl">{getThemeIcon(item.intrs_thema_nm)}</span>
      <p className="mt-2 line-clamp-2 text-xs font-bold text-gray-900 group-hover:text-[#1f1bc4]">
        {item.serv_nm}
      </p>
      {item.srv_pvsn_nm && (
        <span className="mt-1 text-[10px] text-gray-400">{item.srv_pvsn_nm}</span>
      )}
      {item.sgg_nm === null && (
        <span className="mt-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-600">
          {sidoShort} 공통
        </span>
      )}
    </Link>
  )
}

export default async function CityWelfarePage({ params, searchParams }: PageProps) {
  const { sido, city } = await params
  const { theme } = await searchParams
  const sidoDecoded = decodeURIComponent(sido)
  const cityDecoded = decodeURIComponent(city)
  const sidoShort = shortenSido(sidoDecoded)

  const { allRawItems, uniquePolicies, isEmpty } = await fetchCityData(sidoDecoded, cityDecoded)

  // 테마 필터 적용
  const filteredRawItems =
    theme && theme !== '전체'
      ? allRawItems.filter((item) => matchesTheme(item.intrs_thema_nm, theme))
      : allRawItems

  // 시군구 전용 / 시도 공통 분리
  const cityRawItems = filteredRawItems.filter((item) => item.sgg_nm !== null)
  const sidoRawItems = filteredRawItems.filter((item) => item.sgg_nm === null)

  const totalCount = filteredRawItems.length + (theme ? 0 : uniquePolicies.length)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: '홈', href: '/' },
          { label: sidoDecoded, href: `/region/${encodeURIComponent(sidoDecoded)}` },
          { label: cityDecoded },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {cityDecoded} {theme && theme !== '전체' ? `· ${theme}` : '혜택 정보'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {sidoDecoded} · {totalCount}개 서비스
          {theme && theme !== '전체' && (
            <Link
              href={`/${encodeURIComponent(sidoDecoded)}/${encodeURIComponent(cityDecoded)}`}
              className="ml-2 text-[#1f1bc4] hover:underline"
            >
              전체 보기
            </Link>
          )}
        </p>
      </div>

      {/* 데이터 없음 */}
      {isEmpty && (
        <div className="flex flex-col items-center gap-4 py-20 text-center text-gray-500">
          <p>등록된 복지서비스 정보가 없습니다.</p>
          <Link
            href="/"
            className="rounded-lg bg-[#1f1bc4] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a17a0]"
          >
            홈으로 돌아가기
          </Link>
        </div>
      )}

      {/* ── 출산 관련 지원금 (benefits 테이블) ── */}
      {!theme && uniquePolicies.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-base font-bold text-gray-800">{cityDecoded} 출산 관련 지원금</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {uniquePolicies.map((b) => {
              const meta = POLICIES.find((p) => p.id === b.policy_id)
              return (
                <Link
                  key={b.policy_id}
                  href={`/${encodeURIComponent(sidoDecoded)}/${encodeURIComponent(cityDecoded)}/${b.policy_id}`}
                  className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
                >
                  <span className="text-3xl">{meta?.icon ?? '📋'}</span>
                  <p className="mt-3 text-sm font-bold text-gray-900 group-hover:text-[#1f1bc4]">
                    {meta?.name ?? b.policy_name}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── 시군구 전용 복지서비스 ── */}
      {cityRawItems.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-base font-bold text-gray-800">{cityDecoded} 복지서비스</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cityRawItems.map((item) => (
              <RawWelfareCard key={item.serv_id} item={item} sidoShort={sidoShort} />
            ))}
          </div>
        </section>
      )}

      {/* ── 시도 공통 복지서비스 ── */}
      {sidoRawItems.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-base font-bold text-gray-800">{sidoShort} 공통 복지서비스</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {sidoRawItems.map((item) => (
              <RawWelfareCard key={item.serv_id} item={item} sidoShort={sidoShort} />
            ))}
          </div>
        </section>
      )}

      {/* 테마 필터 결과 없음 */}
      {allRawItems.length > 0 && filteredRawItems.length === 0 && theme && theme !== '전체' && (
        <div className="flex flex-col items-center gap-4 py-20 text-center text-gray-500">
          <p>해당 테마의 서비스가 없습니다.</p>
          <Link
            href={`/${encodeURIComponent(sidoDecoded)}/${encodeURIComponent(cityDecoded)}`}
            className="rounded-lg bg-[#1f1bc4] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a17a0]"
          >
            전체 서비스 보기
          </Link>
        </div>
      )}
    </div>
  )
}
