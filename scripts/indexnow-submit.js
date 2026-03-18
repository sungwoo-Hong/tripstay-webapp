/**
 * scripts/indexnow-submit.js
 *
 * benefits + raw_welfare_api의 모든 URL을 IndexNow API로 제출.
 * Bing(IndexNow 허브) → Bing, Naver, Yandex 등 자동 전파.
 *
 * 실행: node scripts/indexnow-submit.js
 * (tripstay-webapp 루트에서 실행, .env.local 필요)
 */

const { createClient } = require('@supabase/supabase-js')
const https = require('https')
const path = require('path')
const fs = require('fs')

// .env.local 수동 로드
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  }
}

const SITE_URL = 'https://www.tripstay.co.kr'
const INDEXNOW_KEY = process.env.INDEXNOW_KEY
const BATCH_SIZE = 500  // IndexNow 권장 최대 500개/요청

if (!INDEXNOW_KEY) {
  console.error('INDEXNOW_KEY가 .env.local에 없습니다.')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
)

/** IndexNow 배치 제출 */
async function submitBatch(urls) {
  const body = JSON.stringify({
    host: 'www.tripstay.co.kr',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  })

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.indexnow.org',
        path: '/indexnow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => resolve({ status: res.statusCode, body: data }))
      },
    )
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

/** URL 배열을 BATCH_SIZE씩 나눠 제출 */
async function submitAll(urls) {
  let submitted = 0
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE)
    const result = await submitBatch(batch)
    submitted += batch.length
    const icon = result.status === 200 || result.status === 202 ? '✓' : '✗'
    console.log(`  ${icon} ${submitted}/${urls.length} (HTTP ${result.status})`)
    // 과도한 요청 방지 — 배치 간 1초 대기
    if (i + BATCH_SIZE < urls.length) await new Promise(r => setTimeout(r, 1000))
  }
  return submitted
}

async function main() {
  console.log('=== IndexNow 제출 시작 ===\n')
  const allUrls = []

  // 1. 정적 페이지
  const staticUrls = [
    `${SITE_URL}/`,
    `${SITE_URL}/search`,
  ]
  ;['서울특별시','부산광역시','대구광역시','인천광역시','광주광역시','대전광역시','울산광역시',
    '세종특별자치시','경기도','강원특별자치도','충청북도','충청남도','전북특별자치도',
    '전라남도','경상북도','경상남도','제주특별자치도'].forEach(sido => {
    staticUrls.push(`${SITE_URL}/region/${encodeURIComponent(sido)}`)
  })
  allUrls.push(...staticUrls)
  console.log(`정적 페이지: ${staticUrls.length}개`)

  // 2. benefits 페이지 (/{sido}/{city}/{policy})
  console.log('benefits 페이지 조회 중...')
  const benefitUrls = []
  let page = 0
  while (true) {
    const { data, error } = await supabase
      .from('benefits')
      .select('sido, city_name, policy_id')
      .range(page * 1000, (page + 1) * 1000 - 1)
    if (error || !data || data.length === 0) break
    data.forEach(r => {
      benefitUrls.push(`${SITE_URL}/${encodeURIComponent(r.sido)}/${encodeURIComponent(r.city_name)}/${r.policy_id}`)
    })
    if (data.length < 1000) break
    page++
  }
  allUrls.push(...benefitUrls)
  console.log(`benefits 페이지: ${benefitUrls.length}개`)

  // 3. welfare 페이지 (/welfare/{servId})
  console.log('welfare 페이지 조회 중...')
  const welfareUrls = []
  page = 0
  while (true) {
    const { data, error } = await supabase
      .from('raw_welfare_api')
      .select('serv_id')
      .range(page * 1000, (page + 1) * 1000 - 1)
    if (error || !data || data.length === 0) break
    data.forEach(r => {
      welfareUrls.push(`${SITE_URL}/welfare/${r.serv_id}`)
    })
    if (data.length < 1000) break
    page++
  }
  allUrls.push(...welfareUrls)
  console.log(`welfare 페이지: ${welfareUrls.length}개`)

  console.log(`\n총 ${allUrls.length}개 URL 제출 시작...\n`)

  const total = await submitAll(allUrls)
  console.log(`\n=== 완료: ${total}개 제출 ===`)
}

main().catch(console.error)
