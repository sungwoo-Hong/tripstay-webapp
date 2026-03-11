/**
 * Phase 3 더미 콘텐츠
 * Phase 4에서 Supabase의 실제 Gemini 생성 콘텐츠로 교체됩니다.
 */

type PolicyContent = {
  intro: (city: string, sido: string) => string
  localSection: (city: string, sido: string) => string
  applySteps: string
  eligibility: string
  documents: string
  faq: Array<{ q: string; a: string }>
  conclusion: (city: string) => string
}

const POLICY_CONTENT: Record<string, PolicyContent> = {
  'birth-support': {
    intro: (city, sido) => `
      <h2>${city} 출산지원금 핵심 요약</h2>
      <p>
        ${sido} ${city}에서 아이를 낳으면 전국 공통 출산지원금 외에 지역 자체 지원금까지 받을 수 있습니다.
        2026년 기준으로 첫만남이용권 200만원, 부모급여 월 최대 100만원 등 출생아 1인당
        <strong>연간 총 1,500만원 이상</strong>의 혜택이 제공됩니다.
      </p>
      <p>위 표에 정리된 전국 공통 혜택에 더해 ${city}만의 추가 지원금을 놓치지 마세요.</p>`,

    localSection: (city, sido) => `
      <h2>${city} 지역 추가 출산지원금</h2>
      <p>
        ${sido} ${city}는 출산 장려를 위해 자체 예산으로 추가 지원금을 운영합니다.
        지원 금액과 대상은 해마다 조례 개정에 따라 달라질 수 있으므로,
        <strong>${city} 주민센터(☎ 지역번호+120)</strong> 또는 시/구청 복지과에서 최신 정보를 확인하세요.
      </p>
      <table>
        <thead>
          <tr>
            <th>구분</th>
            <th>지원금액</th>
            <th>지급 방식</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>첫째 아이</td>
            <td>시청 확인 필요</td>
            <td>현금 또는 바우처</td>
            <td>거주 기간 조건 있을 수 있음</td>
          </tr>
          <tr>
            <td>둘째 아이</td>
            <td>첫째보다 상향 지급</td>
            <td>현금 또는 바우처</td>
            <td>일부 지역 차등 지급</td>
          </tr>
          <tr>
            <td>셋째 이상</td>
            <td>최대 혜택</td>
            <td>현금 일시 지급</td>
            <td>다자녀 특별 혜택 별도 확인</td>
          </tr>
        </tbody>
      </table>
      <p>
        💡 <strong>TIP</strong>: 출산지원금은 대부분 출생신고 후 60일 이내에 신청해야 합니다.
        기간이 지나면 소급 적용이 불가하므로 반드시 기한 내에 신청하세요.
      </p>`,

    applySteps: `
      <h2>출산지원금 신청 방법</h2>
      <h3>온라인 신청 (권장)</h3>
      <ol>
        <li><strong>복지로(www.bokjiro.go.kr)</strong> 접속 → 로그인</li>
        <li>「서비스 신청」 → 「복지급여 신청」 선택</li>
        <li>「임신·출산」 카테고리에서 해당 급여 선택</li>
        <li>신청서 작성 및 서류 첨부 후 제출</li>
        <li>처리 결과는 문자 또는 복지로 마이페이지에서 확인</li>
      </ol>
      <h3>방문 신청</h3>
      <ol>
        <li>주민등록상 주소지 관할 <strong>주민센터(행정복지센터)</strong> 방문</li>
        <li>「임신·출산·육아 통합 신청서(행복출산)」 작성</li>
        <li>구비 서류 제출 및 접수 확인증 수령</li>
        <li>담당자 검토 후 지급 결정 통보 (보통 7~14일 소요)</li>
      </ol>
      <h3>정부24 원스톱 서비스</h3>
      <p>
        <a href="https://www.gov.kr" target="_blank" rel="noopener noreferrer">정부24</a>에서는
        출생신고와 동시에 아동수당·첫만남이용권·부모급여를 한 번에 신청할 수 있는
        <strong>행복출산 원스톱 서비스</strong>를 제공합니다.
      </p>`,

    eligibility: `
      <h2>지원 대상 및 자격 요건</h2>
      <ul>
        <li><strong>거주 요건</strong>: 신청일 기준 해당 지역 주민등록 등재 (지역별 거주 기간 조건 상이)</li>
        <li><strong>출생일 기준</strong>: 지원 시행일 이후 출생한 아동 (소급 적용 불가)</li>
        <li><strong>소득 기준</strong>: 전국 공통 급여(첫만남이용권·부모급여·아동수당)는 소득 무관 지급</li>
        <li><strong>지역 추가 지원</strong>: 일부 시·군·구는 소득 기준 또는 거주 기간 조건 적용</li>
      </ul>
      <p>❗ 동일 급여를 중복 수급할 수 없으며, 부정 수급 시 전액 환수될 수 있습니다.</p>`,

    documents: `
      <h2>신청 시 필요 서류</h2>
      <ul>
        <li>신분증 (신청인 본인)</li>
        <li>가족관계증명서 (출생신고 완료 후)</li>
        <li>주민등록등본 (주소지 확인용)</li>
        <li>건강보험료 납부 확인서 (소득 기준 적용 급여의 경우)</li>
        <li>통장 사본 (현금 지급의 경우)</li>
        <li>국민행복카드 (바우처 수령의 경우, 없으면 신청 시 발급)</li>
      </ul>`,

    faq: [
      {
        q: '출산지원금은 출생신고 전에도 신청할 수 있나요?',
        a: '아니요. 대부분의 출산지원금은 출생신고 완료 후 신청 가능합니다. 출생신고는 출산 후 1개월 이내에 해야 하며, 신고 후 즉시 지원금 신청을 진행하세요.',
      },
      {
        q: '쌍둥이를 출산했는데 두 명분 모두 받을 수 있나요?',
        a: '네. 첫만남이용권은 다태아의 경우 출생아 1인당 300만원씩 지급됩니다. 부모급여·아동수당도 자녀 수만큼 각각 지급됩니다. 지역 추가 지원금도 대부분 출생아 수에 비례합니다.',
      },
      {
        q: '임신 중에 다른 지역으로 이사했는데 어떻게 되나요?',
        a: '출산지원금은 출생신고 시점 또는 신청 시점의 주민등록 주소지 기준으로 지급됩니다. 일부 지역은 일정 기간 거주를 요건으로 하므로, 이사 전·후 해당 시·군·구에 직접 확인하는 것이 좋습니다.',
      },
      {
        q: '직장인도 출산지원금을 신청할 수 있나요?',
        a: '네. 출산지원금(첫만남이용권·부모급여·아동수당)은 소득 및 취업 여부와 무관하게 지급됩니다. 회사의 출산장려금과 중복으로 수령할 수 있습니다.',
      },
      {
        q: '첫만남이용권 바우처는 어디서 사용할 수 있나요?',
        a: '국민행복카드로 충전된 바우처는 산후조리원, 유아용품점, 의료기관, 약국 등 국민행복카드 가맹점에서 사용 가능합니다. 출생일로부터 1년 이내에 사용해야 하며, 기간 내 미사용 잔액은 소멸됩니다.',
      },
    ],

    conclusion: (city) => `
      <h2>정리: ${city} 출산지원금 신청 체크리스트</h2>
      <ul>
        <li>✅ 출생신고 후 <strong>60일 이내</strong> 신청</li>
        <li>✅ 복지로 또는 주민센터 방문 신청</li>
        <li>✅ 국민행복카드 발급 (바우처 수령용)</li>
        <li>✅ ${city} 지역 추가 지원금 별도 확인</li>
        <li>✅ 부모급여는 매월 25일 계좌 입금 확인</li>
      </ul>`,
  },

  'first-voucher': {
    intro: (city, sido) => `
      <h2>첫만남이용권이란?</h2>
      <p>
        첫만남이용권은 출생아 1인당 200만원(다태아 300만원)을 국민행복카드 바우처로 지급하는
        전국 공통 지원제도입니다. ${sido} ${city}에 주민등록이 된 가정이라면 소득에 관계없이
        모두 받을 수 있습니다.
      </p>`,

    localSection: (city, _sido) => `
      <h2>첫만남이용권 사용처</h2>
      <p>국민행복카드 바우처는 아래 업종에서 사용할 수 있습니다.</p>
      <table>
        <thead><tr><th>사용 가능 업종</th><th>주요 이용처</th></tr></thead>
        <tbody>
          <tr><td>산후조리원</td><td>${city} 인근 산후조리원</td></tr>
          <tr><td>유아용품</td><td>베이비페어, 유아용품 전문점</td></tr>
          <tr><td>의료기관</td><td>소아과, 산부인과, 약국</td></tr>
          <tr><td>보육시설</td><td>어린이집, 유치원 비용 일부</td></tr>
          <tr><td>온라인 쇼핑몰</td><td>국민행복카드 가맹 쇼핑몰</td></tr>
        </tbody>
      </table>
      <p>💡 출생일로부터 <strong>1년 이내</strong>에 사용해야 하며 잔액은 소멸됩니다.</p>`,

    applySteps: `
      <h2>신청 방법</h2>
      <h3>출생신고와 동시 신청 (원스톱)</h3>
      <ol>
        <li>주민센터 방문 또는 정부24에서 <strong>출생신고</strong></li>
        <li>행복출산 원스톱 서비스 신청란에서 「첫만남이용권」 체크</li>
        <li>국민행복카드 보유 여부 확인 (없으면 은행에서 발급)</li>
        <li>카드 발급 후 바우처 자동 충전 (약 3~5 영업일)</li>
      </ol>
      <h3>별도 신청</h3>
      <p>복지로(bokjiro.go.kr) → 서비스 신청 → 「첫만남이용권」 검색 후 신청</p>`,

    eligibility: `
      <h2>지원 대상</h2>
      <ul>
        <li>출생 신고된 모든 아동 (소득 무관)</li>
        <li>출생일 기준 주민등록이 대한민국에 등재된 가정</li>
        <li>단태아: 200만원 / 다태아(쌍둥이 이상): 출생아 1인당 300만원</li>
      </ul>`,

    documents: `
      <h2>필요 서류</h2>
      <ul>
        <li>출생신고서 (또는 출생증명서)</li>
        <li>신청인 신분증</li>
        <li>국민행복카드 (또는 발급 신청)</li>
      </ul>`,

    faq: [
      {
        q: '국민행복카드가 없는데 어떻게 하나요?',
        a: '카드사(BC, KB국민, 롯데, 삼성, 신한, 우리, NH농협, 하나카드 등)에서 국민행복카드를 발급받으면 됩니다. 발급 후 바우처가 자동으로 충전됩니다.',
      },
      {
        q: '첫만남이용권 200만원을 현금으로 받을 수 있나요?',
        a: '아니요. 첫만남이용권은 현금이 아닌 국민행복카드 바우처로만 지급됩니다. 현금 인출은 불가하며 가맹점에서만 사용 가능합니다.',
      },
      {
        q: '출생 후 몇 살까지 사용할 수 있나요?',
        a: '출생일로부터 1년(12개월) 이내에 사용해야 합니다. 기간이 지나면 잔액이 자동 소멸되므로 기한 내에 모두 사용하세요.',
      },
      {
        q: '해외에서 출생한 아이도 신청할 수 있나요?',
        a: '대한민국 국적을 취득하고 국내에 주민등록을 마친 경우 신청 가능합니다. 자세한 사항은 관할 주민센터에 문의하세요.',
      },
      {
        q: '입양아동도 받을 수 있나요?',
        a: '네. 입양아동도 입양 후 주민등록 등재 시점부터 대상에 해당하므로, 입양 후 즉시 관할 주민센터에 문의하여 신청하세요.',
      },
    ],

    conclusion: (city) => `
      <h2>${city} 첫만남이용권 신청 요약</h2>
      <ul>
        <li>✅ 출생신고 시 원스톱 신청 가능</li>
        <li>✅ 국민행복카드 사전 발급 권장</li>
        <li>✅ 바우처 충전 후 1년 이내 사용</li>
        <li>✅ 다태아는 1인당 300만원 지급</li>
      </ul>`,
  },
}

/** 정책별 기본 콘텐츠 (미정의 정책용) */
function buildGenericContent(
  sido: string,
  city: string,
  policyName: string,
): string {
  return `
    <h2>${city} ${policyName} 핵심 정보</h2>
    <p>
      ${sido} ${city}의 ${policyName} 지원 내용을 안내합니다.
      전국 공통 혜택 외에 ${city}의 자체 지원이 있을 수 있으므로
      <strong>${city} 주민센터(☎ 지역번호+120)</strong>에서 최신 정보를 확인하세요.
    </p>

    <h2>신청 방법</h2>
    <h3>온라인 신청</h3>
    <ol>
      <li><strong>복지로(www.bokjiro.go.kr)</strong> 접속 후 로그인</li>
      <li>서비스 신청 → 복지급여 신청 → 해당 급여 검색</li>
      <li>신청서 작성 및 제출</li>
      <li>처리 결과 문자 수신 (7~14일 소요)</li>
    </ol>
    <h3>방문 신청</h3>
    <p>${city} 주민센터 복지민원실 방문 후 해당 급여 신청서 작성 및 제출</p>

    <h2>지원 대상</h2>
    <ul>
      <li>${city} 주민등록 등재 가구</li>
      <li>자격 요건은 급여 종류에 따라 상이 (주민센터 확인 필요)</li>
    </ul>

    <h2>자주 묻는 질문</h2>
    <h3>Q1. ${policyName}은 언제 신청해야 하나요?</h3>
    <p>A: 자격 요건 충족 시 즉시 신청 가능합니다. 대부분의 급여는 신청일 기준으로 지급되므로 가능한 빨리 신청하는 것이 유리합니다.</p>
    <h3>Q2. 소득 기준이 있나요?</h3>
    <p>A: 급여 종류에 따라 다릅니다. 아동수당·부모급여 등 일부는 소득 무관 지급, 다른 일부는 기준 중위소득 이하 가구 대상입니다. 복지로에서 모의계산 후 확인하세요.</p>
    <h3>Q3. 서류는 어디서 발급받나요?</h3>
    <p>A: 주민등록등본·가족관계증명서 등은 정부24(gov.kr) 또는 주민센터에서 무료 발급 가능합니다.</p>
    <h3>Q4. 처리 기간은 얼마나 되나요?</h3>
    <p>A: 서류가 완비된 경우 통상 7~14일 내 결정이 됩니다. 바우처는 국민행복카드 발급 후 자동 충전됩니다.</p>
    <h3>Q5. 다른 급여와 중복 수령이 가능한가요?</h3>
    <p>A: 동일 성격의 급여는 중복 불가이나, 상이한 급여는 중복 수령 가능합니다. 예를 들어 부모급여와 아동수당은 동시에 받을 수 있습니다.</p>

    <h2>${city} ${policyName} 신청 체크리스트</h2>
    <ul>
      <li>✅ 복지로 또는 주민센터에서 자격 확인</li>
      <li>✅ 구비 서류 준비 (주민등록등본, 신분증 등)</li>
      <li>✅ 국민행복카드 발급 (바우처 지급 급여의 경우)</li>
      <li>✅ 신청 완료 후 처리 결과 문자 확인</li>
    </ul>`
}

/** 정책별 HTML 콘텐츠 반환 */
export function getDummyContent(
  sido: string,
  city: string,
  policyId: string,
  policyName: string,
): string {
  const template = POLICY_CONTENT[policyId]
  if (!template) {
    return buildGenericContent(sido, city, policyName)
  }

  const faqHtml = template.faq
    .map(
      ({ q, a }, i) =>
        `<h3>Q${i + 1}. ${q}</h3><p>A: ${a}</p>`,
    )
    .join('\n')

  return `
    ${template.intro(city, sido)}
    ${template.localSection(city, sido)}
    ${template.applySteps}
    ${template.eligibility}
    ${template.documents}
    <h2>자주 묻는 질문 (FAQ)</h2>
    ${faqHtml}
    ${template.conclusion(city)}
  `
}

/** 최근 등록 지역 더미 데이터 (메인 페이지용) */
export const RECENT_CITIES = [
  { sido: '경기도', city_name: '고양시',  policy_id: 'birth-support',    policy_name: '출산지원금' },
  { sido: '서울특별시', city_name: '강남구', policy_id: 'parental-benefit', policy_name: '부모급여' },
  { sido: '경기도', city_name: '수원시',  policy_id: 'childcare-fee',    policy_name: '보육료' },
  { sido: '부산광역시', city_name: '해운대구', policy_id: 'child-allowance', policy_name: '아동수당' },
  { sido: '인천광역시', city_name: '연수구', policy_id: 'first-voucher',   policy_name: '첫만남이용권' },
  { sido: '경기도', city_name: '성남시',  policy_id: 'nurturing-allowance', policy_name: '양육수당' },
]
