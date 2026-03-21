import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '문의하기 | 복지다모아',
  description: '복지다모아 서비스 관련 문의는 이메일로 보내주세요.',
}

const CONTACT_EMAIL = 'hsw0614dmz@gmail.com'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">문의하기</h1>
      <p className="mb-8 text-sm text-gray-600">
        복지다모아 서비스 관련 문의는 아래 이메일로 보내주세요.
      </p>

      <div className="mb-10 rounded-xl border border-gray-200 bg-gray-50 px-6 py-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">이메일</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-lg font-medium text-[#1f1bc4] hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <h2 className="mb-4 text-base font-semibold text-gray-800">문의 유형 안내</h2>
      <ul className="space-y-4">
        <li className="rounded-xl border border-gray-100 px-5 py-4">
          <p className="mb-1 font-medium text-gray-800">데이터 오류 신고</p>
          <p className="text-sm text-gray-500">
            잘못된 복지정보(금액, 대상, 신청방법 등)를 발견하셨을 경우 알려주세요.
            확인 후 신속히 수정하겠습니다.
          </p>
        </li>
        <li className="rounded-xl border border-gray-100 px-5 py-4">
          <p className="mb-1 font-medium text-gray-800">서비스 개선 제안</p>
          <p className="text-sm text-gray-500">
            더 편리한 서비스를 위한 기능 제안이나 UI 개선 의견을 보내주세요.
          </p>
        </li>
        <li className="rounded-xl border border-gray-100 px-5 py-4">
          <p className="mb-1 font-medium text-gray-800">기타 문의</p>
          <p className="text-sm text-gray-500">
            위 항목에 해당하지 않는 문의도 이메일로 보내주시면 확인 후 답변드립니다.
          </p>
        </li>
      </ul>
    </div>
  )
}
