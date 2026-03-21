# 복지다모아 PRD (tripstay-webapp)

> 최종 수정: 2026-03-20 (코드베이스 기준 자동 갱신)

---

## 서비스 개요

**복지다모아** — 전국 복지서비스 종합 정보 플랫폼

- **목적:** 지역명·정책명 조합 키워드 구글 상위 노출 → 애드센스 수익 창출
- **도메인:** `https://www.tripstay.co.kr` (기존 애드센스 승인 도메인)
- **사이트명:** 복지다모아 (`SITE_NAME` 상수)
- **대상 키워드:** "원주시 출산지원금", "서울시 복지서비스", "경기도 출산 혜택" 등

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 App Router + TypeScript (strict) |
| 스타일 | Tailwind CSS v4 + @tailwindcss/typography |
| UI 컴포넌트 | shadcn/ui + lucide-react + @base-ui/react |
| DB | Supabase (PostgreSQL, Seoul 리전) |
| 배포 | Vercel (ISR 지원) |
| 광고 | Google AdSense (ca-pub-1982340875676348) |
| SEO | JSON-LD, IndexNow, 동적 sitemap |

---

## 핵심 기능 (현재 구현)

### 1. 복지혜택 정보 제공
- **출산·육아 지역 혜택:** 시군구별 출산지원금, 부모급여, 아동수당 등 16개 정책
- **전국 복지서비스:** 정부 복지로 API 연동 데이터 (~10,000개 서비스)
- **국가 공통 혜택:** 정책별 국가 지급 기준 정보

### 2. 탐색 방법
- **지역별 탐색:** 17개 시도 → 약 250개 시군구 → 복지 목록
- **정책별 탐색:** 16개 정책 카드 → 지역 선택
- **테마별 필터:** 11개 테마 (임신·출산, 교육, 일자리 등)
- **텍스트 검색:** 시군구명 검색 → 해당 도시 복지 목록 이동
- **3단계 선택 위저드:** 테마 → 시도 → 시군구 순서로 선택

### 3. SEO 최적화
- 페이지별 JSON-LD 스키마 (Article, GovernmentService, BreadcrumbList, FAQPage)
- 정적 페이지 우선 생성 (SSG/ISR)
- 동적 sitemap.xml (메인 + 복지 청크별 분리)
- IndexNow 색인 요청 지원

---

## 데이터 구조

### Supabase 테이블

#### 1. `benefits` — 출산·육아 지역 혜택
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| sido | text | 시도명 (예: "경기도") |
| city_name | text | 시군구명 (예: "수원시") |
| policy_id | text | 정책 ID (예: "birth-support") |
| policy_name | text | 정책명 (예: "출산지원금") |
| title | text | 페이지 제목 |
| slug | text | URL 슬러그 |
| content | text | 본문 (HTML) |
| meta_description | text | 메타 설명 |
| tags | text[] | 태그 배열 |
| amount | text | 지원 금액 |
| target | text | 지원 대상 |
| application_method | text | 신청 방법 |
| application_period | text | 신청 기간 |
| raw_content | text | 원문 데이터 |
| created_at | timestamp | 생성일 |

#### 2. `national_benefits` — 국가 공통 혜택
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| policy_id | text | 정책 ID (FK) |
| name | text | 혜택명 |
| amount | text | 지급액 |
| description | text | 설명 |
| apply_url | text | 신청 URL |
| sort_order | int | 정렬 순서 |

#### 3. `raw_welfare_api` — 복지로 API 전체 서비스
| 컬럼 | 타입 | 설명 |
|------|------|------|
| serv_id | text | 서비스 ID (PK 역할) |
| sido | text | 시도명 |
| sgg_nm | text | 시군구명 (null이면 시도 공통) |
| serv_nm | text | 서비스명 |
| serv_dgst | text | 서비스 요약 |
| life_nm | text | 생애주기 |
| intrs_thema_nm | text | 관심테마 (JSON배열 또는 쉼표) |
| sprt_cyc_nm | text | 지원주기 |
| srv_pvsn_nm | text | 서비스 제공 방법 |
| aply_mtd_nm | text | 신청 방법 |
| sprt_trgt_cn | text | 지원대상 상세 |
| slct_crit_cn | text | 선정기준 |
| alw_serv_cn | text | 서비스 내용 |
| aply_mtd_cn | text | 신청방법 상세 |
| dept_name | text | 담당부서 |
| phone | text | 문의전화 |
| baslaw_nm | text | 근거법령 |
| basfm_link | text | 신청 링크 |
| serv_dtl_link | text | 서비스 상세 링크 |
| last_mod_ymd | text | 최종수정일 |
| detail_fetched | boolean | 상세 정보 수집 여부 |

> **RLS:** `raw_welfare_api`는 공개 읽기 전용. `sgg_nm = null`인 경우 해당 시도 공통 서비스.

---

## 페이지 구조 및 URL 패턴

| URL | 역할 | 렌더링 | 데이터 소스 |
|-----|------|--------|------------|
| `/` | 홈 (히어로 + 정책 카드 + 탐색 위저드) | SSG | 상수 |
| `/search?q=...` | 시군구명 검색 결과 | 동적 | benefits |
| `/policy/[policyId]` | 정책별 전국 안내 (16개) | SSG | 상수 + national_benefits |
| `/region/[sido]` | 시도별 시군구 목록 (17개) | SSG | 상수 |
| `/[sido]/[city]` | 시군구 복지 목록 + 테마 필터 | SSG/ISR | raw_welfare_api |
| `/[sido]/[city]/[policy]` | 출산·육아 혜택 상세 | SSG | benefits |
| `/welfare/[servId]` | 복지로 서비스 상세 | ISR 24h | raw_welfare_api |
| `/sitemap.xml` | 메인 사이트맵 | 동적 | DB + 상수 |
| `/welfare/sitemap_[n].xml` | 복지 사이트맵 청크 (1000개 단위) | 동적 | raw_welfare_api |
| `/robots.txt` | 크롤러 설정 | 동적 | 상수 |

**정적 생성 규모:**
- 16개 정책 페이지 (SSG)
- 17개 시도 페이지 (SSG)
- ~250개 시군구 페이지
- ~10,000개+ 복지 서비스 상세 (ISR 24h)

---

## 16개 정책 목록

1. birth-support — 출산지원금
2. first-meeting — 첫만남이용권
3. parental-allowance — 부모급여
4. child-allowance — 아동수당
5. childcare-fee — 보육료
6. nurturing-allowance — 양육수당
7. postpartum-care — 산모신생아건강관리
8. pregnancy-care — 임신출산진료비
9. postpartum-fee — 산후조리비
10. maternal-traffic — 임산부 교통비
11. newborn-supplies — 신생아 용품
12. multiple-children — 다자녀 혜택
13. prenatal-health — 엽산·철분제
14. newlywed-support — 신혼부부 지원
15. (추가 2개 — constants.ts 참조)

**11개 복지 테마:** 전체, 서민금융, 임신·출산, 입양·위탁, 교육, 일자리, 안전·위기, 신체건강, 보호·돌봄, 주거, 생활지원

---

## SEO 전략

- **JSON-LD 스키마:**
  - `Article` + `BreadcrumbList` — 출산·육아 혜택 상세 페이지
  - `GovernmentService` + `BreadcrumbList` + `FAQPage` — 복지로 서비스 상세
- **메타데이터:** 제목에 연도(2026) 포함, 지역+정책명 키워드 최적화
- **Canonical URL:** 상세 페이지에 명시
- **사이트맵 우선순위:** 홈 1.0 → 정책/시도 0.9 → 시군구 0.7 → 복지서비스 0.6
- **IndexNow:** `INDEXNOW_KEY=8352bf06e13c46e68d72aaf5842d674f`

---

## 수익화

- **AdSense ID:** `ca-pub-1982340875676348`
- **광고 형태:** 자동광고 + `AdBanner` 컴포넌트 (slot별 배치)
- **개발환경:** AdSense 로드 생략, 플레이스홀더 표시

---

## 향후 개선 예정

- raw_welfare_api 데이터 정기 갱신 파이프라인 고도화
- 복지서비스 키워드 검색 기능 확장
- 소득·나이 기반 개인화 필터
- 신청 바로가기 버튼 인터랙션 개선
