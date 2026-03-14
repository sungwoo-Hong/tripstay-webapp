'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

const SIDO_NAV = [
  { label: '서울', full: '서울특별시' },
  { label: '경기', full: '경기도' },
  { label: '인천', full: '인천광역시' },
  { label: '부산', full: '부산광역시' },
  { label: '대전', full: '대전광역시' },
  { label: '대구', full: '대구광역시' },
  { label: '울산', full: '울산광역시' },
  { label: '세종', full: '세종특별자치시' },
  { label: '광주', full: '광주광역시' },
  { label: '강원', full: '강원특별자치도' },
  { label: '충북', full: '충청북도' },
  { label: '충남', full: '충청남도' },
  { label: '경북', full: '경상북도' },
  { label: '경남', full: '경상남도' },
  { label: '전북', full: '전북특별자치도' },
  { label: '전남', full: '전라남도' },
  { label: '제주', full: '제주특별자치도' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="메뉴 열기"
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
      >
        <span className="text-xl">{open ? '✕' : '☰'}</span>
      </button>

      {open && (
        <div className="fixed inset-0 top-14 z-40 overflow-y-auto bg-white px-4 py-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">지역별</p>
          <div className="grid grid-cols-3 gap-2">
            {SIDO_NAV.map((item) => (
              <Link
                key={item.full}
                href={`/region/${item.full}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl border border-gray-100 px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
