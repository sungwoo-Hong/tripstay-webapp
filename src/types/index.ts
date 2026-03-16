export type Benefit = {
  id: string
  city_name: string
  sido: string
  policy_id: string
  policy_name: string
  title: string
  content: string
  meta_description: string
  tags: string[]
  slug: string
  created_at: string
  amount: number | null
  raw_content: string | null
  target: string | null
  application_method: string | null
  application_period: string | null
}

export type NationalBenefit = {
  id: string
  policy_id: string
  name: string
  amount: string
  description: string
  apply_url: string
}

export type Policy = {
  id: string
  name: string
  icon: string
  description: string
  keyPoints?: string[]
}

export type Region = {
  name: string
  sido: string
  code: string
}
