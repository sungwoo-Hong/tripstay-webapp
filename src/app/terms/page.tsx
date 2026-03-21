import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: '이용약관',
  description: `${SITE_NAME} 서비스 이용약관 안내입니다.`,
  alternates: { canonical: `${SITE_URL}/terms` },
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">이용약관</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">제1조 서비스 개요</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          {SITE_NAME}(이하 &quot;서비스&quot;)는 전국 시·군·구의 복지정책 정보를 수집·정리하여
          이용자에게 무료로 제공하는 정보 안내 플랫폼입니다. 본 서비스는 정부·지자체의
          공개 정보를 기반으로 하며, 별도의 회원가입 없이 누구나 이용할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">제2조 정보 제공 목적 및 책임 한계</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
          <li>
            본 서비스에서 제공하는 복지정책 정보는 <strong>참고용</strong>이며, 실제
            수혜 여부 및 지원 금액은 해당 지자체 또는 관할 기관의 안내를 따릅니다.
          </li>
          <li>
            정책 내용은 지자체의 예산·방침 변경에 따라 수시로 변경될 수 있으며,
            {SITE_NAME}은 정보의 최신성·정확성을 보장하지 않습니다.
          </li>
          <li>
            본 서비스는 정보 제공 이외의 신청 대리, 법률 자문, 금융 상담 등의 업무를
            수행하지 않습니다.
          </li>
          <li>
            서비스 이용 중 발생하는 오류, 중단, 정보 부정확으로 인한 손해에 대해
            {SITE_NAME}은 법령이 허용하는 범위 내에서 책임을 지지 않습니다.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">제3조 저작권 안내</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
          <li>
            {SITE_NAME}이 자체 제작한 콘텐츠(디자인, 구성, 설명 텍스트 등)의 저작권은
            {SITE_NAME}에 귀속됩니다.
          </li>
          <li>
            정부·지자체 공개 정보를 인용한 부분은 공공저작물 자유이용허락 기준을
            준수합니다.
          </li>
          <li>
            서비스 내 콘텐츠를 무단으로 복제·배포·상업적으로 이용하는 행위는
            금지됩니다.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">제4조 약관 변경</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          본 약관은 서비스 정책 변경에 따라 사전 공지 없이 수정될 수 있습니다.
          변경된 약관은 서비스 내 공지 시점부터 효력이 발생합니다.
        </p>
      </section>

      <p className="text-xs text-gray-400">시행일: 2026년 1월 1일</p>
    </div>
  )
}
