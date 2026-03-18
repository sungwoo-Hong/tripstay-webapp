'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { REGION_DATA } from '@/lib/constants'

const SIDO_LIST = Object.keys(REGION_DATA)

interface RegionSearchDropdownProps {
  targetPolicy?: string
}

export default function RegionSearchDropdown({ targetPolicy }: RegionSearchDropdownProps = {}) {
  const [sido, setSido] = useState('')
  const [city, setCity] = useState('')
  const router = useRouter()

  const cities = sido ? (REGION_DATA[sido] ?? []) : []

  function handleSidoChange(value: string) {
    setSido(value)
    setCity('')
  }

  function handleSearch() {
    if (!sido || !city) return
    if (targetPolicy) {
      router.push(`/${encodeURIComponent(sido)}/${encodeURIComponent(city)}/${targetPolicy}`)
    } else {
      router.push(`/${encodeURIComponent(sido)}/${encodeURIComponent(city)}`)
    }
  }

  const selectClass =
    'min-w-0 flex-1 rounded-lg border border-[#1f1bc4] bg-white px-2 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#1f1bc4] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200'

  return (
    <div className="flex flex-nowrap gap-1.5">
      {/* 시도 드롭다운 */}
      <select
        value={sido}
        onChange={(e) => handleSidoChange(e.target.value)}
        className={selectClass}
      >
        <option value="">시/도</option>
        {SIDO_LIST.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* 시/군/구 드롭다운 */}
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={!sido}
        className={selectClass}
      >
        <option value="">시/군/구</option>
        {cities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* 검색 버튼 */}
      <button
        onClick={handleSearch}
        disabled={!city}
        className="shrink-0 cursor-pointer rounded-lg bg-[#1f1bc4] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1a17a0] disabled:cursor-not-allowed disabled:opacity-70 whitespace-nowrap"
      >
        찾기
      </button>
    </div>
  )
}
