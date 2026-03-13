import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import type { Benefit, NationalBenefit } from '@/types'

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

  if (error) return null
  return data
}

export async function getBenefitsByPolicy(
  policyId: string,
  page = 1,
  pageSize = 50,
): Promise<{ data: Benefit[]; count: number }> {
  const from = (page - 1) * pageSize
  const to   = from + pageSize - 1

  const { data, error, count } = await supabaseServer
    .from('benefits')
    .select('sido, city_name, policy_id, policy_name, title, slug', { count: 'exact' })
    .eq('policy_id', policyId)
    .order('sido',      { ascending: true })
    .order('city_name', { ascending: true })
    .range(from, to)

  if (error) return { data: [], count: 0 }
  return { data: (data ?? []) as Benefit[], count: count ?? 0 }
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
