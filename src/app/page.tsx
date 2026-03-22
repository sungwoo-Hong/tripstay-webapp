import Link from 'next/link'
import RegionSearchDropdown from '@/components/RegionSearchDropdown'
import AdBanner from '@/components/AdBanner'
import PolicyTabs from '@/components/PolicyTabs'
import { POLICIES } from '@/lib/constants'

export default function HomePage() {
  return (
    <div>
      {/* ── 히어로 섹션 ─────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#EEF0FF] to-white px-4 py-14 text-center">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">
          우리 지역 복지서비스 한눈에 확인
        </h1>
        <div className="mx-auto max-w-2xl">
          <RegionSearchDropdown />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* ── 출산 관련 지원금 ── */}
        <section className="mb-10">
          <h2 className="mb-1 text-lg font-bold text-gray-900">출산 관련 지원 내용입니다</h2>
          <p className="mb-4 text-sm text-gray-500">전국 공통 및 지역별 출산·보육 혜택을 확인하세요</p>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-5 lg:grid-cols-7">
            {POLICIES.map((policy) => (
              <Link
                key={policy.id}
                href={`/policy/${policy.id}`}
                className="relative group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-2 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md sm:p-5"
              >
                {policy.id === 'birth-support' && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    인기
                  </span>
                )}
                <span className="text-2xl sm:text-3xl">{policy.icon}</span>
                <p className="mt-1 text-[10px] font-bold text-gray-900 group-hover:text-[#1f1bc4] sm:mt-3 sm:text-sm">
                  {policy.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 혜택 분류 탐색 ── */}
        <PolicyTabs />

        <AdBanner className="hidden sm:block mt-6" />
      </div>
    </div>
  )
}
