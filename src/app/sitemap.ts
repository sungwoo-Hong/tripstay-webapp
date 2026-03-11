import type { MetadataRoute } from 'next'
import { POLICIES, SIDO_LIST, SITE_URL } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    ...POLICIES.map((p) => ({
      url: `${SITE_URL}/policy/${p.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...SIDO_LIST.map((sido) => ({
      url: `${SITE_URL}/region/${encodeURIComponent(sido)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]

  // Phase 4에서 Supabase에서 전체 2,000개 URL 조회
  // const { getAllBenefitParams } = await import('@/lib/supabase')
  // const benefitParams = await getAllBenefitParams()
  // const benefitPages = benefitParams.map(({ sido, city_name, policy_id }) => ({
  //   url: `${SITE_URL}/${encodeURIComponent(sido)}/${encodeURIComponent(city_name)}/${policy_id}`,
  //   lastModified: now,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }))

  return staticPages
}
