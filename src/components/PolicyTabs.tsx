'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LOCAL_ONLY_POLICIES } from '@/lib/constants'

const NATIONAL_POLICY_CARDS = [
  { id: 'birth-support',       icon: '👶', name: '출산지원금',        amount: '지역마다 다름',   desc: '지자체별 출산 장려금 및 축하금' },
  { id: 'first-voucher',       icon: '🎁', name: '첫만남이용권',      amount: '200만원~300만원', desc: '출생아 대상 국민행복카드 바우처' },
  { id: 'parental-benefit',    icon: '💰', name: '부모급여',          amount: '월 최대 100만원', desc: '만 0~1세 아동 양육 가정 현금 지원' },
  { id: 'child-allowance',     icon: '🧒', name: '아동수당',          amount: '월 10만원',       desc: '만 8세 미만 모든 아동 지급' },
  { id: 'childcare-fee',       icon: '🏫', name: '보육료',            amount: '최대 월 54만원',  desc: '어린이집 이용 보육료 전액 지원' },
  { id: 'nurturing-allowance', icon: '🏠', name: '양육수당',          amount: '월 최대 20만원',  desc: '가정양육 시 현금 지원' },
  { id: 'postpartum-care',     icon: '🤱', name: '산모신생아건강관리', amount: '최대 200만원',    desc: '출산 후 건강관리사 가정 파견' },
  { id: 'pregnancy-fee',       icon: '🏥', name: '임신출산진료비',    amount: '100만원',         desc: '임신·출산 의료비 국민행복카드 지원' },
]

type Tab = 'local' | 'national'

export default function PolicyTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('local')

  const tabClass = (tab: Tab) =>
    `px-4 py-3 text-sm font-bold transition-colors ${
      activeTab === tab
        ? 'text-[#1f1bc4] border-b-2 border-[#1f1bc4]'
        : 'text-gray-500 hover:text-gray-700'
    }`

  return (
    <section className="mb-10">
      {/* 탭 헤더 */}
      <div className="mb-6 flex border-b border-gray-200">
        <button onClick={() => setActiveTab('local')} className={tabClass('local')}>
          지자체별 복지혜택
        </button>
        <button onClick={() => setActiveTab('national')} className={tabClass('national')}>
          전국 공통 복지혜택
        </button>
      </div>

      {/* 지자체별 */}
      {activeTab === 'local' && (
        <>
          <p className="mb-6 text-sm text-gray-500">지역마다 금액과 조건이 다른 복지혜택을 확인하세요</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {LOCAL_ONLY_POLICIES.map((policy) => (
              <Link
                key={policy.id}
                href={`/policy/${policy.id}`}
                className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
              >
                <span className="text-3xl">{policy.icon}</span>
                <p className="mt-3 text-sm font-bold text-gray-900 group-hover:text-[#1f1bc4]">
                  {policy.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">{policy.description}</p>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* 전국 공통 */}
      {activeTab === 'national' && (
        <>
          <p className="mb-6 text-sm text-gray-500">
            소득·지역 관계없이 모든 가정이 받을 수 있는 혜택입니다
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {NATIONAL_POLICY_CARDS.map((card) => (
              <Link
                key={card.id}
                href={`/policy/${card.id}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1f1bc4] hover:shadow-md"
              >
                <span className="text-3xl">{card.icon}</span>
                <span className="text-sm font-bold text-gray-900 group-hover:text-[#1f1bc4]">
                  {card.name}
                </span>
                <span className="text-xs font-semibold text-[#1f1bc4]">{card.amount}</span>
                <span className="text-xs leading-snug text-gray-500">{card.desc}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
