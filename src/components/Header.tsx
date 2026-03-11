import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'
import MobileMenu from '@/components/MobileMenu'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#1f1bc4]">{SITE_NAME}</span>
          <span className="hidden rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-[#1f1bc4] sm:inline">
            복지정보
          </span>
        </Link>

        {/* PC 네비게이션 */}
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          <Link href="/policy/birth-support" className="text-gray-600 transition-colors hover:text-[#1f1bc4]">
            출산지원금
          </Link>
          <Link href="/policy/parental-benefit" className="text-gray-600 transition-colors hover:text-[#1f1bc4]">
            부모급여
          </Link>
          <Link href="/policy/child-allowance" className="text-gray-600 transition-colors hover:text-[#1f1bc4]">
            아동수당
          </Link>
          <Link href="/region/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C" className="text-gray-600 transition-colors hover:text-[#1f1bc4]">
            서울
          </Link>
          <Link href="/region/%EA%B2%BD%EA%B8%B0%EB%8F%84" className="text-gray-600 transition-colors hover:text-[#1f1bc4]">
            경기
          </Link>
        </nav>

        {/* 모바일 메뉴 */}
        <MobileMenu />
      </div>
    </header>
  )
}
