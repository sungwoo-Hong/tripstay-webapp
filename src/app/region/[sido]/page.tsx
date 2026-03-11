import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SIDO_LIST, POLICIES } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

interface PageProps {
  params: Promise<{ sido: string }>
}

export async function generateStaticParams() {
  return SIDO_LIST.map((sido) => ({ sido: encodeURIComponent(sido) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sido } = await params
  const sidoDecoded = decodeURIComponent(sido)

  return {
    title: `${sidoDecoded} 복지정책 정보`,
    description: `${sidoDecoded} 시/군/구별 출산지원금, 아동수당, 보육료 등 복지정책 정보를 확인하세요.`,
  }
}

export default async function RegionPage({ params }: PageProps) {
  const { sido } = await params
  const sidoDecoded = decodeURIComponent(sido)

  if (!SIDO_LIST.includes(sidoDecoded)) notFound()

  // Phase 1: 더미 시군구 목록
  // Phase 4에서 getBenefitsBySido(sidoDecoded)로 교체
  const dummyCities = ['고양시', '수원시', '성남시', '부천시', '안양시']

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-2">지역별 보기</Badge>
        <h1 className="text-2xl font-bold text-gray-900">{sidoDecoded} 복지정책</h1>
        <p className="mt-1 text-gray-500">시/군/구를 선택하고 정책별 상세 정보를 확인하세요.</p>
      </div>

      <div className="space-y-8">
        {dummyCities.map((city) => (
          <div key={city}>
            <h2 className="mb-3 border-b pb-2 text-lg font-bold text-gray-800">{city}</h2>
            <div className="flex flex-wrap gap-2">
              {POLICIES.map((policy) => (
                <Link
                  key={policy.id}
                  href={`/${encodeURIComponent(sidoDecoded)}/${encodeURIComponent(city)}/${policy.id}`}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
                >
                  {policy.icon} {policy.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-gray-400">
        Phase 4에서 실제 시/군/구 데이터가 표시됩니다.
      </p>
    </div>
  )
}
