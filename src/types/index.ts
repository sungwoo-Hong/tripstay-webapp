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

export type RawWelfareItem = {
  id: string
  serv_id: string
  sido: string
  sgg_nm: string | null
  serv_nm: string | null
  serv_dgst: string | null
  life_nm: string | null
  intrs_thema_nm: string | null
  sprt_cyc_nm: string | null
  srv_pvsn_nm: string | null
  aply_mtd_nm: string | null
  serv_dtl_link: string | null
  last_mod_ymd: string | null
  sprt_trgt_cn: string | null
  slct_crit_cn: string | null
  alw_serv_cn: string | null
  aply_mtd_cn: string | null
  dept_name: string | null
  phone: string | null
  baslaw_nm: string | null
  basfm_link: string | null
  enfc_bgng_ymd: string | null
  detail_fetched: boolean | null
}
