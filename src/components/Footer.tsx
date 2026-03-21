import Link from 'next/link'
import { SITE_NAME, POLICIES, SIDO_LIST } from '@/lib/constants'

function shortSido(sido: string): string {
  return sido.replace(/(특별자치시|특별자치도|광역시|특별시|도|시)$/, '')
}

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* 브랜드 */}
        <div className="mb-10">
          <p className="text-lg font-bold text-white">{SITE_NAME}</p>
          <p className="mt-1 text-sm text-gray-400">전국 복지서비스 정보 플랫폼</p>
        </div>

        {/* 3열 링크 그리드 */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* 출산·육아 정책 */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">출산·육아 정책</p>
            <ul className="space-y-2">
              {POLICIES.map((policy) => (
                <li key={policy.id}>
                  <Link
                    href={`/policy/${policy.id}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {policy.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 지역별 정보 */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">지역별 정보</p>
            <ul className="space-y-2">
              {SIDO_LIST.map((sido) => (
                <li key={sido}>
                  <Link
                    href={`/region/${encodeURIComponent(sido)}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {shortSido(sido)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 이용 안내 */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">이용 안내</p>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 구분선 */}
        <div className="mt-12 border-t border-gray-800 pt-6">
          <p className="mb-2 text-xs text-gray-500">
            본 사이트의 복지정보는 참고용이며, 정확한 내용은 관할 기관에 문의하세요.
          </p>
          <p className="text-xs text-gray-600">© 2026 {SITE_NAME}</p>
        </div>
      </div>
    </footer>
  )
}
