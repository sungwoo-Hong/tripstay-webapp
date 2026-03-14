import { SITE_NAME } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10 text-center">
        <p className="mb-2 text-base font-bold text-gray-900">{SITE_NAME}</p>
        <p className="mb-6 text-xs leading-relaxed text-gray-500">
          전국 250개 시/군/구 출산·육아 복지정책을 한 곳에서 확인하세요.
        </p>

        <div className="mb-6">
          <p className="mb-3 text-xs font-bold text-gray-400">이용방법</p>
          <ol className="space-y-1 text-xs text-gray-500">
            <li>시/도와 시/군/구를 선택하세요</li>
            <li>출산지원금 정보를 확인하세요</li>
            <li>공식 사이트에서 신청하세요</li>
          </ol>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-400">
            본 사이트의 복지정책 정보는 참고용이며,<br />
            정확한 내용은 관할 기관에 문의하세요.
          </p>
          <p className="mt-2 text-xs text-gray-400">© 2026 {SITE_NAME}</p>
        </div>
      </div>
    </footer>
  )
}
