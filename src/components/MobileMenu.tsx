'use client'

import { useState } from 'react'
import Link from 'next/link'
import { POLICIES, SIDO_LIST, SITE_NAME } from '@/lib/constants'

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
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">정책별</p>
          <nav className="mb-8 grid grid-cols-2 gap-2">
            {POLICIES.map((p) => (
              <Link
                key={p.id}
                href={`/policy/${p.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700 hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </Link>
            ))}
          </nav>

          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">지역별</p>
          <div className="flex flex-wrap gap-2">
            {SIDO_LIST.map((sido) => (
              <Link
                key={sido}
                href={`/region/${encodeURIComponent(sido)}`}
                onClick={() => setOpen(false)}
                className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:text-[#1f1bc4]"
              >
                {sido}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
