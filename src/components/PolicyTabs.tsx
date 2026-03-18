'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { WELFARE_THEMES, type WelfareTheme } from '@/lib/constants'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import type { RawWelfareItem } from '@/types'

const PAGE_SIZE = 12

const THEME_META: Record<string, { icon: string; description: string }> = {
  '서민금융': { icon: '💰', description: '저소득층 금융 지원, 서민 대출 이자 지원' },
  '임신·출산': { icon: '🤱', description: '임산부 건강 지원, 출산 장려금, 산후 케어' },
  '입양·위탁': { icon: '👨‍👩‍👧', description: '입양·위탁 가정을 위한 지원 서비스' },
  '교육': { icon: '📚', description: '교육비 지원, 학습 바우처, 장학금' },
  '일자리': { icon: '💼', description: '취업 지원, 직업 훈련, 고용 연계' },
  '안전·위기': { icon: '🛡️', description: '위기 가정 안전망, 긴급 복지 지원' },
  '신체건강': { icon: '🏥', description: '의료비 지원, 건강 검진, 재활 서비스' },
  '보호·돌봄': { icon: '🤝', description: '노인·장애인 돌봄, 아동 보호 서비스' },
  '주거': { icon: '🏠', description: '주거 지원, 임대, 전세 대출 지원' },
  '생활지원': { icon: '✨', description: '생활비 지원, 식품, 에너지 지원' },
}

function parseThemeLabel(value: string | null): string {
  if (!value) return ''
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed[0] ?? ''
  } catch {
    // not JSON
  }
  return value.split(/[,，]/)[0].trim()
}

export default function PolicyTabs() {
  const [activeTheme, setActiveTheme] = useState<WelfareTheme>('전체')
  const [items, setItems] = useState<RawWelfareItem[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchItems = useCallback(async (theme: WelfareTheme, currentOffset: number) => {
    if (theme === '전체') return []
    setLoading(true)
    const supabase = createBrowserSupabaseClient()
    const { data } = await supabase
      .from('raw_welfare_api')
      .select('serv_id, serv_nm, serv_dgst, intrs_thema_nm')
      .ilike('intrs_thema_nm', `%${theme}%`)
      .order('serv_nm', { ascending: true })
      .range(currentOffset, currentOffset + PAGE_SIZE - 1)
    setLoading(false)
    return (data ?? []) as RawWelfareItem[]
  }, [])

  useEffect(() => {
    if (activeTheme === '전체') {
      setItems([])
      setOffset(0)
      setHasMore(false)
      return
    }
    let cancelled = false
    fetchItems(activeTheme, 0).then((fetched) => {
      if (!cancelled) {
        setItems(fetched)
        setOffset(fetched.length)
        setHasMore(fetched.length === PAGE_SIZE)
      }
    })
    return () => { cancelled = true }
  }, [activeTheme, fetchItems])

  async function handleLoadMore() {
    const fetched = await fetchItems(activeTheme, offset)
    setItems((prev) => [...prev, ...fetched])
    setOffset((prev) => prev + fetched.length)
    setHasMore(fetched.length === PAGE_SIZE)
  }

  const nonAllThemes = WELFARE_THEMES.filter((t) => t !== '전체')

  return (
    <section className="mb-10">
      {/* 탭 헤더 */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-gray-200 pb-0">
        {WELFARE_THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() => setActiveTheme(theme)}
            className={`px-3 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTheme === theme
                ? 'border-b-2 border-[#1f1bc4] text-[#1f1bc4]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      {/* 전체 탭: 테마 카테고리 카드 */}
      {activeTheme === '전체' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {nonAllThemes.map((theme) => {
            const meta = THEME_META[theme]
            return (
              <button
                key={theme}
                onClick={() => setActiveTheme(theme)}
                className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
              >
                <span className="text-3xl">{meta.icon}</span>
                <p className="mt-3 text-sm font-bold text-gray-900 group-hover:text-[#1f1bc4]">
                  {theme}
                </p>
                <p className="mt-1 text-xs leading-snug text-gray-500">{meta.description}</p>
              </button>
            )
          })}
        </div>
      )}

      {/* 개별 테마 탭: DB 서비스 카드 */}
      {activeTheme !== '전체' && (
        <>
          {loading && items.length === 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.serv_id}
                  href={`/welfare/${item.serv_id}`}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
                >
                  <p className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[#1f1bc4]">
                    {item.serv_nm ?? ''}
                  </p>
                  {item.serv_dgst && (
                    <p className="mt-2 text-xs text-gray-500 line-clamp-3">{item.serv_dgst}</p>
                  )}
                  {parseThemeLabel(item.intrs_thema_nm) && (
                    <span className="mt-auto pt-2 text-xs font-medium text-[#1f1bc4]">
                      {parseThemeLabel(item.intrs_thema_nm)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="rounded-lg border border-[#1f1bc4] px-6 py-2.5 text-sm font-semibold text-[#1f1bc4] transition-colors hover:bg-blue-50 disabled:opacity-50"
              >
                {loading ? '불러오는 중...' : '더 보기'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
