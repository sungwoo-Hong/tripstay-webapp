import RegionSearchDropdown from '@/components/RegionSearchDropdown'
import AdBanner from '@/components/AdBanner'
import PolicyTabs from '@/components/PolicyTabs'

export default function HomePage() {
  return (
    <div>
      {/* ── 히어로 섹션 ─────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#EEF0FF] to-white px-4 py-14 text-center">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">
          우리 아이 복지혜택 한눈에 확인
        </h1>
        <div className="mx-auto max-w-2xl">
          <RegionSearchDropdown />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <PolicyTabs />
        <AdBanner className="hidden sm:block mt-6" />
      </div>
    </div>
  )
}
