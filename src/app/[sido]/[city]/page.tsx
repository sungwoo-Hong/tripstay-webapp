import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { REGION_DATA } from '@/lib/constants'
import { getRawWelfareItemsByCity } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ sido: string; city: string }>
}

export function generateStaticParams() {
  const params: { sido: string; city: string }[] = []
  for (const [sido, cities] of Object.entries(REGION_DATA)) {
    for (const city of cities) {
      params.push({
        sido: encodeURIComponent(sido),
        city: encodeURIComponent(city),
      })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sido, city } = await params
  const sidoDecoded = decodeURIComponent(sido)
  const cityDecoded = decodeURIComponent(city)
  return {
    title: `${cityDecoded} 복지혜택 총정리 | 복지다모아`,
    description: `${cityDecoded}의 출산, 보육, 주거, 청년 등 모든 지역 복지서비스를 한눈에 확인하세요.`,
  }
}

function TagBadge({ value }: { value: string | null }) {
  if (!value) return null
  let tags: string[] = []
  try {
    const parsed = JSON.parse(value)
    tags = Array.isArray(parsed) ? parsed.slice(0, 2) : [value]
  } catch {
    tags = value.split(/[,，]/).map((t) => t.trim()).filter(Boolean).slice(0, 2)
  }
  return (
    <>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-[#1f1bc4]"
        >
          {tag}
        </span>
      ))}
    </>
  )
}

export default async function CityWelfarePage({ params }: PageProps) {
  const { sido, city } = await params
  const sidoDecoded = decodeURIComponent(sido)
  const cityDecoded = decodeURIComponent(city)

  const items = await getRawWelfareItemsByCity(sidoDecoded, cityDecoded)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: '홈', href: '/' },
          { label: sidoDecoded, href: `/region/${sido}` },
          { label: cityDecoded },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {cityDecoded} 복지서비스
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {sidoDecoded} · {items.length}개 서비스
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center text-gray-500">
          <p>등록된 복지서비스 정보가 없습니다.</p>
          <Link
            href="/"
            className="rounded-lg bg-[#1f1bc4] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a17a0]"
          >
            홈으로 돌아가기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Link
              key={item.serv_id}
              href={`/welfare/${item.serv_id}`}
              className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#1f1bc4] hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 leading-snug">
                  {item.serv_nm}
                </p>
                {item.srv_pvsn_nm && (
                  <span className="shrink-0 rounded-full border border-gray-200 px-2 py-0.5 text-[10px] text-gray-500">
                    {item.srv_pvsn_nm}
                  </span>
                )}
              </div>
              {item.serv_dgst && (
                <p className="line-clamp-2 text-xs text-gray-500">{item.serv_dgst}</p>
              )}
              <div className="flex flex-wrap gap-1">
                <TagBadge value={item.life_nm} />
                <TagBadge value={item.intrs_thema_nm} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
