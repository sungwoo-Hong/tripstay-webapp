import Link from 'next/link'
import { POLICIES, SIDO_LIST, SITE_NAME } from '@/lib/constants'
import { RECENT_CITIES } from '@/lib/dummy-content'
import SearchBox from '@/components/SearchBox'

export default function HomePage() {
  return (
    <div>
      {/* ── 히어로 섹션 ─────────────────────────────── */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-14 text-center">
        <h1 className="mb-3 text-4xl font-bold text-gray-900">{SITE_NAME}</h1>
        <p className="mb-8 text-lg text-gray-600">
          전국 250개 시/군/구 복지정책을 한 곳에서 확인하세요
        </p>
        <div className="mx-auto max-w-lg">
          <SearchBox />
        </div>
        <p className="mt-3 text-sm text-gray-400">
          예: 고양시, 강남구, 해운대구, 수원시 ...
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">

        {/* ── 8개 정책 카드 ────────────────────────────── */}
        <section className="mb-14">
          <h2 className="mb-2 text-xl font-bold text-gray-900">정책별 보기</h2>
          <p className="mb-6 text-sm text-gray-500">8개 핵심 복지정책을 지역별로 확인하세요</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {POLICIES.map((policy) => (
              <Link
                key={policy.id}
                href={`/policy/${policy.id}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
              >
                <span className="text-3xl">{policy.icon}</span>
                <span className="text-sm font-bold text-gray-900 group-hover:text-[#1f1bc4]">
                  {policy.name}
                </span>
                <span className="text-xs leading-snug text-gray-500">{policy.description}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 최근 등록 지역 ───────────────────────────── */}
        <section className="mb-14">
          <h2 className="mb-2 text-xl font-bold text-gray-900">최근 등록 지역</h2>
          <p className="mb-6 text-sm text-gray-500">새로 추가된 지역 복지정보입니다</p>
          <div className="divide-y rounded-2xl border border-gray-200 bg-white shadow-sm">
            {RECENT_CITIES.map((item) => (
              <Link
                key={`${item.sido}-${item.city_name}-${item.policy_id}`}
                href={`/${encodeURIComponent(item.sido)}/${encodeURIComponent(item.city_name)}/${item.policy_id}`}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-blue-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-lg">
                    {POLICIES.find((p) => p.id === item.policy_id)?.icon ?? '📋'}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.city_name} {item.policy_name}
                    </p>
                    <p className="text-xs text-gray-500">{item.sido}</p>
                  </div>
                </div>
                <span className="text-xs text-[#1f1bc4]">보기 →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 광역시도별 바로가기 ──────────────────────── */}
        <section>
          <h2 className="mb-2 text-xl font-bold text-gray-900">지역별 보기</h2>
          <p className="mb-6 text-sm text-gray-500">광역시도를 선택하면 시/군/구 목록이 나옵니다</p>
          <div className="flex flex-wrap gap-2">
            {SIDO_LIST.map((sido) => (
              <Link
                key={sido}
                href={`/region/${encodeURIComponent(sido)}`}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-[#1f1bc4] hover:bg-blue-50 hover:text-[#1f1bc4]"
              >
                {sido}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
