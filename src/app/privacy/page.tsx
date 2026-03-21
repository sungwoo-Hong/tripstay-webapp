import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: `${SITE_NAME} 개인정보처리방침 안내입니다.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">개인정보처리방침</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">제1조 수집하는 개인정보 항목</h2>
        <p className="mb-3 text-sm leading-relaxed text-gray-600">
          {SITE_NAME}은 회원가입을 운영하지 않으며, 이용자가 직접 입력하는 개인정보를
          수집하지 않습니다. 다만, 서비스 운영을 위해 아래와 같이 자동 수집 정보가
          발생할 수 있습니다.
        </p>
        <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
          <li>
            <strong>Google Analytics:</strong> 접속 IP, 브라우저 종류, 방문 페이지,
            체류 시간 등 익명화된 이용 통계 (쿠키 사용)
          </li>
          <li>
            <strong>Google AdSense:</strong> 광고 노출·클릭 데이터, 관심 기반 광고를
            위한 쿠키 (DoubleClick 쿠키 포함)
          </li>
          <li>
            <strong>서버 로그:</strong> 접속 일시, 요청 URL, 응답 코드 (자동 기록,
            일정 기간 후 자동 삭제)
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">제2조 개인정보 처리 목적</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
          <li>서비스 이용 현황 파악 및 품질 개선 (Google Analytics)</li>
          <li>맞춤형 광고 제공 (Google AdSense)</li>
          <li>서비스 보안 및 장애 대응 (서버 로그)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">제3조 보유 기간</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
          <li>Google Analytics 데이터: Google 정책에 따름 (기본 26개월)</li>
          <li>AdSense 쿠키: 쿠키 만료 시점까지 (최대 13개월)</li>
          <li>서버 로그: 최대 90일</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">제4조 Google AdSense 관련 안내</h2>
        <p className="mb-3 text-sm leading-relaxed text-gray-600">
          본 서비스는 Google AdSense를 통해 광고를 게재합니다. Google은 쿠키를 사용하여
          이용자의 이전 방문 기록을 기반으로 관심 기반 광고를 표시할 수 있습니다.
        </p>
        <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
          <li>
            Google의 광고 쿠키 사용을 원하지 않으실 경우{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Google 광고 설정
            </a>
            에서 직접 비활성화할 수 있습니다.
          </li>
          <li>
            Google의 개인정보 처리방침은{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Google 개인정보처리방침
            </a>
            에서 확인하실 수 있습니다.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">제5조 개인정보 보호 책임자</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          개인정보 관련 문의는{' '}
          <a
            href="mailto:hsw0614dmz@gmail.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            hsw0614dmz@gmail.com
          </a>
          로 연락해 주세요.
        </p>
      </section>

      <p className="text-xs text-gray-400">시행일: 2026년 1월 1일</p>
    </div>
  )
}
