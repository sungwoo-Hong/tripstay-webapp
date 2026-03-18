'use client'

import { useState } from 'react'

const THEME_CARDS = [
  { theme: '서민금융',  icon: '💰', description: '저소득층 금융 지원, 서민 대출 이자 지원' },
  { theme: '임신·출산', icon: '🤱', description: '임산부 건강 지원, 출산 장려금, 산후 케어' },
  { theme: '입양·위탁', icon: '👨‍👩‍👧', description: '입양·위탁 가정을 위한 지원 서비스' },
  { theme: '교육',     icon: '📚', description: '교육비 지원, 학습 바우처, 장학금' },
  { theme: '일자리',   icon: '💼', description: '취업 지원, 직업 훈련, 고용 연계' },
  { theme: '안전·위기', icon: '🛡️', description: '위기 가정 안전망, 긴급 복지 지원' },
  { theme: '신체건강', icon: '🏥', description: '의료비 지원, 건강 검진, 재활 서비스' },
  { theme: '보호·돌봄', icon: '🤝', description: '노인·장애인 돌봄, 아동 보호 서비스' },
  { theme: '주거',     icon: '🏠', description: '주거 지원, 임대, 전세 대출 지원' },
  { theme: '생활지원', icon: '✨', description: '생활비 지원, 식품, 에너지 지원' },
] as const

export default function PolicyTabs() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section className="mb-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {THEME_CARDS.map(({ theme, icon, description }) => (
          <button
            key={theme}
            onClick={() => setActive(active === theme ? null : theme)}
            className={`group flex flex-col items-center rounded-xl border p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
              active === theme
                ? 'border-[#1f1bc4] bg-blue-50'
                : 'border-gray-200 bg-white hover:border-[#1f1bc4]'
            }`}
          >
            <span className="text-3xl">{icon}</span>
            <p className={`mt-3 text-sm font-bold ${active === theme ? 'text-[#1f1bc4]' : 'text-gray-900 group-hover:text-[#1f1bc4]'}`}>
              {theme}
            </p>
            <p className="mt-1 text-xs leading-snug text-gray-500">{description}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
