import Link from 'next/link'
import RegionSearchDropdown from '@/components/RegionSearchDropdown'

const POLICY_CARDS = [
  { id: 'birth-support',       icon: '👶', name: '출산지원금',        amount: '지역마다 다름',    desc: '지자체별 출산 장려금 및 축하금' },
  { id: 'first-voucher',       icon: '🎁', name: '첫만남이용권',      amount: '200만원~300만원',  desc: '출생아 대상 국민행복카드 바우처' },
  { id: 'parental-benefit',    icon: '💰', name: '부모급여',          amount: '월 최대 100만원',  desc: '만 0~1세 아동 양육 가정 현금 지원' },
  { id: 'child-allowance',     icon: '🧒', name: '아동수당',          amount: '월 10만원',        desc: '만 8세 미만 모든 아동 지급' },
  { id: 'childcare-fee',       icon: '🏫', name: '보육료',            amount: '최대 월 54만원',   desc: '어린이집 이용 보육료 전액 지원' },
  { id: 'nurturing-allowance', icon: '🏠', name: '양육수당',          amount: '월 최대 20만원',   desc: '가정양육 시 현금 지원' },
  { id: 'postpartum-care',     icon: '🤱', name: '산모신생아건강관리', amount: '최대 200만원',     desc: '출산 후 건강관리사 가정 파견' },
  { id: 'pregnancy-fee',       icon: '🏥', name: '임신출산진료비',    amount: '100만원',          desc: '임신·출산 의료비 국민행복카드 지원' },
]

export default function HomePage() {
  return (
    <div>
      {/* ── 히어로 섹션 ─────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#EEF0FF] to-white px-4 py-14 text-center">
        <h1 className="mb-3 text-4xl font-bold text-gray-900">
          우리 아이를 위한 복지혜택, 한눈에 확인하세요
        </h1>
        <p className="mb-8 text-lg text-gray-600">전국 250개 시/군/구 복지정책 정보</p>
        <div className="mx-auto max-w-2xl">
          <RegionSearchDropdown />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">

        {/* ── 전국 공통 혜택 카드 섹션 ─────────────────── */}
        <section>
          <h2 className="mb-2 text-xl font-bold text-gray-900">전국 공통 복지혜택</h2>
          <p className="mb-6 text-sm text-gray-500">
            소득·지역 관계없이 모든 가정이 받을 수 있는 혜택입니다
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {POLICY_CARDS.map((card) => (
              <Link
                key={card.id}
                href={`/policy/${card.id}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
              >
                <span className="text-3xl">{card.icon}</span>
                <span className="text-sm font-bold text-gray-900 group-hover:text-[#1f1bc4]">
                  {card.name}
                </span>
                <span className="text-xs font-semibold text-[#1f1bc4]">{card.amount}</span>
                <span className="text-xs leading-snug text-gray-500">{card.desc}</span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
