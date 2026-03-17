import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import SearchBox from '@/components/SearchBox'
import { searchCities } from '@/lib/supabase'

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export const metadata: Metadata = {
  title: '지역 검색 | 복지다모아',
  description: '시/군/구 이름으로 해당 지역의 복지혜택을 검색하세요.',
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const results = query.length >= 1 ? await searchCities(query) : []

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '지역 검색' }]} />

      <h1 className="mb-6 text-2xl font-bold text-gray-900">복지정책 지역 검색</h1>

      <SearchBox initialValue={query} />

      {query ? (
        <div className="mt-8">
          {results.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-gray-500">
                &ldquo;{query}&rdquo;에 해당하는 지역을 찾을 수 없습니다.
              </p>
              <p className="mt-2 text-sm text-gray-400">
                시/군/구 이름의 일부만 입력해도 검색됩니다. (예: &ldquo;강남&rdquo;, &ldquo;수원&rdquo;)
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500">
                &ldquo;{query}&rdquo; 검색 결과 {results.length}개
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {results.map(({ sido, city_name }) => (
                  <Link
                    key={`${sido}-${city_name}`}
                    href={`/${encodeURIComponent(sido)}/${encodeURIComponent(city_name)}`}
                    className="group rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
                  >
                    <p className="font-bold text-gray-900 group-hover:text-[#1f1bc4]">{city_name}</p>
                    <p className="mt-1 text-xs text-gray-400">{sido}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="mt-8 text-sm text-gray-400 text-center">
          검색어를 입력하면 해당 지역의 복지혜택을 확인할 수 있습니다.
        </p>
      )}
    </div>
  )
}
