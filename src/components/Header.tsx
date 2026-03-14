import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'
import MobileMenu from '@/components/MobileMenu'

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

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-xl font-bold text-[#1f1bc4]">{SITE_NAME}</span>
          <span className="hidden rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-[#1f1bc4] sm:inline">
            복지정보
          </span>
        </Link>

        {/* PC 네비게이션 - 17개 시도 */}
        <nav className="hidden items-center gap-1.5 overflow-x-auto text-xs sm:flex">
          {SIDO_NAV.map((item) => (
            <Link
              key={item.full}
              href={`/region/${item.full}`}
              className="shrink-0 rounded px-1.5 py-1 text-gray-600 transition-colors hover:bg-blue-50 hover:text-[#1f1bc4]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 모바일 메뉴 */}
        <MobileMenu />
      </div>
    </header>
  )
}
