import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { supabaseServer } from '@/lib/supabase'

const CHUNK = 1000

export async function generateSitemaps() {
  const { count } = await supabaseServer
    .from('raw_welfare_api')
    .select('*', { count: 'exact', head: true })

  const total = count ?? 0
  const numChunks = Math.max(1, Math.ceil(total / CHUNK))
  return Array.from({ length: numChunks }, (_, i) => ({ id: i }))
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabaseServer
    .from('raw_welfare_api')
    .select('serv_id')
    .range(id * CHUNK, (id + 1) * CHUNK - 1)

  const now = new Date()
  return (data ?? []).map(({ serv_id }) => ({
    url: `${SITE_URL}/welfare/${serv_id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
}
