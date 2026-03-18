'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { WELFARE_THEMES, type WelfareTheme } from '@/lib/constants'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import type { RawWelfareItem } from '@/types'

const PAGE_SIZE = 12

function parseThemeLabel(value: string | null): string {
  if (!value) return ''
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed[0] ?? ''
  } catch {
    // not JSON — treat as plain string (comma-separated or single value)
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
    setLoading(true)
    const supabase = createBrowserSupabaseClient()
    let query = supabase
      .from('raw_welfare_api')
      .select('serv_id, serv_nm, serv_dgst, intrs_thema_nm')
      .order('serv_nm', { ascending: true })
      .range(currentOffset, currentOffset + PAGE_SIZE - 1)

    if (theme !== '전체') {
      query = query.ilike('intrs_thema_nm', `%${theme}%`)
    }

    const { data } = await query
    const fetched = (data ?? []) as RawWelfareItem[]
    setLoading(false)
    return fetched
  }, [])

  useEffect(() => {
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

  function handleTabChange(theme: WelfareTheme) {
    setActiveTheme(theme)
    setItems([])
    setOffset(0)
    setHasMore(false)
  }

  return (
    <section className="mb-10">
      {/* 탭 헤더 */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-gray-200 pb-0">
        {WELFARE_THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() => handleTabChange(theme)}
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

      {/* 카드 그리드 */}
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

      {/* 더 보기 */}
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
    </section>
  )
}
