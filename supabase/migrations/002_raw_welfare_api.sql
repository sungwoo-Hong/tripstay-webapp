-- ============================================================
-- raw_welfare_api 테이블 - 공공데이터 원본 보존
-- 분류 전에 모든 API 응답을 저장하여 누락 방지
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- ============================================================

CREATE TABLE IF NOT EXISTS raw_welfare_api (
  id                   uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  serv_id              text        UNIQUE NOT NULL,          -- 공공데이터 서비스ID (고유 키)
  sido                 text        NOT NULL,                 -- 광역시도
  sgg_nm               text,                                 -- 시군구명 (null = 광역 단위)
  serv_nm              text,                                 -- 서비스명
  serv_dgst            text,                                 -- 서비스 개요
  sprt_trgt_cn         text,                                 -- 지원 대상
  alw_serv_cn          text,                                 -- 지원 내용 (금액 포함)
  aply_mtd_cn          text,                                 -- 신청 방법
  slct_crit_cn         text,                                 -- 선정 기준
  dept_name            text,                                 -- 담당 부서명
  phone                text,                                 -- 문의 전화
  classified_policy_id text,                                 -- 분류된 정책 ID (null = 미분류)
  classify_method      text,                                 -- 'gemini' | 'regex' | null
  fetched_at           timestamptz DEFAULT now()             -- 수집 시각
);

-- 조회 성능 인덱스
CREATE INDEX IF NOT EXISTS idx_raw_welfare_sido       ON raw_welfare_api(sido);
CREATE INDEX IF NOT EXISTS idx_raw_welfare_sgg_nm     ON raw_welfare_api(sgg_nm);
CREATE INDEX IF NOT EXISTS idx_raw_welfare_classified ON raw_welfare_api(classified_policy_id);
CREATE INDEX IF NOT EXISTS idx_raw_welfare_method     ON raw_welfare_api(classify_method);

-- RLS: 서비스 롤만 쓰기 허용, 공개 읽기
ALTER TABLE raw_welfare_api ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'raw_welfare_api' AND policyname = 'raw_welfare_public_read'
  ) THEN
    CREATE POLICY raw_welfare_public_read ON raw_welfare_api
      FOR SELECT USING (true);
  END IF;
END $$;
