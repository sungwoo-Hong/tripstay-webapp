# tripstay-webapp CLAUDE.md

> 최종 수정: 2026-03-20 (코드베이스 기준 자동 갱신)

---

## 프로젝트 개요

**복지다모아** — 전국 복지서비스 종합 정보 플랫폼
Supabase DB 데이터를 읽어 정적/ISR 페이지로 렌더링하는 Next.js 16 App Router 웹앱.

---

## 핵심 규칙

1. 작업 완료 후 항상 `npm run build` 실행
2. TypeScript 에러 0개 유지 (strict 모드)
3. 서버 컴포넌트 / 클라이언트 컴포넌트 명확히 구분
4. 한국어로 응답

---

## 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx                      # 루트 레이아웃 (Noto Sans KR, AdSense 스크립트)
│   ├── page.tsx                        # 홈 (히어로 + 정책 카드 + PolicyTabs)
│   ├── sitemap.ts                      # 메인 사이트맵
│   ├── robots.ts                       # robots.txt
│   ├── globals.css
│   ├── search/page.tsx                 # 시군구 검색 결과
│   ├── policy/[policyId]/page.tsx      # 정책별 전국 안내 (SSG, 16개)
│   ├── region/[sido]/page.tsx          # 시도별 시군구 목록 (SSG, 17개)
│   ├── [sido]/[city]/page.tsx          # 시군구 복지 목록 + 테마 필터
│   ├── [sido]/[city]/[policy]/
│   │   ├── page.tsx                    # 출산·육아 혜택 상세 (SSG)
│   │   ├── loading.tsx                 # 스켈레톤 로딩
│   │   └── not-found.tsx              # 404
│   └── welfare/
│       ├── [servId]/page.tsx           # 복지로 서비스 상세 (ISR 24h)
│       └── sitemap.ts                  # 복지 사이트맵 (1000개 단위 청크)
├── components/
│   ├── Header.tsx                      # 스티키 헤더, 17개 시도 단축키, 모바일 드로어 [Client]
│   ├── Footer.tsx                      # 푸터, 이용안내, 면책조항 [Server]
│   ├── Breadcrumb.tsx                  # 브레드크럼 [Server]
│   ├── AdBanner.tsx                    # Google AdSense 광고 [Client]
│   ├── SearchBox.tsx                   # 텍스트 검색 폼 [Client]
│   ├── RegionSearchDropdown.tsx        # 시도→시군구 드롭다운 [Client]
│   ├── PolicyTabs.tsx                  # 테마→시도→시군구 3단계 위저드 [Client]
│   ├── NationalBenefitsTable.tsx       # 국가 혜택 테이블 [Server]
│   └── ui/                             # shadcn/ui 기본 컴포넌트
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── supabase.ts                     # DB 클라이언트 + 데이터 조회 함수
│   ├── constants.ts                    # 정책 목록, 시도/시군구 데이터, 복지테마
│   └── utils.ts                        # cn() 유틸리티
└── types/
    └── index.ts                        # TypeScript 인터페이스 정의
```

---

## Supabase 테이블 구조

### `benefits` — 출산·육아 지역 혜택
- 주요 컬럼: `sido`, `city_name`, `policy_id`, `slug`, `title`, `content`, `meta_description`, `tags[]`, `amount`, `target`, `application_method`, `application_period`
- 용도: `/[sido]/[city]/[policy]` 상세 페이지

### `national_benefits` — 국가 공통 혜택
- 주요 컬럼: `policy_id`, `name`, `amount`, `description`, `apply_url`, `sort_order`
- 용도: `/policy/[policyId]` 정책 페이지 테이블

### `raw_welfare_api` — 복지로 전체 서비스
- 주요 컬럼: `serv_id`, `sido`, `sgg_nm`, `serv_nm`, `serv_dgst`, `intrs_thema_nm`, `life_nm`, `sprt_trgt_cn`, `slct_crit_cn`, `alw_serv_cn`, `aply_mtd_cn`, `dept_name`, `phone`, `basfm_link`, `serv_dtl_link`, `last_mod_ymd`, `detail_fetched`
- 용도: `/[sido]/[city]` 목록 + `/welfare/[servId]` 상세
- **주의:** `sgg_nm = null`이면 해당 시도 공통 서비스 (도시 페이지에서 함께 표시)
- **RLS:** 공개 읽기 전용

---

## 핵심 함수 (src/lib/supabase.ts)

| 함수 | 반환 | 용도 |
|------|------|------|
| `createBrowserSupabaseClient()` | Client | 브라우저 전용 클라이언트 |
| `supabaseServer` | Client | 서버 읽기 전용 (anon key) |
| `createAdminClient()` | Client | 서버 관리 클라이언트 (service role) |
| `getBenefit(sido, city, policyId)` | `Benefit\|null` | 혜택 상세 1건 |
| `getAllBenefitParams()` | Array | SSG용 전체 파라미터 (페이지네이션) |
| `getBenefitsByCity(sido, city)` | `Benefit[]` | 도시별 혜택 목록 |
| `getNationalBenefits(policyId)` | `NationalBenefit[]` | 정책별 국가 혜택 |
| `getCityPolicies(sido, city)` | `string[]` | 도시 보유 정책 ID 목록 |
| `searchCities(query)` | Array | 시군구명 퍼지 검색 |
| `getRawWelfareItemsByCity(sido, sggNm)` | `RawWelfareItem[]` | 도시 복지서비스 (시도 공통 포함) |
| `getRawWelfareItem(servId)` | `RawWelfareItem\|null` | 복지서비스 상세 1건 |
| `getAllRawCityParams()` | Array | 복지 도시 파라미터 전체 |
| `getWelfareByTheme(theme, limit, offset)` | `RawWelfareItem[]` | 테마별 복지서비스 |

---

## URL 구조

| 패턴 | 설명 | 렌더링 |
|------|------|--------|
| `/` | 홈 | SSG |
| `/search?q=...` | 시군구 검색 | 동적 |
| `/policy/[policyId]` | 정책별 전국 안내 (16개) | SSG |
| `/region/[sido]` | 시도별 목록 (17개) | SSG |
| `/[sido]/[city]` | 시군구 복지 목록 | SSG |
| `/[sido]/[city]/[policy]` | 혜택 상세 | SSG |
| `/welfare/[servId]` | 복지로 서비스 상세 | ISR 24h |

> 한국어 URL 파라미터는 반드시 `encodeURIComponent()` 처리

---

## SEO 구현

**JSON-LD 스키마:**
- `/[sido]/[city]/[policy]`: `Article` + `BreadcrumbList`
- `/welfare/[servId]`: `GovernmentService` + `BreadcrumbList` + `FAQPage` (콘텐츠 있을 때)

**사이트맵:**
- `src/app/sitemap.ts`: 정적 페이지 + 시군구 페이지 (우선순위 0.7~1.0)
- `src/app/welfare/sitemap.ts`: 복지서비스 1000개 단위 청크

**IndexNow:** `INDEXNOW_KEY=8352bf06e13c46e68d72aaf5842d674f`

---

## 컴포넌트 서버/클라이언트 구분

**Server 컴포넌트:** 모든 page.tsx, Breadcrumb, NationalBenefitsTable, Footer
**Client 컴포넌트 (`'use client'`):** Header, SearchBox, RegionSearchDropdown, PolicyTabs, AdBanner

> 클라이언트 컴포넌트에서 `SUPABASE_SERVICE_ROLE_KEY` 절대 사용 금지

---

## 코딩 컨벤션

- 타입 정의: `src/types/index.ts` 집중 관리
- 클래스 병합: `cn()` 유틸리티 사용 (`clsx` + `tailwind-merge`)
- 색상: 기본 파란색 `#1f1bc4`, 호버 `#1a17a0`
- 폰트: Noto Sans KR (400/500/700)
- 레이아웃 최대폭: `max-w-5xl` (960px)
- 페이지네이션: Supabase `.range()` 1000개 단위

---

## 환경변수 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://uwbzmtjttwdbxbtmpysk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=           # 클라이언트 읽기용
SUPABASE_SERVICE_ROLE_KEY=               # 서버 전용 (절대 노출 금지)
NEXT_PUBLIC_ADSENSE_ID=ca-pub-1982340875676348
INDEXNOW_KEY=8352bf06e13c46e68d72aaf5842d674f
NEXT_PUBLIC_SITE_URL=https://www.tripstay.co.kr  # 미설정시 기본값 사용
```

---

## 주의사항

1. **RLS:** `raw_welfare_api`는 anon key로 읽기 가능. `benefits`/`national_benefits` 쓰기는 service role 필요
2. **URL 인코딩:** 시도·시군구·정책명 모두 한국어 → 라우트 파라미터 전달 시 `encodeURIComponent()` 필수
3. **amount 단위:** `benefits.amount`는 텍스트 형식 (예: "100만원", "월 70만원"). 숫자 파싱 주의
4. **sgg_nm null:** `raw_welfare_api`에서 `sgg_nm = null`인 행은 시도 전체 공통 서비스 — `getRawWelfareItemsByCity()`가 자동 포함
5. **ISR revalidate:** `welfare/[servId]/page.tsx`는 `export const revalidate = 86400` (24시간)
6. **테마 필터:** `intrs_thema_nm`은 JSON 배열 또는 쉼표 구분 문자열로 저장될 수 있음

---

## npm 스크립트

```bash
npm run dev            # 개발 서버
npm run build          # 프로덕션 빌드 (작업 완료 후 필수)
npm run start          # 프로덕션 실행
npm run lint           # ESLint 검사
npm run welfare:content  # node scripts/1.welfare_content.js
npm run welfare:post     # node scripts/3.supabase_post.js
npm run welfare:auto     # node scripts/4.welfare_auto.js
```
