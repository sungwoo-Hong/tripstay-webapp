import { createClient } from '@supabase/supabase-js'
import type { Benefit, NationalBenefit } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 브라우저/서버 공용 클라이언트 (공개 읽기 전용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버 전용 클라이언트 (Service Role Key — 서버 컴포넌트에서만 사용)
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })
}

// ── 데이터 페칭 헬퍼 ──────────────────────────────────────

export async function getBenefit(
  sido: string,
  cityName: string,
  policyId: string
): Promise<Benefit | null> {
  const { data, error } = await supabase
    .from('benefits')
    .select('*')
    .eq('sido', decodeURIComponent(sido))
    .eq('city_name', decodeURIComponent(cityName))
    .eq('policy_id', decodeURIComponent(policyId))
    .single()

  if (error) return null
  return data
}

export async function getBenefitsByPolicy(policyId: string, page = 1, pageSize = 50) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('benefits')
    .select('*', { count: 'exact' })
    .eq('policy_id', policyId)
    .order('sido', { ascending: true })
    .range(from, to)

  if (error) return { data: [], count: 0 }
  return { data: data ?? [], count: count ?? 0 }
}

export async function getBenefitsBySido(sido: string) {
  const { data, error } = await supabase
    .from('benefits')
    .select('*')
    .eq('sido', decodeURIComponent(sido))
    .order('city_name', { ascending: true })

  if (error) return []
  return data ?? []
}

export async function getAllBenefitParams() {
  const { data, error } = await supabase
    .from('benefits')
    .select('sido, city_name, policy_id')

  if (error) return []
  return data ?? []
}

export async function getNationalBenefits(policyId: string): Promise<NationalBenefit[]> {
  const { data, error } = await supabase
    .from('national_benefits')
    .select('*')
    .eq('policy_id', policyId)

  if (error) return []
  return data ?? []
}
