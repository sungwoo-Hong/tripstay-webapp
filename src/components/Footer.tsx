import Link from 'next/link'
import { SITE_NAME, POLICIES } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* 브랜드 */}
          <div className="col-span-2 sm:col-span-1">
            <p className="mb-2 text-base font-bold text-gray-900">{SITE_NAME}</p>
            <p className="text-xs leading-relaxed text-gray-500">
              전국 복지정책 정보를 한 곳에서 확인하세요.
              출산지원금부터 보육료까지 지역별 혜택을 쉽게 찾아드립니다.
            </p>
          </div>

          {/* 정책별 */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">정책별</p>
            <ul className="space-y-2">
              {POLICIES.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/policy/${p.id}`}
                    className="text-xs text-gray-600 hover:text-[#1f1bc4]"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 지역별 */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">지역별</p>
            <ul className="space-y-2">
              {['서울특별시', '경기도', '부산광역시', '인천광역시'].map((sido) => (
                <li key={sido}>
                  <Link
                    href={`/region/${encodeURIComponent(sido)}`}
                    className="text-xs text-gray-600 hover:text-[#1f1bc4]"
                  >
                    {sido}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 공식 사이트 */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">공식 사이트</p>
            <ul className="space-y-2">
              {[
                { label: '복지로', href: 'https://www.bokjiro.go.kr' },
                { label: '정부24', href: 'https://www.gov.kr' },
                { label: '아이사랑 보육포털', href: 'https://www.childcare.go.kr' },
                { label: '국민건강보험', href: 'https://www.nhis.or.kr' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-[#1f1bc4]"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-xs text-gray-400">
            본 사이트의 복지정책 정보는 참고용이며, 정확한 내용은 관할 기관에 문의하세요.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            © 2026 {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
