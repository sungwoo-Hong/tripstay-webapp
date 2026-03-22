import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* 브랜드 */}
        <div className="mb-10">
          <p className="text-lg font-bold text-white">{SITE_NAME}</p>
          <p className="mt-1 text-sm text-gray-400">전국 복지서비스 정보 플랫폼</p>
        </div>

        {/* 2열 링크 그리드 */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* 이용방법 */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">이용방법</p>
            <ol className="space-y-2 list-none">
              <li className="text-sm text-gray-400">1. 시/도와 시/군/구를 선택하세요</li>
              <li className="text-sm text-gray-400">2. 원하는 복지혜택을 확인하세요</li>
              <li className="text-sm text-gray-400">3. 공식 사이트에서 신청하세요</li>
            </ol>
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
