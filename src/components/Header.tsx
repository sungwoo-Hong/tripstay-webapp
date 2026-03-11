import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-[#1f1bc4]">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-[#1f1bc4]">
            홈
          </Link>
          <Link href="/region/경기도" className="text-gray-600 hover:text-[#1f1bc4]">
            지역별
          </Link>
          <Link href="/policy/birth-support" className="text-gray-600 hover:text-[#1f1bc4]">
            정책별
          </Link>
        </nav>
      </div>
    </header>
  )
}
