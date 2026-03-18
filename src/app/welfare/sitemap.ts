import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { createAdminClient } from '@/lib/supabase'

const CHUNK = 1000

export async function generateSitemaps() {
  const sb = createAdminClient()
  const { count } = await sb
    .from('raw_welfare_api')
    .select('*', { count: 'exact', head: true })

  const total = count ?? 0
  const numChunks = Math.max(1, Math.ceil(total / CHUNK))
  return Array.from({ length: numChunks }, (_, i) => ({ id: i }))
}

export default async function sitemap({
  id: rawId,
}: {
  id: number | Promise<number>
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await rawId)
  const sb = createAdminClient()
  const { data, error } = await sb
    .from('raw_welfare_api')
    .select('serv_id')
    .range(id * CHUNK, (id + 1) * CHUNK - 1)

  if (error) console.error('[welfare/sitemap] fetch error id=%d:', id, error)

  const now = new Date()
  return (data ?? []).map(({ serv_id }) => ({
    url: `${SITE_URL}/welfare/${serv_id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
}
