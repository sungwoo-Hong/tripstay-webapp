/**
 * scripts/raw-to-benefits.js
 *
 * raw_welfare_api의 classified_policy_id가 있는 레코드를
 * benefits 테이블 형식으로 변환해 INSERT하는 스크립트.
 *
 * 대상 policy: postpartum-fee, newlywed-support, newborn-supplies,
 *              prenatal-health, multiple-children (기존 미존재 또는 부족분)
 *
 * 실행: node scripts/raw-to-benefits.js
 * (tripstay-webapp 루트에서 실행, .env.local 필요)
 */

const { createClient } = require('@supabase/supabase-js')
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
)

const POLICY_NAMES = {
  'postpartum-fee':    '산후조리비',
  'newlywed-support':  '신혼부부 지원',
  'newborn-supplies':  '신생아 용품 지원',
  'prenatal-health':   '임산부 건강관리비',
  'multiple-children': '다자녀 추가 지원',
  'maternal-traffic':  '임산부 교통비',
}

// 처리할 policy 목록 (benefits에 없거나 부족한 것들)
const TARGET_POLICIES = [
  'postpartum-fee',
  'newlywed-support',
  'newborn-supplies',
  'prenatal-health',
  'multiple-children',
]

/** 텍스트에서 HTML 태그 제거 */
function stripHtml(text) {
  if (!text) return ''
  return text.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim()
}

/** 여러 raw 항목을 하나의 benefits content HTML로 변환 */
function buildContent(city, sido, policyName, items) {
  const first = items[0]
  const cityFull = `${sido} ${city}`

  // 인트로 단락
  let html = `<p>${cityFull}의 ${policyName} 정책을 안내합니다. `
  if (first.serv_dgst) {
    html += `${stripHtml(first.serv_dgst)} `
  }
  html += `아래 내용을 확인하시고 신청 자격 여부를 먼저 확인하세요.</p>\n\n`

  html += `<h2>${city} ${policyName} 핵심 정보 요약</h2>\n`

  for (const item of items) {
    if (items.length > 1) {
      html += `<h3>${stripHtml(item.serv_nm)}</h3>\n`
    }

    if (item.sprt_trgt_cn) {
      html += `<h4>지원 대상</h4>\n<p>${stripHtml(item.sprt_trgt_cn)}</p>\n`
    }
    if (item.alw_serv_cn) {
      html += `<h4>지원 내용</h4>\n<p>${stripHtml(item.alw_serv_cn)}</p>\n`
    }
    if (item.slct_crit_cn) {
      html += `<h4>선정 기준</h4>\n<p>${stripHtml(item.slct_crit_cn)}</p>\n`
    }

    html += `<h2>${city} ${policyName} 신청 방법 및 자격</h2>\n`

    if (item.aply_mtd_cn) {
      html += `<p>${stripHtml(item.aply_mtd_cn)}</p>\n`
    }
    if (item.dept_name || item.phone) {
      html += `<p>담당 부서: ${item.dept_name || '-'}${item.phone ? ` / 문의: ${item.phone}` : ''}</p>\n`
    }
  }

  return html
}

/** benefits 레코드 생성 */
function buildBenefit(sido, city, policyId, items) {
  const policyName = POLICY_NAMES[policyId]
  const first = items[0]

  const title = `${city} ${policyName} 신청 방법 및 지원 내용`
  const slug = `${sido}-${city}-${policyId}`
  const tags = [city, policyName, sido, '복지정책', '지자체지원']
  const metaDescription = `${city} ${policyName} 지원금액, 신청방법, 지원대상을 정리했습니다. ${sido} ${city}의 ${policyName} 혜택과 신청 절차를 확인하세요.`
  const target = first.sprt_trgt_cn ? stripHtml(first.sprt_trgt_cn).substring(0, 500) : null
  const applicationMethod = first.aply_mtd_nm || (first.aply_mtd_cn ? stripHtml(first.aply_mtd_cn).substring(0, 200) : null)
  const content = buildContent(city, sido, policyName, items)

  return {
    sido,
    city_name: city,
    policy_id: policyId,
    policy_name: policyName,
    title,
    slug,
    tags,
    meta_description: metaDescription,
    target,
    application_method: applicationMethod,
    application_period: null,
    amount: null,
    content,
  }
}

async function main() {
  console.log('=== raw_welfare_api → benefits 변환 시작 ===\n')

  // 기존 benefits (sido, city_name, policy_id) 목록 조회 → 중복 체크용
  console.log('기존 benefits 조회 중...')
  const existing = new Set()
  let page = 0
  while (true) {
    const { data, error } = await supabase
      .from('benefits')
      .select('sido, city_name, policy_id')
      .range(page * 1000, (page + 1) * 1000 - 1)
    if (error || !data || data.length === 0) break
    data.forEach(r => existing.add(`${r.sido}__${r.city_name}__${r.policy_id}`))
    if (data.length < 1000) break
    page++
  }
  console.log(`기존 benefits: ${existing.size}개\n`)

  let totalInserted = 0
  let totalSkipped = 0

  for (const policyId of TARGET_POLICIES) {
    const policyName = POLICY_NAMES[policyId]
    console.log(`\n[${policyName}] 처리 중...`)

    // raw_welfare_api에서 해당 policy 전체 조회 (sgg_nm이 null이 아닌 것만)
    const { data: rawItems, error } = await supabase
      .from('raw_welfare_api')
      .select('sido, sgg_nm, serv_nm, serv_dgst, sprt_trgt_cn, alw_serv_cn, aply_mtd_cn, slct_crit_cn, dept_name, phone, aply_mtd_nm')
      .eq('classified_policy_id', policyId)
      .not('sgg_nm', 'is', null)
      .order('sido')
      .order('sgg_nm')

    if (error) {
      console.error(`  조회 오류:`, error.message)
      continue
    }

    // (sido, sgg_nm)별로 그룹핑
    const groups = {}
    for (const item of rawItems) {
      const key = `${item.sido}__${item.sgg_nm}`
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    }

    const toInsert = []
    let skipped = 0

    for (const [key, items] of Object.entries(groups)) {
      const [sido, city] = key.split('__')
      const dupKey = `${sido}__${city}__${policyId}`

      if (existing.has(dupKey)) {
        skipped++
        continue
      }

      toInsert.push(buildBenefit(sido, city, policyId, items))
    }

    console.log(`  raw 그룹: ${Object.keys(groups).length}개, 신규: ${toInsert.length}개, 중복 스킵: ${skipped}개`)

    // 배치 INSERT (50개씩)
    const BATCH = 50
    let inserted = 0
    for (let i = 0; i < toInsert.length; i += BATCH) {
      const batch = toInsert.slice(i, i + BATCH)
      const { error: insertError } = await supabase.from('benefits').insert(batch)
      if (insertError) {
        console.error(`  INSERT 오류 (batch ${i / BATCH}):`, insertError.message)
      } else {
        inserted += batch.length
        process.stdout.write(`  진행: ${inserted}/${toInsert.length}\r`)
      }
    }

    console.log(`  완료: ${inserted}개 삽입`)
    totalInserted += inserted
    totalSkipped += skipped
  }

  console.log(`\n=== 전체 완료 ===`)
  console.log(`삽입: ${totalInserted}개, 스킵: ${totalSkipped}개`)
  console.log(`\nnpm run build 실행하면 새 SSG 페이지가 생성됩니다.`)
}

main().catch(console.error)
