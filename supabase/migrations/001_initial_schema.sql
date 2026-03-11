-- ============================================================
-- 복지다모아 초기 스키마
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- ============================================================

-- ── benefits 테이블 ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS benefits (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  city_name        text        NOT NULL,
  sido             text        NOT NULL,
  policy_id        text        NOT NULL,
  policy_name      text        NOT NULL,
  title            text        NOT NULL,
  content          text        NOT NULL,
  meta_description text,
  tags             text[]      DEFAULT '{}',
  slug             text        UNIQUE NOT NULL,
  created_at       timestamptz DEFAULT now()
);

-- 검색 성능 인덱스
CREATE INDEX IF NOT EXISTS idx_benefits_city_policy  ON benefits(city_name, policy_id);
CREATE INDEX IF NOT EXISTS idx_benefits_sido         ON benefits(sido);
CREATE INDEX IF NOT EXISTS idx_benefits_policy_id    ON benefits(policy_id);
CREATE INDEX IF NOT EXISTS idx_benefits_slug         ON benefits(slug);

-- RLS 활성화 (공개 읽기 허용)
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "benefits_public_read" ON benefits
  FOR SELECT USING (true);

-- ── national_benefits 테이블 ────────────────────────────────
-- 전국 공통 혜택 (정책별 기준 금액/정보)
CREATE TABLE IF NOT EXISTS national_benefits (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id   text NOT NULL,
  name        text NOT NULL,
  amount      text NOT NULL,
  description text,
  apply_url   text,
  sort_order  int  DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_national_benefits_policy ON national_benefits(policy_id);

ALTER TABLE national_benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "national_benefits_public_read" ON national_benefits
  FOR SELECT USING (true);

-- ── 초기 시드 데이터: national_benefits ──────────────────────
INSERT INTO national_benefits (policy_id, name, amount, description, apply_url, sort_order) VALUES
-- 출산지원금 관련 전국 공통
('birth-support',        '첫만남이용권',           '200만원',          '출생아 1인당 바우처 지급 (둘째 이상 300만원)',       'https://www.gov.kr/portal/service/serviceInfo/SD0000058083', 1),
('birth-support',        '부모급여 (만 0세)',       '월 100만원',       '만 0세 아동 양육 가정 현금 지원',                    'https://www.bokjiro.go.kr',                                  2),
('birth-support',        '부모급여 (만 1세)',       '월 50만원',        '만 1세 아동 양육 가정 현금 지원',                    'https://www.bokjiro.go.kr',                                  3),
('birth-support',        '아동수당',               '월 10만원',        '만 8세 미만 모든 아동 지급',                         'https://www.bokjiro.go.kr',                                  4),

-- 첫만남이용권
('first-voucher',        '첫만남이용권',           '200만원 (단태아)', '출생 후 1년 이내 국민행복카드 바우처 사용',            'https://www.gov.kr/portal/service/serviceInfo/SD0000058083', 1),
('first-voucher',        '첫만남이용권 (다태아)',   '300만원',          '쌍둥이 이상 출생 시 1인당 300만원',                   'https://www.gov.kr/portal/service/serviceInfo/SD0000058083', 2),

-- 부모급여
('parental-benefit',     '부모급여 (만 0세)',       '월 100만원',       '만 0세 아동 현금 지원',                              'https://www.bokjiro.go.kr',                                  1),
('parental-benefit',     '부모급여 (만 1세)',       '월 50만원',        '만 1세 아동 현금 지원',                              'https://www.bokjiro.go.kr',                                  2),
('parental-benefit',     '어린이집 이용 시 바우처', '월 최대 514,000원','부모급여 대신 보육료 바우처로 수령 가능',              'https://www.childcare.go.kr',                                3),

-- 아동수당
('child-allowance',      '아동수당',               '월 10만원',        '만 8세 미만 모든 아동 (소득 무관)',                   'https://www.bokjiro.go.kr',                                  1),

-- 보육료
('childcare-fee',        '어린이집 보육료 (만 0세)', '월 514,000원',    '어린이집 이용 시 보육료 전액 지원',                   'https://www.childcare.go.kr',                                1),
('childcare-fee',        '어린이집 보육료 (만 1세)', '월 452,000원',    '어린이집 이용 시 보육료 전액 지원',                   'https://www.childcare.go.kr',                                2),
('childcare-fee',        '어린이집 보육료 (만 2세)', '월 375,000원',    '어린이집 이용 시 보육료 전액 지원',                   'https://www.childcare.go.kr',                                3),
('childcare-fee',        '유치원 유아학비',         '월 최대 280,000원','유치원 이용 시 유아학비 지원',                        'https://www.childcare.go.kr',                                4),

-- 양육수당
('nurturing-allowance',  '양육수당 (만 0~1세)',     '월 20만원',        '가정양육 시 (부모급여 수급 제외)',                    'https://www.bokjiro.go.kr',                                  1),
('nurturing-allowance',  '양육수당 (만 2세)',       '월 15만원',        '가정양육 시',                                        'https://www.bokjiro.go.kr',                                  2),
('nurturing-allowance',  '양육수당 (만 3~5세)',     '월 10만원',        '가정양육 시',                                        'https://www.bokjiro.go.kr',                                  3),

-- 산모신생아건강관리
('postpartum-care',      '산모·신생아 건강관리 지원', '30~50만원',      '출산 가정에 건강관리사 파견 (소득 기준에 따라 차등)',   'https://www.bokjiro.go.kr',                                  1),

-- 임신출산진료비
('pregnancy-fee',        '임신·출산 진료비 (국민행복카드)', '100만원 (단태아)', '임신·출산 의료비 바우처',                  'https://www.nhis.or.kr',                                     1),
('pregnancy-fee',        '임신·출산 진료비 (다태아)',        '140만원',          '쌍둥이 이상 임신 시',                      'https://www.nhis.or.kr',                                     2)
ON CONFLICT DO NOTHING;
