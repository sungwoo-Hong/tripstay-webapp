import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import type { Benefit, NationalBenefit, RawWelfareItem } from '@/types'

// ── 클라이언트 컴포넌트용 (브라우저) ─────────────────────────
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

// ── 서버 컴포넌트용 (SSG/SSR) ─────────────────────────────
// 공개 읽기 전용: benefits, national_benefits 모두 RLS SELECT public
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } },
)

// ── 서버 전용 쓰기 클라이언트 (pipeline 업로드 등 관리 목적) ──
// SUPABASE_SERVICE_ROLE_KEY는 서버 컴포넌트에서만 사용, 클라이언트 노출 금지
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}

// ── 데이터 페칭 헬퍼 (서버 컴포넌트용) ──────────────────────

export async function getBenefit(
  sido: string,
  cityName: string,
  policyId: string,
): Promise<Benefit | null> {
  const { data, error } = await supabaseServer
    .from('benefits')
    .select('*')
    .eq('sido', sido)
    .eq('city_name', cityName)
    .eq('policy_id', policyId)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('getBenefit error:', { sido, cityName, policyId, error })
    }
    return null
  }
  return data
}

export async function getBenefitsByPolicy(
  policyId: string,
): Promise<{ count: number }> {
  const { count, error } = await supabaseServer
    .from('benefits')
    .select('*', { count: 'exact', head: true })
    .eq('policy_id', policyId)

  if (error) return { count: 0 }
  return { count: count ?? 0 }
}

export async function getBenefitsBySido(sido: string): Promise<Benefit[]> {
  const { data, error } = await supabaseServer
    .from('benefits')
    .select('city_name, policy_id, policy_name, title, slug')
    .eq('sido', sido)
    .order('city_name', { ascending: true })
    .order('policy_id',  { ascending: true })

  if (error) return []
  return (data ?? []) as Benefit[]
}

export async function getAllBenefitParams(): Promise<
  Array<{ sido: string; city_name: string; policy_id: string }>
> {
  const allData: Array<{ sido: string; city_name: string; policy_id: string }> = []
  const pageSize = 1000
  let page = 0

  while (true) {
    const { data, error } = await supabaseServer
      .from('benefits')
      .select('sido, city_name, policy_id')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error || !data || data.length === 0) break
    allData.push(...data)
    if (data.length < pageSize) break
    page++
  }

  return allData
}

export async function getBenefitsByCity(
  sido: string,
  cityName: string,
): Promise<Benefit[]> {
  const { data, error } = await supabaseServer
    .from('benefits')
    .select('sido, city_name, policy_id, policy_name, title, slug')
    .eq('sido', sido)
    .eq('city_name', cityName)
    .order('policy_id', { ascending: true })
  if (error) return []
  return (data ?? []) as Benefit[]
}

export async function getNationalBenefits(policyId: string): Promise<NationalBenefit[]> {
  const { data, error } = await supabaseServer
    .from('national_benefits')
    .select('id, policy_id, name, amount, description, apply_url')
    .eq('policy_id', policyId)
    .order('sort_order', { ascending: true })

  if (error) return []
  return (data ?? []) as NationalBenefit[]
}

export async function getRecentBenefits(limit = 12): Promise<Benefit[]> {
  const { data, error } = await supabaseServer
    .from('benefits')
    .select('sido, city_name, policy_id, policy_name, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data ?? []) as Benefit[]
}

export type TopBirthSupportItem = {
  title: string
  sido: string
  city_name: string
  amount: number
}

/** 특정 시군구에 실제 존재하는 policy_id 목록 조회 */
export async function getCityPolicies(sido: string, cityName: string): Promise<string[]> {
  const { data, error } = await supabaseServer
    .from('benefits')
    .select('policy_id')
    .eq('sido', sido)
    .eq('city_name', cityName)

  if (error || !data) return []
  return [...new Set(data.map((d) => d.policy_id))]
}

export async function searchCities(
  query: string,
): Promise<Array<{ sido: string; city_name: string }>> {
  if (!query.trim()) return []

  const { data, error } = await supabaseServer
    .from('benefits')
    .select('sido, city_name')
    .ilike('city_name', `%${query.trim()}%`)
    .order('sido', { ascending: true })
    .order('city_name', { ascending: true })

  if (error) return []

  // 중복 제거 (policy_id별로 여러 행이 있으므로)
  const seen = new Set<string>()
  return (data ?? []).filter((item) => {
    const key = `${item.sido}__${item.city_name}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function getTopBirthSupport(limit = 5): Promise<TopBirthSupportItem[]> {
  const { data, error } = await supabaseServer
    .from('benefits')
    .select('title, sido, city_name, amount')
    .eq('policy_id', 'birth-support')
    .not('amount', 'is', null)
    .order('amount', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as TopBirthSupportItem[]
}

// ── raw_welfare_api 헬퍼 (새 아키텍처) ──────────────────────

/** 시군구별 복지 목록 (city page용) */
export async function getRawWelfareItemsByCity(
  sido: string,
  sggNm: string,
): Promise<RawWelfareItem[]> {
  const { data, error } = await supabaseServer
    .from('raw_welfare_api')
    .select('serv_id, sido, sgg_nm, serv_nm, serv_dgst, life_nm, intrs_thema_nm, sprt_cyc_nm, srv_pvsn_nm, aply_mtd_nm, detail_fetched')
    .eq('sido', sido)
    .eq('sgg_nm', sggNm)
    .order('serv_nm', { ascending: true })

  if (error) return []
  return (data ?? []) as RawWelfareItem[]
}

/** 개별 복지 항목 상세 (welfare detail page용) */
export async function getRawWelfareItem(servId: string): Promise<RawWelfareItem | null> {
  const { data, error } = await supabaseServer
    .from('raw_welfare_api')
    .select('*')
    .eq('serv_id', servId)
    .single()

  if (error) return null
  return data as RawWelfareItem
}

/** generateStaticParams용: city page (raw_welfare_api 기준) */
export async function getAllRawCityParams(): Promise<
  Array<{ sido: string; sgg_nm: string }>
> {
  const allData: Array<{ sido: string; sgg_nm: string }> = []
  const pageSize = 1000
  let page = 0

  while (true) {
    const { data, error } = await supabaseServer
      .from('raw_welfare_api')
      .select('sido, sgg_nm')
      .not('sgg_nm', 'is', null)
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error || !data || data.length === 0) break
    allData.push(...data)
    if (data.length < pageSize) break
    page++
  }

  // 중복 제거
  const seen = new Set<string>()
  return allData.filter((item) => {
    const key = `${item.sido}__${item.sgg_nm}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** generateStaticParams용: welfare detail page */
export async function getAllRawServIds(): Promise<string[]> {
  const allIds: string[] = []
  const pageSize = 1000
  let page = 0

  while (true) {
    const { data, error } = await supabaseServer
      .from('raw_welfare_api')
      .select('serv_id')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error || !data || data.length === 0) break
    allIds.push(...data.map((d) => d.serv_id))
    if (data.length < pageSize) break
    page++
  }

  return allIds
}

/** region page용: 시도별 시군구 목록 (raw_welfare_api 기준) */
export async function getRawCitiesBySido(sido: string): Promise<string[]> {
  const { data, error } = await supabaseServer
    .from('raw_welfare_api')
    .select('sgg_nm')
    .eq('sido', sido)
    .not('sgg_nm', 'is', null)
    .order('sgg_nm', { ascending: true })

  if (error) return []

  const seen = new Set<string>()
  const cities: string[] = []
  for (const row of data ?? []) {
    if (row.sgg_nm && !seen.has(row.sgg_nm)) {
      seen.add(row.sgg_nm)
      cities.push(row.sgg_nm)
    }
  }
  return cities
}
