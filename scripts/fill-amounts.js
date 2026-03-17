/**
 * scripts/fill-amounts.js
 *
 * birth-support 레코드에서 amount(만원)가 null인 항목을 찾아
 * content/raw_content에서 금액을 파싱해 DB에 채워 넣는 스크립트.
 *
 * 실행: node scripts/fill-amounts.js
 * (tripstay-webapp 루트에서 실행, .env.local 필요)
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const fs = require('fs')

// .env.local 수동 로드 (dotenv 없이)
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
)

/**
 * HTML에서 금액(만원 단위 정수)을 추출.
 * birth-support 콘텐츠 기준으로 우선순위 순서로 패턴 매칭.
 */
function extractAmount(content) {
  if (!content) return null

  // HTML 태그 제거
  const text = content.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ')

  const patterns = [
    // "지원금액 : 500만원", "출산지원금 300만원" 처럼 맥락이 있는 경우
    /(?:지원\s*금액|출산\s*지원금|출산\s*장려금|지역\s*지원금|추가\s*지원)[^\d]{0,10}(\d{1,4}(?:,\d{3})?)만\s*원/,
    // "XX만원 지급", "XX만원 지원"
    /(\d{1,4}(?:,\d{3})?)만\s*원\s*(?:지급|지원|상당|한도)/,
    // "최대 XX만원", "총 XX만원"
    /(?:최대|총|합계)\s*(\d{1,4}(?:,\d{3})?)만\s*원/,
    // 300~1000 범위 만원 숫자 (작은 숫자는 오류 가능성 높음)
    /\b(\d{3,4}(?:,\d{3})?)만\s*원\b/,
  ]

  const results = []
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const num = parseInt(match[1].replace(/,/g, ''), 10)
      // 10만원 ~ 5,000만원 범위만 유효
      if (num >= 10 && num <= 5000) {
        results.push(num)
        break // 첫 번째 패턴 매칭 우선
      }
    }
  }

  return results.length > 0 ? results[0] : null
}

async function main() {
  console.log('amount가 null인 birth-support 레코드 조회 중...')

  const pageSize = 500
  let page = 0
  const allRecords = []

  while (true) {
    const { data, error } = await supabase
      .from('benefits')
      .select('id, sido, city_name, content, raw_content')
      .eq('policy_id', 'birth-support')
      .is('amount', null)
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) { console.error('조회 오류:', error); break }
    if (!data || data.length === 0) break
    allRecords.push(...data)
    if (data.length < pageSize) break
    page++
  }

  console.log(`총 ${allRecords.length}개 레코드 처리 시작\n`)

  let updated = 0
  let skipped = 0

  for (const record of allRecords) {
    const raw = record.raw_content || record.content
    const amount = extractAmount(raw)

    if (!amount) {
      console.log(`  SKIP  ${record.sido} ${record.city_name} — 금액 파싱 불가`)
      skipped++
      continue
    }

    const { error } = await supabase
      .from('benefits')
      .update({ amount })
      .eq('id', record.id)

    if (error) {
      console.error(`  ERROR ${record.sido} ${record.city_name}:`, error.message)
      skipped++
    } else {
      console.log(`  OK    ${record.sido} ${record.city_name} → ${amount}만원`)
      updated++
    }
  }

  console.log(`\n완료: ${updated}개 업데이트, ${skipped}개 스킵`)
}

main().catch(console.error)
