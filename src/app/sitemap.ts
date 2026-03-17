import type { MetadataRoute } from 'next'
import { SIDO_LIST, SITE_URL } from '@/lib/constants'
import { getAllRawCityParams, getAllRawServIds } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    ...SIDO_LIST.map((sido) => ({
      url: `${SITE_URL}/region/${encodeURIComponent(sido)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]

  // 시군구 페이지
  const cityParams = await getAllRawCityParams()
  const cityPages: MetadataRoute.Sitemap = cityParams.map(({ sido, sgg_nm }) => ({
    url: `${SITE_URL}/${encodeURIComponent(sido)}/${encodeURIComponent(sgg_nm)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // 개별 복지 서비스 페이지
  const servIds = await getAllRawServIds()
  const welfarePages: MetadataRoute.Sitemap = servIds.map((servId) => ({
    url: `${SITE_URL}/welfare/${servId}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...cityPages, ...welfarePages]
}
