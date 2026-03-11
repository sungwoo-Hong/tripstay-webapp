import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <h2 className="mb-3 text-2xl font-bold text-gray-800">페이지를 찾을 수 없습니다</h2>
      <p className="mb-8 text-gray-500">
        해당 지역 또는 정책 정보가 아직 등록되지 않았습니다.
      </p>
      <Link
        href="/"
        className="rounded-xl px-6 py-3 text-white"
        style={{ backgroundColor: '#1f1bc4' }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
