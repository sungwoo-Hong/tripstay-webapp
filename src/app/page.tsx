import Link from 'next/link'
import { POLICIES, SIDO_LIST, SITE_NAME } from '@/lib/constants'
import SearchBox from '@/components/SearchBox'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* 히어로 섹션 */}
      <section className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          {SITE_NAME}
        </h1>
        <p className="text-lg text-gray-600">
          전국 시/군/구 복지정책 정보를 한 곳에서 확인하세요
        </p>
      </section>

      {/* 지역 검색 */}
      <section className="mb-10">
        <SearchBox />
      </section>

      {/* 8개 정책 카드 */}
      <section className="mb-10">
        <h2 className="mb-5 text-xl font-bold text-gray-800">정책별 보기</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {POLICIES.map((policy) => (
            <Link
              key={policy.id}
              href={`/policy/${policy.id}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{policy.icon}</span>
              <span className="text-sm font-semibold text-gray-800">{policy.name}</span>
              <span className="text-xs text-gray-500">{policy.description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 광역시도별 바로가기 */}
      <section>
        <h2 className="mb-5 text-xl font-bold text-gray-800">지역별 보기</h2>
        <div className="flex flex-wrap gap-2">
          {SIDO_LIST.map((sido) => (
            <Link
              key={sido}
              href={`/region/${encodeURIComponent(sido)}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
            >
              {sido}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
