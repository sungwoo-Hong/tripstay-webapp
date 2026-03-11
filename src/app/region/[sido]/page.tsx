import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SIDO_LIST, POLICIES } from '@/lib/constants'
import Breadcrumb from '@/components/Breadcrumb'
import AdBanner from '@/components/AdBanner'

interface PageProps {
  params: Promise<{ sido: string }>
}

// 시도별 더미 시/군/구 목록 — Phase 4에서 Supabase로 교체
const DUMMY_CITIES_BY_SIDO: Record<string, string[]> = {
  '서울특별시':   ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '노원구', '도봉구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구'],
  '경기도':       ['고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안양시', '양주시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '하남시', '화성시'],
  '부산광역시':   ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '수영구', '연제구', '영도구', '해운대구'],
  '대구광역시':   ['달서구', '달성군', '동구', '북구', '서구', '수성구', '중구', '남구'],
  '인천광역시':   ['계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '중구'],
  '광주광역시':   ['광산구', '남구', '동구', '북구', '서구'],
  '대전광역시':   ['대덕구', '동구', '서구', '유성구', '중구'],
  '울산광역시':   ['남구', '동구', '북구', '울주군', '중구'],
  '세종특별자치시': ['세종시'],
  '강원특별자치도': ['강릉시', '동해시', '삼척시', '속초시', '원주시', '춘천시', '태백시', '횡성군'],
  '충청북도':     ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '청주시', '충주시'],
  '충청남도':     ['공주시', '당진시', '논산시', '보령시', '서산시', '아산시', '천안시', '홍성군'],
  '전북특별자치도': ['고창군', '군산시', '김제시', '남원시', '완주군', '익산시', '전주시', '정읍시'],
  '전라남도':     ['광양시', '나주시', '목포시', '순천시', '여수시', '해남군'],
  '경상북도':     ['경산시', '경주시', '구미시', '김천시', '안동시', '영주시', '포항시'],
  '경상남도':     ['거제시', '김해시', '밀양시', '사천시', '양산시', '진주시', '창원시', '통영시'],
  '제주특별자치도': ['서귀포시', '제주시'],
}

export async function generateStaticParams() {
  return SIDO_LIST.map((sido) => ({ sido: encodeURIComponent(sido) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sido } = await params
  const sidoDecoded = decodeURIComponent(sido)
  return {
    title: `${sidoDecoded} 복지정책 정보`,
    description: `${sidoDecoded} 시/군/구별 출산지원금·아동수당·보육료 등 8개 복지정책 정보를 확인하세요.`,
  }
}

export default async function RegionPage({ params }: PageProps) {
  const { sido } = await params
  const sidoDecoded = decodeURIComponent(sido)

  if (!SIDO_LIST.includes(sidoDecoded)) notFound()

  const cities = DUMMY_CITIES_BY_SIDO[sidoDecoded] ?? ['해당 지역 데이터 준비 중']

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* 브레드크럼 */}
      <Breadcrumb items={[{ label: '홈', href: '/' }, { label: sidoDecoded }]} />

      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          {sidoDecoded} 복지정책
        </h1>
        <p className="text-gray-500">
          시/군/구를 선택해 정책별 지원금액과 신청방법을 확인하세요.
        </p>
      </div>

      {/* 광고 */}
      <AdBanner className="mb-8" />

      {/* 정책 카드 빠른 이동 */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-bold text-gray-600">정책별 빠른 이동</h2>
        <div className="flex flex-wrap gap-2">
          {POLICIES.map((policy) => (
            <Link
              key={policy.id}
              href={`/policy/${policy.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 transition-colors hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
            >
              {policy.icon} {policy.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 시/군/구별 목록 */}
      <section>
        <h2 className="mb-5 text-lg font-bold text-gray-800">
          {sidoDecoded} 시/군/구 목록
          <span className="ml-2 text-sm font-normal text-gray-400">({cities.length}개)</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cities.map((city) => (
            <div
              key={city}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              {/* 도시명 + 전체 보기 */}
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">{city}</h3>
                <span className="text-xs text-gray-400">{sidoDecoded}</span>
              </div>

              {/* 8개 정책 링크 */}
              <div className="flex flex-wrap gap-1.5">
                {POLICIES.map((policy) => (
                  <Link
                    key={policy.id}
                    href={`/${encodeURIComponent(sidoDecoded)}/${encodeURIComponent(city)}/${policy.id}`}
                    className="inline-flex items-center gap-0.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:border-[#1f1bc4] hover:bg-blue-50 hover:text-[#1f1bc4]"
                  >
                    {policy.icon} {policy.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 다른 지역 바로가기 */}
      <section className="mt-12">
        <h2 className="mb-4 text-sm font-bold text-gray-600">다른 지역 보기</h2>
        <div className="flex flex-wrap gap-2">
          {SIDO_LIST.filter((s) => s !== sidoDecoded).map((s) => (
            <Link
              key={s}
              href={`/region/${encodeURIComponent(s)}`}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 transition-colors hover:border-[#1f1bc4] hover:text-[#1f1bc4]"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
