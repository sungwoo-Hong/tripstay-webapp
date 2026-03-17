-- ============================================================
-- raw_welfare_api 상세 필드 추가
-- 공공데이터 상세 API 응답값 저장 (목록 API 추가 필드 포함)
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- ============================================================

ALTER TABLE raw_welfare_api
  ADD COLUMN IF NOT EXISTS life_nm          text,   -- 생애주기 (영유아, 아동, 청년, 노인 등)
  ADD COLUMN IF NOT EXISTS intrs_thema_nm   text,   -- 관심테마 (교육, 서민금융 등)
  ADD COLUMN IF NOT EXISTS sprt_cyc_nm      text,   -- 지원주기 (1회성, 월정기 등)
  ADD COLUMN IF NOT EXISTS srv_pvsn_nm      text,   -- 지원방식 (현금, 바우처, 현물 등)
  ADD COLUMN IF NOT EXISTS aply_mtd_nm      text,   -- 신청방법 요약 (방문, 인터넷 등)
  ADD COLUMN IF NOT EXISTS serv_dtl_link    text,   -- 복지로 상세 링크
  ADD COLUMN IF NOT EXISTS last_mod_ymd     text,   -- 최종수정일 (YYYYMMDD)
  ADD COLUMN IF NOT EXISTS enfc_bgng_ymd    text,   -- 시행시작일
  ADD COLUMN IF NOT EXISTS baslaw_nm        text,   -- 근거법령명
  ADD COLUMN IF NOT EXISTS basfm_link       text,   -- 신청서식 다운로드 링크
  ADD COLUMN IF NOT EXISTS detail_fetched   boolean DEFAULT false; -- 상세 조회 완료 여부

-- 상세 조회 여부 인덱스 (미완료 항목 빠른 조회용)
CREATE INDEX IF NOT EXISTS idx_raw_welfare_detail_fetched ON raw_welfare_api(detail_fetched);
