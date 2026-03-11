import type { NationalBenefit } from '@/types'

interface NationalBenefitsTableProps {
  benefits: NationalBenefit[]
}

export default function NationalBenefitsTable({ benefits }: NationalBenefitsTableProps) {
  if (benefits.length === 0) return null

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-blue-100 shadow-sm">
      <div className="bg-[#1f1bc4] px-4 py-3">
        <h2 className="text-sm font-bold text-white">🇰🇷 전국 공통 혜택</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">혜택명</th>
              <th className="px-4 py-3 text-left font-semibold">지원금액</th>
              <th className="px-4 py-3 text-left font-semibold">내용</th>
              <th className="px-4 py-3 text-left font-semibold">신청</th>
            </tr>
          </thead>
          <tbody>
            {benefits.map((benefit, idx) => (
              <tr key={benefit.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-gray-900">{benefit.name}</td>
                <td className="px-4 py-3 font-semibold text-[#1f1bc4]">{benefit.amount}</td>
                <td className="px-4 py-3 text-gray-600">{benefit.description}</td>
                <td className="px-4 py-3">
                  <a
                    href={benefit.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#1f1bc4] underline hover:no-underline"
                  >
                    신청하기
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
