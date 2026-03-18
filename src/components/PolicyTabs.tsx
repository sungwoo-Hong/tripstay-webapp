'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { REGION_DATA } from '@/lib/constants'

const THEME_CARDS = [
  { theme: '서민금융',  icon: '💰' },
  { theme: '임신·출산', icon: '🤱' },
  { theme: '입양·위탁', icon: '👨‍👩‍👧' },
  { theme: '교육',     icon: '📚' },
  { theme: '일자리',   icon: '💼' },
  { theme: '안전·위기', icon: '🛡️' },
  { theme: '신체건강', icon: '🏥' },
  { theme: '보호·돌봄', icon: '🤝' },
  { theme: '주거',     icon: '🏠' },
  { theme: '생활지원', icon: '✨' },
] as const

const SIDO_LIST = Object.keys(REGION_DATA)

type Step = 'theme' | 'sido' | 'city'

export default function PolicyTabs() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('theme')
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedSido, setSelectedSido] = useState<string | null>(null)

  function handleThemeClick(theme: string) {
    setSelectedTheme(theme)
    setStep('sido')
  }

  function handleSidoClick(sido: string) {
    setSelectedSido(sido)
    setStep('city')
  }

  function handleCityClick(city: string) {
    if (!selectedSido) return
    const themeParam = selectedTheme && selectedTheme !== '전체' ? `?theme=${encodeURIComponent(selectedTheme)}` : ''
    router.push(`/${encodeURIComponent(selectedSido)}/${encodeURIComponent(city)}${themeParam}`)
  }

  function goBack() {
    if (step === 'city') setStep('sido')
    else if (step === 'sido') setStep('theme')
  }

  const cities = selectedSido ? (REGION_DATA[selectedSido] ?? []) : []

  return (
    <section className="mb-10">
      {/* 뒤로가기 버튼 */}
      {step !== 'theme' && (
        <button
          onClick={goBack}
          className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <span>←</span>
          <span>{step === 'sido' ? '혜택 분류' : selectedSido}</span>
        </button>
      )}

      {/* Step 1: 테마 카드 */}
      {step === 'theme' && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-5 lg:grid-cols-5">
          {THEME_CARDS.map(({ theme, icon }) => (
            <button
              key={theme}
              onClick={() => handleThemeClick(theme)}
              className="group flex cursor-pointer flex-col items-center rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md sm:p-5"
            >
              <span className="text-2xl sm:text-3xl">{icon}</span>
              <p className="mt-2 text-xs font-bold text-gray-900 group-hover:text-[#1f1bc4] sm:mt-3 sm:text-sm">
                {theme}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: 시도 목록 */}
      {step === 'sido' && (
        <>
          <p className="mb-3 text-sm font-semibold text-gray-700">
            <span className="text-[#1f1bc4]">{selectedTheme}</span> · 지역을 선택하세요
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {SIDO_LIST.map((sido) => (
              <button
                key={sido}
                onClick={() => handleSidoClick(sido)}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:text-[#1f1bc4] hover:shadow-md"
              >
                {sido.replace('특별자치시', '').replace('특별자치도', '').replace('특별시', '').replace('광역시', '').replace('광역자치도', '')}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Step 3: 시군구 목록 */}
      {step === 'city' && (
        <>
          <p className="mb-3 text-sm font-semibold text-gray-700">
            <span className="text-[#1f1bc4]">{selectedSido}</span> · 시/군/구를 선택하세요
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCityClick(city)}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:text-[#1f1bc4] hover:shadow-md"
              >
                {city}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
