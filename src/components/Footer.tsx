import { SITE_NAME } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500">
        <p className="font-semibold text-gray-700">{SITE_NAME}</p>
        <p className="mt-1">전국 복지정책 정보를 한 곳에서 확인하세요.</p>
        <p className="mt-2 text-xs">
          본 사이트의 복지정책 정보는 참고용이며, 정확한 내용은 관할 기관에 문의하세요.
        </p>
      </div>
    </footer>
  )
}
